// Sistema de Autenticação para LeRunners

const AuthManager = {
    // Estado atual do usuário
    currentUser: null,
    
    // Inicializar sistema de autenticação
    init() {
        // Verificar se o usuário já está logado
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.handleAuthSuccess(user);
            } else {
                this.currentUser = null;
                this.handleAuthLogout();
            }
        });
    },

    // Registrar novo usuário
    async register(email, password, userData) {
        try {
            // Criar usuário no Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Atualizar perfil do usuário
            await user.updateProfile({
                displayName: userData.name
            });

            // Salvar dados adicionais no Realtime Database
            const userProfile = {
                uid: user.uid,
                name: userData.name,
                email: user.email,
                role: userData.role,
                createdAt: FirebaseUtils.now(),
                updatedAt: FirebaseUtils.now(),
                profile: {
                    age: null,
                    weight: null,
                    height: null,
                    goal: null,
                    photoURL: null
                },
                stats: {
                    totalTrainings: 0,
                    totalDistance: 0,
                    totalTime: 0,
                    averagePace: 0
                }
            };

            await FirebaseUtils.set(`users/${user.uid}`, userProfile);

            console.log('Usuário registrado com sucesso:', user.uid);
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
            const user = userCredential.user;

            console.log('Login realizado com sucesso:', user.uid);
            return { success: true, user };

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
            return { success: true };

        } catch (error) {
            console.error('Erro no logout:', error);
            return { success: false, error: 'Erro ao fazer logout' };
        }
    },

    // Redefinir senha
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };

        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    },

    // Atualizar perfil do usuário
    async updateProfile(userData) {
        if (!this.currentUser) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        try {
            const uid = this.currentUser.uid;
            
            // Atualizar dados no Firebase Auth se necessário
            if (userData.name && userData.name !== this.currentUser.displayName) {
                await this.currentUser.updateProfile({
                    displayName: userData.name
                });
            }

            // Atualizar dados no Realtime Database
            const updates = {
                [`users/${uid}/name`]: userData.name,
                [`users/${uid}/updatedAt`]: FirebaseUtils.now()
            };

            // Adicionar campos do perfil se fornecidos
            if (userData.age !== undefined) updates[`users/${uid}/profile/age`] = userData.age;
            if (userData.weight !== undefined) updates[`users/${uid}/profile/weight`] = userData.weight;
            if (userData.height !== undefined) updates[`users/${uid}/profile/height`] = userData.height;
            if (userData.goal !== undefined) updates[`users/${uid}/profile/goal`] = userData.goal;
            if (userData.photoURL !== undefined) updates[`users/${uid}/profile/photoURL`] = userData.photoURL;

            await FirebaseUtils.update('/', updates);

            console.log('Perfil atualizado com sucesso');
            return { success: true };

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return { success: false, error: 'Erro ao atualizar perfil' };
        }
    },

    // Obter dados do usuário
    async getUserData() {
        if (!this.currentUser) {
            return { success: false, error: 'Usuário não autenticado' };
        }

        try {
            const userData = await FirebaseUtils.get(`users/${this.currentUser.uid}`);
            return { success: true, data: userData };

        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
            return { success: false, error: 'Erro ao carregar dados do usuário' };
        }
    },

    // Verificar se usuário está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    },

    // Obter UID do usuário atual
    getCurrentUserId() {
        return this.currentUser ? this.currentUser.uid : null;
    },

    // Lidar com sucesso na autenticação
    handleAuthSuccess(user) {
        // Redirecionar para dashboard se estiver na página de login
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            window.location.href = 'dashboard.html';
        }
    },

    // Lidar com logout
    handleAuthLogout() {
        // Redirecionar para página de login se estiver no dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    },

    // Converter códigos de erro para mensagens amigáveis
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/email-already-in-use': 'Este email já está em uso',
            'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
            'auth/invalid-email': 'Email inválido',
            'auth/user-disabled': 'Esta conta foi desabilitada',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
            'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
            'auth/requires-recent-login': 'É necessário fazer login novamente'
        };

        return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente';
    },

    // Verificar força da senha
    checkPasswordStrength(password) {
        const strength = {
            score: 0,
            feedback: []
        };

        if (password.length >= 8) {
            strength.score += 1;
        } else {
            strength.feedback.push('Use pelo menos 8 caracteres');
        }

        if (/[a-z]/.test(password)) {
            strength.score += 1;
        } else {
            strength.feedback.push('Inclua letras minúsculas');
        }

        if (/[A-Z]/.test(password)) {
            strength.score += 1;
        } else {
            strength.feedback.push('Inclua letras maiúsculas');
        }

        if (/[0-9]/.test(password)) {
            strength.score += 1;
        } else {
            strength.feedback.push('Inclua números');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength.score += 1;
        } else {
            strength.feedback.push('Inclua símbolos especiais');
        }

        return strength;
    }
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});

// Exportar para uso global
window.AuthManager = AuthManager;

