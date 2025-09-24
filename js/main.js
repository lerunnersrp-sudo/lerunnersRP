// Script principal para a página de login/registro

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Alternar entre login e registro
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
        Utils.clearError('login-error');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
        Utils.clearError('register-error');
    });

    // Formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Validações básicas
        Utils.clearError('login-error');
        
        if (!email || !password) {
            Utils.showError('login-error', 'Preencha todos os campos');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Utils.showError('login-error', 'Email inválido');
            return;
        }

        // Mostrar loading
        Utils.showLoading(submitBtn, 'Entrando...');

        try {
            const result = await AuthManager.login(email, password);
            
            if (result.success) {
                // Login bem-sucedido - o AuthManager já redireciona
                console.log('Login realizado com sucesso');
            } else {
                Utils.showError('login-error', result.error);
            }
        } catch (error) {
            console.error('Erro no login:', error);
            Utils.showError('login-error', 'Erro inesperado. Tente novamente');
        } finally {
            Utils.hideLoading(submitBtn);
        }
    });

    // Formulário de registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Validações básicas
        Utils.clearError('register-error');
        
        if (!name || !email || !password) {
            Utils.showError('register-error', 'Preencha todos os campos');
            return;
        }

        if (name.length < 2) {
            Utils.showError('register-error', 'Nome deve ter pelo menos 2 caracteres');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Utils.showError('register-error', 'Email inválido');
            return;
        }

        if (!Utils.isValidPassword(password)) {
            Utils.showError('register-error', 'Senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Mostrar loading
        Utils.showLoading(submitBtn, 'Cadastrando...');

        try {
            const userData = {
                name: name,
                role: role
            };

            const result = await AuthManager.register(email, password, userData);
            
            if (result.success) {
                // Registro bem-sucedido - o AuthManager já redireciona
                console.log('Registro realizado com sucesso');
            } else {
                Utils.showError('register-error', result.error);
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            Utils.showError('register-error', 'Erro inesperado. Tente novamente');
        } finally {
            Utils.hideLoading(submitBtn);
        }
    });

    // Verificar se usuário já está logado
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuário já está logado, redirecionar para dashboard
            window.location.href = 'dashboard.html';
        }
    });

    // Adicionar validação em tempo real para email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value.trim();
            const errorElement = this.closest('form').querySelector('.login-error-message');
            
            if (email && !Utils.isValidEmail(email)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    });

    // Adicionar validação em tempo real para senha
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const password = this.value;
            
            if (password.length > 0 && password.length < 6) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    });

    // Adicionar funcionalidade de "Enter" para alternar campos
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            
            if (activeElement.tagName === 'INPUT' && activeElement.type !== 'submit') {
                const form = activeElement.closest('form');
                const inputs = Array.from(form.querySelectorAll('input:not([type="submit"]):not([type="radio"])'));
                const currentIndex = inputs.indexOf(activeElement);
                
                if (currentIndex < inputs.length - 1) {
                    e.preventDefault();
                    inputs[currentIndex + 1].focus();
                }
            }
        }
    });

    // Adicionar funcionalidade de mostrar/esconder senha
    passwordInputs.forEach(input => {
        const container = input.parentElement;
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.innerHTML = '👁️';
        toggleBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.6;
        `;
        
        container.style.position = 'relative';
        container.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.innerHTML = '🙈';
            } else {
                input.type = 'password';
                toggleBtn.innerHTML = '👁️';
            }
        });
    });

    // Adicionar efeitos visuais nos formulários
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    console.log('Sistema de autenticação inicializado');
});

