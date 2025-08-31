import React from 'react';
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaBook } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import webbg from "../assest/libBack.jpeg";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${webbg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/90 to-amber-800/90" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-amber-400 inline-block">
                Contact Us
              </h3>
              <ul className="space-y-4 text-amber-100">
                <li className="flex items-start">
                  <FaPhoneAlt className="text-amber-300 mt-1 mr-3 flex-shrink-0" />
                  <span>+94 112 345 678</span>
                </li>
                <li className="flex items-start">
                  <FaEnvelope className="text-amber-300 mt-1 mr-3 flex-shrink-0" />
                  <span>info@booknestlibrary.com</span>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-amber-300 mt-1 mr-3 flex-shrink-0" />
                  <span>123 Library Street, Colombo, Sri Lanka</span>
                </li>
                <li className="flex items-start">
                  <FaClock className="text-amber-300 mt-1 mr-3 flex-shrink-0" />
                  <span>Mon-Sat: 8:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-amber-400 inline-block">
                Quick Links
              </h3>
              <ul className="space-y-3 text-amber-100">
                {['Home', 'Book Catalog', 'My Account', 'Borrowing History', 'Events', 'Contact'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link to="#" className="hover:text-white transition-colors duration-200">
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Library Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-amber-400 inline-block">
                Our Services
              </h3>
              <ul className="space-y-3 text-amber-100">
                {['Book Borrowing', 'E-Books', 'Research Help', 'Study Rooms', 'Printing Services', 'Book Clubs'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link to="#" className="hover:text-white transition-colors duration-200">
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-amber-400 inline-block">
                Stay Updated
              </h3>
              <p className="text-amber-100 mb-4">
                Subscribe to our newsletter for new arrivals and events
              </p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-2 rounded-lg bg-amber-900/50 border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-amber-300"
                />
                <motion.button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Social Media & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-amber-700">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {[
                { icon: FaFacebook, color: 'text-amber-400', url: 'https://www.facebook.com' },
                { icon: FaTwitter, color: 'text-amber-300', url: 'https://www.twitter.com' },
                { icon: FaInstagram, color: 'text-amber-200', url: 'https://www.instagram.com' },
                { icon: FaLinkedin, color: 'text-amber-300', url: 'https://www.linkedin.com' }
              ].map(({ icon: Icon, color, url }, index) => (
                <motion.a 
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${color} hover:text-white text-2xl transition-colors duration-200`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-amber-300 text-sm">
                &copy; {new Date().getFullYear()} BookNest Library. All Rights Reserved.
              </p>
              <div className="flex justify-center md:justify-end space-x-4 mt-2 text-xs">
                <Link to="/privacy" className="text-amber-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-amber-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link to="/accessibility" className="text-amber-300 hover:text-white transition-colors duration-200">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;