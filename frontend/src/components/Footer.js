import React from 'react';
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import webbg from "../assest/webbg.jpg";
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
   
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${webbg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 to-blue-800/90" />
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
           
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-blue-400 inline-block">
                Contact Us
              </h3>
              <ul className="space-y-4 text-blue-100">
                <li className="flex items-start">
                  <FaPhoneAlt className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                  <span>+94 412 238 338</span>
                </li>
                <li className="flex items-start">
                  <FaEnvelope className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                  <span>prabodhahospitals@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                  <span>No49, Beach Road, Matara, Sri Lanka</span>
                </li>
                <li className="flex items-start">
                  <FaClock className="text-blue-300 mt-1 mr-3 flex-shrink-0" />
                  <span>24 x 7 Hours Service</span>
                </li>
              </ul>
            </motion.div>

          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-blue-400 inline-block">
                Quick Links
              </h3>
              <ul className="space-y-3 text-blue-100">
                {['Home', 'About Us', 'Courses', 'Admissions', 'Facilities', 'Contact'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a href="#" className="hover:text-white transition-colors duration-200">
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

           
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-blue-400 inline-block">
                Our Programs
              </h3>
              <ul className="space-y-3 text-blue-100">
                {['Diploma in Nursing', 'BSc Nursing', 'Post Basic Nursing', 'Specialty Courses', 'Continuing Education'].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a href="#" className="hover:text-white transition-colors duration-200">
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

      
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b-2 border-blue-400 inline-block">
                Stay Updated
              </h3>
              <p className="text-blue-100 mb-4">
                Subscribe to our newsletter for the latest updates
              </p>
              <form className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-2 rounded-lg bg-blue-900/50 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-blue-300"
                />
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

   
          <motion.div 
            className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-8 mb-12 text-center shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Your Nursing Journey?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our admissions counselors are here to guide you through every step of the application process
            </p>
            <Link to="/all-onlineConsultations">
              <motion.button
                className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 shadow-lg transition-all flex items-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhoneAlt className="inline-block mr-2" /> Schedule a Consultation
              </motion.button>
            </Link>
          </motion.div>

       
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-blue-700">
        
          
              <div className="flex space-x-6 mb-4 md:mb-0" href = "https://www.facebook.com/share/18z8RvJGFm/?mibextid=wwXIfr">
                {[
                  { icon: FaFacebook, color: 'text-blue-400'},
                  { icon: FaTwitter, color: 'text-sky-400' },
                  { icon: FaInstagram, color: 'text-pink-400' },
                  { icon: FaLinkedin, color: 'text-blue-300' }
                ].map(({ icon: Icon, color }, index) => (
                  <motion.a 
                    key={index}
                    href="#"
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
              <p className="text-blue-300 text-sm">
                &copy; {new Date().getFullYear()} Prabodha Hospital Nursing School. All Rights Reserved.
              </p>
              <div className="flex justify-center md:justify-end space-x-4 mt-2 text-xs">
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors duration-200">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;