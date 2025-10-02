document.addEventListener('DOMContentLoaded', function() {
    
    // --- Seletores do DOM ---
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const professorView = document.getElementById('professor-view');
    const atletaView = document.getElementById('atleta-view');
    const addAthleteContainer = document.getElementById('add-athlete-container');
    const showAddAthleteBtn = document.getElementById('show-add-athlete-form-btn');
    const cancelAddAthleteBtn = document.getElementById('cancel-add-athlete-btn');
    const addAthleteForm = document.getElementById('add-athlete-form');
    const athleteGridContainer = document.getElementById('athlete-grid-container');
    
    // --- Lógica Principal ---
    function checkSessionAndInitialize() {
        const sessionDataString = localStorage.getItem('currentUserSession');
        if (!sessionDataString) {
            window.location.href = 'index.html';
            return;
        }
        
        const sessionData = JSON.parse(sessionDataString);
        initializeDashboard(sessionData);
    }

    function initializeDashboard(userData) {
        userNameElement.textContent = `Olá, ${userData.name}`;
        if (userData.role === 'professor') {
            professorView.style.display = 'block';
            setupProfessorView();
        } else {
            atletaView.style.display = 'block';
            // setupAthleteView(userData); // A implementar no futuro
        }
    }

    // --- Funções da Visão do Professor ---
    function setupProfessorView() {
        loadAthletesGrid();

        showAddAthleteBtn.addEventListener('click', () => {
            addAthleteContainer.style.display = 'block';
            showAddAthleteBtn.style.display = 'none';
        });

        cancelAddAthleteBtn.addEventListener('click', () => {
            addAthleteContainer.style.display = 'none';
            showAddAthleteBtn.style.display = 'block';
            addAthleteForm.reset();
        });

        addAthleteForm.addEventListener('submit', handleAddAthlete);
    }

    async function handleAddAthlete(e) {
        e.preventDefault();
        const nameInput = document.getElementById('athlete-name');
        const passwordInput = document.getElementById('athlete-password');
        
        const newAthleteLogin = {
            name: nameInput.value.trim(),
            password: passwordInput.value.trim(),
            role: 'atleta'
        };

        if (!newAthleteLogin.name || !newAthleteLogin.password) return;

        try {
            // 1. Cria o login para o atleta
            const newLoginRef = database.ref('logins').push();
            const newLoginKey = newLoginRef.key; // Pega a chave única gerada
            await newLoginRef.set(newAthleteLogin);
            
            // 2. Cria o perfil de atleta na nova "gaveta" de atletas usando a mesma chave
            const newAthleteProfile = {
                nome: newAthleteLogin.name,
                perfil: { objetivo: 'Não definido' },
                treinos_realizados: {}
            };
            await database.ref('atletas/' + newLoginKey).set(newAthleteProfile);
            
            alert(`Atleta '${newAthleteLogin.name}' cadastrado com sucesso!`);
            addAthleteForm.reset();
            addAthleteContainer.style.display = 'none';
            showAddAthleteBtn.style.display = 'block';

        } catch (error) {
            console.error("Erro ao cadastrar atleta:", error);
            alert("Falha ao cadastrar atleta.");
        }
    }

    function loadAthletesGrid() {
        const atletasRef = database.ref('atletas'); // Agora, lemos da nova "gaveta" de atletas
        
        atletasRef.on('value', (snapshot) => {
            athleteGridContainer.innerHTML = '<p>A carregar atletas...</p>';
            if (snapshot.exists()) {
                let html = '';
                snapshot.forEach(childSnapshot => {
                    const atleta = childSnapshot.val();
                    const atletaId = childSnapshot.key;

                    // Placeholder para dados futuros
                    const ultimoTreino = "N/A";
                    const volumeSemanal = "0 km";

                    html += `
                        <div class="athlete-card">
                            <h3 class="font-bold text-xl text-gray-800">${atleta.nome}</h3>
                            <div class="mt-4 space-y-2 text-sm text-gray-600">
                                <p><strong>Último Treino:</strong> ${ultimoTreino}</p>
                                <p><strong>Volume Semanal:</strong> ${volumeSemanal}</p>
                                <p><strong>Objetivo:</strong> ${atleta.perfil.objetivo || 'Não definido'}</p>
                            </div>
                            <div class="mt-6 text-right">
                                <button data-atleta-id="${atletaId}" class="form-button" style="width: auto; padding: 0.5rem 1rem;">Gerir Atleta</button>
                            </div>
                        </div>
                    `;
                });
                athleteGridContainer.innerHTML = html;
            } else {
                athleteGridContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">Nenhum atleta cadastrado.</p>';
            }
        });
    }

    // --- Funções Gerais ---
    function logoutUser() {
        localStorage.removeItem('currentUserSession');
        window.location.href = 'index.html';
    }

    logoutBtn.addEventListener('click', logoutUser);
    
    // Inicia a aplicação
    checkSessionAndInitialize();
});
