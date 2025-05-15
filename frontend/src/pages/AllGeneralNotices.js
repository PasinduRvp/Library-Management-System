import React, { useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { motion } from "framer-motion";
import AddGeneralNotice from '../components/AddGeneralNotice';
import SummaryApi from '../common';
import GeneralNotice from '../components/GeneralNotice';
import ROLE from '../common/role';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AllGeneralNotices = () => {
  const user = useSelector(state => state?.user?.user);
  const [openAddGeneralNotice, setOpenAddGeneralNotice] = useState(false);
  const [allNotices, setAllNotices] = useState([]);

  const fetchAllNotices = async() => {
    try {
      const response = await fetch(SummaryApi.allNotices.url);
      const dataResponse = await response.json();

      if (dataResponse.success) {
        setAllNotices(dataResponse?.data || []);
      } else {
        toast.error(dataResponse.message || "Failed to fetch notices");
      }
    } catch (error) {
      toast.error("Error fetching notices");
      console.error("Error fetching notices:", error);
    }
  };

  const showDeleteConfirmation = (deleteFunction) => {
    toast.info(
      <div className="p-2">
        <p className="text-gray-800 font-medium">Are you sure you want to delete this notice?</p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={() => {
              deleteFunction();
              toast.dismiss();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("Deletion canceled");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "shadow-lg"
      }
    );
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className='bg-white py-4 px-6 flex justify-between items-center rounded-lg shadow-md'>
        <h2 className='font-bold text-xl text-gray-700'>General Notices</h2>

        {(user?.role === ROLE.ADMIN || user?.role === ROLE.DOCTOR) && (
          <motion.button 
            className='bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md'
            onClick={() => setOpenAddGeneralNotice(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoMdAdd className='text-white' />
            Add New Notice
          </motion.button>
        )}
      </div>

      <div className='mt-4 space-y-4'>
        {allNotices.length > 0 ? (
          allNotices.map((notice, index) => (
            <GeneralNotice 
              data={notice} 
              key={notice._id || index} 
              fetchdata={fetchAllNotices}
              showDeleteConfirmation={showDeleteConfirmation}
            />
          ))
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No notices found</p>
          </div>
        )}
      </div>

      {openAddGeneralNotice && (
        <AddGeneralNotice 
          onClose={() => {
            setOpenAddGeneralNotice(false);
            toast.success("Notice created successfully!", {
              position: "top-center",
              autoClose: 3000,
            });
            fetchAllNotices();
          }}
        />
      )}
    </div>
  );
};

export default AllGeneralNotices;