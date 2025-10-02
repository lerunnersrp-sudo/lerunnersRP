// Script principal para o dashboard (versão com login local)
document.addEventListener('DOMContentLoaded', function() {
    
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Função para verificar a sessão local
    function checkSessionAndInitialize() {
        const sessionDataString = localStorage.getItem('currentUserSession');
        
        if (!sessionDataString) {
            // Se não há sessão, volta para a página de login
            console.log('Nenhuma sessão encontrada. Redirecionando para o login.');
            window.location.href = 'index.html';
            return;
        }
        
        // Se há sessão, inicializa o dashboard
        const sessionData = JSON.parse(sessionDataString);
        initializeDashboard(sessionData);
    }

    // Função para inicializar o dashboard com os dados da sessão
    function initializeDashboard(userData) {
        if (userNameElement) {
            userNameElement.textContent = `Olá, ${userData.name}`;
        }

        // Aqui virá a lógica para mostrar a view de atleta ou professor
        console.log(`Usuário '${userData.name}' logado como '${userData.role}'.`);
        
        // Exemplo:
        // if (userData.role === 'professor') {
        //     document.getElementById('professor-view').style.display = 'block';
        // } else {
        //     document.getElementById('atleta-view').style.display = 'block';
        // }
    }

    // Função de logout
    function logoutUser() {
        localStorage.removeItem('currentUserSession');
        window.location.href = 'index.html';
    }

    // Adiciona o evento de clique no botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
    
    // Inicia o processo de verificação
    checkSessionAndInitialize();
});
