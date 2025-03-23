// environment.js - Gestion de l'environnement 3D du studio de tatouage

class Environment {
    constructor(scene) {
        this.scene = scene;
    }
    
    create() {
        this.createFloor();
        this.createWalls();
        this.createFurniture();
        this.createLighting();
        this.createAtmosphericEffects();
    }
    
    createFloor() {
        // Créer la texture du sol en motif de carrelage
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Dessiner le carrelage
        ctx.fillStyle = '#444444';
        ctx.fillRect(0, 0, 64, 64);
        
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        floorGeometry.rotateX(-Math.PI / 2);
        const floorMaterial = new THREE.MeshLambertMaterial({ map: texture });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.scene.add(floor);
    }
    
    createWalls() {
        // Créer une texture pour les murs
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Dessiner la texture du mur
        ctx.fillStyle = '#555555';
        ctx.fillRect(0, 0, 64, 64);
        
        // Ajouter quelques détails pour simuler du papier peint
        ctx.fillStyle = '#666666';
        for (let y = 0; y < 64; y += 16) {
            for (let x = 0; x < 64; x += 16) {
                ctx.fillRect(x, y, 8, 8);
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        
        // Mur arrière
        const backWallGeometry = new THREE.PlaneGeometry(20, 10);
        const wallMaterial = new THREE.MeshLambertMaterial({ map: texture });
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.z = -10;
        backWall.position.y = 5;
        this.scene.add(backWall);
        
        // Murs latéraux
        const sideWallGeometry = new THREE.PlaneGeometry(20, 10);
        
        const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -10;
        leftWall.position.y = 5;
        this.scene.add(leftWall);
        
        const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.x = 10;
        rightWall.position.y = 5;
        this.scene.add(rightWall);
    }
    
    createFurniture() {
        // Ajouter quelques meubles low-poly
        
        // Comptoir d'accueil
        const counterGeometry = new THREE.BoxGeometry(5, 1, 1);
        const counterMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(0, 0.5, -8);
        this.scene.add(counter);
        
        // Fauteuil de tatouage
        this.createTattooChair(-3, 0, -5);
        
        // Miroir sur le mur
        const mirrorGeometry = new THREE.PlaneGeometry(2, 3);
        const mirrorMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaff });
        const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirror.position.set(8, 3, 0);
        mirror.rotation.y = -Math.PI / 2;
        this.scene.add(mirror);
        
        // Tableau de flash (dessins de tatouage)
        this.createFlashWall(-9, 3, 0);
    }
    
    createTattooChair(x, y, z) {
        const group = new THREE.Group();
        
        // Base du fauteuil
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.3, 3);
        const material = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const base = new THREE.Mesh(baseGeometry, material);
        group.add(base);
        
        // Dossier
        const backGeometry = new THREE.BoxGeometry(1.5, 2, 0.3);
        const back = new THREE.Mesh(backGeometry, material);
        back.position.set(0, 1, -1.35);
        group.add(back);
        
        group.position.set(x, y + 0.5, z);
        this.scene.add(group);
    }
    
    createFlashWall(x, y, z) {
        const group = new THREE.Group();
        
        // Panneau principal
        const boardGeometry = new THREE.PlaneGeometry(5, 5);
        const boardMaterial = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        group.add(board);
        
        // Ajouter des "flash" de tatouage (petites images)
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            
            const flashGeometry = new THREE.PlaneGeometry(1, 1);
            
            // Créer une texture unique pour chaque flash
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            
            // Dessiner un motif simple
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 32, 32);
            
            // Choisir une couleur aléatoire
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            
            // Dessiner une forme différente pour chaque flash
            switch (i % 5) {
                case 0: // Étoile
                    this.drawStar(ctx, 16, 16, 12);
                    break;
                case 1: // Cercle
                    ctx.beginPath();
                    ctx.arc(16, 16, 12, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 2: // Cœur
                    this.drawHeart(ctx, 16, 16, 12);
                    break;
                case 3: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(16, 4);
                    ctx.lineTo(4, 28);
                    ctx.lineTo(28, 28);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 4: // Éclair
                    this.drawLightning(ctx, 16, 16, 12);
                    break;
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            
            const flashMaterial = new THREE.MeshLambertMaterial({ map: texture });
            const flash = new THREE.Mesh(flashGeometry, flashMaterial);
            
            flash.position.set(-1.6 + col * 1.6, 1.6 - row * 1.6, 0.01);
            group.add(flash);
        }
        
        group.position.set(x, y, z);
        group.rotation.y = Math.PI / 2;
        this.scene.add(group);
    }
    
    drawStar(ctx, cx, cy, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = cx + Math.cos(angle) * size;
            const y = cy + Math.sin(angle) * size;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
    
    drawHeart(ctx, cx, cy, size) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - size / 2);
        ctx.bezierCurveTo(
            cx + size, cy - size,
            cx + size, cy + size / 2,
            cx, cy + size
        );
        ctx.bezierCurveTo(
            cx - size, cy + size / 2,
            cx - size, cy - size,
            cx, cy - size / 2
        );
        ctx.fill();
    }
    
    drawLightning(ctx, cx, cy, size) {
        ctx.beginPath();
        ctx.moveTo(cx - size / 4, cy - size);
        ctx.lineTo(cx + size / 4, cy - size / 3);
        ctx.lineTo(cx - size / 4, cy + size / 3);
        ctx.lineTo(cx + size / 4, cy + size);
        ctx.fill();
    }
    
    createLighting() {
        // Éclairage principal
        const ambientLight = new THREE.AmbientLight(0x888888);
        this.scene.add(ambientLight);
        
        // Lumières directionnelles
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(0, 10, 0);
        this.scene.add(mainLight);
        
        // Ajouter quelques spots lumineux
        const spot1 = new THREE.PointLight(0xffffaa, 0.7, 15);
        spot1.position.set(0, 5, 0);
        this.scene.add(spot1);
        
        const spot2 = new THREE.PointLight(0xaaffff, 0.5, 10);
        spot2.position.set(-5, 3, -5);
        this.scene.add(spot2);
    }
    
    createAtmosphericEffects() {
        // Dans un vrai projet PS1, on pourrait ajouter du brouillard ou des effets de particules
        this.scene.fog = new THREE.FogExp2(0x000033, 0.02);
    }
}