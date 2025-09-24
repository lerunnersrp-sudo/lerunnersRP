// Utilitários gerais para a plataforma LeRunners

const Utils = {
    // Formatação de tempo
    formatTime(minutes) {
        if (!minutes || minutes === 0) return '0:00';
        
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        const secs = Math.floor((minutes % 1) * 60);
        
        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // Calcular pace (min/km)
    calculatePace(distance, timeInMinutes) {
        if (!distance || !timeInMinutes || distance === 0) return '0:00';
        
        const paceInMinutes = timeInMinutes / distance;
        const minutes = Math.floor(paceInMinutes);
        const seconds = Math.floor((paceInMinutes % 1) * 60);
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    // Formatação de moeda
    formatCurrency(value) {
        if (typeof value !== 'number') return 'R$ 0,00';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    // Formatação de data
    formatDate(date, includeTime = false) {
        if (!date) return '';
        
        const dateObj = date instanceof Date ? date : new Date(date);
        
        if (includeTime) {
            return dateObj.toLocaleString('pt-BR');
        }
        
        return dateObj.toLocaleDateString('pt-BR');
    },

    // Validação de email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validação de senha
    isValidPassword(password) {
        // Mínimo 6 caracteres
        return password && password.length >= 6;
    },

    // Mostrar mensagem de erro
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    // Limpar mensagem de erro
    clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    },

    // Mostrar loading
    showLoading(buttonElement, text = 'Carregando...') {
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.originalText = buttonElement.textContent;
            buttonElement.textContent = text;
        }
    },

    // Esconder loading
    hideLoading(buttonElement) {
        if (buttonElement && buttonElement.originalText) {
            buttonElement.disabled = false;
            buttonElement.textContent = buttonElement.originalText;
        }
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Calcular IMC
    calculateBMI(weight, height) {
        if (!weight || !height) return null;
        
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        return Math.round(bmi * 10) / 10;
    },

    // Classificar IMC
    classifyBMI(bmi) {
        if (!bmi) return '';
        
        if (bmi < 18.5) return 'Abaixo do peso';
        if (bmi < 25) return 'Peso normal';
        if (bmi < 30) return 'Sobrepeso';
        if (bmi < 35) return 'Obesidade grau I';
        if (bmi < 40) return 'Obesidade grau II';
        return 'Obesidade grau III';
    },

    // Calcular calorias queimadas (estimativa básica)
    calculateCalories(distance, weight, timeInMinutes) {
        if (!distance || !weight || !timeInMinutes) return 0;
        
        // Fórmula aproximada: MET * peso * tempo
        // Corrida tem MET variável baseado na velocidade
        const speed = (distance / timeInMinutes) * 60; // km/h
        
        let met;
        if (speed < 8) met = 8.3;
        else if (speed < 9.7) met = 9.8;
        else if (speed < 11.3) met = 11.0;
        else if (speed < 12.9) met = 11.8;
        else if (speed < 14.5) met = 12.8;
        else if (speed < 16.1) met = 14.5;
        else met = 16.0;
        
        const calories = met * weight * (timeInMinutes / 60);
        return Math.round(calories);
    },

    // Obter saudação baseada no horário
    getGreeting() {
        const hour = new Date().getHours();
        
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    },

    // Converter string para slug
    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },

    // Truncar texto
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        
        return text.substr(0, maxLength) + '...';
    },

    // Capitalizar primeira letra
    capitalize(text) {
        if (!text) return '';
        
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    // Verificar se é dispositivo móvel
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Scroll suave para elemento
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Copiar texto para clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
            return false;
        }
    },

    // Verificar suporte a recursos do navegador
    checkBrowserSupport() {
        const support = {
            localStorage: typeof Storage !== 'undefined',
            geolocation: 'geolocation' in navigator,
            camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
            notifications: 'Notification' in window,
            serviceWorker: 'serviceWorker' in navigator
        };
        
        return support;
    },

    // Salvar no localStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    // Carregar do localStorage
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    },

    // Remover do localStorage
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }
};

// Exportar para uso global
window.Utils = Utils;

