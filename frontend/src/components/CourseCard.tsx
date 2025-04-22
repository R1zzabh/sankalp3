import React from 'react';
import { Course } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  showCurriculum?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, showCurriculum = false }) => {
  return (
    <div className="card bg-dark-200/80 border border-primary-800/20 rounded-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-primary-500/20">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-2">{course.title}</h3>
        <p className="text-gray-400 mb-4">{course.description}</p>
        <div className="flex items-center text-gray-500 mb-4">
          <Clock className="w-4 h-4 mr-2" />
          <span>{course.duration}</span>
        </div>

        {showCurriculum && (
          <div className="mt-4 border-t border-primary-800/20 pt-4">
            <h4 className="font-semibold text-primary-300 mb-2">Curriculum Overview</h4>
            <div className="curriculum-items">
              {course.curriculum.map((item, index) => (
                <div key={index} className={`mb-3 curriculum-item-${index + 1}`}>
                  <div className="flex items-center text-gray-300 font-medium">
                    <ChevronRight className="w-4 h-4 mr-1 text-primary-500" />
                    {item.title} ({item.duration})
                  </div>
                  <ul className="ml-6 mt-1 text-sm text-gray-400">
                    {item.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="list-disc ml-4 topic-item">{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {onClick && (
          <button
            onClick={onClick}
            className="mt-4 w-full bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded btn-hover btn-primary transition-all duration-300"
          >
            View Course Details
          </button>
        )}
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        .curriculum-items {
          position: relative;
        }
        
        .curriculum-item-1 { animation: slideIn 0.4s ease-out 0.1s forwards; }
        .curriculum-item-2 { animation: slideIn 0.4s ease-out 0.2s forwards; }
        .curriculum-item-3 { animation: slideIn 0.4s ease-out 0.3s forwards; }
        .curriculum-item-4 { animation: slideIn 0.4s ease-out 0.4s forwards; }
        .curriculum-item-5 { animation: slideIn 0.4s ease-out 0.5s forwards; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .topic-item {
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
          animation-delay: calc(0.1s * var(--topic-index));
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .card {
          position: relative;
          overflow: hidden;
        }
        
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.6), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        
        .card:hover::before {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
};