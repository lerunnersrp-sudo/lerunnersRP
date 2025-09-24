# 🔥 Configuração do Firebase para LeRunners (Passo a Passo Simples)

Olá! Vamos configurar o Firebase para sua plataforma LeRunners. Não se preocupe, vou te guiar em cada passo, como se estivéssemos lado a lado. Não precisa saber programar, apenas seguir as instruções com atenção.

## O que é o Firebase?

Pense no Firebase como o "cérebro" da sua plataforma. Ele guarda as informações dos usuários (como seu nome e email), os treinos, as finanças e tudo mais. Ele também cuida da segurança, garantindo que só você e seus atletas possam acessar os dados.

--- 

## 🚀 Primeiro Passo: Acessar o Firebase

1.  **Abra seu navegador de internet** (Chrome, Firefox, Edge, etc.).
2.  **Digite este endereço** na barra de endereços (onde você digita `google.com`): `https://console.firebase.google.com/`
3.  **Pressione Enter**.
4.  Você verá uma tela para **fazer login**. Use a mesma conta do Google que você usou para criar o projeto `lerunners`.
5.  Depois de fazer login, você verá uma lista dos seus projetos. **Clique no projeto que se chama `lerunners`**.

--- 

## 🔐 Segundo Passo: Configurar a Autenticação (Login e Cadastro)

Agora vamos dizer ao Firebase como ele deve lidar com o login e o cadastro de usuários.

1.  No menu que aparece no lado esquerdo da tela, procure por **"Build"** (Construir) e, abaixo dele, clique em **"Authentication"** (Autenticação).
2.  Na tela de Autenticação, clique na aba **"Sign-in method"** (Método de login).
3.  Você verá uma lista de opções. Procure por **"Email/Password"** (Email/Senha) e clique nele.
4.  Uma nova janela ou seção vai aparecer. Você verá um botão para **"Enable"** (Ativar) ou um interruptor. **Ative essa opção** (deixe-a azul ou verde).
5.  **Importante**: Certifique-se de que a opção **"Email link (passwordless sign-in)"** (Login sem senha por link de email) **NÃO esteja ativada** (deixe-a cinza ou branca).
6.  Clique no botão **"Save"** (Salvar) para guardar essa configuração.

### 2.1. Adicionar Endereços Permitidos (Domínios Autorizados)

Esta parte é para dizer ao Firebase de quais endereços de internet sua plataforma pode se conectar a ele. Isso é uma medida de segurança.

1.  Ainda na tela de "Sign-in method", role a página para baixo até encontrar a seção **"Authorized domains"** (Domínios autorizados).
2.  Você verá alguns endereços já listados. Precisamos adicionar o endereço do seu GitHub Pages.
3.  Clique no botão **"Add domain"** (Adicionar domínio).
4.  Na caixa que aparecer, **digite o endereço do seu GitHub Pages**. Ele geralmente tem o formato `seu-usuario.github.io` (substitua `seu-usuario` pelo seu nome de usuário do GitHub). Por exemplo, se seu usuário é `joaodasilva`, você digitaria `joaodasilva.github.io`.
5.  Clique em **"Add"** (Adicionar).
6.  **Repita o passo 3 e 4** para adicionar também `localhost` (sem aspas). Isso é para quando você quiser testar a plataforma no seu próprio computador.
7.  Clique em **"Save"** (Salvar) novamente para guardar as mudanças.

--- 

## 📝 Terceiro Passo: Configurar o Banco de Dados (Realtime Database)

Agora vamos configurar onde os dados da sua plataforma serão guardados e como eles serão protegidos.

1.  No menu esquerdo, procure por **"Build"** (Construir) e, abaixo dele, clique em **"Realtime Database"** (Banco de Dados em Tempo Real).
2.  Se você nunca usou o Realtime Database antes, pode aparecer um botão **"Create database"** (Criar banco de dados). Se aparecer, clique nele.
    *   Escolha a localização: **"us-central1"** (é uma boa opção padrão).
    *   Selecione **"Start in test mode"** (Iniciar em modo de teste) e clique em **"Enable"** (Ativar).
3.  Agora que você está na tela do Realtime Database, clique na aba **"Rules"** (Regras).
4.  Você verá um texto que parece um código. **Apague todo o texto que estiver lá** e cole o seguinte código exatamente como está:

    ```json
    {
      "rules": {
        "users": {
          "$uid": {
            ".read": "$uid === auth.uid",
            ".write": "$uid === auth.uid",
            ".validate": "auth != null"
          }
        }
      }
    }
    ```

    *   **Explicação simples**: Este código diz ao Firebase que cada usuário (`$uid`) só pode ler e escrever nas *suas próprias* informações (`$uid === auth.uid`). Isso garante a privacidade e segurança dos dados de cada atleta.

5.  Clique no botão **"Publish"** (Publicar) para salvar as novas regras.

--- 

## 🎉 Quarto Passo: Verificação Final

Você configurou o essencial! Agora sua plataforma LeRunners está pronta para se comunicar com o Firebase de forma segura e eficiente.

**O que você fez:**
-   Permitiu que usuários se cadastrem e façam login com email e senha.
-   Disse ao Firebase de onde sua plataforma pode se conectar a ele.
-   Configurou as regras de segurança para que cada usuário só acesse seus próprios dados.

Agora, siga para as instruções de configuração do Cloudinary!

