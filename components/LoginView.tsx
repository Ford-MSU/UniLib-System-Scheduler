
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation would happen here
    if (username && password) {
      onLogin();
    } else {
        // Allow login for demo even if empty, or just focus
        onLogin(); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
               <div className="bg-[#D32F2F] text-white px-2 py-1 font-serif italic font-bold text-xl rounded-sm border-2 border-yellow-500 shadow-sm">
                  <span className="text-yellow-400 text-lg mr-1">my</span>
                  <span className="text-2xl tracking-widest">IIT</span>
               </div>
            </div>
          </div>
          
          <h2 className="text-2xl text-gray-500 font-light text-center mb-8">Sign in to continue</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto w-full">
            <div className="relative group">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="peer w-full border-b-2 border-gray-300 py-2 px-1 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 transition-colors bg-white"
                id="username"
                placeholder="Enter your username"
                style={{ color: '#1a1a1a', backgroundColor: '#ffffff' }} 
              />
              <label 
                htmlFor="username" 
                className={`absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
              >
                Enter your username
              </label>
              <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 opacity-0 peer-focus:opacity-100 transition-opacity"></div>
            </div>

            <div className="relative group">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full border border-gray-300 rounded p-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow bg-white"
                id="password"
                placeholder="Enter your password"
                style={{ color: '#1a1a1a', backgroundColor: '#ffffff' }}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <a href="#" className="text-blue-600 text-sm hover:underline">Forgot password?</a>
              <button 
                type="submit"
                className="bg-[#1a73e8] text-white px-8 py-2 rounded font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign in
              </button>
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                <a href="#" className="text-blue-600 text-sm hover:underline">Sign up</a>
                <a href="#" className="text-blue-600 text-sm hover:underline">Help</a>
            </div>
          </form>
        </div>

        {/* Right Side: Image/Video Placeholder */}
        <div className="w-full md:w-1/2 bg-gray-100 relative overflow-hidden hidden md:block group">
            <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Student studying in library" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </div>
      </div>
      
      <div className="fixed bottom-4 text-center w-full text-gray-500 text-xs">
         Copyright © 2010 onwards, MSU-Iligan Institute of Technology. 9200 Iligan City, Philippines.
      </div>
    </div>
  );
};

export default LoginView;
