// Admin Footer Component
import React from 'react';

/**
 * Minimal admin footer with version info
 */
const AdminFooter = () => {
    const currentYear = new Date().getFullYear();
    const version = '1.0.0';

    return (
        <footer className="bg-white border-t border-secondary-200 py-4 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
                {/* Left: Copyright */}
                <p className="text-secondary-500">
                    © {currentYear} <span className="font-medium text-secondary-700">BarakahAid</span>. All rights reserved.
                </p>

                {/* Right: Version & Links */}
                <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded text-xs font-mono">
                        v{version}
                    </span>
                    <a
                        href="#"
                        className="text-secondary-500 hover:text-primary-600 transition-colors"
                    >
                        Documentation
                    </a>
                    <a
                        href="#"
                        className="text-secondary-500 hover:text-primary-600 transition-colors"
                    >
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;
