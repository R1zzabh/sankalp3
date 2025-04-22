import * as THREE from 'three';

export const createOptimizedParticles = (count: number = 5000) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Optimize renderer settings
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true
  });
  
  // Optimize render quality vs performance
  renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Use smaller particles on mobile
  const isMobile = window.innerWidth < 768;
  const particlesCount = isMobile ? Math.floor(count / 2) : count;
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * (isMobile ? 10 : 15);
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, particlesCount);
  
  const material = new THREE.PointsMaterial({
    size: isMobile ? 0.05 : 0.03,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Add lights for depth
  const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x7c3aed, 0.8);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);

  return {
    scene,
    camera, 
    renderer,
    particles,
    geometry,
    material,
    ambientLight,
    pointLight,
    dispose: () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.remove(particles);
      scene.remove(ambientLight);
      scene.remove(pointLight);
    }
  };
};
