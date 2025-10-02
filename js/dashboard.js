// Script principal para o dashboard (versão com correção de sintaxe)
document.addEventListener('DOMContentLoaded', function() {
    
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Elementos das diferentes visões
    const professorView = document.getElementById('professor-view'); // Container da visão do professor
    const atletaView = document.getElementById('atleta-view');     // Container da visão do atleta

    // --- Lógica de Autenticação e Carregamento de Dados ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // O usuário está logado. Vamos buscar seus dados no Realtime Database.
            // CORREÇÃO: Removida a aspa simples extra antes do sinal de mais.
            const userRef = database.ref('users/' + user.uid);
            
            userRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    // Dados encontrados, vamos configurar o dashboard.
                    initializeDashboard(userData);
                } else {
                    // Este é o erro que você estava vendo.
                    console.error('Dados do usuário não encontrados no banco de dados para o UID:', user.uid);
                    // Como medida de segurança, se os dados não existem, deslogamos o usuário.
                    auth.signOut();
                }
            });

        } else {
            // Se o usuário não está logado, ele não deveria estar aqui. Redirecionar para o login.
            window.location.href = 'index.html';
        }
    });

    // Função para inicializar o dashboard com os dados do usuário
    function initializeDashboard(userData) {
        // Exibe o nome do usuário no cabeçalho
        if (userNameElement) {
            userNameElement.textContent = `Olá, ${userData.nome}`;
        }
        
        // Esconde todas as "views" para garantir que apenas a correta seja mostrada
        if(professorView) professorView.style.display = 'none';
        if(atletaView) atletaView.style.display = 'none';
        
        // Verifica o tipo de usuário e mostra a view correta
        if (userData.tipo === 'professor') {
            if(professorView) {
                professorView.style.display = 'block'; // Mostra a visão do professor
                loadProfessorData(userData); // Carrega dados específicos do professor
            }
        } else { // Assume 'atleta' como padrão
            if(atletaView) {
                atletaView.style.display = 'block'; // Mostra a visão do atleta
                loadAtletaData(userData); // Carrega dados específicos do atleta
            }
        }
    }

    // Função para carregar dados para a visão do professor
    function loadProfessorData(professorData) {
        console.log("Visão do Professor carregada.", professorData);
        // Próximo passo: carregar a lista de atletas aqui.
        const atletasContainer = document.getElementById('lista-atletas-container');
        if(!atletasContainer) return;

        const atletasRef = database.ref('users').orderByChild('tipo').equalTo('atleta');
        atletasRef.on('value', (snapshot) => {
            atletasContainer.innerHTML = ''; // Limpa a lista
            if(snapshot.exists()){
                 snapshot.forEach(childSnapshot => {
                    const atleta = childSnapshot.val();
                    const atletaElement = document.createElement('div');
                    atletaElement.className = 'atleta-item'; // Adicione estilo para .atleta-item no seu CSS
                    atletaElement.innerHTML = `
                        <p>${atleta.nome}</p>
                        <button>Ver Detalhes</button>
                    `;
                    atletasContainer.appendChild(atletaElement);
                });
            } else {
                atletasContainer.innerHTML = '<p>Nenhum atleta encontrado.</p>';
            }
        });
    }

    // Função para carregar dados para a visão do atleta
    function loadAtletaData(atletaData) {
        console.log("Visão do Atleta carregada.", atletaData);
        // Carregar treinos, metas, etc.
    }

    // Event Listener para o botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch(error => console.error("Erro ao fazer logout:", error));
        });
    }

});
