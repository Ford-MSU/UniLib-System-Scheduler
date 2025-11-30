
import React from 'react';
import { User, UserRole } from '../types';
import { UserIcon } from './icons/UserIcons';

interface HeaderProps {
  user: User;
  onRoleChange: (role: UserRole) => void;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onRoleChange, onBack }) => {
  return (
    <header className="bg-red-900 text-white shadow-lg border-b-4 border-yellow-600">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
              <button 
                onClick={onBack}
                className="bg-red-800 p-2 rounded-full hover:bg-red-700 transition-colors"
                title="Back to Portal"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                 </svg>
              </button>
          )}
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              University Library Resources
            </h1>
            <p className="text-red-100 text-sm font-light tracking-wide">Scheduling System</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
                <p className="font-semibold text-lg">{user.name}</p>
                <p className="text-xs text-red-200 uppercase tracking-wider">{user.department || user.role}</p>
            </div>
            <div className="flex items-center bg-red-800 rounded-full p-1 border border-red-700">
               <div className="bg-white rounded-full p-2">
                 <UserIcon className="h-6 w-6 text-red-900" />
               </div>
            </div>
            
            {/* Simulation Controls - kept subtle */}
            <div className="hidden lg:flex flex-col text-[10px] text-red-300 gap-1 ml-4 border-l border-red-700 pl-4">
                <span>Simulate Role:</span>
                <div className="flex gap-2">
                   <button onClick={() => onRoleChange(UserRole.STUDENT)} className={`hover:text-white ${user.role === UserRole.STUDENT ? 'font-bold text-white underline' : ''}`}>Student</button>
                   <button onClick={() => onRoleChange(UserRole.STAFF)} className={`hover:text-white ${user.role === UserRole.STAFF ? 'font-bold text-white underline' : ''}`}>Staff</button>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
