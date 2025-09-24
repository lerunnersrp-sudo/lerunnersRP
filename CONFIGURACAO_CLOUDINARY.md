# Configuração Detalhada do Cloudinary

## ☁️ Passo a Passo Completo

### 1. Acessar o Console do Cloudinary

1. Vá para [https://cloudinary.com/console](https://cloudinary.com/console)
2. Faça login com sua conta
3. Você deve estar no dashboard principal

### 2. Verificar Credenciais

No dashboard principal, verifique se as credenciais estão corretas:
- **Cloud Name**: `dd6ppm6nf`
- **API Key**: `845911223412467`
- **API Secret**: `S6YefZx7J5StgcTV-greU4wFhP4`

### 3. Criar Upload Preset

#### 3.1 Acessar Configurações de Upload
1. No menu superior, clique em **"Settings"** (⚙️)
2. No menu lateral esquerdo, clique em **"Upload"**
3. Role até a seção **"Upload presets"**

#### 3.2 Criar Novo Preset
1. Clique em **"Add upload preset"**
2. Configure os seguintes campos:

**Configurações Básicas:**
- **Preset name**: `lerunners_preset`
- **Signing mode**: **Unsigned** ⚠️ (Muito importante!)
- **Folder**: `lerunners`

**Configurações de Upload:**
- **Resource type**: `Auto`
- **Allowed formats**: `jpg,jpeg,png,gif,webp`
- **Max file size**: `5000000` (5MB)
- **Max image width**: `2000`
- **Max image height**: `2000`

**Transformações Automáticas:**
- **Quality**: `auto`
- **Format**: `auto`
- **Crop**: `limit`
- **Width**: `1200`
- **Height**: `1200`

3. Clique em **"Save"**

### 4. Configurar Transformações Adicionais

#### 4.1 Preset para Fotos de Perfil
Crie um segundo preset específico para fotos de perfil:

1. Clique em **"Add upload preset"** novamente
2. Configure:

**Configurações Básicas:**
- **Preset name**: `lerunners_profile`
- **Signing mode**: **Unsigned**
- **Folder**: `lerunners/profiles`

**Transformações:**
- **Crop**: `fill`
- **Width**: `300`
- **Height**: `300`
- **Quality**: `auto:good`
- **Format**: `auto`
- **Gravity**: `face` (para focar no rosto)

3. Clique em **"Save"**

### 5. Configurar Pastas (Folders)

#### 5.1 Estrutura de Pastas Recomendada
1. Vá para **"Media Library"** no menu superior
2. Crie as seguintes pastas:
   - `lerunners/` (pasta principal)
   - `lerunners/profiles/` (fotos de perfil)
   - `lerunners/documents/` (documentos)
   - `lerunners/temp/` (arquivos temporários)

### 6. Configurar Webhooks (Opcional)

Para receber notificações de uploads:

1. Vá para **"Settings"** > **"Webhooks"**
2. Clique em **"Add webhook"**
3. Configure:
   - **Notification URL**: Sua URL de webhook (se tiver)
   - **Events**: `upload`, `delete`

### 7. Configurar Segurança

#### 7.1 Configurações de Domínio
1. Vá para **"Settings"** > **"Security"**
2. Em **"Allowed fetch domains"**, adicione:
   - `localhost`
   - `*.github.io`
   - Seus domínios personalizados

#### 7.2 Configurações de Upload
1. Em **"Upload restrictions"**:
   - **Max file size**: `5 MB`
   - **Max image dimensions**: `2000x2000`
   - **Allowed formats**: `jpg,jpeg,png,gif,webp`

### 8. Otimizações de Performance

#### 8.1 Configurar Auto-otimização
1. Vá para **"Settings"** > **"Upload"**
2. Em **"Upload defaults"**:
   - ✅ **Auto quality**
   - ✅ **Auto format**
   - ✅ **Auto crop**

#### 8.2 Configurar CDN
1. Vá para **"Settings"** > **"Advanced"**
2. Configure:
   - **Secure delivery**: ✅ Enabled
   - **Force HTTPS**: ✅ Enabled

### 9. Configurar Transformações Personalizadas

#### 9.1 Transformação para Thumbnails
Crie uma transformação nomeada para thumbnails:

1. Vá para **"Settings"** > **"Upload"**
2. Role até **"Named transformations"**
3. Clique em **"Add named transformation"**
4. Configure:
   - **Name**: `thumbnail`
   - **Transformation**: `c_fill,w_150,h_150,q_auto,f_auto`

#### 9.2 Transformação para Imagens de Capa
1. Adicione outra transformação:
   - **Name**: `cover`
   - **Transformation**: `c_fill,w_800,h_400,q_auto,f_auto`

### 10. Testar a Configuração

#### 10.1 Teste Manual
1. Vá para **"Media Library"**
2. Clique em **"Upload"**
3. Selecione uma imagem de teste
4. Verifique se ela aparece na pasta correta

#### 10.2 Teste via JavaScript
No console do navegador:

```javascript
// Testar se o Cloudinary está carregado
console.log(typeof cloudinary);

// Testar criação do widget
const widget = cloudinary.createUploadWidget({
  cloudName: 'dd6ppm6nf',
  uploadPreset: 'lerunners_preset'
}, (error, result) => {
  if (!error && result && result.event === "success") {
    console.log('Upload bem-sucedido:', result.info);
  }
});

// Abrir widget
widget.open();
```

### 11. URLs de Transformação

#### 11.1 Formato das URLs
As URLs do Cloudinary seguem este padrão:
```
https://res.cloudinary.com/dd6ppm6nf/image/upload/[transformações]/[public_id]
```

#### 11.2 Exemplos de Transformações
```javascript
// Imagem original
https://res.cloudinary.com/dd6ppm6nf/image/upload/sample.jpg

// Redimensionada (300x300)
https://res.cloudinary.com/dd6ppm6nf/image/upload/w_300,h_300,c_fill/sample.jpg

// Com qualidade automática
https://res.cloudinary.com/dd6ppm6nf/image/upload/q_auto,f_auto/sample.jpg

// Thumbnail circular
https://res.cloudinary.com/dd6ppm6nf/image/upload/w_150,h_150,c_fill,r_max/sample.jpg
```

### 12. Monitoramento e Analytics

#### 12.1 Dashboard de Uso
1. No dashboard principal, monitore:
   - **Transformations**: Número de transformações usadas
   - **Bandwidth**: Largura de banda consumida
   - **Storage**: Espaço de armazenamento usado
   - **Requests**: Número de requisições

#### 12.2 Configurar Alertas
1. Vá para **"Settings"** > **"Account"**
2. Configure alertas para:
   - 80% do limite de transformações
   - 80% do limite de largura de banda
   - 80% do limite de armazenamento

### 13. Backup e Exportação

#### 13.1 Backup Automático
1. Vá para **"Settings"** > **"Upload"**
2. Configure **"Auto backup"** se disponível
3. Escolha um serviço de backup (Google Drive, Dropbox, etc.)

### 14. Integração com a Plataforma LeRunners

#### 14.1 Código JavaScript Já Configurado
O arquivo `js/config.js` já contém:

```javascript
const CloudinaryUtils = {
  createUploadWidget(options = {}) {
    return cloudinary.createUploadWidget({
      cloudName: 'dd6ppm6nf',
      uploadPreset: 'lerunners_preset',
      folder: 'lerunners/profiles',
      cropping: true,
      croppingAspectRatio: 1,
      maxImageFileSize: 5000000,
      ...options
    }, callback);
  }
};
```

### 15. Solução de Problemas Comuns

#### Erro: "Upload preset not found"
- **Causa**: Preset não foi criado ou nome incorreto
- **Solução**: Verifique se o preset `lerunners_preset` existe e está configurado como "Unsigned"

#### Erro: "Invalid signature"
- **Causa**: Tentativa de usar preset "Signed" sem assinatura
- **Solução**: Configure o preset como "Unsigned"

#### Imagens não carregam
- **Causa**: URLs incorretas ou transformações inválidas
- **Solução**: Verifique o formato das URLs e transformações

#### Upload muito lento
- **Causa**: Imagens muito grandes
- **Solução**: Configure redimensionamento automático no preset

### 16. Limites do Plano Gratuito

O plano gratuito do Cloudinary inclui:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/mês
- **Transformations**: 25,000/mês
- **Admin API calls**: 500/hora

### 17. URLs Importantes

- **Console Cloudinary**: https://cloudinary.com/console
- **Documentação**: https://cloudinary.com/documentation
- **Upload Widget**: https://cloudinary.com/documentation/upload_widget
- **Transformações**: https://cloudinary.com/documentation/image_transformations

---

**✅ Após seguir todos esses passos, o sistema de upload de imagens da plataforma LeRunners estará totalmente configurado e funcional!**

