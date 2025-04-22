import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CourseCard } from '../components/CourseCard';
import { CourseDetails } from '../components/CourseDetails';
import { ProfileSettings } from '../components/ProfileSettings';
import { mockCourses } from '../data/mockData';
import { LogOut, User, Settings } from 'lucide-react';
import * as THREE from 'three';

// Optimized THREE.js configuration for better performance - same as login page
const setupThreeJS = (mountElement: HTMLDivElement) => {
  // Lower particle count for mobile devices
  const isMobile = window.innerWidth < 768;
  const particlesCount = isMobile ? 1500 : 3000;
  
  // Set up scene with optimized settings
  const scene = new THREE.Scene();
  
  // Set up camera with wider angle for better visibility on small screens
  const camera = new THREE.PerspectiveCamera(
    isMobile ? 85 : 75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.z = isMobile ? 6 : 5;
  
  // Set up renderer with lower pixel ratio for mobile
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: !isMobile, 
    powerPreference: 'high-performance'
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for better performance
  
  mountElement.appendChild(renderer.domElement);
  
  // Create optimized particles
  const particlesGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (isMobile ? 12 : 15);
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Use smaller particles on mobile for better performance
  const particlesMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.05 : 0.03,
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  // Optimize lighting
  const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.5);
  scene.add(ambientLight);
  
  // Handle resize efficiently with debounce
  let resizeTimeout: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Use requestAnimationFrame for smooth animation
  let animationId: number;
  const animate = () => {
    // Slow down rotation for smoother look
    particlesMesh.rotation.x += 0.0003;
    particlesMesh.rotation.y += 0.0003;
    
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };
  
  animate();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    mountElement.removeChild(renderer.domElement);
    
    // Dispose resources
    scene.remove(particlesMesh);
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    renderer.dispose();
  };
};

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    let cleanup: () => void;
    
    if (mountRef.current) {
      cleanup = setupThreeJS(mountRef.current);
      
      // Set loaded state with a small delay to ensure smooth initial animations
      setTimeout(() => setIsLoaded(true), 100);
    }
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleProfileUpdate = (userData: Partial<User>) => {
    console.log('Updating user data:', userData);
    setShowSettings(false);
  };

  const course = selectedCourse ? mockCourses.find(c => c.id === selectedCourse) : null;

  // Add view transition state for smooth transitions between views
  const [viewTransition, setViewTransition] = useState(false);
  
  const changeView = (newCourseId: string | null) => {
    setViewTransition(true);
    setTimeout(() => {
      setSelectedCourse(newCourseId);
      setViewTransition(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInTitle {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .title-animation {
          opacity: 0;
          animation: fadeInTitle 0.6s ease-out forwards;
        }
        
        .subtitle-animation {
          opacity: 0;
          animation: fadeInTitle 0.6s ease-out 0.2s forwards;
        }
        
        .buttons-animation {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.4s forwards;
        }
        
        .content-animation {
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.6s forwards;
        }
        
        .view-exit {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .view-enter {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        /* Button hover effects with pure CSS */
        .btn-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
        }
        
        .btn-hover:hover {
          transform: scale(1.03);
        }
        
        .btn-hover:active {
          transform: scale(0.97);
        }
        
        .btn-primary:hover {
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
        }
        
        .btn-secondary:hover {
          border-color: rgb(124, 58, 237);
          color: rgb(167, 139, 250);
        }
        
        /* Course card animations */
        .card-animation {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .card-animation-1 { animation: fadeIn 0.5s ease-out 0.1s forwards; }
        .card-animation-2 { animation: fadeIn 0.5s ease-out 0.2s forwards; }
        .card-animation-3 { animation: fadeIn 0.5s ease-out 0.3s forwards; }
        .card-animation-4 { animation: fadeIn 0.5s ease-out 0.4s forwards; }
        .card-animation-5 { animation: fadeIn 0.5s ease-out 0.5s forwards; }
        .card-animation-6 { animation: fadeIn 0.5s ease-out 0.6s forwards; }
        
        .nav-animation {
          opacity: 0;
          animation: fadeInTitle 0.6s ease-out forwards;
        }
      `}</style>
      
      {/* 3D Background container with optimized rendering */}
      <div ref={mountRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />

      <nav className={`bg-dark-200/80 border-b border-primary-800/20 relative z-10 ${isLoaded ? 'nav-animation' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-400">Sankalp Training</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className="btn-secondary btn-hover rounded-lg px-4 py-2 flex items-center bg-black/80 border-2 border-gray-700 text-gray-300"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
              <div className="flex items-center text-gray-400">
                <User className="w-5 h-5 mr-2" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="btn-secondary btn-hover rounded-lg px-4 py-2 flex items-center bg-black/80 border-2 border-gray-700 text-gray-300"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          <div className={`${viewTransition ? 'view-exit' : isLoaded ? 'view-enter' : 'opacity-0'}`}>
            {showSettings ? (
              <div className="content-animation">
                <ProfileSettings
                  user={user!}
                  onSave={handleProfileUpdate}
                  onClose={() => setShowSettings(false)}
                />
              </div>
            ) : course ? (
              <div className="content-animation">
                <CourseDetails
                  course={course}
                  onBack={() => changeView(null)}
                  email={user?.email}
                  name={user?.name}
                />
              </div>
            ) : (
              <div>
                <h2 className={`text-3xl font-bold text-primary-400 mb-8 ${isLoaded ? 'title-animation' : 'opacity-0'}`}>
                  Available Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCourses.map((course, index) => (
                    <div key={course.id} className={`card-animation card-animation-${index + 1}`}>
                      <CourseCard
                        course={course}
                        onClick={() => changeView(course.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};