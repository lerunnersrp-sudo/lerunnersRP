document.addEventListener('DOMContentLoaded', function() {
    
    // Lista de usuários. O professor está aqui para garantir o primeiro acesso.
    // Os outros usuários (alunos) serão carregados do Firebase.
    const STATIC_USERS = [
        { name: 'Leandro Alves', role: 'professor', password: '194001' }
    ];
    let ALL_USERS = [...STATIC_USERS]; // Começa com o usuário estático

    const userSelect = document.getElementById('user-select');
    const passwordInput = document.getElementById('password-input');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Função principal que inicia o processo
    async function initializeLogin() {
        // 1. Verifica se já existe uma sessão. Se sim, redireciona.
        const currentUserSession = localStorage.getItem('currentUserSession');
        if (currentUserSession) {
            window.location.href = 'dashboard.html';
            return;
        }

        // 2. Tenta carregar usuários adicionais (alunos) do Firebase.
        try {
            const snapshot = await database.ref('logins').once('value');
            if (snapshot.exists()) {
                const firebaseUsers = Object.values(snapshot.val());
                // Adiciona os usuários do Firebase à lista, evitando duplicatas
                firebaseUsers.forEach(fbUser => {
                    if (!ALL_USERS.some(u => u.name === fbUser.name)) {
                        ALL_USERS.push(fbUser);
                    }
                });
            }
        } catch (error) {
            console.error("Aviso: Não foi possível carregar usuários do Firebase. Usando apenas o usuário local.", error);
        }
        
        // 3. Popula o <select> com todos os usuários (estáticos + Firebase).
        populateUserSelect();
    }

    // Preenche o campo <select> com os usuários
    function populateUserSelect() {
        if (!userSelect) return;
        userSelect.innerHTML = '<option value="">Selecione seu usuário...</option>';
        ALL_USERS.forEach(user => {
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

        const user = ALL_USERS.find(u => u.name === selectedUserName);

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
