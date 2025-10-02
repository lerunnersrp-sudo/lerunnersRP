document.addEventListener('DOMContentLoaded', function() {
    
    let ALL_USERS = [];
    const userSelect = document.getElementById('user-select');
    const passwordInput = document.getElementById('password-input');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    async function initializeLogin() {
        const currentUserSession = localStorage.getItem('currentUserSession');
        if (currentUserSession) {
            window.location.href = 'dashboard.html';
            return;
        }

        try {
            const snapshot = await database.ref('logins').once('value');
            if (snapshot.exists()) {
                ALL_USERS = Object.values(snapshot.val());
                populateUserSelect();
            } else {
                loginError.textContent = 'Nenhum utilizador configurado. Crie o professor manualmente no Firebase.';
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error("Erro ao carregar lista de utilizadores:", error);
            loginError.textContent = 'Falha ao conectar. Verifique as regras do Firebase.';
            loginError.style.display = 'block';
        }
    }

    function populateUserSelect() {
        if (!userSelect) return;
        userSelect.innerHTML = '<option value="">Selecione o seu utilizador...</option>';
        ALL_USERS.forEach(user => {
            const option = document.createElement('option');
            option.value = user.name;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';
        loginError.style.display = 'none';

        const selectedUserName = userSelect.value;
        const enteredPassword = passwordInput.value;

        if (!selectedUserName) {
            loginError.textContent = 'Por favor, selecione um utilizador.';
            loginError.style.display = 'block';
            return;
        }

        const user = ALL_USERS.find(u => u.name === selectedUserName);

        if (user && user.password === enteredPassword) {
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
