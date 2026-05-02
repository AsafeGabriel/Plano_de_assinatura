const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../users/userModel');
const passport = require('passport');
const https = require('https');

// CPF Validation Helper
const validateCPF = (cpf) => {
  // Remove non-numeric characters
  cpf = cpf.replace(/\D/g, '');

  // Check if CPF has 11 digits
  if (cpf.length !== 11) {
    return false;
  }

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calculate verification digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;

  return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
};

// JWT Helper
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
};

// Register
exports.register = async (req, res) => {
  console.log('Register endpoint called');
  console.log('Request body:', req.body);

  try {
    const { name, email, password, cpf, role } = req.body;

    if (!name || !email || !password || !cpf || !role) {
      console.log('Validation failed: missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateCPF(cpf)) {
      console.log('Validation failed: invalid CPF');
      return res.status(400).json({ message: 'CPF must be 11 digits' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, cpf, role });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Use Google login for this account' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Google Auth
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google Callback
exports.googleCallback = (req, res) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  })(req, res);
};

// Google Mobile: verify idToken and create/find user
exports.googleMobile = (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'idToken is required' });

  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;

  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', async () => {
      try {
        const payload = JSON.parse(data);
        const validClientIds = [
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_EXPO_CLIENT_ID,
          process.env.GOOGLE_ANDROID_CLIENT_ID,
          process.env.GOOGLE_IOS_CLIENT_ID,
        ].filter(Boolean);

        if (!validClientIds.includes(payload.aud)) {
          return res.status(401).json({ message: 'Invalid Google client ID' });
        }

        const email = payload.email;
        const name = payload.name || payload.email.split('@')[0];
        const googleId = payload.sub;

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({ name, email, googleId, password: Math.random().toString(36).slice(-8) });
          await user.save();
        } else if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }

        const token = generateToken(user);
        return res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
      } catch (e) {
        return res.status(400).json({ message: 'Invalid token payload' });
      }
    });
  }).on('error', (err) => {
    return res.status(500).json({ message: 'Failed to verify token' });
  });
};