// Script principal para o dashboard (Lógica de redirecionamento corrigida)
document.addEventListener('DOMContentLoaded', function() {
    
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    const professorView = document.getElementById('professor-view');
    const atletaView = document.getElementById('atleta-view');

    // --- Lógica de Autenticação e Carregamento de Dados ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado, busca os dados.
            const userRef = database.ref('users/' + user.uid);
            
            userRef.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    initializeDashboard(userData);
                } else {
                    console.error('Dados do usuário não encontrados no DB. Deslogando.', user.uid);
                    auth.signOut(); // Desloga se não encontrar dados, o que aciona o redirecionamento abaixo.
                }
            });

        } else {
            // Usuário NÃO está logado. Redirecionar para a página de login.
            console.log('Nenhum usuário logado. Redirecionando para index.html');
            window.location.href = 'index.html';
        }
    });

    function initializeDashboard(userData) {
        if (userNameElement) {
            userNameElement.textContent = `Olá, ${userData.nome}`;
        }
        
        if(professorView) professorView.style.display = 'none';
        if(atletaView) atletaView.style.display = 'none';
        
        if (userData.tipo === 'professor') {
            if(professorView) {
                professorView.style.display = 'block';
                loadProfessorData(userData);
            }
        } else {
            if(atletaView) {
                atletaView.style.display = 'block';
                loadAtletaData(userData);
            }
        }
    }

    function loadProfessorData(professorData) {
        const atletasContainer = document.getElementById('lista-atletas-container');
        if(!atletasContainer) return;

        const atletasRef = database.ref('users').orderByChild('tipo').equalTo('atleta');
        atletasRef.on('value', (snapshot) => {
            atletasContainer.innerHTML = '';
            if(snapshot.exists()){
                 snapshot.forEach(childSnapshot => {
                    const atleta = childSnapshot.val();
                    const atletaElement = document.createElement('div');
                    atletaElement.className = 'atleta-item';
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

    function loadAtletaData(atletaData) {
        console.log("Visão do Atleta carregada.", atletaData);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().catch(error => console.error("Erro ao fazer logout:", error));
        });
    }

});
