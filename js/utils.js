// utils.js - Fonctions utilitaires simplifiées

// Fonction pour appliquer l'esthétique rétro au rendu 3D
function applyRetroEffect(renderer, pixelationLevel) {
    // Réduire la résolution pour un rendu pixelisé
    renderer.setPixelRatio(1);
    
    // Définir une résolution basse pour l'effet pixelisé
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
        width: width,
        height: height
    };
}

// Fonction pour appliquer le post-processing rétro - version simplifiée
function renderWithRetroEffect(renderer, scene, camera, retroEffect) {
    // Rendu direct sans post-processing complexe
    renderer.render(scene, camera);
}

// Optimisation pour convertir des objets en low-poly
function simplifyGeometry(geometry, factor) {
    // Version simplifiée qui ne modifie pas la géométrie
    return geometry;
}

// Fonction pour appliquer un effet de dithering à une texture - version simplifiée
function applyDithering(texture) {
    return texture;
}

// Générateur de textures procédurales pour un style rétro
function createRetroTexture(width, height, drawFunction) {
    const canvas = document.createElement('canvas');
    canvas.width = width || 64;
    canvas.height = height || 64;
    
    const ctx = canvas.getContext('2d');
    
    // Exécuter la fonction de dessin personnalisée
    if (typeof drawFunction === 'function') {
        drawFunction(ctx, canvas.width, canvas.height);
    } else {
        // Texture par défaut
        ctx.fillStyle = '#444444';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Créer la texture Three.js
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    
    return texture;
}

// Fonction pour créer un effet de bruit CRT
function createCRTNoise() {
    return function(time) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        // Générer du bruit aléatoire
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() > 0.8 ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = value;
            data[i + 3] = value * 0.3; // Semi-transparent
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        return new THREE.CanvasTexture(canvas);
    };
}

// Exportation des fonctions
const Utils = {
    applyRetroEffect,
    renderWithRetroEffect,
    simplifyGeometry,
    applyDithering,
    createRetroTexture,
    createCRTNoise
};