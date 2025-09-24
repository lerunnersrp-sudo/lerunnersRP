# Plataforma LeRunners

Uma plataforma completa de gestão financeira, treinos e acompanhamento de desenvolvimento para atletas de corrida de rua.

## 🚀 Características

- **Sistema de Autenticação Completo**: Login e registro com Firebase Authentication
- **Gestão de Perfil**: Upload de fotos com Cloudinary e dados pessoais
- **Registro de Treinos**: Controle completo de sessões de treino com métricas
- **Gestão Financeira**: Controle de receitas e despesas relacionadas ao esporte
- **Acompanhamento de Progresso**: Gráficos e estatísticas de evolução
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Integração com Firebase**: Banco de dados em tempo real
- **Upload de Imagens**: Sistema robusto com Cloudinary

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase Realtime Database
- **Autenticação**: Firebase Authentication
- **Upload de Imagens**: Cloudinary
- **Gráficos**: Chart.js
- **Deploy**: GitHub Pages

## 📁 Estrutura do Projeto

```
lerunners-platform/
├── index.html              # Página de login/registro
├── dashboard.html           # Dashboard principal
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   ├── config.js           # Configurações Firebase/Cloudinary
│   ├── utils.js            # Funções utilitárias
│   ├── auth.js             # Sistema de autenticação
│   ├── main.js             # Script da página de login
│   └── dashboard.js        # Script do dashboard
├── .nojekyll               # Arquivo para GitHub Pages
└── README.md               # Esta documentação
```

## ⚙️ Configuração

### Credenciais já Configuradas

A plataforma já está configurada com suas credenciais reais:

**Firebase:**
- Project ID: lerunners
- Database URL: https://lerunners-default-rtdb.firebaseio.com
- Auth Domain: lerunners.firebaseapp.com

**Cloudinary:**
- Cloud Name: dd6ppm6nf
- Upload Preset: lerunners_preset (precisa ser criado)

### Configuração do Firebase Realtime Database

Para que a plataforma funcione corretamente, você precisa configurar as regras do Firebase Realtime Database:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione o projeto "lerunners"
3. Vá em "Realtime Database" > "Regras"
4. Substitua as regras existentes por:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### Configuração do Cloudinary

1. Acesse o [Console do Cloudinary](https://cloudinary.com/console)
2. Vá em "Settings" > "Upload"
3. Crie um novo "Upload Preset" com o nome: `lerunners_preset`
4. Configure o preset como:
   - Signing Mode: Unsigned
   - Folder: lerunners
   - Allowed formats: jpg, jpeg, png, gif, webp
   - Max file size: 5MB
   - Transformation: Auto crop e auto quality

## 🚀 Deploy no GitHub Pages

### Passo a Passo:

1. **Faça upload dos arquivos para seu repositório GitHub**
2. **Ative o GitHub Pages:**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: main (ou master)
   - Folder: / (root)
3. **Aguarde alguns minutos** para o deploy ser concluído
4. **Acesse sua plataforma** no link fornecido pelo GitHub Pages

### Estrutura de Dados no Firebase

A plataforma criará automaticamente a seguinte estrutura no Firebase:

```
users/
  {userId}/
    ├── uid: string
    ├── name: string
    ├── email: string
    ├── role: "atleta" | "professor"
    ├── createdAt: timestamp
    ├── updatedAt: timestamp
    ├── profile/
    │   ├── age: number
    │   ├── weight: number
    │   ├── height: number
    │   ├── goal: string
    │   └── photoURL: string
    ├── stats/
    │   ├── totalTrainings: number
    │   ├── totalDistance: number
    │   ├── totalTime: number
    │   └── averagePace: number
    ├── trainings/
    │   └── {trainingId}/
    │       ├── date: string
    │       ├── type: string
    │       ├── distance: number
    │       ├── time: number
    │       ├── pace: string
    │       ├── notes: string
    │       └── createdAt: timestamp
    └── transactions/
        └── {transactionId}/
            ├── type: "income" | "expense"
            ├── description: string
            ├── amount: number
            ├── date: string
            ├── category: string
            └── createdAt: timestamp
```

## 🎯 Funcionalidades

### Sistema de Autenticação
- Registro de novos usuários (Atleta ou Professor)
- Login com email e senha
- Recuperação de senha
- Logout seguro
- Validação em tempo real

### Gestão de Perfil
- Upload de foto de perfil via Cloudinary
- Edição de dados pessoais (nome, idade, peso, altura)
- Definição de objetivos
- Cálculo automático de IMC

### Registro de Treinos
- Diferentes tipos de treino (Leve, Ritmo, Intervalado, Longo, Recuperação)
- Registro de distância, tempo e observações
- Cálculo automático de pace
- Histórico completo de treinos

### Gestão Financeira
- Registro de receitas e despesas
- Categorização por tipo (Equipamentos, Nutrição, Provas, etc.)
- Resumo financeiro com saldo atual
- Histórico de transações

### Acompanhamento de Progresso
- Gráficos de evolução de distância
- Gráficos de evolução de pace
- Estatísticas gerais no dashboard
- Métricas da semana atual

## 📱 Responsividade

A plataforma é totalmente responsiva e funciona perfeitamente em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🔒 Segurança

- Autenticação segura via Firebase
- Regras de segurança no banco de dados
- Validação de dados no frontend e backend
- Upload seguro de imagens via Cloudinary

## 🎨 Design

- Interface moderna e intuitiva
- Gradientes e cores atrativas
- Ícones SVG personalizados
- Animações suaves
- Feedback visual para ações do usuário

## 🚨 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, certifique-se de que:
- As regras do Firebase estão configuradas corretamente
- O domínio está autorizado no Firebase Authentication

### Upload de Imagens não Funciona
Verifique se:
- O upload preset do Cloudinary foi criado
- O preset está configurado como "Unsigned"
- As credenciais do Cloudinary estão corretas

### Dados não Salvam
Confirme que:
- As regras do Firebase Realtime Database estão corretas
- O usuário está autenticado
- A conexão com internet está funcionando

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte o console do navegador para erros
3. Verifique as configurações do Firebase e Cloudinary

## 📄 Licença

Este projeto foi desenvolvido especificamente para a plataforma LeRunners.

---

**Desenvolvido com ❤️ para a comunidade de corredores**

