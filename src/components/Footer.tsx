import {
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  Github,
  Linkedin,
  MapPin,
  Twitter
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Find Rooms', href: '/dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Book Rooms', href: '/book-room', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Manage Bookings', href: '/user-manage-bookings', icon: <ClipboardList className="w-4 h-4" /> },
    { name: 'Room Schedules', href: '/room-schedules', icon: <Clock className="w-4 h-4" /> },
    { name: 'DB Testing', href: '/db-testing', icon: <MapPin className="w-4 h-4" /> }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">StudySpace</h3>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Helping university students find the perfect study space. Real-time room availability,
              smart scheduling, and seamless booking for academic success.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Github className="w-4 h-4 text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>


        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© {currentYear} StudySpace.</span>

            </div>



            {/* Version Info */}
            <div className="text-sm text-gray-500">
              Version 1.1.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
