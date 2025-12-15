// Navbar Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiChevronDown, HiMenu, HiX } from 'react-icons/hi';
import logo from "../../assets/logo-main.png";
import Avatar from '../ui/Avatar';
import PrimaryButton from '../ui/PrimaryButton';
import { logout } from '../../store/userSlice';

/**
 * Main navigation bar component
 */
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donor':
        return '/donor/dashboard';
      case 'recipient':
        return '/recipient/dashboard';
      case 'volunteer':
        return '/volunteer/dashboard';
      case 'ngo':
        return '/ngo/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-secondary-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12">
              <img src={logo} alt="BarakahAid Logo" />
            </div>
            <span className="text-2xl font-bold font-logo text-primary-600">
              BarakahAid
            </span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="items-center hidden gap-8 md:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to="/browse-requests"
                  className="font-medium transition-colors text-secondary-700 hover:text-primary-600"
                >
                  Browse Requests
                </Link>
                <Link
                  to="/campaigns"
                  className="font-medium transition-colors text-secondary-700 hover:text-primary-600"
                >
                  Campaigns
                </Link>
                {user?.role === 'volunteer' && (
                  <Link
                    to="/volunteer/browse-events"
                    className="font-medium transition-colors text-secondary-700 hover:text-primary-600"
                  >
                    Events
                  </Link>
                )}
              </>
            ) : (
              <>
                <a href="/how-it-works" className="font-medium transition-colors text-secondary-700 hover:text-primary-600">
                  How it works
                </a>
                <a href="/campaigns" className="font-medium transition-colors text-secondary-700 hover:text-primary-600">
                  Campaigns
                </a>
                <a href="/contact" className="font-medium transition-colors text-secondary-700 hover:text-primary-600">
                  Contact Us
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 transition-colors rounded-lg hover:bg-secondary-50"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  <span className="text-sm font-medium text-secondary-900">
                    {user?.name}
                  </span>
                  <HiChevronDown className="w-4 h-4 text-secondary-600" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 z-20 w-48 py-1 mt-2 bg-white border rounded-lg shadow-lg border-secondary-200">
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-secondary-700 hover:text-primary-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-secondary-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-danger-600 hover:bg-danger-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hidden font-medium transition-colors text-secondary-700 hover:text-primary-600 md:block">
                  Sign in
                </Link>
                <Link to="/register">
                  <PrimaryButton>
                    Get started
                  </PrimaryButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 md:hidden text-secondary-600 hover:text-secondary-900"
          >
            {showMobileMenu ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="py-4 border-t md:hidden border-secondary-200">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block py-2 font-medium text-secondary-700 hover:text-primary-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/browse-requests"
                  className="block py-2 font-medium text-secondary-700 hover:text-primary-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Browse Requests
                </Link>
                <Link
                  to="/campaigns"
                  className="block py-2 font-medium text-secondary-700 hover:text-primary-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Campaigns
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 font-medium text-secondary-700 hover:text-primary-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full py-2 font-medium text-left text-danger-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/#projects" className="block py-2 font-medium text-secondary-700 hover:text-primary-600">
                  Project
                </a>
                <a href="/#how-it-works" className="block py-2 font-medium text-secondary-700 hover:text-primary-600">
                  How it works
                </a>
                <a href="/#impact" className="block py-2 font-medium text-secondary-700 hover:text-primary-600">
                  Impact
                </a>
                <a href="/#faq" className="block py-2 font-medium text-secondary-700 hover:text-primary-600">
                  FAQs
                </a>
                <Link
                  to="/login"
                  className="block py-2 font-medium text-secondary-700 hover:text-primary-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block py-2 font-medium text-primary-600 hover:text-primary-700"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
