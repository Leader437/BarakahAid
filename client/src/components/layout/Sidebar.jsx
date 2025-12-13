// Sidebar Component for Dashboard Navigation
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Dashboard sidebar navigation component
 */
const Sidebar = ({ menuItems, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="flex flex-col h-full overflow-hidden bg-white border-r w-70 border-secondary-200">
      <div className="p-6">
        {/* User Info */}
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-secondary-500">
            {user?.role} Dashboard
          </h3>
          <p className="font-medium text-secondary-900">{user?.name}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-secondary-700 hover:bg-secondary-50'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-danger-100 text-danger-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
