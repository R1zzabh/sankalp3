import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, Users, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockCourses } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [pendingRequests] = useState(12); // Mock data
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin-check', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fetch failed');
      }

      const data = await response.json();
      setData(data.data);
      console.log('Admin check response:', data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const approveUser = async (email) => {
    try {
      // Update UI immediately
      setData(prevData => 
        prevData.map(item => 
          item.Email === email ? { ...item, status: 1 } : item
        )
      );
      
      // Send request to server
      const response = await fetch('http://localhost:5000/api/admin-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 1, email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Approval failed');
        
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
  };
  
  const courseStats = mockCourses.map(course => ({
    id: course.id,
    title: course.title,
    enrolledStudents: Math.floor(Math.random() * 50) + 10,
    pendingRequests: Math.floor(Math.random() * 8)
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <nav className="bg-dark-200 border-b border-primary-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-2xl font-bold text-primary-400"
              >
                Sankalp Training Admin
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center text-gray-400"
              >
                <Settings className="w-5 h-5 mr-2" />
                <span>{user?.name}</span>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="btn-secondary rounded-lg px-4 py-2 flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="card p-6 flex items-center"
          >
            <div className="rounded-full bg-primary-500/20 p-3 mr-4">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Students</h3>
              <p className="text-2xl font-bold text-primary-400">156</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="card p-6 flex items-center"
          >
            <div className="rounded-full bg-primary-500/20 p-3 mr-4">
              <BookOpen className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Active Courses</h3>
              <p className="text-2xl font-bold text-primary-400">{mockCourses.length}</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="card p-6 flex items-center"
          >
            <div className="rounded-full bg-primary-500/20 p-3 mr-4">
              <CheckCircle className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Pending Requests</h3>
              <p className="text-2xl font-bold text-primary-400">{pendingRequests}</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-primary-400 mb-6">Course Statistics</h2>
          <div className="space-y-4">
            {courseStats.map((course) => (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="bg-dark-100 rounded-lg p-4 border border-primary-800/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-200">{course.title}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-4 py-2 rounded-lg text-sm"
                  >
                    View Details
                  </motion.button>
                </div>
                <div className="mt-2 flex space-x-4">
                  <div className="text-gray-400">
                    <span className="font-medium text-primary-400">{course.enrolledStudents}</span> enrolled
                  </div>
                  <div className="text-gray-400">
                    <span className="font-medium text-primary-400">{course.pendingRequests}</span> pending
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {data && data.length > 0 ? (
          <div className="card p-6 mt-6">
            <h2 className="text-xl font-bold text-primary-400 mb-6">Approval Requests</h2>
            <div className="space-y-4">
              {data.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-dark-100 rounded-lg p-4 border border-primary-800/20 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">{item.Name}</h3>
                    <p className="text-gray-400">Transaction ID: {item.TransactionId}</p>
                  </div>
                  {console.log(item.status)}
                  <div>
                    {item.status === 1 ? (
                      <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
                        Approved
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => approveUser(item.Email)}
                        className="btn-primary px-4 py-2 rounded-lg"
                      >
                        Approve
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card p-6 mt-6 text-center text-gray-400">
            No approval requests available
          </div>
        )}
      </main>
    </div>
  );
};