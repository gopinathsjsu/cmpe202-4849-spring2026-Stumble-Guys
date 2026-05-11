import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const categories = [
  { label: 'Music', path: '/events?category=music' },
  { label: 'Technology', path: '/events?category=technology' },
  { label: 'Business', path: '/events?category=business' },
  { label: 'Sports', path: '/events?category=sports' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold text-white">EventHub</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Discover and create amazing events. Connect with people who share
              your passions, learn new skills, and build community.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>support@eventhub.com</li>
              <li>1-800-EVENTHUB</li>
              <li>123 Event Street, San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
