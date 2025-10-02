// Script de Login para a Plataforma LeRunners
document.addEventListener('DOMContentLoaded', function() {
    
    // Lista de usuários pré-definida.
    // No futuro, podemos carregar isso do Firebase se necessário.
    const USERS = [
        { name: 'Professor Carlos', role: 'professor', password: '123' },
        { name: 'Atleta Teste', role: 'atleta', password: '123' },
        { name: 'Ana Corredora', role: 'atleta', password: 'senha123' }
    ];

    const userSelect = document.getElementById('user-select');
    const passwordInput = document.getElementById('password-input');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Função para verificar se já existe uma sessão de usuário
    function checkSession() {
        const currentUserSession = localStorage.getItem('currentUserSession');
        if (currentUserSession) {
            // Se encontrou uma sessão, vai direto para o dashboard
            console.log('Sessão encontrada. Redirecionando para o dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            // Se não, popula a lista de usuários para login
            populateUserSelect();
        }
    }

    // Preenche o campo <select> com os usuários da lista
    function populateUserSelect() {
        if (!userSelect) return;
        userSelect.innerHTML = '<option value="">Selecione seu usuário...</option>';
        USERS.forEach(user => {
            const option = document.createElement('option');
            option.value = user.name;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    }

    // Lida com o evento de submit do formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';
        loginError.style.display = 'none';

        const selectedUserName = userSelect.value;
        const enteredPassword = passwordInput.value;

        if (!selectedUserName) {
            loginError.textContent = 'Por favor, selecione um usuário.';
            loginError.style.display = 'block';
            return;
        }

        const user = USERS.find(u => u.name === selectedUserName);

        if (user && user.password === enteredPassword) {
            // Senha correta, cria a sessão no localStorage
            const sessionData = {
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUserSession', JSON.stringify(sessionData));
            
            // Redireciona para o dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Senha incorreta
            loginError.textContent = 'Senha incorreta. Tente novamente.';
            loginError.style.display = 'block';
            passwordInput.value = '';
        }
    });

    // Inicia o processo ao carregar a página
    checkSession();
});
