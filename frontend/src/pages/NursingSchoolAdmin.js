import React from 'react';
import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion';
import { FaBook, FaClipboardList, FaBell } from 'react-icons/fa';

const NursingSchoolAdmin = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col items-center">

      <div className="bg-white w-full p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-700">Nursing School Admin Dashboard</h1>
      </div>

  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">


        <motion.div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/admin-panel/admin-course-materials">
            <div className="text-center">
              <FaBook className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Course Materials</h3>
              <p className="text-gray-500 mt-2">Manage and upload course materials for students.</p>
            </div>
          </Link>
        </motion.div>


        <motion.div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/admin-panel/marks-allocation">
            <div className="text-center">
              <FaClipboardList className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Marks Allocation</h3>
              <p className="text-gray-500 mt-2">Allocate and track student marks for exams and assignments.</p>
            </div>
          </Link>
        </motion.div>

     
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/admin-panel/special-notices">
            <div className="text-center">
              <FaBell className="text-4xl text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Special Notices</h3>
              <p className="text-gray-500 mt-2">Post important announcements and updates for staff and students.</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NursingSchoolAdmin;
