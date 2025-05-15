import React from "react";
import { motion } from "framer-motion";
import { FaUserNurse, FaBook, FaPhoneAlt, FaGraduationCap, FaStethoscope } from "react-icons/fa";
import { Link } from "react-router-dom";

const NursingSchoolPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaGraduationCap className="text-5xl mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl font-bold mb-4">Prabodha Nursing School</h1>
            <p className="text-xl mb-8">
              Excellence in nursing education with hands-on clinical experience
            </p>
            <motion.button
              className="px-6 py-3 bg-white text-blue-900 font-medium rounded-lg shadow hover:bg-blue-100 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Programs
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Why Choose Us */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaStethoscope className="mr-3 text-blue-600" />
                Why Our Program Stands Out
              </h2>
              <p className="text-gray-600 mb-6">
                Our nursing program combines rigorous academics with real-world clinical experience in our affiliated hospital, preparing students for successful careers in healthcare.
              </p>
              <ul className="space-y-3">
                {[
                  "100% NCLEX pass rate (past 3 years)",
                  "Direct clinical experience from day one",
                  "90% graduate employment rate",
                  "Modern simulation labs",
                  "Personalized faculty mentorship"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-blue-100 rounded-xl p-8 h-full">
                <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Nursing students"
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Links */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">Student Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/student-marks">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
                whileHover={{ y: -3 }}
              >
                <div className="text-blue-600 mb-4">
                  <FaUserNurse className="text-3xl" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Student Marks</h4>
                <p className="text-gray-600 text-sm">
                  Track your academic progress and performance
                </p>
              </motion.div>
            </Link>

            <Link to="/course-materials">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
                whileHover={{ y: -3 }}
              >
                <div className="text-blue-600 mb-4">
                  <FaBook className="text-3xl" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Course Materials</h4>
                <p className="text-gray-600 text-sm">
                  Access your learning resources and curriculum
                </p>
              </motion.div>
            </Link>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
              whileHover={{ y: -3 }}
            >
              <div className="text-blue-600 mb-4">
                <FaPhoneAlt className="text-3xl" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Support Services</h4>
              <p className="text-gray-600 text-sm mb-4">
                Get academic and career guidance
              </p>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Contact Us →
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div 
          className="text-center bg-blue-50 rounded-xl p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Nursing Journey</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our next cohort of aspiring nurses and begin your path to making a difference in healthcare.
          </p>
          <motion.button 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Apply Now
          </motion.button>
          <p className="text-gray-500 mt-4 text-sm">
            Next intake: June 2024
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NursingSchoolPage;