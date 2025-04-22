import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Zap, Users, Globe } from 'lucide-react';
import * as THREE from 'three';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<THREE.Points[]>([]);
  const animationRef = useRef<number>();
  const controls = useAnimation();
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const setupScene = useCallback(() => {
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

    const createParticleSystem = (color: number, count: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count * 3; i += 3) {
        const radius = 7 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i+2] = radius * Math.cos(phi);
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        size: 0.03,
        color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current.push(particles);
      
      return { geometry, material };
    };

    const particleSystems = [
      createParticleSystem(0x7c3aed, 2000), // Purple
      createParticleSystem(0x3b82f6, 1500), // Blue
      createParticleSystem(0xec4899, 1000)  // Pink
    ];

    return { scene, camera, renderer, particleSystems };
  }, []);

  useEffect(() => {
    const { scene, camera, renderer } = setupScene();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    const animate = () => {
      particlesRef.current.forEach((particles, index) => {
        particles.rotation.x += 0.0003 * (index + 1);
        particles.rotation.y += 0.0005 * (index + 1);
      });
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      particlesRef.current.forEach(particles => {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
      });
    };
  }, [setupScene]);

  const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: delay
      }
    })
  };

  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20
      }
    }
  };

  const featureAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: delay
      }
    })
  };

  const glowAnimation = {
    animate: {
      boxShadow: [
        '0 0 5px rgba(124, 58, 237, 0.3)',
        '0 0 20px rgba(124, 58, 237, 0.5)',
        '0 0 5px rgba(124, 58, 237, 0.3)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    { icon: <Zap />, text: "Industry-Aligned", delay: 0 },
    { icon: <Code />, text: "Hands-on Learning", delay: 0.15 },
    { icon: <Users />, text: "Collaborative Environment", delay: 0.3 },
    { icon: <Globe />, text: "Global Opportunities", delay: 0.45 }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay
      }
    })
  };

  return (
    <section id="about" className="mx-auto py-20 overflow-hidden relative bg-dark-200 min-h-screen flex items-center">
      {/* 3D Background container - non-reactive */}
      <div ref={mountRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />
      
      {/* Background gradient overlays - animated but not reactive */}
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-1/3 bg-gradient-to-br from-primary-900/20 to-transparent blur-3xl z-0"
        animate={{
          x: [0, 20, 0],
          y: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-tl from-secondary-900/20 to-transparent blur-3xl z-0"
        animate={{
          x: [0, -20, 0],
          y: [0, -10, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="w-[90vw] container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section - with reactive animations */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={imageAnimation}
            className="relative"
          >
            <motion.div className="relative overflow-hidden rounded-2xl shadow-xl">
              <motion.img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Team collaboration" 
                className="w-full h-auto object-cover transition-all duration-500 ease-out"
                whileHover={{ 
                  scale: 1.08,
                  transition: { duration: 0.4 }
                }}
                animate={{
                  filter: [
                    'brightness(1) contrast(1)',
                    'brightness(1.1) contrast(1.05)',
                    'brightness(1) contrast(1)'
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Animated texture overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-secondary-900/10 mix-blend-multiply"
                animate={{
                  background: [
                    'linear-gradient(to top right, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.1))',
                    'linear-gradient(to bottom right, rgba(124, 58, 237, 0.2), rgba(59, 130, 246, 0.15))',
                    'linear-gradient(to top right, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.1))'
                  ]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Glow border on hover */}
              <motion.div 
                className="absolute inset-0 rounded-2xl opacity-0"
                whileHover={{
                  opacity: 1,
                  boxShadow: [
                    '0 0 5px rgba(124, 58, 237, 0.3), 0 0 10px rgba(124, 58, 237, 0.2) inset',
                    '0 0 20px rgba(124, 58, 237, 0.6), 0 0 40px rgba(124, 58, 237, 0.3) inset',
                    '0 0 5px rgba(124, 58, 237, 0.3), 0 0 10px rgba(124, 58, 237, 0.2) inset'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Floating decorative elements - not reactive */}
            <motion.div 
              className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1.5 }}
            >
              <motion.div 
                className="absolute -top-10 -left-10 w-64 h-64 bg-primary-900/20 rounded-full filter blur-3xl opacity-20"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary-900/20 rounded-full filter blur-3xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, -15, 0],
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>
          </motion.div>

          {/* Content Section with reactive elements */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div 
              className="inline-block bg-primary-900/30 text-primary-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm"
              variants={textAnimation}
              custom={0.1}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(124, 58, 237, 0.4)"
              }}
            >
              Who We Are
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6 font-display"
              variants={textAnimation}
              custom={0.2}
              whileHover={{
                scale: 1.02,
                textShadow: "0 0 8px rgba(124, 58, 237, 0.6)"
              }}
            >
              <motion.span className="inline-block">Empowering Coders, </motion.span>
              <motion.span 
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400"
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Enabling Dreams
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-300 mb-6"
              variants={textAnimation}
              custom={0.3}
            >
              At SpectoV Pvt Ltd, we are committed to creating an environment that fosters innovation, learning, and professional growth. Our training programs are designed to bridge the gap between academic learning and industry requirements.
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              variants={textAnimation}
              custom={0.4}
            >
              We ensure our interns are well-prepared to tackle real-world challenges and succeed in their tech careers. Our focus is on practical skills, industry exposure, and career development.
            </motion.p>
            
            {/* Feature cards - fully reactive */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.5
                  }
                }
              }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
                  variants={cardVariants}
                  custom={feature.delay}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(124, 58, 237, 0.15)"
                  }}
                  onHoverStart={() => setHovered(index)}
                  onHoverEnd={() => setHovered(null)}
                >
                  <motion.div 
                    className="bg-primary-900/30 p-2 rounded-full backdrop-blur-sm relative"
                    animate={hovered === index ? {
                      scale: [1, 1.2, 1.1],
                      backgroundColor: "rgba(124, 58, 237, 0.5)",
                    } : {}}
                    transition={{
                      duration: 0.3
                    }}
                  >
                    <motion.div
                      className="h-5 w-5 text-primary-400"
                      animate={hovered === index ? {
                        rotate: [0, 10, -10, 0],
                        color: "#f3f4f6" // text-gray-100
                      } : {}}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    {/* Glow effect on hover */}
                    <motion.div 
                      className="absolute inset-0 rounded-full opacity-0"
                      animate={hovered === index ? {
                        opacity: 1,
                        boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)'
                      } : {}}
                    />
                  </motion.div>
                  
                  <motion.span 
                    className="font-medium text-white"
                    animate={hovered === index ? {
                      color: "#c4b5fd" // text-primary-300
                    } : {}}
                  >
                    {feature.text}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Animated CTA button */}
            <motion.div
              variants={textAnimation}
              custom={0.7}
            >
              <motion.button
                className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium py-2.5 px-6 rounded-lg overflow-hidden group"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span className="relative z-10">Join Our Team</motion.span>
                
                {/* Gradient shift on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 z-0 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Shine effect on hover */}
                <motion.div 
                  className="absolute inset-0 z-0 opacity-0 group-hover:opacity-50"
                  initial={{ x: "-100%", skew: -20 }}
                  whileHover={{ x: "100%" }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 1 }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                  }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;