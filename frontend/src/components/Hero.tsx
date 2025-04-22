import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, Rocket } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import * as THREE from 'three';
import { SphereAnimation } from '../extras/Sphere';
import Features from './Features';

const Hero = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<THREE.Points>();

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 2500 : 5000;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setDrawRange(0, particlesCount);

    const particlesMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.05 : 0.03,
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    particlesRef.current = particlesMesh;

    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x7c3aed, 0.8);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const handleResize = () => {
      if (!rendererRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!particlesRef.current || !rendererRef.current || !sceneRef.current) return;

      const deltaTime = currentTime - lastTime;
      if (deltaTime > 16) {
        lastTime = currentTime;
        particlesRef.current.rotation.x += 0.0005;
        particlesRef.current.rotation.y += 0.0005;
        
        const mouseX = 0;
        const mouseY = 0;
        particlesRef.current.position.x += (mouseX - particlesRef.current.position.x) * 0.05;
        particlesRef.current.position.y += (-mouseY - particlesRef.current.position.y) * 0.05;
        
        rendererRef.current.render(sceneRef.current, camera);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      rendererRef.current?.dispose();
    };
  }, []);

  const titleAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const subtitleAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <div>
<section id="home" className="h-[100vh] flex justify-center items-center overflow-hidden relative bg-black">
      <div ref={mountRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 w-[90vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div 
              className="inline-block bg-primary-900/30 text-primary-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              variants={titleAnimation}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)"
              }}
            >
              Training Program
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-display"
              variants={titleAnimation}
            >
              <motion.span
                className="inline-block text-5xl"
                variants={subtitleAnimation}
              >
                <Typewriter
                  options={{
                    strings: ['Sankalp 2.0', 'Transform Your Career', 'Learn. Grow. Succeed.'],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                    delay: 80,
                  }}
                />
              </motion.span>
              <motion.div 
                className="text-primary-400 mt-2"
                variants={subtitleAnimation}
                whileHover={{
                  scale: 1.02,
                  textShadow: "0 0 8px rgba(124, 58, 237, 0.6)"
                }}
              >
                Bridging Silence, Building Connections
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-300 mb-8 max-w-xl"
              variants={titleAnimation}
            >
              Join our comprehensive training program and master the skills that top tech companies demand. Get hands-on experience, mentorship, and guaranteed placement opportunities.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={titleAnimation}
            >
              <motion.button
                className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2 relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(124, 58, 237, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/30"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                Get Started 
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.button>
              
              <motion.button
                className="border-2 border-dark-400 text-gray-300 px-8 py-3 rounded-full font-medium hover:border-primary-600 hover:text-primary-400 transition-colors relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(124, 58, 237, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute inset-0 bg-primary-600/10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial="hidden"
            animate="visible"
            variants={cardAnimation}
          >
            <motion.div 
              className="relative z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <SphereAnimation/>
              
              <motion.div
                className="absolute inset-0 rounded-2xl"
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
    <Features/>
    </div>
    
  );
};

export default Hero;