// tattoo-artist.js - Classe pour gérer les tatoueurs (version simplifiée)

class TattooArtist {
    constructor(id, name, style, description, modelPath, portfolioImages) {
        this.id = id;
        this.name = name;
        this.style = style;  // Old School, Réaliste, Japonais, Tribal, Graphique
        this.description = description;
        this.modelPath = modelPath;
        this.portfolioImages = portfolioImages;
        this.mesh = null;
        this.originalPosition = null;
        this.targetPosition = null;
        this.isSelected = false;
    }

    async loadModel() {
        console.log(`Chargement du modèle pour ${this.name}...`);
        
        // Créer un modèle très simple pour éviter les problèmes
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshBasicMaterial({ color: this.getStyleColor() });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Ajouter une "tête" pour le tatoueur
        const headGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffa07a });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.25;
        this.mesh.add(head);
        
        console.log(`Modèle pour ${this.name} chargé avec succès`);
        return this.mesh;
    }
    
    getStyleColor() {
        // Retourner une couleur selon le style du tatoueur
        switch(this.style) {
            case 'Old School':
                return 0x0000ff; // Bleu
            case 'Réaliste':
                return 0x00ff00; // Vert
            case 'Japonais':
                return 0xff0000; // Rouge
            case 'Tribal':
                return 0x000000; // Noir
            case 'Graphique':
                return 0xffff00; // Jaune
            default:
                return 0xffffff; // Blanc
        }
    }
    
    placeInCarousel(index, totalArtists, radius) {
        const angle = (index / totalArtists) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        this.mesh.position.set(x, 1, z);
        this.mesh.rotation.y = -angle;
        
        this.originalPosition = {
            x: x,
            y: 1,
            z: z,
            rotationY: -angle
        };
        
        this.targetPosition = { ...this.originalPosition };
    }
    
    moveToCenter() {
        this.targetPosition = {
            x: 0,
            y: 1,
            z: 0,
            rotationY: 0
        };
        this.isSelected = true;
    }
    
    returnToCarousel() {
        this.targetPosition = { ...this.originalPosition };
        this.isSelected = false;
    }
    
    update(deltaTime) {
        if (!this.mesh) return;
        
        // Interpolation de la position actuelle vers la position cible
        this.mesh.position.x += (this.targetPosition.x - this.mesh.position.x) * 0.1;
        this.mesh.position.y += (this.targetPosition.y - this.mesh.position.y) * 0.1;
        this.mesh.position.z += (this.targetPosition.z - this.mesh.position.z) * 0.1;
        
        // Interpolation de la rotation
        this.mesh.rotation.y += (this.targetPosition.rotationY - this.mesh.rotation.y) * 0.1;
        
        // Animation d'idle
        if (!this.isSelected) {
            this.mesh.position.y = this.targetPosition.y + Math.sin(Date.now() * 0.002) * 0.1;
        }
    }
    
    getInfo() {
        return {
            name: this.name,
            style: this.style,
            description: this.description
        };
    }
}