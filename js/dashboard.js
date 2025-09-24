// Script principal para o dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        await initializeDashboard(user);
    });

    // Inicializar dashboard
    async function initializeDashboard(user) {
        try {
            // Carregar dados do usuário
            const userDataResult = await AuthManager.getUserData();
            if (userDataResult.success) {
                const userData = userDataResult.data;
                setupUserInterface(userData);
                loadDashboardData(userData);
            }

            setupEventListeners();
            setupNavigation();
            
        } catch (error) {
            console.error('Erro ao inicializar dashboard:', error);
        }
    }

    // Configurar interface do usuário
    function setupUserInterface(userData) {
        // Atualizar nome do usuário no header
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && userData.name) {
            userNameElement.textContent = userData.name;
        }

        // Carregar foto do perfil se existir
        if (userData.profile && userData.profile.photoURL) {
            updateProfilePhoto(userData.profile.photoURL);
        }
    }

    // Configurar navegação
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetSection = item.getAttribute('data-section');
                
                // Remover classe active de todos os itens
                navItems.forEach(nav => nav.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                // Adicionar classe active ao item clicado
                item.classList.add('active');
                
                // Mostrar seção correspondente
                const targetElement = document.getElementById(`${targetSection}-section`);
                if (targetElement) {
                    targetElement.classList.add('active');
                }

                // Carregar dados específicos da seção
                loadSectionData(targetSection);
            });
        });
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                const result = await AuthManager.logout();
                if (result.success) {
                    window.location.href = 'index.html';
                }
            });
        }

        // Formulário de perfil
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', handleProfileSubmit);
        }

        // Upload de foto
        const uploadPhotoBtn = document.getElementById('upload-photo-btn');
        if (uploadPhotoBtn) {
            uploadPhotoBtn.addEventListener('click', handlePhotoUpload);
        }

        // Modais
        setupModals();

        // Formulários de treino e transação
        setupTrainingForm();
        setupTransactionForm();
    }

    // Configurar modais
    function setupModals() {
        const modals = document.querySelectorAll('.modal');
        const modalCloses = document.querySelectorAll('.modal-close');

        // Fechar modais
        modalCloses.forEach(close => {
            close.addEventListener('click', () => {
                close.closest('.modal').style.display = 'none';
            });
        });

        // Fechar modal clicando fora
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Botões para abrir modais
        const addTrainingBtn = document.getElementById('add-training-btn');
        const addTransactionBtn = document.getElementById('add-transaction-btn');

        if (addTrainingBtn) {
            addTrainingBtn.addEventListener('click', () => {
                document.getElementById('training-modal').style.display = 'flex';
                document.getElementById('training-date').value = new Date().toISOString().split('T')[0];
            });
        }

        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                document.getElementById('transaction-modal').style.display = 'flex';
                document.getElementById('transaction-date').value = new Date().toISOString().split('T')[0];
            });
        }
    }

    // Configurar formulário de treino
    function setupTrainingForm() {
        const trainingForm = document.getElementById('training-form');
        const cancelTrainingBtn = document.getElementById('cancel-training');

        if (trainingForm) {
            trainingForm.addEventListener('submit', handleTrainingSubmit);
        }

        if (cancelTrainingBtn) {
            cancelTrainingBtn.addEventListener('click', () => {
                document.getElementById('training-modal').style.display = 'none';
                trainingForm.reset();
            });
        }
    }

    // Configurar formulário de transação
    function setupTransactionForm() {
        const transactionForm = document.getElementById('transaction-form');
        const cancelTransactionBtn = document.getElementById('cancel-transaction');

        if (transactionForm) {
            transactionForm.addEventListener('submit', handleTransactionSubmit);
        }

        if (cancelTransactionBtn) {
            cancelTransactionBtn.addEventListener('click', () => {
                document.getElementById('transaction-modal').style.display = 'none';
                transactionForm.reset();
            });
        }
    }

    // Lidar com envio do formulário de perfil
    async function handleProfileSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = {
            name: formData.get('profile-name') || document.getElementById('profile-name').value,
            age: parseInt(document.getElementById('profile-age').value) || null,
            weight: parseFloat(document.getElementById('profile-weight').value) || null,
            height: parseInt(document.getElementById('profile-height').value) || null,
            goal: document.getElementById('profile-goal').value || null
        };

        const submitBtn = e.target.querySelector('button[type="submit"]');
        Utils.showLoading(submitBtn, 'Salvando...');

        try {
            const result = await AuthManager.updateProfile(profileData);
            
            if (result.success) {
                showNotification('Perfil atualizado com sucesso!', 'success');
            } else {
                showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            showNotification('Erro ao atualizar perfil', 'error');
        } finally {
            Utils.hideLoading(submitBtn);
        }
    }

    // Lidar com upload de foto
    function handlePhotoUpload() {
        const uploadWidget = CloudinaryUtils.createUploadWidget({
            cropping: true,
            croppingAspectRatio: 1,
            folder: 'lerunners/profiles',
            onSuccess: async (result) => {
                try {
                    // Atualizar foto no perfil
                    const updateResult = await AuthManager.updateProfile({
                        photoURL: result.secure_url
                    });

                    if (updateResult.success) {
                        updateProfilePhoto(result.secure_url);
                        showNotification('Foto atualizada com sucesso!', 'success');
                    } else {
                        showNotification('Erro ao salvar foto', 'error');
                    }
                } catch (error) {
                    console.error('Erro ao atualizar foto:', error);
                    showNotification('Erro ao atualizar foto', 'error');
                }
            },
            onError: (error) => {
                console.error('Erro no upload:', error);
                showNotification('Erro no upload da imagem', 'error');
            }
        });

        uploadWidget.open();
    }

    // Atualizar foto do perfil na interface
    function updateProfilePhoto(photoURL) {
        const profilePhoto = document.getElementById('profile-photo');
        if (profilePhoto && photoURL) {
            profilePhoto.innerHTML = `<img src="${photoURL}" alt="Foto do perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
    }

    // Lidar com envio do formulário de treino
    async function handleTrainingSubmit(e) {
        e.preventDefault();
        
        const trainingData = {
            date: document.getElementById('training-date').value,
            type: document.getElementById('training-type').value,
            distance: parseFloat(document.getElementById('training-distance').value),
            time: parseInt(document.getElementById('training-time').value),
            notes: document.getElementById('training-notes').value,
            createdAt: FirebaseUtils.now()
        };

        // Calcular pace
        trainingData.pace = Utils.calculatePace(trainingData.distance, trainingData.time);

        const submitBtn = e.target.querySelector('button[type="submit"]');
        Utils.showLoading(submitBtn, 'Salvando...');

        try {
            const userId = AuthManager.getCurrentUserId();
            const trainingId = await FirebaseUtils.push(`users/${userId}/trainings`, trainingData);
            
            if (trainingId) {
                // Atualizar estatísticas
                await updateUserStats();
                
                showNotification('Treino registrado com sucesso!', 'success');
                document.getElementById('training-modal').style.display = 'none';
                e.target.reset();
                
                // Recarregar dados se estiver na seção de treinos
                loadSectionData('training');
                loadDashboardStats();
            }
        } catch (error) {
            console.error('Erro ao salvar treino:', error);
            showNotification('Erro ao registrar treino', 'error');
        } finally {
            Utils.hideLoading(submitBtn);
        }
    }

    // Lidar com envio do formulário de transação
    async function handleTransactionSubmit(e) {
        e.preventDefault();
        
        const transactionData = {
            type: document.getElementById('transaction-type').value,
            description: document.getElementById('transaction-description').value,
            amount: parseFloat(document.getElementById('transaction-amount').value),
            date: document.getElementById('transaction-date').value,
            category: document.getElementById('transaction-category').value,
            createdAt: FirebaseUtils.now()
        };

        const submitBtn = e.target.querySelector('button[type="submit"]');
        Utils.showLoading(submitBtn, 'Salvando...');

        try {
            const userId = AuthManager.getCurrentUserId();
            const transactionId = await FirebaseUtils.push(`users/${userId}/transactions`, transactionData);
            
            if (transactionId) {
                showNotification('Transação registrada com sucesso!', 'success');
                document.getElementById('transaction-modal').style.display = 'none';
                e.target.reset();
                
                // Recarregar dados se estiver na seção financeira
                loadSectionData('finances');
            }
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            showNotification('Erro ao registrar transação', 'error');
        } finally {
            Utils.hideLoading(submitBtn);
        }
    }

    // Carregar dados do dashboard
    async function loadDashboardData(userData) {
        // Carregar dados do perfil
        if (userData.profile) {
            const profile = userData.profile;
            document.getElementById('profile-name').value = userData.name || '';
            document.getElementById('profile-email').value = userData.email || '';
            document.getElementById('profile-age').value = profile.age || '';
            document.getElementById('profile-weight').value = profile.weight || '';
            document.getElementById('profile-height').value = profile.height || '';
            document.getElementById('profile-goal').value = profile.goal || '';
        }

        // Carregar estatísticas do dashboard
        loadDashboardStats();
    }

    // Carregar estatísticas do dashboard
    async function loadDashboardStats() {
        try {
            const userId = AuthManager.getCurrentUserId();
            const trainings = await FirebaseUtils.get(`users/${userId}/trainings`);
            
            if (trainings) {
                const trainingArray = Object.values(trainings);
                const currentWeek = getCurrentWeekTrainings(trainingArray);
                
                // Atualizar métricas
                document.getElementById('weekly-trainings').textContent = currentWeek.length;
                document.getElementById('total-distance').textContent = trainingArray.reduce((sum, t) => sum + (t.distance || 0), 0).toFixed(1);
                document.getElementById('total-time').textContent = Math.round(trainingArray.reduce((sum, t) => sum + (t.time || 0), 0));
                
                // Calcular pace médio
                const totalDistance = trainingArray.reduce((sum, t) => sum + (t.distance || 0), 0);
                const totalTime = trainingArray.reduce((sum, t) => sum + (t.time || 0), 0);
                const averagePace = totalDistance > 0 ? Utils.calculatePace(totalDistance, totalTime) : '0:00';
                document.getElementById('average-pace').textContent = averagePace;
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    // Obter treinos da semana atual
    function getCurrentWeekTrainings(trainings) {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        
        return trainings.filter(training => {
            const trainingDate = new Date(training.date);
            return trainingDate >= startOfWeek && trainingDate <= endOfWeek;
        });
    }

    // Carregar dados específicos de uma seção
    async function loadSectionData(section) {
        const userId = AuthManager.getCurrentUserId();
        
        switch (section) {
            case 'training':
                await loadTrainings(userId);
                break;
            case 'finances':
                await loadFinances(userId);
                break;
            case 'progress':
                await loadProgressCharts(userId);
                break;
        }
    }

    // Carregar treinos
    async function loadTrainings(userId) {
        try {
            const trainings = await FirebaseUtils.get(`users/${userId}/trainings`);
            const trainingList = document.getElementById('training-list');
            
            if (!trainings) {
                trainingList.innerHTML = '<p class="empty-state">Nenhum treino registrado ainda.</p>';
                return;
            }

            const trainingArray = Object.entries(trainings)
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            trainingList.innerHTML = trainingArray.map(training => `
                <div class="training-item">
                    <div class="training-header">
                        <h4>${getTrainingTypeName(training.type)}</h4>
                        <span class="training-date">${Utils.formatDate(training.date)}</span>
                    </div>
                    <div class="training-stats">
                        <span>${training.distance}km</span>
                        <span>${Utils.formatTime(training.time)}</span>
                        <span>Pace: ${training.pace}</span>
                    </div>
                    ${training.notes ? `<p class="training-notes">${training.notes}</p>` : ''}
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar treinos:', error);
        }
    }

    // Carregar finanças
    async function loadFinances(userId) {
        try {
            const transactions = await FirebaseUtils.get(`users/${userId}/transactions`);
            const transactionsList = document.getElementById('transactions-list');
            
            if (!transactions) {
                transactionsList.innerHTML = '<p class="empty-state">Nenhuma transação registrada ainda.</p>';
                updateFinanceSummary(0, 0);
                return;
            }

            const transactionArray = Object.entries(transactions)
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            // Calcular totais
            const totalIncome = transactionArray
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const totalExpenses = transactionArray
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            updateFinanceSummary(totalIncome, totalExpenses);

            transactionsList.innerHTML = transactionArray.map(transaction => `
                <div class="transaction-item ${transaction.type}">
                    <div class="transaction-info">
                        <h4>${transaction.description}</h4>
                        <span class="transaction-category">${getCategoryName(transaction.category)}</span>
                        <span class="transaction-date">${Utils.formatDate(transaction.date)}</span>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${Utils.formatCurrency(transaction.amount)}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        }
    }

    // Atualizar resumo financeiro
    function updateFinanceSummary(income, expenses) {
        document.getElementById('total-income').textContent = Utils.formatCurrency(income);
        document.getElementById('total-expenses').textContent = Utils.formatCurrency(expenses);
        document.getElementById('balance').textContent = Utils.formatCurrency(income - expenses);
    }

    // Carregar gráficos de progresso
    async function loadProgressCharts(userId) {
        try {
            const trainings = await FirebaseUtils.get(`users/${userId}/trainings`);
            
            if (!trainings) {
                return;
            }

            const trainingArray = Object.values(trainings)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            createDistanceChart(trainingArray);
            createPaceChart(trainingArray);
        } catch (error) {
            console.error('Erro ao carregar gráficos:', error);
        }
    }

    // Criar gráfico de distância
    function createDistanceChart(trainings) {
        const ctx = document.getElementById('distance-chart');
        if (!ctx) return;

        const data = trainings.map(t => ({
            x: t.date,
            y: t.distance
        }));

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Distância (km)',
                    data: data,
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Criar gráfico de pace
    function createPaceChart(trainings) {
        const ctx = document.getElementById('pace-chart');
        if (!ctx) return;

        const data = trainings.map(t => {
            const paceMinutes = t.time / t.distance;
            return {
                x: t.date,
                y: paceMinutes
            };
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Pace (min/km)',
                    data: data,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                const minutes = Math.floor(value);
                                const seconds = Math.floor((value % 1) * 60);
                                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Atualizar estatísticas do usuário
    async function updateUserStats() {
        try {
            const userId = AuthManager.getCurrentUserId();
            const trainings = await FirebaseUtils.get(`users/${userId}/trainings`);
            
            if (trainings) {
                const trainingArray = Object.values(trainings);
                const stats = {
                    totalTrainings: trainingArray.length,
                    totalDistance: trainingArray.reduce((sum, t) => sum + (t.distance || 0), 0),
                    totalTime: trainingArray.reduce((sum, t) => sum + (t.time || 0), 0),
                    averagePace: 0
                };

                if (stats.totalDistance > 0) {
                    stats.averagePace = stats.totalTime / stats.totalDistance;
                }

                await FirebaseUtils.update(`users/${userId}/stats`, stats);
            }
        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
        }
    }

    // Funções auxiliares
    function getTrainingTypeName(type) {
        const types = {
            'easy': 'Corrida Leve',
            'tempo': 'Treino de Ritmo',
            'interval': 'Treino Intervalado',
            'long': 'Corrida Longa',
            'recovery': 'Recuperação'
        };
        return types[type] || type;
    }

    function getCategoryName(category) {
        const categories = {
            'equipment': 'Equipamentos',
            'nutrition': 'Nutrição',
            'race': 'Provas',
            'coaching': 'Assessoria',
            'medical': 'Médico/Fisio',
            'other': 'Outros'
        };
        return categories[category] || category;
    }

    // Mostrar notificação
    function showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // Definir cor baseada no tipo
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    console.log('Dashboard inicializado');
});

