import React, { useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdDownload } from 'react-icons/md';
import AddChannelingAppointment from '../components/AddChannelingAppointment';
import ChannelingAppointment from '../components/ChannelingAppointment';
import UserEditChannelingAppointment from '../components/UserEditChannelingAppointment';
import SummaryApi from '../common';
import ROLE from '../common/role';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import moment from 'moment';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const AllChannelingAppointments = () => {
  const [openAddChanneling, setOpenAddChanneling] = useState(false);
  const [allChannelingAppointments, setAllChannelingAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const user = useSelector((state) => state?.user?.user);

  const fetchAllChannelingAppointments = async () => {
    try {
      const response = await fetch(SummaryApi.allChannelingAppointments.url, {
        credentials: 'include'
      });
      const dataResponse = await response.json();
      if (dataResponse.success) {
        setAllChannelingAppointments(dataResponse?.data || []);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    fetchAllChannelingAppointments();
  }, []);

  const filteredAppointments = (() => {
    if (!user?.role) return [];
    if (user.role === ROLE.ADMIN) return allChannelingAppointments;
    if (user.role === ROLE.DOCTOR) {
      return allChannelingAppointments.filter((a) => a.doctorName === user.name);
    }
    return allChannelingAppointments.filter((a) => a.email === user.email);
  })();

  const groupedAppointments = filteredAppointments.reduce((acc, appointment) => {
    const dateKey = moment(appointment.date).format('YYYY-MM-DD');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(appointment);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => new Date(a) - new Date(b));

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleEditClose = () => {
    setEditingAppointment(null);
    fetchAllChannelingAppointments();
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const downloadDailyAppointmentsPdf = (date, appointments) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Header Section
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 102, 204);
      doc.text("PRABODHA", 14, 20);
      doc.setTextColor(0, 153, 76);
      const prabodhaWidth = doc.getTextWidth("PRABODHA");
      doc.text("CENTRAL HOSPITAL", 14 + prabodhaWidth + 2, 20);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Prabodha Central Hospitals (PVT) LTD", 14, 27);
      doc.text("No.49, Beach Road, Matara, Sri Lanka.", 14, 32);
      doc.text("Tel: 041 2 238 338 / 071 18 41 662", 14, 37);
      doc.text("Email: prabodhahospital@gmail.com", 14, 42);

      doc.setTextColor(0, 102, 204);
      const websiteText = "www.prabodhahealth.lk";
      const websiteX = 160;
      const websiteY = 42;
      doc.text(websiteText, websiteX, websiteY, { align: "right" });

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 102, 204);
      doc.line(14, 48, 196, 48);

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("DAILY APPOINTMENTS LIST", 70, 60);

      // Doctor and Date
      doc.setFontSize(12);
      doc.text(`Doctor: ${user.name}`, 14, 70);
      doc.text(`Date: ${moment(date).format('dddd, MMMM D, YYYY')}`, 14, 77);
      doc.text(`Total Appointments: ${appointments.length}`, 14, 84);

      // Table data
      const tableData = appointments.map(app => [
        app.patientName,
        app.contactNo,
        moment(app.timeSlot).format('hh:mm A'),
        app.otherNotes || "N/A"
      ]);

      // Table headers
      const headers = [
        { header: 'Patient Name', dataKey: 'patientName' },
        { header: 'Contact No', dataKey: 'contactNo' },
        { header: 'Time Slot', dataKey: 'timeSlot' },
        { header: 'Notes', dataKey: 'notes' }
      ];

      // Create table
      autoTable(doc, {
        startY: 90,
        head: [['Patient Name', 'Contact No', 'Time Slot', 'Notes']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { top: 90 }
      });

      // Footer
      doc.setFontSize(10);
      doc.text("***End of Report***", 105, doc.lastAutoTable.finalY + 15, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

      // Save the PDF
      doc.save(`Appointments_${user.name.replace(/\s+/g, '_')}_${moment(date).format('YYYY-MM-DD')}.pdf`);
      toast.success("Daily appointments downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Channeling Appointments</h2>
        {user?.role !== ROLE.DOCTOR && (
          <motion.button
            className="flex items-center gap-2 bg-blue-600 text-white py-3 px-5 rounded-lg shadow-md hover:bg-blue-800 transition-all"
            onClick={() => setOpenAddChanneling(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoMdAdd className="text-xl" />
            New Appointment
          </motion.button>
        )}
      </div>

      <div className="space-y-8">
        {sortedDates.length > 0 ? (
          sortedDates.map((date, i) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-100 p-5 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {moment(date).format('dddd, MMMM D, YYYY')}
                </h3>
                {user?.role === ROLE.DOCTOR && (
                  <motion.button
                    className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-800 transition-all"
                    onClick={() => downloadDailyAppointmentsPdf(date, groupedAppointments[date])}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MdDownload className="text-lg" />
                    Download List
                  </motion.button>
                )}
              </div>
              <div className="flex flex-col gap-4">
                {groupedAppointments[date].map((appointment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                  >
                    <ChannelingAppointment
                      data={appointment}
                      fetchData={fetchAllChannelingAppointments}
                      onEditClick={handleEditClick}
                      showSuccessToast={showSuccessToast}
                      currentUser={user}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No appointments found</p>
            {user?.role === ROLE.GENERAL && (
              <button
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg mx-auto"
                onClick={() => setOpenAddChanneling(true)}
              >
                <IoMdAdd />
                Create Your First Appointment
              </button>
            )}
          </div>
        )}
      </div>

      {openAddChanneling && (
        <AddChannelingAppointment 
          onClose={() => {
            setOpenAddChanneling(false);
            fetchAllChannelingAppointments();
          }} 
          fetchData={fetchAllChannelingAppointments}
          showSuccessToast={showSuccessToast}
        />
      )}

      {editingAppointment && (
        <UserEditChannelingAppointment 
          channelingAppointmentData={editingAppointment}
          onClose={handleEditClose}
          fetchData={fetchAllChannelingAppointments}
        />
      )}
    </div>
  );
};

export default AllChannelingAppointments;