// Main variables
let scene, camera, renderer, controls;
let currentSection = 'home';
let portals = [];
let mouse = { x: 0, y: 0 };

// Portal configurations
const portalConfigs = {
    web: { 
        color: 0x00a8ff, 
        title: 'WEB DEVELOPMENT', 
        description: 'Interactive websites and web applications',
        position: { x: 5, y: 3, z: 0 }
    },
    app: { 
        color: 0x9c88ff, 
        title: 'APP DEVELOPMENT', 
        description: 'Mobile and desktop applications',
        position: { x: -5, y: 3, z: 0 }
    },
    video: { 
        color: 0xe84118, 
        title: 'VIDEO PRODUCTION', 
        description: 'Cinematic videos and motion graphics',
        position: { x: -5, y: -3, z: 0 }
    },
    design: { 
        color: 0xfbc531, 
        title: 'DESIGN STUDIO', 
        description: 'UI/UX and brand identity design',
        position: { x: 5, y: -3, z: 0 }
    }
};

// Initialize the application
function init() {
    createScene();
    createCamera();
    createRenderer();
    createControls();
    createLights();
    createCentralLogo();
    createPortals();
    createParticles();
    
    animate();
    setupEventListeners();
    simulateLoading();
}

// Create Three.js scene
function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
}

// Create camera
function createCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
}

// Create renderer
function createRenderer() {
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('threeCanvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

// Create orbit controls
function createControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 3;
    controls.maxDistance = 20;
}

// Create lighting
function createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point light
    const pointLight = new THREE.PointLight(0x00ff88, 0.5, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Spot light
    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(0, 10, 0);
    spotLight.angle = 0.3;
    spotLight.penumbra = 1;
    spotLight.castShadow = true;
    scene.add(spotLight);
}

// Create central logo
function createCentralLogo() {
    const geometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5
    });
    
    const logo = new THREE.Mesh(geometry, material);
    scene.add(logo);

    // Add floating animation
    function animateLogo() {
        requestAnimationFrame(animateLogo);
        logo.rotation.x += 0.01;
        logo.rotation.y += 0.02;
        logo.position.y = Math.sin(Date.now() * 0.001) * 0.3;
    }
    animateLogo();
}

// Create portals
function createPortals() {
    Object.keys(portalConfigs).forEach(type => {
        const config = portalConfigs[type];
        createPortal(type, config);
    });
}

function createPortal(type, config) {
    const group = new THREE.Group();
    group.position.set(config.position.x, config.position.y, config.position.z);
    
    // Outer ring
    const ringGeometry = new THREE.TorusGeometry(1.5, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({ 
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    group.add(ring);

    // Portal surface
    const portalGeometry = new THREE.CircleGeometry(1.2, 32);
    const portalMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.rotation.x = Math.PI / 2;
    group.add(portal);

    // Store portal data
    const portalData = {
        group: group,
        ring: ring,
        type: type,
        config: config,
        isActive: true
    };
    
    portals.push(portalData);
    scene.add(group);

    // Add floating animation
    function animatePortal() {
        requestAnimationFrame(animatePortal);
        if (currentSection === 'home' && portalData.isActive) {
            ring.rotation.z += 0.02;
            group.position.y = config.position.y + Math.sin(Date.now() * 0.001 + config.position.x) * 0.2;
        }
    }
    animatePortal();
}

// Create particles
function createParticles() {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 100;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animate particles
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
    }
    animateParticles();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate entire scene when in home section
    if (currentSection === 'home') {
        scene.rotation.y += 0.005;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Setup event listeners
function setupEventListeners() {
    // Mouse move for raycasting
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    
    // Click for portal interaction
    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Home button
    document.getElementById('homeButton').addEventListener('click', goToHome);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    updatePortalHoverEffects();
}

function onMouseClick() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    portals.forEach(portal => {
        if (!portal.isActive) return;
        
        const intersects = raycaster.intersectObject(portal.group, true);
        if (intersects.length > 0) {
            navigateToSection(portal.type);
        }
    });
}

function updatePortalHoverEffects() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    let hoveredPortal = null;
    
    portals.forEach(portal => {
        if (!portal.isActive) return;
        
        const intersects = raycaster.intersectObject(portal.group, true);
        const isHovered = intersects.length > 0;
        
        // Update cursor
        renderer.domElement.style.cursor = isHovered ? 'pointer' : 'default';
        
        // Update portal appearance
        portal.ring.material.emissiveIntensity = isHovered ? 1.2 : 0.8;
        
        if (isHovered) {
            hoveredPortal = portal;
        }
    });
    
    // Update portal info display
    const portalInfo = document.querySelector('.portal-info');
    if (hoveredPortal && currentSection === 'home') {
        portalInfo.innerHTML = `
            <h3>${hoveredPortal.config.title}</h3>
            <p>${hoveredPortal.config.description}</p>
        `;
        portalInfo.classList.add('visible');
    } else {
        portalInfo.classList.remove('visible');
    }
}

function navigateToSection(section) {
    if (currentSection === section) return;
    
    currentSection = section;
    
    // Update UI
    document.getElementById('homeButton').style.display = 'block';
    document.getElementById('sectionTitle').textContent = portalConfigs[section].title.toUpperCase();
    document.getElementById('sectionTitle').classList.add('visible');
    
    // Disable portals
    portals.forEach(portal => {
        portal.isActive = false;
    });
    
    // Move camera to section view
    const targetPosition = new THREE.Vector3(
        portalConfigs[section].position.x * 1.5,
        portalConfigs[section].position.y * 1.5,
        12
    );
    
    animateCamera(targetPosition);
}

function goToHome() {
    currentSection = 'home';
    
    // Update UI
    document.getElementById('homeButton').style.display = 'none';
    document.getElementById('sectionTitle').classList.remove('visible');
    
    // Enable portals
    portals.forEach(portal => {
        portal.isActive = true;
    });
    
    // Move camera back to home position
    const homePosition = new THREE.Vector3(0, 0, 8);
    animateCamera(homePosition);
}

function animateCamera(targetPosition) {
    const startPosition = camera.position.clone();
    const startTime = Date.now();
    const duration = 1500;
    
    function updateCamera() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const ease = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPosition, targetPosition, ease);
        
        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        }
    }
    
    updateCamera();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function simulateLoading() {
    let progress = 0;
    const progressElement = document.querySelector('.loading-progress');
    const progressText = document.getElementById('progressText');
    const loadingScreen = document.getElementById('loadingScreen');
    
    const interval = setInterval(() => {
        progress += 1;
        progressElement.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 30);
}

// Add portal info element to HTML
document.addEventListener('DOMContentLoaded', function() {
    const portalInfo = document.createElement('div');
    portalInfo.className = 'portal-info';
    document.querySelector('.ui-overlay').appendChild(portalInfo);
});

// Start the application when page loads
window.addEventListener('load', init);