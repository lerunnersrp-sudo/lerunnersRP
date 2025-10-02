document.addEventListener('DOMContentLoaded', function() {
    
    // --- Seletores do DOM ---
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const hubView = document.getElementById('hub-view');
    const managementView = document.getElementById('management-view');
    const atletaView = document.getElementById('atleta-view');
    const addAthleteContainer = document.getElementById('add-athlete-container');
    const showAddAthleteBtn = document.getElementById('show-add-athlete-form-btn');
    const cancelAddAthleteBtn = document.getElementById('cancel-add-athlete-btn');
    const addAthleteForm = document.getElementById('add-athlete-form');
    const athleteGridContainer = document.getElementById('athlete-grid-container');
    const backToHubBtn = document.getElementById('back-to-hub-btn');
    const managementAthleteName = document.getElementById('management-athlete-name');
    const prescribeTrainingForm = document.getElementById('prescribe-training-form');
    const trainingPlanList = document.getElementById('training-plan-list');
    const athleteProfileForm = document.getElementById('athlete-profile-form');
    const keyMetricsContainer = document.getElementById('key-metrics-container');

    let currentManagingAthleteId = null; 

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
            showView('hub-view');
            setupProfessorHub();
        } else {
            showView('atleta-view');
        }
    }

    function showView(viewId) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const viewToShow = document.getElementById(viewId);
        if(viewToShow) viewToShow.classList.add('active');
    }

    // --- Funções do Hub do Professor ---
    function setupProfessorHub() {
        loadAthletesGrid();
        showAddAthleteBtn.addEventListener('click', () => { addAthleteContainer.style.display = 'block'; showAddAthleteBtn.style.display = 'none'; });
        cancelAddAthleteBtn.addEventListener('click', () => { addAthleteContainer.style.display = 'none'; showAddAthleteBtn.style.display = 'block'; addAthleteForm.reset(); });
        addAthleteForm.addEventListener('submit', handleAddAthlete);
        backToHubBtn.addEventListener('click', () => { showView('hub-view'); currentManagingAthleteId = null; });

        athleteGridContainer.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('manage-athlete-btn')) {
                const athleteId = e.target.dataset.atletaId;
                openManagementPanel(athleteId);
            }
        });
    }

    async function handleAddAthlete(e) {
        e.preventDefault();
        const name = document.getElementById('athlete-name').value.trim();
        const password = document.getElementById('athlete-password').value.trim();
        if (!name || !password) return;

        try {
            const newLoginRef = database.ref('logins').push();
            await newLoginRef.set({ name, password, role: 'atleta' });
            
            // Usamos a mesma chave para a nova "gaveta" de atletas
            await database.ref('atletas/' + newLoginRef.key).set({
                nome: name,
                perfil: { objetivo: 'Não definido' }
            });
            alert(`Atleta '${name}' cadastrado com sucesso!`);
            addAthleteForm.reset();
            addAthleteContainer.style.display = 'none';
            showAddAthleteBtn.style.display = 'block';
        } catch (error) {
            console.error("Erro ao cadastrar atleta:", error);
            alert("Falha ao cadastrar atleta.");
        }
    }

    function loadAthletesGrid() {
        const atletasRef = database.ref('atletas');
        atletasRef.on('value', (snapshot) => {
            athleteGridContainer.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const atleta = childSnapshot.val();
                    const atletaId = childSnapshot.key;
                    athleteGridContainer.innerHTML += `
                        <div class="athlete-card">
                            <h3 class="font-bold text-xl text-gray-800">${atleta.nome}</h3>
                            <div class="mt-4 space-y-2 text-sm text-gray-600">
                                <p><strong>Objetivo:</strong> ${atleta.perfil.objetivo || 'Não definido'}</p>
                            </div>
                            <div class="mt-6 text-right">
                                <button data-atleta-id="${atletaId}" class="form-button manage-athlete-btn" style="width: auto; padding: 0.5rem 1rem;">Gerir Atleta</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                athleteGridContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">Nenhum atleta cadastrado.</p>';
            }
        });
    }

    // --- Funções do Painel de Gestão Individual ---
    function openManagementPanel(athleteId) {
        currentManagingAthleteId = athleteId;
        showView('management-view');
        
        const atletaRef = database.ref('atletas/' + athleteId);
        atletaRef.on('value', (snapshot) => {
            if(!snapshot.exists()) return;
            const atleta = snapshot.val();
            managementAthleteName.textContent = `Gerindo: ${atleta.nome}`;
            loadProfileData(atleta.perfil);
            loadTrainingPlan(athleteId);
            loadKeyMetrics(atleta);
        });

        prescribeTrainingForm.onsubmit = (e) => handlePrescribeTraining(e);
        athleteProfileForm.onsubmit = (e) => handleUpdateProfile(e);
    }

    function loadProfileData(perfil) {
        if (!perfil) return;
        document.getElementById('athlete-goal').value = perfil.objetivo || '';
        document.getElementById('athlete-rp-5k').value = perfil.rp5k || '';
    }

    function loadTrainingPlan(athleteId) {
        const planRef = database.ref(`atletas/${athleteId}/plano_treino`).orderByChild('data');
        planRef.on('value', (snapshot) => {
            trainingPlanList.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const treino = childSnapshot.val();
                    trainingPlanList.innerHTML += `
                        <div class="p-3 bg-gray-100 rounded">
                            <p><strong>${new Date(treino.data + 'T03:00:00Z').toLocaleDateString('pt-BR', {weekday: 'long', day: '2-digit', month: '2-digit'})}:</strong> ${treino.tipo}</p>
                            <p class="text-sm text-gray-600">${treino.descricao}</p>
                        </div>
                    `;
                });
            } else {
                trainingPlanList.innerHTML = '<p class="text-gray-500">Nenhum treino agendado.</p>';
            }
        });
    }

    function loadKeyMetrics(atleta) {
        keyMetricsContainer.innerHTML = `<p><strong>Volume Total:</strong> 0 km</p>`;
    }
    
    async function handlePrescribeTraining(e) {
        e.preventDefault();
        if (!currentManagingAthleteId) return;
        const newTraining = {
            data: document.getElementById('training-date').value,
            tipo: document.getElementById('training-type').value,
            descricao: document.getElementById('training-description').value,
            status: 'agendado'
        };
        try {
            await database.ref(`atletas/${currentManagingAthleteId}/plano_treino`).push().set(newTraining);
            alert('Treino agendado com sucesso!');
            prescribeTrainingForm.reset();
        } catch (error) {
            console.error("Erro ao agendar treino:", error);
            alert('Falha ao agendar treino.');
        }
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();
        if (!currentManagingAthleteId) return;
        const updatedProfile = {
            objetivo: document.getElementById('athlete-goal').value,
            rp5k: document.getElementById('athlete-rp-5k').value
        };
        try {
            await database.ref(`atletas/${currentManagingAthleteId}/perfil`).update(updatedProfile);
            alert('Perfil do atleta atualizado com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert('Falha ao atualizar perfil.');
        }
    }

    // --- Funções Gerais ---
    function logoutUser() {
        localStorage.removeItem('currentUserSession');
        window.location.href = 'index.html';
    }

    logoutBtn.addEventListener('click', logoutUser);
    checkSessionAndInitialize();
});
