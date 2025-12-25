import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Shiva's Box Cricket</h3>
                        <p className="text-xs sm:text-sm leading-relaxed">
                            Kalol's premier box cricket turf. Experience the best cricket facilities with easy online booking!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li>
                                <Link to="/" className="hover:text-primary-500 transition-colors inline-block py-1 touch-target">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-primary-500 transition-colors inline-block py-1 touch-target">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary-500 transition-colors inline-block py-1 touch-target">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li className="flex items-center space-x-2">
                                <Phone size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="break-all">info@shivashub.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                <span>Kalol, Gujarat</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Operating Hours</h3>
                        <p className="text-xs sm:text-sm">Monday - Sunday</p>
                        <p className="text-xs sm:text-sm font-semibold text-primary-500">6:00 AM - 11:00 PM</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
                    <p>&copy; {new Date().getFullYear()} Shiva's Box Cricket. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
