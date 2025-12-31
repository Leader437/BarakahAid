// Admin Navbar Component
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '../components/ui';
import { selectAdmin } from '../store/adminSlice';
import logoMain from '../assets/logo-main.png';

/**
 * Admin Navbar with title, search bar, and admin profile avatar
 */
const AdminNavbar = ({ onMenuToggle, isSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const admin = useSelector(selectAdmin);

  // Fallback if admin isn't loaded yet
  const displayAdmin = admin || { name: 'Admin User', email: 'admin@barakahaid.com' };



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-secondary-200 shadow-sm">
      {/* Subtle accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500"></div>
      
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Menu Toggle & Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="p-2 transition-colors rounded-lg text-secondary-600 hover:bg-secondary-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center overflow-hidden rounded-xl shadow-sm w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600">
              <img src={logoMain} alt="BarakahAid Logo" className="object-contain w-8 h-8" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-secondary-900 font-heading">BarakahAid</h1>
              <p className="-mt-1 text-xs text-secondary-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 hidden max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users, donations, campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm transition-colors border rounded-lg bg-secondary-50 border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search */}
          <button className="p-2 transition-colors rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 md:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <button className="relative p-2 transition-colors rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

            {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8">
                <Avatar
                    src={displayAdmin.avatar || displayAdmin.profileImage}
                    name={displayAdmin.name}
                    size="sm"
                    shape="circle"
                />
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium text-secondary-900">{displayAdmin.name}</p>
                <p className="text-xs text-secondary-500">Administrator</p>
              </div>
              <svg className="hidden w-4 h-4 text-secondary-400 lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 z-20 w-56 mt-2 bg-white border rounded-lg border-secondary-200 shadow-dropdown animate-fade-in">
                  <div className="p-3 border-b border-secondary-200">
                    <p className="font-medium text-secondary-900">{displayAdmin.name}</p>
                    <p className="text-sm text-secondary-700">{displayAdmin.email}</p>
                  </div>
                  <div className="py-1">
                    <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm transition-colors text-secondary-700 hover:bg-secondary-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </a>
                  </div>
                  <div className="border-t border-secondary-200">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm transition-colors text-danger-600 hover:bg-danger-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
