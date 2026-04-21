const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/healthcare')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Definir schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'patient' }
});

const professionalSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    email: String,
    bio: String,
    experience: Number,
    rating: { type: Number, default: 5.0 }
});

const User = mongoose.model('User', userSchema);
const Professional = mongoose.model('Professional', professionalSchema);

async function seedDatabase() {
    try {
        // Limpar dados existentes
        await User.deleteMany({});
        await Professional.deleteMany({});

        // Criar usuários de teste
        const hashedPassword1 = await bcrypt.hash('123456', 10);
        const hashedPassword2 = await bcrypt.hash('123456', 10);

        const users = [
            {
                name: 'João Silva',
                email: 'joao@email.com',
                password: hashedPassword1,
                role: 'patient'
            },
            {
                name: 'Maria Santos',
                email: 'maria@email.com',
                password: hashedPassword2,
                role: 'patient'
            }
        ];

        await User.insertMany(users);
        console.log('Usuários criados:', users.length);

        // Criar profissionais de teste
        const professionals = [
            {
                name: 'Dra. Ana Souza',
                specialty: 'Nutricionista',
                email: 'ana.nutri@email.com',
                bio: 'Especialista em nutrição esportiva e emagrecimento saudável',
                experience: 8,
                rating: 4.8
            },
            {
                name: 'Dr. Lucas Pereira',
                specialty: 'Educador Físico',
                email: 'lucas.fitness@email.com',
                bio: 'Personal trainer com foco em reabilitação e condicionamento físico',
                experience: 6,
                rating: 4.9
            },
            {
                name: 'Dra. Mariana Lima',
                specialty: 'Psicóloga',
                email: 'mariana.psi@email.com',
                bio: 'Psicóloga clínica especializada em ansiedade e depressão',
                experience: 10,
                rating: 5.0
            }
        ];

        await Professional.insertMany(professionals);
        console.log('Profissionais criados:', professionals.length);

        console.log('\n=== DADOS DE TESTE CRIADOS ===');
        console.log('Usuários para login:');
        console.log('Email: joao@email.com | Senha: 123456');
        console.log('Email: maria@email.com | Senha: 123456');
        console.log('\nProfissionais disponíveis:');
        professionals.forEach(prof => {
            console.log(`- ${prof.name} (${prof.specialty})`);
        });

    } catch (error) {
        console.error('Erro ao criar dados de teste:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();