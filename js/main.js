// Script principal para a página de login/registro
document.addEventListener('DOMContentLoaded', function() {
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // --- Lógica de Autenticação ---
    // Monitora o estado de autenticação do usuário
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Se o usuário está logado E está na página index.html, redireciona para o dashboard
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                console.log('Usuário logado. Redirecionando para o dashboard...');
                window.location.href = 'dashboard.html';
            }
        } else {
            // Se o usuário não está logado E está em qualquer página que não seja a index, redireciona para o login
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                console.log('Usuário não logado. Redirecionando para a página de login...');
                window.location.href = 'index.html';
            }
        }
    });

    // --- Lógica da Interface ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    // Formulário de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');
        
        errorElement.textContent = ''; // Limpa erro anterior
        
        const result = await AuthManager.login(email, password);
        if (!result.success) {
            errorElement.textContent = result.error;
        }
    });

    // Formulário de registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        const errorElement = document.getElementById('register-error');

        errorElement.textContent = ''; // Limpa erro anterior

        if (password.length < 6) {
             errorElement.textContent = "A senha deve ter pelo menos 6 caracteres.";
             return;
        }

        const userData = { name, role };
        const result = await AuthManager.register(email, password, userData);
        
        if (!result.success) {
            errorElement.textContent = result.error;
        }
    });
});
