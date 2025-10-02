// Sistema de Autenticação para LeRunners (usando SDK v8)
const AuthManager = {
    
    // Registrar novo usuário
    async register(email, password, userData) {
        try {
            // 1. Criar usuário no Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2. Preparar os dados do perfil para o banco de dados
            const userProfile = {
                uid: user.uid,
                nome: userData.name,
                email: user.email,
                tipo: userData.role,
                createdAt: new Date().toISOString()
            };

            // 3. Salvar os dados adicionais no Realtime Database
            await database.ref('users/' + user.uid).set(userProfile);

            console.log('Usuário registrado com sucesso e dados salvos no DB:', user.uid);
            // O redirecionamento será tratado pelo onAuthStateChanged
            return { success: true, user };

        } catch (error) {
            console.error('Erro no registro:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    // Fazer login
    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login realizado com sucesso:', userCredential.user.uid);
             // O redirecionamento será tratado pelo onAuthStateChanged
            return { success: true, user: userCredential.user };

        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    // Fazer logout
    async logout() {
        try {
            await auth.signOut();
            console.log('Logout realizado com sucesso');
            // O onAuthStateChanged tratará o redirecionamento para index.html
            return { success: true };

        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, error: 'Erro ao fazer logout' };
        }
    },

    // Converter códigos de erro para mensagens amigáveis
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado.',
            'auth/wrong-password': 'Senha incorreta.',
            'auth/email-already-in-use': 'Este email já está em uso.',
            'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
            'auth/invalid-email': 'O formato do email é inválido.',
        };
        return errorMessages[errorCode] || 'Ocorreu um erro. Tente novamente.';
    }
};
