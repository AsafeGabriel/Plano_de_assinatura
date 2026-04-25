# ⚙️ CONFIGURAÇÃO DO FRONTEND

## 1. Instalar Dependências
```bash
cd HealthcareApp
npm install
```

## 2. Configurar IP Local
Edite `src/services/api.js` e substitua o IP:
```javascript
const API_URL = 'http://SEU_IP_LOCAL:3000';
// Exemplo: const API_URL = 'http://192.168.0.100:3000';
```

**Como descobrir seu IP:**
- **Windows:** `ipconfig` (procure por IPv4 Address)
- **Mac/Linux:** `ifconfig` (procure por inet)

## 3. Executar o App
```bash
npx expo start
```

Use Expo Go no seu celular ou simulador.

---

# ⚙️ CONFIGURAÇÃO DO BACKEND

## 1. Instalar Dependências
```bash
cd backend
npm install
```

## 2. Criar Arquivo `.env`
Copie `.env.example` para `.env` e preencha:
```env
MONGO_URI=mongodb://localhost:27017/conecta_saude
JWT_SECRET=sua_chave_secreta
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
PORT=3000
```

## 3. Certificar MongoDB está Rodando
```bash
# Linux/Mac
mongod

# Windows (se instalado via brew ou chocolatey)
mongod
```

Ou use **MongoDB Atlas** (cloud) e atualize `MONGO_URI`.

## 4. Executar Backend
```bash
npm start
```

Server rodará em `http://localhost:3000`.

---

# 🔄 FLUXO DE AUTENTICAÇÃO

## Login com Email/Senha
1. Usuário insere email e senha na LoginScreen
2. Frontend faz `POST /auth/login`
3. Backend valida credenciais e retorna JWT
4. Frontend salva token em AsyncStorage
5. AuthContext atualiza `isAuthenticated = true`
6. Usuário é redirecionado para app principal

## Cadastro
1. Usuário preenche formulário em RegisterScreen
2. Frontend valida dados (CPF, senha, etc)
3. Frontend faz `POST /auth/register`
4. Backend cria usuário e retorna JWT
5. Frontend salva token e redireciona

## Login com Google
(Em desenvolvimento - requer `expo-auth-session`)

---

# 🧪 TESTAR ROTAS COM INSOMNIA/POSTMAN

## 1. Registrar
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "cpf": "123.456.789-10",
  "role": "patient"
}
```

## 2. Login
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. Usar Token em Requisições Protegidas
```
GET http://localhost:3000/users/profile
Authorization: Bearer SEU_TOKEN_AQUI
```

---

# 🐛 TROUBLESHOOTING

## "Cannot connect to server"
- Verifique se o backend está rodando
- Confirme o IP correto em `api.js`
- Teste: `ping 192.168.0.100`

## "Network Error"
- CORS pode estar bloqueado
- Adicione CORS no backend:
```javascript
const cors = require('cors');
app.use(cors());
```

## "Invalid token"
- Token expirou (duração: 1 hora)
- Faça login novamente
- Verifique se JWT_SECRET é igual em ambos

## MongoDB connection refused
- MongoDB não está rodando
- Se local: execute `mongod`
- Se cloud: verifique connection string

---

# 📱 PRÓXIMOS PASSOS

1. ✅ Login e cadastro funcionando
2. ⏳ Integrar telas do app com dados reais
3. ⏳ Implementar login com Google
4. ⏳ Criar rotas protegidas no backend para profissionais
5. ⏳ Implementar chat e videochamada
