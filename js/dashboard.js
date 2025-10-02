document.addEventListener('DOMContentLoaded', function() {
    
    const userNameElement = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const professorView = document.getElementById('professor-view');
    const atletaView = document.getElementById('atleta-view');
    const addAthleteForm = document.getElementById('add-athlete-form');
    const athleteListContainer = document.getElementById('athlete-list-container');
    
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
            loadAthletesList();
        } else {
            atletaView.style.display = 'block';
        }
    }

    function loadAthletesList() {
        const loginsRef = database.ref('logins').orderByChild('role').equalTo('atleta');
        loginsRef.on('value', (snapshot) => {
            athleteListContainer.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const athlete = childSnapshot.val();
                    const div = document.createElement('div');
                    div.className = "p-2 bg-gray-100 rounded";
                    div.textContent = athlete.name;
                    athleteListContainer.appendChild(div);
                });
            } else {
                athleteListContainer.innerHTML = '<p class="text-gray-500">Nenhum aluno registado.</p>';
            }
        });
    }

    if (addAthleteForm) {
        addAthleteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('athlete-name');
            const passwordInput = document.getElementById('athlete-password');
            const newAthlete = {
                name: nameInput.value.trim(),
                password: passwordInput.value.trim(),
                role: 'atleta'
            };

            if (!newAthlete.name || !newAthlete.password) { return; }

            try {
                // Com as novas regras, isto agora é permitido
                await database.ref('logins').push().set(newAthlete);
                alert(`Aluno '${newAthlete.name}' registado com sucesso!`);
                addAthleteForm.reset();
            } catch (error) {
                console.error("Erro ao registar aluno:", error);
                alert("Falha ao registar aluno. Verifique a sua ligação à internet.");
            }
        });
    }

    function logoutUser() {
        localStorage.removeItem('currentUserSession');
        window.location.href = 'index.html';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
    
    checkSessionAndInitialize();
});
