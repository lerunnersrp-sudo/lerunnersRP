// Script principal para a página de login/registro (Lógica de redirecionamento corrigida)
document.addEventListener('DOMContentLoaded', function() {
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Monitora o estado de autenticação para redirecionar APENAS SE o usuário já estiver logado ao carregar a página
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Usuário já logado, redirecionando para dashboard.');
            window.location.href = 'dashboard.html';
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
        
        errorElement.textContent = '';
        
        const result = await AuthManager.login(email, password);
        if (result.success) {
            // Se o login for bem-sucedido, redireciona para o dashboard
            window.location.href = 'dashboard.html';
        } else {
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

        errorElement.textContent = '';

        if (password.length < 6) {
             errorElement.textContent = "A senha deve ter pelo menos 6 caracteres.";
             return;
        }

        const userData = { name, role };
        const result = await AuthManager.register(email, password, userData);
        
        if (result.success) {
            // Se o cadastro for bem-sucedido, redireciona para o dashboard
            window.location.href = 'dashboard.html';
        } else {
            errorElement.textContent = result.error;
        }
    });
});
