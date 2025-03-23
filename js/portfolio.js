// portfolio.js - Gestion des portfolios de tatouages

class Portfolio {
    constructor(scene, style) {
        this.scene = scene;
        this.style = style;
        this.currentPage = 0;
        this.imagesPerPage = 4;
        this.designs = [];
        this.group = new THREE.Group();
        this.isVisible = false;
        
        // Position du portfolio dans la scène
        this.group.position.set(0, 1.5, -3);
        this.group.rotation.y = 0;
        this.scene.add(this.group);
        
        // Masquer initialement
        this.group.visible = false;
    }
    
    async loadDesigns() {
        // Générer des designs fictifs selon le style
        this.designs = [];
        
        // Le nombre de designs dépend du style
        const designCount = {
            'Old School': 8,
            'Réaliste': 12,
            'Japonais': 10,
            'Tribal': 6,
            'Graphique': 9
        }[this.style] || 8;
        
        for (let i = 0; i < designCount; i++) {
            const design = await this.createDesignTexture(i);
            this.designs.push(design);
        }
        
        // Créer la structure du portfolio
        this.createPortfolioStructure();
    }
    
    async createDesignTexture(index) {
        // Créer une texture pour le design de tatouage
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Fond blanc
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 128, 128);
        
        // Dessiner un motif différent selon le style
        switch (this.style) {
            case 'Old School':
                this.drawOldSchoolDesign(ctx, index);
                break;
            case 'Réaliste':
                this.drawRealisticDesign(ctx, index);
                break;
            case 'Japonais':
                this.drawJapaneseDesign(ctx, index);
                break;
            case 'Tribal':
                this.drawTribalDesign(ctx, index);
                break;
            case 'Graphique':
                this.drawGraphicDesign(ctx, index);
                break;
            default:
                this.drawDefaultDesign(ctx, index);
        }
        
        // Ajouter un cadre
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, 124, 124);
        
        // Créer la texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        
        return {
            texture: texture,
            name: `${this.style} Design #${index + 1}`,
            price: 50 + Math.floor(Math.random() * 150)
        };
    }
    
    drawOldSchoolDesign(ctx, index) {
        ctx.fillStyle = '#e63946';
        
        // Motifs Old School classiques
        const motifs = [
            // Ancre
            () => {
                ctx.fillStyle = '#e63946';
                ctx.fillRect(54, 30, 20, 70);
                ctx.fillRect(44, 40, 40, 10);
                ctx.fillStyle = '#0077b6';
                ctx.beginPath();
                ctx.arc(64, 20, 15, 0, Math.PI * 2);
                ctx.fill();
            },
            // Hirondelle
            () => {
                ctx.fillStyle = '#0077b6';
                ctx.beginPath();
                ctx.moveTo(64, 40);
                ctx.bezierCurveTo(30, 60, 30, 80, 64, 90);
                ctx.bezierCurveTo(98, 80, 98, 60, 64, 40);
                ctx.fill();
                ctx.fillStyle = '#e63946';
                ctx.beginPath();
                ctx.arc(64, 50, 5, 0, Math.PI * 2);
                ctx.fill();
            },
            // Rose
            () => {
                ctx.fillStyle = '#e63946';
                ctx.beginPath();
                ctx.arc(64, 64, 25, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#0077b6';
                ctx.fillRect(60, 90, 8, 30);
            },
            // Étoile nautique
            () => {
                ctx.fillStyle = '#0077b6';
                for (let i = 0; i < 8; i++) {
                    ctx.save();
                    ctx.translate(64, 64);
                    ctx.rotate(i * Math.PI / 4);
                    ctx.fillRect(-5, -40, 10, 80);
                    ctx.restore();
                }
                ctx.fillStyle = '#e63946';
                ctx.beginPath();
                ctx.arc(64, 64, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        ];
        
        // Dessiner un motif en fonction de l'index
        motifs[index % motifs.length]();
    }
    
    drawRealisticDesign(ctx, index) {
        // Simulation de dessin réaliste avec des dégradés
        const grd = ctx.createRadialGradient(64, 64, 5, 64, 64, 60);
        grd.addColorStop(0, '#ffffff');
        grd.addColorStop(1, '#222222');
        
        ctx.fillStyle = grd;
        
        // Différentes formes pour simuler des dessins réalistes
        switch (index % 4) {
            case 0: // Portrait
                ctx.beginPath();
                ctx.arc(64, 50, 30, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(54, 80, 20, 30);
                break;
            case 1: // Animal
                ctx.beginPath();
                ctx.ellipse(64, 64, 40, 30, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(94, 44, 15, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 2: // Paysage
                ctx.fillRect(20, 70, 90, 40);
                ctx.beginPath();
                ctx.moveTo(20, 70);
                ctx.lineTo(50, 30);
                ctx.lineTo(80, 50);
                ctx.lineTo(110, 20);
                ctx.lineTo(110, 70);
                ctx.closePath();
                ctx.fill();
                break;
            case 3: // Fleur
                for (let i = 0; i < 6; i++) {
                    ctx.save();
                    ctx.translate(64, 64);
                    ctx.rotate(i * Math.PI / 3);
                    ctx.beginPath();
                    ctx.ellipse(0, -25, 15, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                break;
        }
    }
    
    drawJapaneseDesign(ctx, index) {
        // Couleurs traditionnelles japonaises
        const colors = ['#e63946', '#000000', '#0077b6'];
        
        // Motifs inspirés des tatouages japonais
        switch (index % 5) {
            case 0: // Carpe koï
                ctx.fillStyle = colors[0];
                ctx.beginPath();
                ctx.ellipse(64, 64, 40, 25, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = colors[1];
                ctx.beginPath();
                ctx.ellipse(94, 64, 15, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1: // Dragon
                ctx.fillStyle = colors[2];
                ctx.beginPath();
                ctx.moveTo(30, 30);
                ctx.bezierCurveTo(50, 10, 70, 40, 90, 20);
                ctx.bezierCurveTo(110, 0, 100, 50, 110, 70);
                ctx.bezierCurveTo(120, 90, 80, 100, 60, 80);
                ctx.bezierCurveTo(40, 60, 20, 90, 10, 70);
                ctx.bezierCurveTo(0, 50, 10, 50, 30, 30);
                ctx.fill();
                break;
            case 2: // Fleur de cerisier
                ctx.fillStyle = colors[0];
                for (let i = 0; i < 5; i++) {
                    ctx.save();
                    ctx.translate(64, 64);
                    ctx.rotate(i * Math.PI * 2 / 5);
                    ctx.beginPath();
                    ctx.ellipse(0, -25, 15, 25, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                ctx.fillStyle = colors[1];
                ctx.beginPath();
                ctx.arc(64, 64, 10, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 3: // Vague
                ctx.fillStyle = colors[2];
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, 40 + i * 20);
                    for (let x = 0; x <= 128; x += 20) {
                        ctx.quadraticCurveTo(
                            x + 10, 20 + i * 20 + (i % 2 ? 20 : 0), 
                            x + 20, 40 + i * 20
                        );
                    }
                    ctx.lineTo(128, 128);
                    ctx.lineTo(0, 128);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
            case 4: // Chrysanthème
                ctx.fillStyle = colors[index % 3];
                for (let i = 0; i < 16; i++) {
                    ctx.save();
                    ctx.translate(64, 64);
                    ctx.rotate(i * Math.PI / 8);
                    ctx.fillRect(-5, -60, 10, 50);
                    ctx.restore();
                }
                break;
        }
    }
    
    drawTribalDesign(ctx, index) {
        ctx.fillStyle = '#000000';
        
        // Motifs tribaux
        switch (index % 4) {
            case 0: // Spirale
                ctx.beginPath();
                let radius = 5;
                for (let angle = 0; angle < Math.PI * 10; angle += 0.1) {
                    radius += 0.5;
                    const x = 64 + Math.cos(angle) * radius;
                    const y = 64 + Math.sin(angle) * radius;
                    if (angle === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.fill();
                break;
            case 1: // Motif angulaire
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(20, 30 + i * 30);
                    ctx.lineTo(50, 40 + i * 30);
                    ctx.lineTo(70, 30 + i * 30);
                    ctx.lineTo(100, 50 + i * 30);
                    ctx.lineTo(70, 70 + i * 30);
                    ctx.lineTo(40, 50 + i * 30);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
            case 2: // Motif symétrique
                ctx.beginPath();
                ctx.moveTo(64, 20);
                ctx.lineTo(104, 50);
                ctx.lineTo(84, 80);
                ctx.lineTo(104, 110);
                ctx.lineTo(64, 100);
                ctx.lineTo(24, 110);
                ctx.lineTo(44, 80);
                ctx.lineTo(24, 50);
                ctx.closePath();
                ctx.fill();
                break;
            case 3: // Bandes entrecroisées
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(20, 30 + i * 30, 90, 15);
                }
                for (let i = 0; i < 3; i++) {
                    ctx.save();
                    ctx.translate(64, 64);
                    ctx.rotate(Math.PI / 3);
                    ctx.fillRect(-45, -7.5 + i * 30, 90, 15);
                    ctx.restore();
                }
                break;
        }
    }
    
    drawGraphicDesign(ctx, index) {
        // Couleurs vives pour les designs graphiques
        const colors = ['#ff006e', '#3a86ff', '#8338ec', '#fb5607'];
        
        // Motifs géométriques modernes
        switch (index % 5) {
            case 0: // Cercles concentriques
                for (let i = 5; i > 0; i--) {
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.beginPath();
                    ctx.arc(64, 64, i * 15, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 1: // Grille de carrés
                for (let y = 0; y < 4; y++) {
                    for (let x = 0; x < 4; x++) {
                        ctx.fillStyle = colors[(x + y) % colors.length];
                        ctx.fillRect(
                            20 + x * 22,
                            20 + y * 22,
                            20, 20
                        );
                    }
                }
                break;
            case 2: // Formes géométriques imbriquées
                ctx.fillStyle = colors[0];
                ctx.fillRect(24, 24, 80, 80);
                ctx.fillStyle = colors[1];
                ctx.beginPath();
                ctx.arc(64, 64, 40, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = colors[2];
                ctx.beginPath();
                ctx.moveTo(64, 24);
                ctx.lineTo(104, 104);
                ctx.lineTo(24, 104);
                ctx.closePath();
                ctx.fill();
                break;
            case 3: // Lignes parallèles
                for (let i = 0; i < 10; i++) {
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.fillRect(14, 10 + i * 12, 100, 10);
                }
                break;
            case 4: // Pattern de points
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        if ((x + y) % 2 === 0) {
                            ctx.fillStyle = colors[(x * y) % colors.length];
                            ctx.beginPath();
                            ctx.arc(
                                20 + x * 12,
                                20 + y * 12,
                                5, 0, Math.PI * 2
                            );
                            ctx.fill();
                        }
                    }
                }
                break;
        }
    }
    
    drawDefaultDesign(ctx, index) {
        // Design par défaut simple
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(64, 64, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(64, 64, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    createPortfolioStructure() {
        // Nettoyer le groupe existant
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }
        
        // Créer la structure du livre de portfolio
        const coverGeometry = new THREE.BoxGeometry(3, 0.2, 4);
        const coverMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        
        const cover = new THREE.Mesh(coverGeometry, coverMaterial);
        this.group.add(cover);
        
        // Ajouter une page de titre
        const titleGeometry = new THREE.PlaneGeometry(2.8, 3.8);
        
        // Créer une texture pour la page de titre
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Fond de la page
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        
        // Titre
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px RetroFont, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PORTFOLIO', 128, 50);
        
        // Style
        ctx.fillText(this.style.toUpperCase(), 128, 90);
        
        // Dessin d'exemple
        this.drawPortfolioCover(ctx, 128, 160, 80);
        
        const titleTexture = new THREE.CanvasTexture(canvas);
        titleTexture.magFilter = THREE.NearestFilter;
        titleTexture.minFilter = THREE.NearestFilter;
        
        const titleMaterial = new THREE.MeshLambertMaterial({ map: titleTexture });
        const titlePage = new THREE.Mesh(titleGeometry, titleMaterial);
        titlePage.position.y = 0.11;
        this.group.add(titlePage);
        
        // Ajouter des contrôles pour naviguer dans le portfolio
        this.addNavigationControls();
        
        // Afficher les designs de la page actuelle
        this.showCurrentPage();
    }
    
    drawPortfolioCover(ctx, x, y, size) {
        // Dessiner un exemple de design pour la couverture selon le style
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 128, size / 128);
        
        switch (this.style) {
            case 'Old School':
                this.drawOldSchoolDesign(ctx, 0);
                break;
            case 'Réaliste':
                this.drawRealisticDesign(ctx, 0);
                break;
            case 'Japonais':
                this.drawJapaneseDesign(ctx, 0);
                break;
            case 'Tribal':
                this.drawTribalDesign(ctx, 0);
                break;
            case 'Graphique':
                this.drawGraphicDesign(ctx, 0);
                break;
            default:
                this.drawDefaultDesign(ctx, 0);
        }
        
        ctx.restore();
    }
    
    addNavigationControls() {
        // Ajouter des boutons pour naviguer dans le portfolio
        const buttonGeometry = new THREE.PlaneGeometry(0.5, 0.5);
        
        // Créer une texture pour le bouton précédent
        const prevCanvas = document.createElement('canvas');
        prevCanvas.width = 32;
        prevCanvas.height = 32;
        const prevCtx = prevCanvas.getContext('2d');
        
        prevCtx.fillStyle = '#ffffff';
        prevCtx.fillRect(0, 0, 32, 32);
        prevCtx.fillStyle = '#000000';
        prevCtx.beginPath();
        prevCtx.moveTo(25, 5);
        prevCtx.lineTo(5, 16);
        prevCtx.lineTo(25, 27);
        prevCtx.closePath();
        prevCtx.fill();
        
        const prevTexture = new THREE.CanvasTexture(prevCanvas);
        prevTexture.magFilter = THREE.NearestFilter;
        prevTexture.minFilter = THREE.NearestFilter;
        
        const prevMaterial = new THREE.MeshLambertMaterial({ map: prevTexture });
        this.prevButton = new THREE.Mesh(buttonGeometry, prevMaterial);
        this.prevButton.position.set(-1.25, 0.11, -1.75);
        this.prevButton.userData = { type: 'prev' };
        this.group.add(this.prevButton);
        
        // Créer une texture pour le bouton suivant
        const nextCanvas = document.createElement('canvas');
        nextCanvas.width = 32;
        nextCanvas.height = 32;
        const nextCtx = nextCanvas.getContext('2d');
        
        nextCtx.fillStyle = '#ffffff';
        nextCtx.fillRect(0, 0, 32, 32);
        nextCtx.fillStyle = '#000000';
        nextCtx.beginPath();
        nextCtx.moveTo(7, 5);
        nextCtx.lineTo(27, 16);
        nextCtx.lineTo(7, 27);
        nextCtx.closePath();
        nextCtx.fill();
        
        const nextTexture = new THREE.CanvasTexture(nextCanvas);
        nextTexture.magFilter = THREE.NearestFilter;
        nextTexture.minFilter = THREE.NearestFilter;
        
        const nextMaterial = new THREE.MeshLambertMaterial({ map: nextTexture });
        this.nextButton = new THREE.Mesh(buttonGeometry, nextMaterial);
        this.nextButton.position.set(1.25, 0.11, -1.75);
        this.nextButton.userData = { type: 'next' };
        this.group.add(this.nextButton);
    }
    
    showCurrentPage() {
        // Supprimer les designs précédents
        this.group.children.forEach(child => {
            if (child.userData && child.userData.type === 'design') {
                this.group.remove(child);
            }
        });
        
        // Calculer combien de pages nous avons
        const totalPages = Math.ceil(this.designs.length / this.imagesPerPage);
        
        // S'assurer que la page actuelle est valide
        if (this.currentPage >= totalPages) {
            this.currentPage = totalPages - 1;
        }
        if (this.currentPage < 0) {
            this.currentPage = 0;
        }
        
        // Afficher les designs de la page actuelle
        const startIndex = this.currentPage * this.imagesPerPage;
        const endIndex = Math.min(startIndex + this.imagesPerPage, this.designs.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const design = this.designs[i];
            const index = i - startIndex;
            
            const row = Math.floor(index / 2);
            const col = index % 2;
            
            const designGeometry = new THREE.PlaneGeometry(1.2, 1.2);
            const designMaterial = new THREE.MeshLambertMaterial({ map: design.texture });
            const designMesh = new THREE.Mesh(designGeometry, designMaterial);
            
            designMesh.position.set(
                col === 0 ? -0.75 : 0.75,
                0.12,
                row === 0 ? -0.5 : -1.15
            );
            
            designMesh.userData = { 
                type: 'design', 
                designIndex: i,
                designInfo: design
            };
            
            this.group.add(designMesh);
        }
        
        // Mettre à jour les boutons de navigation
        this.prevButton.visible = this.currentPage > 0;
        this.nextButton.visible = this.currentPage < totalPages - 1;
    }
    
    navigate(direction) {
        if (direction === 'prev' && this.currentPage > 0) {
            this.currentPage--;
            this.showCurrentPage();
        } else if (direction === 'next') {
            const totalPages = Math.ceil(this.designs.length / this.imagesPerPage);
            if (this.currentPage < totalPages - 1) {
                this.currentPage++;
                this.showCurrentPage();
            }
        }
    }
    
    show() {
        this.group.visible = true;
        this.isVisible = true;
    }
    
    hide() {
        this.group.visible = false;
        this.isVisible = false;
    }
    
    update(deltaTime) {
        if (!this.isVisible) return;
        
        // Animation d'oscillation
        this.group.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.05;
    }
}