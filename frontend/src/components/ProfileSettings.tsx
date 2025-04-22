import React, { useState } from 'react';
import { User } from '../types';
import { Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileSettingsProps {
  user: User;
  onSave: (userData: Partial<User>) => void;
  onClose: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold text-primary-400"
        >
          Profile Settings
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            className="input w-full rounded-lg"
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="input w-full rounded-lg"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="input w-full rounded-lg"
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn-primary py-2 px-4 rounded-lg flex items-center shadow-lg shadow-primary-500/30"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};