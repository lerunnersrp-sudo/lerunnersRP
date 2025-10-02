document.addEventListener('DOMContentLoaded', function() {
    
    // Lista de usuários será carregada aqui do Firebase
    let USERS = [];

    const userSelect = document.getElementById('user-select');
    const passwordInput = document.getElementById('password-input');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Função principal que inicia o processo
    async function initializeLogin() {
        const currentUserSession = localStorage.getItem('currentUserSession');
        if (currentUserSession) {
            window.location.href = 'dashboard.html';
            return;
        }

        try {
            const snapshot = await database.ref('logins').once('value');
            if (snapshot.exists()) {
                USERS = Object.values(snapshot.val());
                populateUserSelect();
            } else {
                loginError.textContent = 'Nenhum usuário configurado no sistema.';
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error("Erro ao carregar lista de usuários:", error);
            loginError.textContent = 'Falha ao conectar com o banco de dados.';
            loginError.style.display = 'block';
        }
    }

    // Preenche o campo <select> com os usuários carregados do Firebase
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
            
            window.location.href = 'dashboard.html';
        } else {
            loginError.textContent = 'Senha incorreta. Tente novamente.';
            loginError.style.display = 'block';
            passwordInput.value = '';
        }
    });

    initializeLogin();
});
