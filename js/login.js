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
            // Com as novas regras, esta leitura agora é permitida
            const snapshot = await database.ref('logins').once('value');
            if (snapshot.exists()) {
                ALL_USERS = Object.values(snapshot.val());
                populateUserSelect();
            } else {
                 // Se não houver usuários no DB, cria o professor padrão
                await createDefaultProfessor();
                initializeLogin(); // Tenta novamente
            }
        } catch (error) {
            console.error("Erro ao carregar lista de usuários:", error);
            loginError.textContent = 'Falha ao conectar. Verifique as regras do Firebase.';
            loginError.style.display = 'block';
        }
    }
    
    // Função para criar o professor padrão se o banco estiver vazio
    async function createDefaultProfessor() {
        console.log("Nenhum usuário encontrado. Criando professor padrão...");
        const defaultProfessor = {
            name: 'Leandro Alves',
            password: '194001',
            role: 'professor'
        };
        try {
            // Para escrever, precisamos de uma autenticação anônima temporária
            await auth.signInAnonymously();
            await database.ref('logins').push().set(defaultProfessor);
            await auth.signOut();
        } catch(e) {
             console.error("Erro crítico ao criar professor padrão. Verifique as regras de escrita.", e);
        }
    }

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
