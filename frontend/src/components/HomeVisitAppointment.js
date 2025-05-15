import React, { useState } from "react";
import { MdEdit, MdOutlineDelete, MdDownload } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

const HomeVisitAppointment = ({ data, fetchData, onEditClick }) => {
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.deleteHomeVisitAppointment.url, {
        method: SummaryApi.deleteHomeVisitAppointment.method,
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ id: data._id })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message || "Appointment deleted successfully!");
        fetchData();
      } else {
        toast.error(result.message || "Failed to delete appointment");
      }
    } catch (error) {
      toast.error("Error deleting appointment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = () => {
    toast.info(
      <div className="p-3">
        <p className="text-gray-800 font-medium">Are you sure you want to delete this home visit appointment?</p>
        <div className="flex justify-end gap-3 mt-3">
          <motion.button
            onClick={() => {
              handleDelete();
              toast.dismiss();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Confirm
          </motion.button>
          <motion.button
            onClick={() => {
              toast.dismiss();
              toast.info("Deletion canceled");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "shadow-lg rounded-lg"
      }
    );
  };

  const downloadAppointmentPdf = () => {
    setGeneratingPdf(true);
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
      doc.text("PRABODHA", 14, 25);
      doc.setTextColor(0, 153, 76);
      const prabodhaWidth = doc.getTextWidth("PRABODHA");
      doc.text("CENTRAL HOSPITAL", 14 + prabodhaWidth + 2, 25);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Prabodha Central Hospitals (PVT) LTD", 14, 32);
      doc.text("No.49, Beach Road, Matara, Sri Lanka.", 14, 37);
      doc.text("Tel: 041 2 238 338 / 071 18 41 662", 14, 42);
      doc.text("Email: prabodhahospital@gmail.com", 14, 47);

      doc.setTextColor(0, 102, 204);
      const websiteText = "www.prabodhahealth.lk";
      const websiteX = 160;
      const websiteY = 47;
      doc.text(websiteText, websiteX, websiteY, { align: "right" });

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 102, 204);
      doc.line(14, 53, 196, 53);

      // Appointment Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("HOME VISIT APPOINTMENT RECEIPT", 65, 65);

      // Appointment Details
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Appointment Details", 14, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const details = [
        { label: "Appointment ID:", value: data._id },
        { label: "Patient Name:", value: data.patientName },
        { label: "Doctor:", value: data.doctorName },
        { label: "Date:", value: new Date(data.date).toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) },
        { label: "Contact Number:", value: data.contactNo },
        { label: "Address:", value: data.address },
        { label: "Notes:", value: data.otherNotes || "N/A" }
      ];

      let yPos = 90;
      details.forEach(item => {
        doc.text(`${item.label} ${item.value}`, 14, yPos);
        yPos += 7;
      });

      // Footer
      doc.setFontSize(10);
      doc.text("***End of Receipt***", 105, 260, { align: "center" });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

      // Save the PDF
      doc.save(`Home_Visit_${data.patientName.replace(/\s+/g, '_')}_${data._id.slice(-6)}.pdf`);
      toast.success("Home visit receipt downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate receipt. Please try again.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <motion.div 
      className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">Home Visit Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start">
            <span className="text-gray-600 font-medium w-32">Patient Name:</span>
            <span className="text-gray-800">{data.patientName}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 font-medium w-32">Doctor:</span>
            <span className="text-gray-800">{data.doctorName}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 font-medium w-32">Date:</span>
            <span className="text-gray-800">
              {new Date(data.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-600 font-medium w-32">Mobile:</span>
            <span className="text-gray-800">{data.contactNo}</span>
          </div>
          <div className="flex items-start col-span-1 md:col-span-2">
            <span className="text-gray-600 font-medium w-32">Address:</span>
            <span className="text-gray-800">{data.address}</span>
          </div>
          <div className="flex items-start col-span-1 md:col-span-2">
            <span className="text-gray-600 font-medium w-32">Notes:</span>
            <span className="text-gray-800">{data.otherNotes || "N/A"}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <motion.button
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors"
            onClick={downloadAppointmentPdf}
            disabled={generatingPdf}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdDownload className="text-lg" />
            <span>{generatingPdf ? "Generating..." : "Get Receipt"}</span>
          </motion.button>

          <motion.button 
            className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors"
            onClick={() => onEditClick(data)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdEdit className="text-lg" />
            <span>Edit</span>
          </motion.button>

          <motion.button 
            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-colors"
            onClick={showDeleteConfirmation}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdOutlineDelete className="text-lg" />
            <span>{loading ? "Deleting..." : "Delete"}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeVisitAppointment;