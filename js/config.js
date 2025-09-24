// Configuração do Firebase com os valores reais do projeto LeRunners
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDGLozMAqDoQdP_znYi3mbebUomE-_O6hU",
    authDomain: "lerunners.firebaseapp.com",
    databaseURL: "https://lerunners-default-rtdb.firebaseio.com",
    projectId: "lerunners",
    storageBucket: "lerunners.firebasestorage.app",
    messagingSenderId: "786096020973",
    appId: "1:786096020973:web:334dc555218cedb0e1dbe4"
};

// Configuração do Cloudinary com os valores reais do projeto
const CLOUDINARY_CONFIG = {
    CLOUD_NAME: "dd6ppm6nf",
    API_KEY: "845911223412467",
    API_SECRET: "S6YefZx7J5StgcTV-greU4wFhP4"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

// Referências globais do Firebase
const auth = firebase.auth();
const database = firebase.database();

// Utilitários para Firebase Realtime Database
const FirebaseUtils = {
    // Referência para um caminho específico
    ref(path) {
        return database.ref(path);
    },

    // Salvar dados em um caminho específico
    async set(path, data) {
        try {
            await database.ref(path).set(data);
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            throw error;
        }
    },

    // Atualizar dados em um caminho específico
    async update(path, updates) {
        try {
            await database.ref(path).update(updates);
            return true;
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            throw error;
        }
    },

    // Obter dados de um caminho específico
    async get(path) {
        try {
            const snapshot = await database.ref(path).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Erro ao obter dados:', error);
            throw error;
        }
    },

    // Remover dados de um caminho específico
    async remove(path) {
        try {
            await database.ref(path).remove();
            return true;
        } catch (error) {
            console.error('Erro ao remover dados:', error);
            throw error;
        }
    },

    // Gerar uma nova chave única
    generateKey(path) {
        return database.ref(path).push().key;
    },

    // Adicionar dados com chave gerada automaticamente
    async push(path, data) {
        try {
            const newRef = database.ref(path).push();
            await newRef.set(data);
            return newRef.key;
        } catch (error) {
            console.error('Erro ao adicionar dados:', error);
            throw error;
        }
    },

    // Escutar mudanças em tempo real
    onValue(path, callback) {
        return database.ref(path).on('value', callback);
    },

    // Parar de escutar mudanças
    off(path, callback) {
        database.ref(path).off('value', callback);
    },

    // Converter timestamp para Date
    timestampToDate(timestamp) {
        if (!timestamp) return null;
        return new Date(timestamp);
    },

    // Converter Date para timestamp
    dateToTimestamp(date) {
        if (!date) return null;
        return date.getTime();
    },

    // Obter timestamp atual
    now() {
        return Date.now();
    },

    // Escutar mudanças de autenticação
    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    }
};

// Utilitários para Cloudinary
const CloudinaryUtils = {
    // Configurar widget de upload
    createUploadWidget(options = {}) {
        return cloudinary.createUploadWidget({
            cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
            uploadPreset: 'lerunners_preset', // Você precisará criar este preset no Cloudinary
            sources: ['local', 'url', 'camera'],
            multiple: false,
            cropping: true,
            croppingAspectRatio: 1,
            croppingValidateDimensions: true,
            maxImageFileSize: 5000000, // 5MB
            maxVideoFileSize: 20000000, // 20MB
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            ...options
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                console.log('Upload realizado com sucesso:', result.info);
                if (options.onSuccess) {
                    options.onSuccess(result.info);
                }
            }
            if (error) {
                console.error('Erro no upload:', error);
                if (options.onError) {
                    options.onError(error);
                }
            }
        });
    },

    // Gerar URL otimizada para imagem
    generateImageUrl(publicId, transformations = {}) {
        const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/`;
        
        let transformString = '';
        if (transformations.width) transformString += `w_${transformations.width},`;
        if (transformations.height) transformString += `h_${transformations.height},`;
        if (transformations.crop) transformString += `c_${transformations.crop},`;
        if (transformations.quality) transformString += `q_${transformations.quality},`;
        if (transformations.format) transformString += `f_${transformations.format},`;
        
        // Remove última vírgula
        if (transformString.endsWith(',')) {
            transformString = transformString.slice(0, -1);
        }
        
        return `${baseUrl}${transformString ? transformString + '/' : ''}${publicId}`;
    },

    // Upload direto via API (para uso avançado)
    async uploadImage(file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lerunners_preset');
        formData.append('cloud_name', CLOUDINARY_CONFIG.CLOUD_NAME);
        
        if (options.folder) formData.append('folder', options.folder);
        if (options.publicId) formData.append('public_id', options.publicId);
        
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Erro no upload da imagem');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro no upload:', error);
            throw error;
        }
    }
};

// Exportar para uso global
window.FirebaseUtils = FirebaseUtils;
window.CloudinaryUtils = CloudinaryUtils;
window.auth = auth;
window.database = database;

console.log('Firebase e Cloudinary configurados com sucesso para LeRunners');

