import React from "react";
import { FaUserMd, FaCalendarCheck, FaHospitalSymbol, FaAmbulance, FaClinicMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import webBg from "../assest/webbg.jpg";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center text-center overflow-hidden relative ">
     
      <motion.div 
        className="w-full h-screen relative flex flex-col justify-center items-center p-6 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${webBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white max-w-4xl z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to PRABODHA Hospital</h1>
          <p className="text-lg md:text-xl mb-8">
            Comprehensive healthcare services with expert medical professionals dedicated to your well-being.
          </p>
          <Link to="/all-channelings">
            <motion.button 
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book an Appointment
            </motion.button>
          </Link>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>

      
      <div className="w-full py-16 bg-gray-50 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-blue-600 text-5xl mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};


const services = [
  {
    icon: <FaUserMd />,
    title: "Expert Doctors",
    description: "Highly skilled specialists in multiple medical fields with years of experience."
  },
  {
    icon: <FaCalendarCheck />,
    title: "Easy Appointments",
    description: "Book your doctor consultations online with just a few clicks."
  },
  {
    icon: <FaHospitalSymbol />,
    title: "Advanced Facilities",
    description: "State-of-the-art medical infrastructure and cutting-edge technology."
  },
  {
    icon: <FaAmbulance />,
    title: "Emergency Care",
    description: "24/7 emergency services with rapid response teams."
  },
  {
    icon: <FaClinicMedical />,
    title: "Preventive Care",
    description: "Comprehensive health check-ups and preventive medicine programs."
  },
  {
    icon: <FaHospitalSymbol />,
    title: "Specialized Treatments",
    description: "Advanced treatments for complex medical conditions."
  }
];

export default Homepage;