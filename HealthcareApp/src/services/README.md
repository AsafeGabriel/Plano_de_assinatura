// Usar IP da máquina local, NÃO localhost
// Substitua 192.168.0.100 pelo IP da sua máquina

export const API_CONFIG = {
  baseURL: 'http://192.168.0.100:3000',
};

// Exemplo de requisições com token

import api, { authService } from '../services/api';

// 1. LOGIN
const handleLogin = async () => {
  try {
    const result = await authService.login('user@example.com', 'password123');
    console.log('Login bem-sucedido:', result.data.token);
  } catch (error) {
    console.error('Erro no login:', error.response?.data?.message);
  }
};

// 2. REQUISIÇÃO PROTEGIDA COM TOKEN
const fetchUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    console.log('Perfil:', response.data);
  } catch (error) {
    console.error('Erro:', error.message);
  }
};

// 3. LOGOUT
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  // Navegar para tela de login
};
