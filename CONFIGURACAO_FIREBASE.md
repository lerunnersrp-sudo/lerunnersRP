# Configuração Detalhada do Firebase Realtime Database

## 🔥 Passo a Passo Completo

### 1. Acessar o Console do Firebase

1. Vá para [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Faça login com sua conta Google
3. Selecione o projeto **"lerunners"**

### 2. Configurar o Realtime Database

#### 2.1 Acessar o Realtime Database
1. No menu lateral esquerdo, clique em **"Realtime Database"**
2. Se ainda não foi criado, clique em **"Criar banco de dados"**
3. Escolha a localização: **"us-central1"** (recomendado)
4. Selecione **"Iniciar em modo de teste"** (vamos configurar as regras depois)

#### 2.2 Configurar as Regras de Segurança
1. Clique na aba **"Regras"**
2. Substitua o conteúdo existente por:

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

3. Clique em **"Publicar"**

### 3. Configurar Authentication

#### 3.1 Ativar Authentication
1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. Clique em **"Email/Password"**
4. Ative a opção **"Email/Password"**
5. **NÃO** ative "Email link (passwordless sign-in)"
6. Clique em **"Salvar"**

#### 3.2 Configurar Domínios Autorizados
1. Na aba **"Sign-in method"**, role até **"Authorized domains"**
2. Adicione os seguintes domínios:
   - `localhost` (para testes locais)
   - `seu-usuario.github.io` (substitua pelo seu usuário do GitHub)
   - Qualquer outro domínio personalizado que você usar

### 4. Verificar Configurações do Projeto

#### 4.1 Configurações Gerais
1. Clique no ícone de engrenagem ⚙️ ao lado de "Visão geral do projeto"
2. Selecione **"Configurações do projeto"**
3. Verifique se as informações estão corretas:
   - **Nome do projeto**: lerunners
   - **ID do projeto**: lerunners
   - **Região padrão**: us-central1

#### 4.2 Configuração do App Web
1. Na aba **"Geral"**, role até **"Seus apps"**
2. Se não houver um app web, clique em **"Adicionar app"** e selecione o ícone **</>**
3. Configure:
   - **Apelido do app**: LeRunners Web
   - ✅ **Configurar também o Firebase Hosting** (opcional)
4. Clique em **"Registrar app"**

### 5. Estrutura Inicial do Banco (Opcional)

Você pode criar uma estrutura inicial no banco para testes:

1. Vá para **"Realtime Database"** > **"Dados"**
2. Clique no **"+"** ao lado da URL do banco
3. Adicione:
   - **Nome**: `users`
   - **Valor**: `{}`
4. Clique em **"Adicionar"**

### 6. Regras Avançadas de Segurança (Opcional)

Para maior segurança, você pode usar estas regras mais detalhadas:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".validate": "auth != null",
        "profile": {
          ".validate": "newData.hasChildren(['age', 'weight', 'height']) || newData.val() == null",
          "age": {
            ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 120"
          },
          "weight": {
            ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= 300"
          },
          "height": {
            ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= 250"
          }
        },
        "trainings": {
          "$trainingId": {
            ".validate": "newData.hasChildren(['date', 'type', 'distance', 'time'])",
            "distance": {
              ".validate": "newData.isNumber() && newData.val() > 0"
            },
            "time": {
              ".validate": "newData.isNumber() && newData.val() > 0"
            }
          }
        },
        "transactions": {
          "$transactionId": {
            ".validate": "newData.hasChildren(['type', 'description', 'amount', 'date'])",
            "type": {
              ".validate": "newData.val() === 'income' || newData.val() === 'expense'"
            },
            "amount": {
              ".validate": "newData.isNumber() && newData.val() > 0"
            }
          }
        }
      }
    }
  }
}
```

### 7. Monitoramento e Logs

#### 7.1 Ativar Logs
1. Vá para **"Realtime Database"** > **"Uso"**
2. Aqui você pode monitorar:
   - Conexões simultâneas
   - Largura de banda utilizada
   - Operações de leitura/escrita

#### 7.2 Configurar Alertas (Opcional)
1. Vá para **"Alertas"** no menu lateral
2. Configure alertas para:
   - Uso excessivo de largura de banda
   - Muitas operações de escrita
   - Erros de autenticação

### 8. Backup e Exportação

#### 8.1 Configurar Backup Automático
1. Vá para **"Realtime Database"** > **"Backup"**
2. Configure backups automáticos se necessário
3. Escolha a frequência e retenção

### 9. Teste da Configuração

Para testar se tudo está funcionando:

1. **Teste Local**:
   ```bash
   # No diretório da plataforma
   python3 -m http.server 8080
   # Acesse http://localhost:8080
   ```

2. **Teste de Registro**:
   - Tente criar uma conta
   - Verifique se os dados aparecem no Firebase Console

3. **Teste de Login**:
   - Faça login com a conta criada
   - Verifique se consegue acessar o dashboard

### 10. Solução de Problemas Comuns

#### Erro: "Permission denied"
- **Causa**: Regras do banco muito restritivas
- **Solução**: Verifique se as regras permitem acesso para usuários autenticados

#### Erro: "Network request failed"
- **Causa**: Problemas de conectividade ou CORS
- **Solução**: Verifique os domínios autorizados

#### Dados não aparecem no banco
- **Causa**: Usuário não autenticado ou regras incorretas
- **Solução**: Verifique se o login está funcionando

### 11. URLs Importantes

- **Console Firebase**: https://console.firebase.google.com/
- **Documentação**: https://firebase.google.com/docs/database
- **Regras de Segurança**: https://firebase.google.com/docs/database/security

### 12. Comandos Úteis para Debug

No console do navegador (F12), você pode usar:

```javascript
// Verificar se está conectado
firebase.database().ref('.info/connected').on('value', (snapshot) => {
  console.log('Conectado:', snapshot.val());
});

// Testar escrita
firebase.database().ref('test').set('Hello World');

// Testar leitura
firebase.database().ref('test').once('value').then((snapshot) => {
  console.log('Valor:', snapshot.val());
});
```

---

**✅ Após seguir todos esses passos, sua plataforma LeRunners estará totalmente configurada e funcional!**

