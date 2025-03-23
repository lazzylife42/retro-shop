// main.js - Fichier principal minimaliste
// Configuration
const PIXELATION_LEVEL = 256;
const LOW_POLY_FACTOR = 3;
const DITHERING = true;
const TEXTURE_FILTERING = false;

// Variables globales
let scene, camera, renderer;
let isLoading = true;

// Initialisation
function init() {
    // Créer la scène Three.js
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000033);

    // Créer la caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Créer le renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('shop-canvas'),
        antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Ajouter un sol simple
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    floorGeometry.rotateX(-Math.PI / 2);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x333388 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);
    
    // Ajouter une lumière
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);
    
    // Créer un cube pour tester
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, 0);
    scene.add(cube);
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', onWindowResize);
    
    // Masquer l'écran de chargement
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        isLoading = false;
    }, 500);
    
    // Commencer l'animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Animation du cube de test
    const cube = scene.children.find(child => child.geometry && child.geometry.type === "BoxGeometry");
    if (cube) {
        cube.rotation.y += 0.01;
        cube.position.y = 0.5 + Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    renderer.render(scene, camera);
}

// Initialiser l'application au chargement
window.addEventListener('load', init);