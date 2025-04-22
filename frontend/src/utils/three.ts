import * as THREE from 'three';

export const createOptimizedParticles = (mountElement: HTMLDivElement) => {
  const isMobile = window.innerWidth < 768;
  
  // Reduced particle count for mobile
  const particlesCount = isMobile ? 1500 : 3000;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    isMobile ? 85 : 75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = isMobile ? 6 : 5;

  const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
    precision: isMobile ? 'mediump' : 'highp'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  mountElement.appendChild(renderer.domElement);

  const particlesGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (isMobile ? 10 : 15);
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.05 : 0.03,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  return { scene, camera, renderer, particlesMesh };
};
