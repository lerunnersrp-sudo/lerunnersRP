# ☁️ Configuração do Cloudinary para LeRunners (Passo a Passo Simples)

Agora vamos configurar o Cloudinary, que é o serviço que vai guardar as fotos de perfil dos seus atletas. É como uma galeria de fotos na nuvem.

## O que é o Cloudinary?

Pense no Cloudinary como um álbum de fotos inteligente. Ele não só guarda as imagens, mas também as ajusta automaticamente para que fiquem perfeitas na sua plataforma, sem que você precise se preocupar com o tamanho ou formato.

--- 

## 🚀 Primeiro Passo: Acessar o Cloudinary

1.  **Abra seu navegador de internet**.
2.  **Digite este endereço** na barra de endereços: `https://cloudinary.com/console`
3.  **Pressione Enter**.
4.  Faça login com sua conta. Você deve chegar ao **Dashboard** (Painel de Controle) do Cloudinary.

--- 

## 📝 Segundo Passo: Criar um "Upload Preset"

Um "Upload Preset" é como uma regra que diz ao Cloudinary como ele deve tratar as fotos que você enviar. Vamos criar um para as fotos de perfil.

1.  No menu superior do Cloudinary, procure por **"Settings"** (Configurações) e clique no ícone de engrenagem (⚙️).
2.  No menu que aparece no lado esquerdo da tela, clique em **"Upload"**.
3.  Role a página para baixo até encontrar a seção **"Upload presets"**.
4.  Clique no botão **"Add upload preset"** (Adicionar preset de upload).
5.  Agora, vamos preencher as informações com muito cuidado:
    *   **Preset name**: Digite `lerunners_preset` (exatamente assim, com `_` e sem espaços).
    *   **Signing mode**: Esta é a parte mais importante! Clique na opção e **selecione "Unsigned"**.
        *   *Explicação simples*: "Unsigned" significa que sua plataforma pode enviar fotos para o Cloudinary sem precisar de uma "assinatura" especial a cada vez, o que facilita muito.
    *   **Folder**: Digite `lerunners/profiles` (isso vai criar uma pasta para as fotos de perfil).
    *   **Allowed formats**: Clique e selecione os formatos de imagem que você quer permitir. Recomendo: `jpg`, `jpeg`, `png`, `gif`, `webp`.
    *   **Max file size**: Digite `5000000` (isso significa 5 Megabytes, um bom tamanho para fotos de perfil).
    *   **Max image width**: Digite `2000`
    *   **Max image height**: Digite `2000`
    *   **Transformation**: Aqui, você pode deixar o Cloudinary ajustar as imagens automaticamente. Para isso, procure por:
        *   **Quality**: Selecione `Auto`
        *   **Format**: Selecione `Auto`
        *   **Crop**: Selecione `limit`
        *   **Width**: Digite `1200`
        *   **Height**: Digite `1200`

6.  Depois de preencher tudo, clique no botão **"Save"** (Salvar) no final da página.

--- 

## 🎉 Terceiro Passo: Verificação Final

Você configurou o Cloudinary! Agora sua plataforma LeRunners pode enviar e gerenciar as fotos de perfil dos atletas de forma automática.

**O que você fez:**
-   Criou uma regra especial (`lerunners_preset`) para que o Cloudinary saiba como lidar com as fotos.
-   Definiu que as fotos serão salvas em uma pasta específica (`lerunners/profiles`).
-   Permitiu que o Cloudinary otimize as imagens automaticamente.

Agora, siga para as instruções de como colocar sua plataforma no ar usando o GitHub Pages!

