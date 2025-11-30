
import React from 'react';
import { User } from '../types';

interface PortalViewProps {
  user: User;
  onSelectApp: (appName: string) => void;
  onLogout: () => void;
}

const PortalView: React.FC<PortalViewProps> = ({ user, onSelectApp, onLogout }) => {
  const apps = [
    { id: 'gmsuiit', name: 'G.MSUIIT', icon: 'G' },
    { id: 'mail', name: 'Mail', icon: '✉️' },
    { id: 'cor', name: 'COR', icon: '🏵️' },
    { id: 'schedule', name: 'Schedule', icon: '📅' },
    { id: 'grades', name: 'Grades', icon: '🔢' },
    { id: 'inc', name: 'INC Grade', icon: '📝' },
    { id: 'clearance', name: 'Clearance', icon: '✅' },
    { id: 'offerings', name: 'Offerings', icon: '📋' },
    { id: 'elearning', name: 'eLearning', icon: '💻' },
    { id: 'elibrary', name: 'eLibrary', icon: '📚' },
    { id: 'mole', name: 'MOLÉ', icon: '💡' },
    { id: 'iitdocs', name: 'IIT Docs', icon: '📄' },
    { id: 'mica', name: 'MICA', icon: '🏥', badge: 'New' },
    { id: 'gradapp', name: 'Grad App', icon: '🎓', badge: 'New' },
    { id: 'libsched', name: 'LibSched', icon: '⏱️', active: true }, // The app we are building
  ];

  return (
    <div className="min-h-screen bg-[#2c1e36] flex flex-col font-sans relative overflow-hidden">
      {/* Background Image Effect */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)'
        }}
      ></div>

      {/* Header */}
      <header className="bg-[#B71C1C] text-white z-10 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <button className="hover:bg-red-800 p-2 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium tracking-wide">
             <button className="hover:text-red-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
             <button className="hover:text-red-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
             </button>
             <span>G.MSUIIT</span>
             <span>MOLÉ</span>
             <span>VGMO</span>
             <button onClick={onLogout} className="bg-red-900 px-3 py-1 rounded text-xs hover:bg-red-950 transition-colors">Logout</button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-grow z-10 p-6 flex flex-col md:flex-row gap-6 overflow-y-auto pb-40">
        
        {/* Left Column: Resources Lists */}
        <div className="w-full md:w-1/3 space-y-4">
            <div className="bg-white/95 backdrop-blur rounded shadow-lg overflow-hidden">
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors text-blue-600 font-medium">JSTOR</div>
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors text-blue-600 font-medium">McGraw-Hill's Access Engineering</div>
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors text-blue-600 font-medium flex justify-between items-center">
                    ProQuest Central
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">New</span>
                </div>
                <div className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors text-blue-600 font-medium flex justify-between items-center">
                    CELPh (Wiley Online Library)
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">New</span>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors text-blue-600 font-medium flex justify-between items-center">
                    MSU-IIT Online Journals
                    <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">New</span>
                </div>
            </div>
        </div>

        {/* Middle Column: Announcements */}
        <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white/95 backdrop-blur rounded p-6 shadow-lg">
                <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">• <span>Inviting you to Cats on the Run 2025, the official Legacy Run of MSU-IIT <span className="bg-red-600 text-white text-[10px] px-1 rounded ml-1">New</span></span></li>
                    <li className="flex items-start gap-2">• <span>Free Gemini Pro for Students <span className="bg-red-600 text-white text-[10px] px-1 rounded ml-1">New</span></span></li>
                    <li className="flex items-start gap-2">• <span>IMPORTANT: New storage limit will be implemented on your G.MSUIIT account</span></li>
                    <li className="flex items-start gap-2">• <span>Announcement from Registrar's Office</span></li>
                    <li className="flex items-start gap-2">• <span>Philippine Identification System (PhilSys) Registration</span></li>
                </ul>
            </div>

            <div className="bg-white/95 backdrop-blur rounded p-6 shadow-lg border-l-4 border-red-500">
                <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Cybersecurity Advisories
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                     <li>• How AI was used in an advanced phishing campaign targeting Gmail users - and how to avoid it <span className="bg-red-600 text-white text-[10px] px-1 rounded">New</span></li>
                </ul>
            </div>
        </div>

        {/* Right Column: Surveys/Links */}
        <div className="w-full md:w-1/3 space-y-4">
             <div className="bg-white/95 backdrop-blur rounded p-6 shadow-lg">
                <ul className="space-y-3 text-sm text-blue-700">
                    <li>• Digital Citizenship Survey (2025) <span className="bg-red-600 text-white text-[10px] px-1 rounded">New</span></li>
                    <li>• Course Survey for Students (Second Sem 2024-2025)</li>
                    <li>• MSU-IIT Undergraduate Student Workload Survey</li>
                    <li>• Survey on Week 12 Asynchronous Implementation at MSU-IIT</li>
                    <li>• Energy and Greenhouse Gas Audit-Survey</li>
                    <li>• Performance Evaluation Survey of our External Services Providers</li>
                    <li>• Student Satisfaction Survey on SAS Programs</li>
                </ul>
             </div>
        </div>
      </main>

      {/* Bottom Dock Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 overflow-x-auto">
          <div className="flex justify-center min-w-max px-4">
             <div className="bg-black/60 backdrop-blur-md rounded-2xl p-2 flex items-end gap-2 border border-white/10">
                {apps.map(app => (
                    <button 
                        key={app.id}
                        onClick={() => app.id === 'libsched' && onSelectApp(app.id)}
                        className={`group flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 ${app.active ? 'bg-white/5 ring-1 ring-white/20' : ''}`}
                    >
                        <div className="relative">
                            <div className={`w-12 h-12 flex items-center justify-center text-2xl bg-stone-900 rounded-xl shadow-inner border border-stone-700 group-hover:shadow-lg ${app.active ? 'border-red-500 shadow-red-900/20' : ''}`}>
                                {app.icon}
                            </div>
                            {app.badge && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10 border border-black">
                                    {app.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] text-gray-300 font-medium group-hover:text-white">{app.name}</span>
                    </button>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export default PortalView;
