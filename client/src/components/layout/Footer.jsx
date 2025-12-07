// Footer Component
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import logoWhite from '../../assets/logo-white.png';

/**
 * Footer component for the application
*/
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto text-white bg-primary-800">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-12 h-12">
                <img src={logoWhite} alt="BarakahAid Logo" />
              </div>
              <span className="text-2xl font-bold text-white font-logo">
                BarakahAid
              </span>
            </div>
            <p className="max-w-md mb-4 text-primary-100">
              A global donation management platform connecting donors with those in need.
              Together, we make a difference.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-primary-700 hover:bg-white hover:text-primary-600"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-primary-700 hover:bg-white hover:text-primary-600"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-primary-700 hover:bg-white hover:text-primary-600"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="transition-colors text-primary-100 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="transition-colors text-primary-100 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/browse-requests" className="transition-colors text-primary-100 hover:text-white">
                  Browse Requests
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="transition-colors text-primary-100 hover:text-white">
                  Campaigns
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="transition-colors text-primary-100 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition-colors text-primary-100 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors text-primary-100 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors text-primary-100 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-8 border-t border-primary-700 md:flex-row">
          <p className="text-sm text-primary-200">
            © {currentYear} BarakahAid. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="transition-colors text-primary-100 hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors text-primary-100 hover:text-white">
              Terms
            </Link>
            <Link to="/cookies" className="transition-colors text-primary-100 hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
