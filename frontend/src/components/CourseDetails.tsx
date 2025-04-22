import React, { useEffect, useState } from 'react';
import { Course } from '../types';
import { Book, Video, ArrowLeft, Clock, Calendar, AlertCircle, CheckCircle, QrCode } from 'lucide-react';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  email: string;
  name: string;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack, email, name }) => {
  const [transid, setTransid] = useState('');
  const [courseName, setCourse] = useState(course.title);
  const [amt, setAmt] = useState(course.price || 100);
  const [reg, setReg] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const sendToPending = async () => {
    if (!transid.trim()) {
      alert('Please enter a transaction ID');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, transid, courseName, amt }),
      });
  
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setReg(0);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkPending = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pending-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
    
        const data = await response.json();
        setReg(data.value);
        
        console.log('Pending check response:', data.value);
    
        if (!response.ok) {
          throw new Error(data.message || 'Pending check failed');
        }
      } catch (error) {
        console.error('Pending check error:', error);
      }
    };
    
    checkPending();
    
    // Add fade-in animation after component mounts
    setTimeout(() => setFadeIn(true), 100);
  }, [email]);

  // Generate QR code SVG
  const generateQRCode = () => {
    // In a real app, you would generate a proper QR code with API endpoint info
    // This is a simple placeholder SVG that looks like a QR code
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="#111111" />
        <g fill="#7c3aed">
          {/* Border */}
          <rect x="15" y="15" width="90" height="90" fill="none" stroke="#7c3aed" strokeWidth="2" />
          
          {/* Position markers */}
          <rect x="25" y="25" width="20" height="20" />
          <rect x="30" y="30" width="10" height="10" fill="#111111" />
          
          <rect x="75" y="25" width="20" height="20" />
          <rect x="80" y="30" width="10" height="10" fill="#111111" />
          
          <rect x="25" y="75" width="20" height="20" />
          <rect x="30" y="80" width="10" height="10" fill="#111111" />
          
          {/* Random QR code-like pattern */}
          <rect x="55" y="25" width="5" height="5" />
          <rect x="65" y="30" width="5" height="5" />
          <rect x="35" y="55" width="5" height="5" />
          <rect x="40" y="40" width="5" height="5" />
          <rect x="55" y="40" width="5" height="5" />
          <rect x="60" y="55" width="5" height="5" />
          <rect x="65" y="45" width="5" height="5" />
          <rect x="70" y="65" width="5" height="5" />
          <rect x="40" y="60" width="5" height="5" />
          <rect x="50" y="60" width="5" height="5" />
          <rect x="65" y="75" width="5" height="5" />
          <rect x="55" y="80" width="5" height="5" />
          <rect x="75" y="55" width="5" height="5" />
          <rect x="40" y="70" width="5" height="5" />
          <rect x="60" y="65" width="5" height="5" />
          <rect x="50" y="75" width="5" height="5" />
          <rect x="80" y="60" width="5" height="5" />
          <rect x="75" y="70" width="5" height="5" />
          <rect x="60" y="40" width="5" height="5" />
          <rect x="70" y="50" width="5" height="5" />
        </g>
      </svg>
    );
  };

  return (
    <div className={`card bg-dark-200/80 border border-primary-800/20 rounded-lg p-6 shadow-lg ${fadeIn ? 'content-animation' : 'opacity-0'}`}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        .content-animation {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .module-animation {
          opacity: 0;
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .module-animation-1 { animation-delay: 0.1s; }
        .module-animation-2 { animation-delay: 0.2s; }
        .module-animation-3 { animation-delay: 0.3s; }
        .module-animation-4 { animation-delay: 0.4s; }
        .module-animation-5 { animation-delay: 0.5s; }
        
        .module-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.1), 0 4px 6px -2px rgba(124, 58, 237, 0.05);
        }
        
        .pending-animation {
          animation: pulse 2s infinite;
        }
        
        .btn-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
        }
        
        .btn-hover:hover {
          transform: scale(1.03);
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
        }
        
        .btn-hover:active {
          transform: scale(0.97);
        }
        
        .header-gradient {
          position: relative;
        }
        
        .header-gradient::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          z-index: 1;
          border-radius: 0.5rem;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .qr-container {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(124, 58, 237, 0.2);
          transition: all 0.3s ease;
        }
        
        .qr-container:hover {
          border-color: rgba(124, 58, 237, 0.5);
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
        }
        
        .qr-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(124, 58, 237, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          opacity: 0;
          transition: opacity 0.3s ease, top 0.3s ease;
          white-space: nowrap;
        }
        
        .qr-container:hover .qr-tooltip {
          opacity: 1;
          top: -25px;
        }
        
        .qr-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .qr-container:hover .qr-glow {
          opacity: 1;
        }
      `}</style>

      <button
        onClick={onBack}
        className="mb-4 text-primary-400 hover:text-primary-300 font-medium flex items-center btn-hover rounded-full bg-black/60 border border-primary-800/20 px-4 py-2 transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </button>

      <div className="header-gradient rounded-lg mb-6 relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="header-content absolute bottom-0 left-0 w-full p-6">
          <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
          <div className="flex items-center text-gray-300 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>{course.duration}</span>
            <span className="mx-2">•</span>
            <Calendar className="w-4 h-4 mr-2" />
            <span>{course.modules.length} Modules</span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 mb-6 text-lg">{course.description}</p>

      <div className="mb-8 p-4 rounded-lg border border-primary-800/20 bg-dark-100/80">
        {reg === -1 ? (
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-primary-400">Course Registration</h3>
            <p className="text-gray-400">Complete your registration to access all course materials.</p>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-gray-400 mb-1 text-sm">Transaction ID</label>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={transid} 
                      onChange={(e) => setTransid(e.target.value)}
                      placeholder="Enter your transaction ID"
                      className="w-full px-4 py-2 rounded-lg bg-black/40 border border-primary-800/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="qr-container p-2 flex items-center justify-center module-animation module-animation-1">
                    <div className="qr-tooltip">Scan QR Code to Pay</div>
                    <div className="qr-glow"></div>
                    {generateQRCode()}
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-1">Scan the QR code to make payment, then enter the transaction ID above.</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">
                <p>Course Fee: ${amt}</p>
              </div>
              
              <button 
                onClick={sendToPending}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Register for Course'}
              </button>
            </div>
          </div>
        ) : reg === 0 ? (
          <div className="flex items-center text-amber-400 pending-animation">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Registration Under Review</span>
            <p className="ml-2 text-gray-400">We'll notify you once your registration is approved.</p>
          </div>
        ) : (
          <div className="flex items-center text-green-400">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Registration Approved</span>
            <p className="ml-2 text-gray-400">You have full access to all course materials.</p>
          </div>
        )}
      </div>

      <div className="border-t border-primary-800/20 pt-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">Course Modules</h3>
        {course.modules.map((module, index) => (
          <div 
            key={module.id} 
            className={`mb-6 bg-dark-100 rounded-lg p-4 border border-primary-800/20 transition-all duration-300 module-item module-animation module-animation-${index + 1}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-200">
                Day {module.day}: {module.title}
              </h4>
            </div>
            
            <div className="flex items-center text-primary-400 mb-2">
              <Video className="w-4 h-4 mr-2" />
              <a href={module.videoUrl} className="hover:text-primary-300 transition-colors duration-300">
                Watch Video Lecture
              </a>
            </div>

            <div className="mt-2">
              <div className="flex items-center text-gray-300 mb-1">
                <Book className="w-4 h-4 mr-2" />
                <span className="font-medium">Study Materials:</span>
              </div>
              <ul className="ml-6 list-disc text-gray-400">
                {module.materials.map((material, idx) => (
                  <li key={idx} className="mt-1">
                    <a href="#" className="hover:text-primary-400 transition-colors duration-300">
                      {material}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};