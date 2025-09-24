# 🚀 Como Colocar a Plataforma LeRunners no Ar com GitHub Pages (Passo a Passo Simples)

Agora que o Firebase e o Cloudinary estão configurados, vamos colocar sua plataforma LeRunners online para que todos possam acessar! Usaremos o GitHub Pages, que é uma forma gratuita e fácil de hospedar sites diretamente do seu repositório no GitHub.

## O que é o GitHub Pages?

Pense no GitHub Pages como um serviço de hospedagem gratuito que o GitHub oferece. Ele pega os arquivos do seu projeto (HTML, CSS, JavaScript) e os transforma em um site que pode ser acessado por qualquer pessoa na internet, usando um endereço como `seu-usuario.github.io/nome-do-repositorio`.

--- 

## 📁 Primeiro Passo: Preparar os Arquivos da Plataforma

Você recebeu um arquivo ZIP chamado `lerunners-platform-completa.zip`. Este arquivo contém todos os arquivos da sua plataforma LeRunners.

1.  **Baixe o arquivo `lerunners-platform-completa.zip`** para o seu computador.
2.  **Descompacte este arquivo**. Você pode fazer isso clicando com o botão direito do mouse sobre ele e escolhendo a opção "Extrair tudo" ou "Descompactar". Isso criará uma pasta chamada `lerunners-platform`.
3.  **Abra a pasta `lerunners-platform`**. Dentro dela, você verá todos os arquivos do projeto (como `index.html`, `dashboard.html`, as pastas `css` e `js`, etc.).

--- 

## 📤 Segundo Passo: Fazer Upload dos Arquivos para o GitHub

Agora vamos colocar esses arquivos no seu repositório do GitHub.

1.  **Abra seu navegador de internet** e vá para `https://github.com/`.
2.  **Faça login** na sua conta do GitHub.
3.  **Vá para o seu repositório `lerunners`**. Você pode encontrá-lo na lista de seus repositórios ou usando a barra de pesquisa.
4.  Dentro do repositório, clique no botão **"Add file"** (Adicionar arquivo) e depois em **"Upload files"** (Fazer upload de arquivos).
5.  Você verá uma área onde pode arrastar e soltar arquivos. **Arraste todos os arquivos e pastas** que estão dentro da pasta `lerunners-platform` (que você descompactou no passo anterior) para essa área.
    *   **Importante**: Certifique-se de arrastar o *conteúdo* da pasta `lerunners-platform`, e não a pasta `lerunners-platform` em si. Ou seja, os arquivos `index.html`, `dashboard.html`, as pastas `css`, `js`, etc., devem ficar diretamente na raiz do seu repositório.
6.  Role a página para baixo. Na caixa **"Commit changes"** (Confirmar mudanças), você pode escrever uma mensagem como "Adicionando arquivos da plataforma LeRunners".
7.  Clique no botão verde **"Commit changes"**.

--- 

## 🌐 Terceiro Passo: Ativar o GitHub Pages

Agora vamos dizer ao GitHub para transformar esses arquivos em um site!

1.  No seu repositório `lerunners` no GitHub, clique na aba **"Settings"** (Configurações), que fica na parte superior da página.
2.  No menu lateral esquerdo, clique em **"Pages"**.
3.  Na seção **"Build and deployment"** (Construção e implantação):
    *   Em **"Source"** (Fonte), selecione a opção **"Deploy from a branch"** (Implantar de um branch).
    *   Em **"Branch"** (Ramificação), selecione a ramificação **`main`** (ou `master`, se for o caso do seu repositório). Certifique-se de que a pasta selecionada seja **`/ (root)`**.
4.  Clique no botão **"Save"** (Salvar).

--- 

## ⏳ Quarto Passo: Aguardar e Acessar

O GitHub Pages levará alguns minutos para processar seus arquivos e colocar seu site no ar.

1.  Após salvar as configurações do GitHub Pages, a página deve recarregar e mostrar uma mensagem como "Your site is live at..." (Seu site está ativo em...). Abaixo dessa mensagem, você verá o **endereço do seu site**.
2.  **Copie este endereço** (ele será algo como `https://seu-usuario.github.io/lerunners/`).
3.  **Cole este endereço na barra de endereços do seu navegador** e pressione Enter.

**Parabéns! Sua plataforma LeRunners estará online!**

--- 

## ⚠️ O que fazer se não funcionar imediatamente?

-   **Aguarde mais alguns minutos**: Às vezes, o GitHub Pages pode demorar um pouco mais para atualizar.
-   **Limpe o cache do seu navegador**: Pressione `Ctrl + Shift + R` (Windows/Linux) ou `Cmd + Shift + R` (Mac) para recarregar a página sem usar o cache antigo.
-   **Verifique o endereço**: Certifique-se de que o endereço que você copiou do GitHub Pages está correto.
-   **Verifique as configurações**: Revise os passos 2 e 3 para garantir que você fez o upload dos arquivos corretamente e ativou o GitHub Pages na ramificação `main` (ou `master`) e na pasta `/ (root)`.

Se tiver qualquer dúvida, me avise!

