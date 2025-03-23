// main.js - Fichier principal pour le studio de tatouage rétro (version débogage)

// Configuration
const PIXELATION_LEVEL = 256;   // Niveau de pixelisation (plus bas = plus pixelisé)
const LOW_POLY_FACTOR = 3;      // Facteur de simplification des modèles
const DITHERING = true;         // Activer le dithering 
const TEXTURE_FILTERING = false; // Désactiver le filtrage des textures pour un look plus rétro

// Variables globales
let scene, camera, renderer;
let environment, ui, audioManager;
let tattooArtists = [];
let portfolios = [];
let currentArtistIndex = 0;
let carouselRadius = 7;
let isLoading = true;
let gameState = 'carousel'; // États: carousel, portfolio, purchase
let retroEffect;
let clock;
let raycaster, mouse;

// Fonction pour ajouter des logs
function log(message) {
    console.log("DEBUG: " + message);
}

// Initialisation
async function init() {
    try {
        log("Début initialisation");
        
        // Initialiser l'horloge
        clock = new THREE.Clock();
        log("Horloge initialisée");
        
        // Créer la scène Three.js
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000033);
        log("Scène créée");
        
        // Créer la caméra
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);
        log("Caméra créée");
        
        // Créer le renderer
        renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('shop-canvas'),
            antialias: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        log("Renderer créé");
        
        // Initialiser le raycaster pour la détection des clics
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        log("Raycaster initialisé");
        
        // Créer l'interface utilisateur
        ui = new UI();
        ui.showLoadingScreen(0.1);
        log("UI créée");
        
        // Créer le gestionnaire audio
        audioManager = new AudioManager();
        log("Gestionnaire audio créé");
        
        // Appliquer l'effet rétro
        retroEffect = Utils.applyRetroEffect(renderer, PIXELATION_LEVEL);
        log("Effet rétro appliqué");
        
        // Créer l'environnement
        environment = new Environment(scene);
        environment.create();
        ui.showLoadingScreen(0.3);
        log("Environnement créé");
        
        try {
            // Créer les tatoueurs
            await createTattooArtists();
            log("Tatoueurs créés");
            ui.showLoadingScreen(0.6);
            
            // Créer les portfolios
            await createPortfolios();
            log("Portfolios créés");
            ui.showLoadingScreen(0.8);
            
            // Ajouter les écouteurs d'événements
            setupEventListeners();
            log("Événements configurés");
            
            // Commencer la musique
            audioManager.playMusic();
            log("Musique démarrée");
            
            // Masquer l'écran de chargement
            ui.showLoadingScreen(1);
            setTimeout(() => {
                isLoading = false;
                log("Chargement terminé");
                
                // Afficher un message de bienvenue
                ui.showMessage("Bienvenue au studio de tatouage rétro!");
                
                // Mettre à jour l'interface
                updateUI();
                log("UI mise à jour");
            }, 1000);
            
            // Commencer l'animation
            animate();
            log("Animation démarrée");
        } catch (error) {
            console.error("Erreur lors de la création des éléments 3D:", error);
            ui.showMessage("Erreur de chargement: " + error.message);
        }
    } catch (error) {
        console.error("Erreur d'initialisation:", error);
        alert("Erreur lors du chargement de l'application: " + error.message);
    }
}

async function createTattooArtists() {
    log("Création des tatoueurs...");
    
    // Définir les styles de tatouage et leurs informations
    const styles = [
        {
            id: 'oldschool',
            name: 'Jack',
            style: 'Old School',
            description: 'Spécialiste des designs classiques avec des lignes audacieuses et des couleurs vives.'
        },
        {
            id: 'realistic',
            name: 'Laura',
            style: 'Réaliste',
            description: 'Maître des portraits et des designs ultra-réalistes avec un souci du détail exceptionnel.'
        },
        {
            id: 'japanese',
            name: 'Kenji',
            style: 'Japonais',
            description: 'Expert en tatouages traditionnels japonais avec des motifs emblématiques comme les dragons et les vagues.'
        },
        {
            id: 'tribal',
            name: 'Maori',
            style: 'Tribal',
            description: 'Adepte des motifs tribaux polynésiens et maoris avec des designs géométriques audacieux.'
        },
        {
            id: 'graphic',
            name: 'Zoé',
            style: 'Graphique',
            description: 'Artiste moderne spécialisée dans les designs géométriques et abstraits avec des lignes précises.'
        }
    ];
    
    // Créer les tatoueurs
    for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        log(`Création du tatoueur ${style.name}...`);
        
        const artist = new TattooArtist(
            style.id,
            style.name,
            style.style,
            style.description,
            null, // Pas de chemin de modèle, nous créons des modèles simples
            [] // Les images du portfolio seront créées plus tard
        );
        
        try {
            // Charger le modèle du tatoueur
            const artistMesh = await artist.loadModel();
            log(`Modèle de ${style.name} chargé`);
            
            // Simplifier la géométrie pour un look plus low-poly
            if (artistMesh.geometry) {
                artistMesh.geometry = Utils.simplifyGeometry(artistMesh.geometry, LOW_POLY_FACTOR);
            }
            
            // Placer le tatoueur dans le carrousel
            artist.placeInCarousel(i, styles.length, carouselRadius);
            
            // Ajouter le tatoueur à la scène
            scene.add(artistMesh);
            
            // Ajouter le tatoueur à notre liste
            tattooArtists.push(artist);
            log(`Tatoueur ${style.name} ajouté`);
        } catch (error) {
            console.error(`Erreur lors du chargement du tatoueur ${style.name}:`, error);
        }
    }
    
    // Sélectionner le premier tatoueur
    currentArtistIndex = 0;
    log("Création des tatoueurs terminée");
}

async function createPortfolios() {
    log("Création des portfolios...");
    // Créer un portfolio pour chaque tatoueur
    for (const artist of tattooArtists) {
        try {
            log(`Création du portfolio pour ${artist.name}...`);
            const portfolio = new Portfolio(scene, artist.style);
            await portfolio.loadDesigns();
            portfolios.push(portfolio);
            log(`Portfolio de ${artist.name} créé`);
        } catch (error) {
            console.error(`Erreur lors de la création du portfolio pour ${artist.name}:`, error);
        }
    }
    log("Création des portfolios terminée");
}

function setupEventListeners() {
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', onWindowResize);
    
    // Gérer les contrôles clavier
    document.addEventListener('keydown', onKeyDown);
    
    // Gérer les clics
    document.addEventListener('click', onClick);
    
    // Gérer les mouvements de souris pour le survol
    document.addEventListener('mousemove', onMouseMove);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Mettre à jour l'effet rétro
    retroEffect = Utils.applyRetroEffect(renderer, PIXELATION_LEVEL);
}

function onKeyDown(event) {
    if (isLoading) return;
    
    switch (gameState) {
        case 'carousel':
            handleCarouselControls(event);
            break;
        case 'portfolio':
            handlePortfolioControls(event);
            break;
        case 'purchase':
            // Géré par le système de confirmation de l'UI
            break;
    }
}

function handleCarouselControls(event) {
    switch (event.key) {
        case 'ArrowLeft':
            navigateCarousel('left');
            break;
        case 'ArrowRight':
            navigateCarousel('right');
            break;
        case ' ':
        case 'Enter':
            selectCurrentArtist();
            break;
        case 'm':
            audioManager.toggleMute();
            break;
    }
}

function handlePortfolioControls(event) {
    switch (event.key) {
        case 'ArrowLeft':
            portfolios[currentArtistIndex].navigate('prev');
            audioManager.playSound('navigate');
            break;
        case 'ArrowRight':
            portfolios[currentArtistIndex].navigate('next');
            audioManager.playSound('navigate');
            break;
        case 'Escape':
            exitPortfolio();
            break;
    }
}

function onClick(event) {
    if (isLoading) return;
    
    // Calculer la position de la souris en coordonnées normalisées (-1 à +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Mettre à jour le raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Vérifier les intersections selon l'état du jeu
    switch (gameState) {
        case 'carousel':
            // Détecter les clics sur les tatoueurs
            const artistIntersects = raycaster.intersectObjects(
                tattooArtists.map(artist => artist.mesh)
            );
            
            if (artistIntersects.length > 0) {
                // Trouver l'index du tatoueur cliqué
                const clickedArtist = artistIntersects[0].object;
                const artistIndex = tattooArtists.findIndex(artist => artist.mesh === clickedArtist);
                
                if (artistIndex !== -1) {
                    // Si ce n'est pas le tatoueur actuel, naviguer vers lui
                    if (artistIndex !== currentArtistIndex) {
                        // Déterminer dans quelle direction naviguer
                        let direction = 'right';
                        const diff = artistIndex - currentArtistIndex;
                        if (diff < 0 || diff > tattooArtists.length / 2) {
                            direction = 'left';
                        }
                        
                        navigateCarousel(direction, artistIndex);
                    } else {
                        // Si c'est le tatoueur actuel, le sélectionner
                        selectCurrentArtist();
                    }
                }
            }
            
            break;
        case 'portfolio':
            // Détecter les clics sur les boutons de navigation
            const portfolioIntersects = raycaster.intersectObjects(scene.children, true);
            
            for (const intersect of portfolioIntersects) {
                const userData = intersect.object.userData;
                
                if (userData && userData.type) {
                    // Navigation dans le portfolio
                    if (userData.type === 'prev' || userData.type === 'next') {
                        portfolios[currentArtistIndex].navigate(userData.type);
                        audioManager.playSound('navigate');
                        break;
                    }
                    // Sélection d'un design
                    else if (userData.type === 'design') {
                        purchaseDesign(userData.designInfo);
                        break;
                    }
                }
            }
            
            break;
    }
}

function onMouseMove(event) {
    if (isLoading) return;
    
    // Calculer la position de la souris en coordonnées normalisées
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Mettre à jour le raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Vérifier les survols selon l'état du jeu
    switch (gameState) {
        case 'carousel':
            // Détecter le survol des tatoueurs
            const artistIntersects = raycaster.intersectObjects(
                tattooArtists.map(artist => artist.mesh)
            );
            
            // Réinitialiser l'info de l'élément
            ui.updateItemInfo();
            
            if (artistIntersects.length > 0) {
                const hoveredArtist = artistIntersects[0].object;
                const artistIndex = tattooArtists.findIndex(artist => artist.mesh === hoveredArtist);
                
                if (artistIndex !== -1) {
                    // Mettre à jour l'interface avec les infos du tatoueur
                    const artist = tattooArtists[artistIndex];
                    ui.updateItemInfo({
                        name: `${artist.name} - ${artist.style}`,
                        price: artist.description
                    });
                }
            }
            break;
            
        case 'portfolio':
            // Détecter le survol des designs
            const portfolioIntersects = raycaster.intersectObjects(scene.children, true);
            
            // Réinitialiser l'info de l'élément
            ui.updateItemInfo();
            
            for (const intersect of portfolioIntersects) {
                const userData = intersect.object.userData;
                
                if (userData && userData.type === 'design') {
                    // Afficher les informations du design
                    ui.updateItemInfo({
                        name: userData.designInfo.name,
                        price: `${userData.designInfo.price} CRÉDITS`
                    });
                    break;
                }
            }
            break;
    }
}

function navigateCarousel(direction, targetIndex = null) {
    // Jouer un son de navigation
    audioManager.playSound('navigate');
    
    // Mettre à jour l'index du tatoueur actuel
    if (targetIndex !== null) {
        currentArtistIndex = targetIndex;
    } else {
        if (direction === 'left') {
            currentArtistIndex = (currentArtistIndex - 1 + tattooArtists.length) % tattooArtists.length;
        } else {
            currentArtistIndex = (currentArtistIndex + 1) % tattooArtists.length;
        }
    }
    
    // Mettre à jour la position de la caméra
    updateCameraPosition();
    
    // Mettre à jour l'interface
    updateUI();
}

function selectCurrentArtist() {
    // Jouer un son de confirmation
    audioManager.playSound('confirm');
    
    // Afficher le portfolio du tatoueur
    portfolios.forEach((portfolio, index) => {
        if (index === currentArtistIndex) {
            portfolio.show();
        } else {
            portfolio.hide();
        }
    });
    
    // Déplacer la caméra pour voir le portfolio
    moveCamera('portfolio');
    
    // Mettre à jour l'état du jeu
    gameState = 'portfolio';
    
    // Mettre à jour l'interface
    ui.updateControlsInfo('portfolio');
}

function exitPortfolio() {
    // Jouer un son d'annulation
    audioManager.playSound('cancel');
    
    // Masquer le portfolio
    portfolios[currentArtistIndex].hide();
    
    // Replacer la caméra dans le carrousel
    moveCamera('carousel');
    
    // Mettre à jour l'état du jeu
    gameState = 'carousel';
    
    // Mettre à jour l'interface
    ui.updateControlsInfo('carousel');
}

function purchaseDesign(design) {
    // Passer à l'état d'achat
    gameState = 'purchase';
    
    // Mettre à jour les contrôles
    ui.updateControlsInfo('purchase');
    
    // Afficher la confirmation d'achat
    ui.confirmPurchase(design).then(confirmed => {
        if (confirmed) {
            // Vérifier si le joueur a assez de crédits
            if (ui.credits >= design.price) {
                // Achat réussi
                ui.updateCredits(-design.price);
                audioManager.playSound('buy');
                ui.showNotification('success', `Vous avez acheté "${design.name}" !`);
            } else {
                // Pas assez de crédits
                audioManager.playSound('error');
                ui.showNotification('error', "Pas assez de crédits !");
            }
        } else {
            // Achat annulé
            audioManager.playSound('cancel');
        }
        
        // Revenir à l'état du portfolio
        gameState = 'portfolio';
        ui.updateControlsInfo('portfolio');
    });
}

function moveCamera(target) {
    // Définir la position cible de la caméra en fonction de la cible
    switch (target) {
        case 'carousel':
            // Position par défaut pour voir le carrousel
            camera.position.set(0, 2, 5);
            camera.lookAt(0, 1, 0);
            break;
        case 'portfolio':
            // Position pour voir le portfolio
            camera.position.set(0, 2, 0);
            camera.lookAt(0, 1.5, -3);
            break;
    }
}

function updateCameraPosition() {
    // Obtenir le tatoueur actuel
    const currentArtist = tattooArtists[currentArtistIndex];
    
    // Calculer la position idéale de la caméra pour regarder le tatoueur actuel
    const idealPosition = new THREE.Vector3();
    idealPosition.x = currentArtist.mesh.position.x * 0.5;
    idealPosition.y = currentArtist.mesh.position.y + 1;
    idealPosition.z = currentArtist.mesh.position.z * 0.5 + 5;
    
    // Interpoler la position de la caméra vers la position idéale
    camera.position.lerp(idealPosition, 0.1);
    
    // Faire regarder la caméra vers le tatoueur
    camera.lookAt(
        currentArtist.mesh.position.x,
        currentArtist.mesh.position.y + 1,
        currentArtist.mesh.position.z
    );
}

function updateUI() {
    // Mettre à jour les informations du tatoueur actuel
    if (gameState === 'carousel') {
        const currentArtist = tattooArtists[currentArtistIndex];
        ui.updateItemInfo({
            name: `${currentArtist.name} - ${currentArtist.style}`,
            price: currentArtist.description
        });
    }
    
    // Mettre à jour les contrôles
    ui.updateControlsInfo(gameState);
}

function animate() {
    requestAnimationFrame(animate);
    
    try {
        // Calculer le delta time
        const deltaTime = clock.getDelta();
        
        // Mettre à jour les tatoueurs
        for (const artist of tattooArtists) {
            artist.update(deltaTime);
        }
        
        // Mettre à jour les portfolios
        for (const portfolio of portfolios) {
            portfolio.update(deltaTime);
        }
        
        // Rendu avec effet rétro
        if (retroEffect && PIXELATION_LEVEL < window.innerWidth) {
            Utils.renderWithRetroEffect(renderer, scene, camera, retroEffect);
        } else {
            renderer.render(scene, camera);
        }
    } catch (error) {
        console.error("Erreur dans la boucle d'animation:", error);
    }
}

// Fonction pour démarrer l'application
function startApp() {
    log("Démarrage de l'application...");
    // Initialiser l'application
    init().catch(error => {
        console.error("Erreur lors de l'initialisation:", error);
        alert("Une erreur est survenue lors du démarrage: " + error.message);
    });
}

// Initialiser l'application au chargement
window.addEventListener('load', startApp);