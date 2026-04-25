# App Conecta Saúde

## 📋 Descrição
O **App Conecta Saúde** é uma aplicação móvel que conecta pacientes a profissionais de saúde. O sistema permite cadastro e login de usuários, com autenticação segura via JWT e integração com Google. O backend é desenvolvido em Node.js com Express e MongoDB, enquanto o frontend utiliza React Native com Expo.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Linguagem**: JavaScript (Node.js)
- **Framework**: Express.js
- **Banco de Dados**: MongoDB (com Mongoose)
- **Autenticação**: JWT (jsonwebtoken), bcrypt para hash de senhas
- **OAuth**: Passport.js com passport-google-oauth20 para login com Google
- **Outros**: Validação de CPF (implementada manualmente)

### Frontend
- **Linguagem**: JavaScript (React Native)
- **Framework**: React Native com Expo
- **Navegação**: React Navigation (tabs e stack)
- **Estilização**: StyleSheet (convertido de Tailwind CSS)
- **Ícones**: @expo/vector-icons

## 🏗️ Arquitetura

### Backend
O backend está estruturado em módulos:
- **src/modules/auth**: Controla autenticação (registro, login, Google OAuth)
- **src/modules/users**: Modelo de usuário e serviços
- **src/middlewares**: Middleware de autenticação JWT
- **src/config**: Configurações de Passport e JWT

**Funcionalidades**:
- Cadastro de usuários (nome, email, senha, CPF, role: patient/professional)
- Login com email/senha
- Login com Google (cria usuário automaticamente se não existir)
- Validação de CPF
- Hash de senhas com bcrypt
- Geração de JWT com expiração

### Frontend
O frontend é uma aplicação React Native com navegação por tabs:
- **HomeScreen**: Tela inicial
- **SearchScreen**: Busca de profissionais
- **ProfileScreen**: Perfil com formulário de login (email, senha)
- **PlansScreen**: Planos de assinatura
- **ProfessionalProfileScreen**: Perfil de profissional

**Funcionalidades**:
- Navegação entre telas
- Formulário de login na ProfileScreen
- Estilização com StyleSheet

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado
- MongoDB rodando localmente ou MongoDB Atlas
- Expo CLI para o frontend
- Conta Google para OAuth (client ID e secret)

### Backend
1. Navegue para a pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente em um arquivo `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/conecta_saude
   JWT_SECRET=sua_chave_secreta
   GOOGLE_CLIENT_ID=sua_google_client_id
   GOOGLE_CLIENT_SECRET=sua_google_client_secret
   ```
4. Rode o servidor:
   ```bash
   npm start
   ```
   O servidor estará rodando em `http://localhost:3000`.

### Frontend
1. Navegue para a pasta `HealthcareApp`:
   ```bash
   cd HealthcareApp
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Rode o app:
   ```bash
   npx expo start
   ```
   Use o Expo Go no seu dispositivo ou simulador.

## 🔄 Fluxo de Funcionamento
1. **Cadastro/Login**: Usuário se cadastra ou faz login via email/senha ou Google.
2. **Autenticação**: Backend valida credenciais e retorna JWT.
3. **Navegação**: No app, usuário navega entre telas (home, busca, perfil).
4. **Integração**: Futuramente, conectar com backend para buscar profissionais e gerenciar assinaturas.

## 📝 Notas
- O CPF é validado no backend (implementação básica; pode ser aprimorada).
- O login com Google cria usuários automaticamente.
- O frontend ainda não está integrado com o backend; o formulário de login é apenas UI.
- Para produção, use HTTPS e configure CORS se necessário.</content>
<parameter name="filePath">c:\Users\user\Projetos\8. Projetos com Asafe\App_Conecta_Saude\README.md