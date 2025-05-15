import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDelete, MdSearch, MdDownload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SummaryApi from "../common";

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [newResource, setNewResource] = useState({ 
    name: "", 
    type: "", 
    availability: "Available" 
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SummaryApi.getResources.url, {
        method: SummaryApi.getResources.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setResources(data.data);
        setFilteredResources(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching resources");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(resource =>
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
    }
  }, [searchQuery, resources]);

  const generateResourceReport = () => {
    if (filteredResources.length === 0) {
      toast.error("No resources available to generate report");
      return;
    }

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

      // Report Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("HOSPITAL RESOURCE MANAGEMENT REPORT", 70, 65);

      // Report Metadata
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      doc.text(`Report Generated: ${currentDate}`, 14, 75);
      doc.text(`Total Resources: ${filteredResources.length}`, 160, 75, { align: "right" });

      // Resource Statistics
      const resourceTypes = {};
      let availableCount = 0;
      
      filteredResources.forEach(resource => {
        resourceTypes[resource.type] = (resourceTypes[resource.type] || 0) + 1;
        if (resource.availability === "Available") availableCount++;
      });

      const unavailableCount = filteredResources.length - availableCount;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Resource Summary", 14, 85);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Available Resources: ${availableCount}`, 14, 95);
      doc.text(`Unavailable Resources: ${unavailableCount}`, 14, 100);
      
      let yPos = 110;
      doc.setFont("helvetica", "bold");
      doc.text("Resource Types Breakdown:", 14, yPos);
      yPos += 7;
      
      doc.setFont("helvetica", "normal");
      Object.entries(resourceTypes).forEach(([type, count]) => {
        doc.text(`${type}: ${count} (${Math.round((count / filteredResources.length) * 100)}%)`, 20, yPos);
        yPos += 7;
      });

      // Resource Table
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Resource List", 14, yPos);
      yPos += 10;

      const tableColumns = ["#", "Resource Name", "Type", "Status"];
      const tableRows = filteredResources.map((resource, index) => [
        index + 1,
        resource.name,
        resource.type,
        resource.availability
      ]);

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPos,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { 
          fillColor: [0, 102, 204], 
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 70 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30, halign: 'center' }
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 14 }
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(10);
      doc.text("***End of Report***", 105, finalY, { align: "center" });

      // Page number
      doc.setFontSize(9);
      doc.text(`Page 1 of 1`, 180, 280);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 280);

      // Save the PDF
      doc.save(`Hospital_Resources_Report_${currentDate.replace(/\s+/g, '_')}.pdf`);
      toast.success("Resource report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const handleAddResource = async () => {
    if (!newResource.name || !newResource.type) {
      return toast.error("Please fill in all fields!");
    }

    try {
      const response = await fetch(SummaryApi.addResource.url, {
        method: SummaryApi.addResource.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Resource added successfully!");
        fetchResources();
        setNewResource({ name: "", type: "", availability: "Available" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding resource");
    }
  };

  const handleUpdateAvailability = async (id, availability) => {
    const newAvailability = availability === "Available" ? "Not Available" : "Available";
    
    toast.info(
      <div className="p-4">
        <p className="text-gray-800 font-medium text-lg mb-3">
          Change availability to <span className="font-bold">{newAvailability}</span>?
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${SummaryApi.updateResource.url}/${id}`, {
                  method: "PATCH",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ availability: newAvailability }),
                });
                const data = await response.json();
                if (data.success) {
                  toast.success("Availability updated successfully!");
                  fetchResources();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error updating availability");
              }
              toast.dismiss();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-colors shadow-md"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("Update canceled");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg transition-colors shadow-md"
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
        className: "shadow-xl rounded-xl"
      }
    );
  };

  const handleDeleteResource = async (id) => {
    toast.info(
      <div className="p-4">
        <p className="text-gray-800 font-medium text-lg mb-3">
          Are you sure you want to delete this resource?
        </p>
        <p className="text-gray-600 text-sm mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${SummaryApi.deleteResource.url}/${id}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                const data = await response.json();
                if (data.success) {
                  toast.success("Resource deleted successfully!");
                  fetchResources();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error deleting resource");
              }
              toast.dismiss();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-colors shadow-md"
          >
            Delete
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("Deletion canceled");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg transition-colors shadow-md"
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
        className: "shadow-xl rounded-xl"
      }
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl min-h-screen">
      <div className="bg-white py-5 px-6 flex flex-col md:flex-row justify-between items-center rounded-xl shadow-lg">
        <h2 className="font-bold text-2xl text-gray-800 mb-4 md:mb-0">
          Resource Management
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="text-gray-400 text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search resources by name or type..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <motion.button
          onClick={generateResourceReport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md whitespace-nowrap"
          disabled={isLoading || filteredResources.length === 0}
        >
          <MdDownload className="text-white text-xl" />
          <span className="hidden sm:inline">Generate Report</span>
        </motion.button>
      </div>
      </div>

      <div className="mt-6 bg-white p-5 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Resource</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
            <input
              type="text"
              placeholder="e.g., Projector, Microscope"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select
              className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={newResource.type}
              onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
            >
              <option value="" disabled>Select Type</option>
              <option value="Room Component">Room Component</option>
              <option value="Machine">Machine</option>
              <option value="Instrument">Instrument</option>
              <option value="Equipment">Equipment</option>
              <option value="Furniture">Furniture</option>
              <option value="Medical Device">Medical Device</option>
              <option value="IT Equipment">IT Equipment</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <motion.button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md"
              onClick={handleAddResource}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!newResource.name || !newResource.type || isLoading}
            >
              <IoMdAdd className="text-white text-xl" /> 
              <span>Add Resource</span>
            </motion.button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Resource Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource, index) => (
                    <tr key={resource._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {resource.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resource.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-1 rounded-full text-xs font-semibold ${
                            resource.availability === "Available" 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          } transition-colors shadow-sm`}
                          onClick={() => handleUpdateAvailability(resource._id, resource.availability)}
                        >
                          {resource.availability}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          onClick={() => handleDeleteResource(resource._id)}
                          title="Delete Resource"
                        >
                          <MdOutlineDelete className="text-xl" />
                        </motion.button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No resources match your search." : "No resources available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;