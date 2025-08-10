import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdModeEdit, MdOutlineDelete, MdSearch, MdDownload } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";
import AddUser from "../components/AddUser";
import { motion } from "framer-motion";
import { IoMdAdd } from "react-icons/io";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaIdCard, FaUserShield, FaUser, FaMoneyBillWave } from "react-icons/fa";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });
  const [openAddUser, setOpenAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultProfilePic = (name = 'User') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN':
        return <FaUserShield className="text-purple-600 text-sm" />;
      default:
        return <FaUser className="text-amber-600 text-sm" />;
    }
  };

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });
      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
        setFilteredUsers(dataResponse.data);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(allUser);
    } else {
      const filtered = allUser.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.registrationNumber && user.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUser]);

  const generateUserReport = () => {
    if (filteredUsers.length === 0) {
      toast.error("No users available to generate report");
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
      doc.setTextColor(251, 146, 60);
      doc.text("BOOKNEST", 105, 25, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text("Digital Library Management System", 105, 32, { align: "center" });
      doc.text("Comprehensive User Management Report", 105, 37, { align: "center" });

      doc.setLineWidth(0.5);
      doc.setDrawColor(251, 146, 60);
      doc.line(14, 43, 196, 43);

      // Report Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("USER MANAGEMENT REPORT", 105, 55, { align: "center" });

      // Report Metadata
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      doc.text(`Report Generated: ${currentDate}`, 14, 65);
      doc.text(`Total Users: ${filteredUsers.length}`, 160, 65, { align: "right" });

      // User Statistics
      const userRoles = {};
      let totalFines = 0;
      filteredUsers.forEach(user => {
        userRoles[user.role] = (userRoles[user.role] || 0) + 1;
        totalFines += user.fines || 0;
      });

      let yPos = 75;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("User Statistics", 14, yPos);
      yPos += 7;
      
      doc.setFont("helvetica", "normal");
      Object.entries(userRoles).forEach(([role, count]) => {
        doc.text(`${role}: ${count} (${Math.round((count / filteredUsers.length) * 100)}%)`, 20, yPos);
        yPos += 7;
      });

      // Fines Statistics
      yPos += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Total Outstanding Fines: Rs. ${totalFines.toFixed(2)}`, 20, yPos);
      yPos += 10;

      // User Table
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("User Details", 14, yPos);
      yPos += 10;

      const tableColumns = ["#", "Name", "Email", "Reg Number", "Role", "Fines (Rs.)", "Joined Date"];
      const tableRows = filteredUsers.map((user, index) => [
        index + 1,
        user.name,
        user.email,
        user.registrationNumber || 'N/A',
        user.role,
        (user.fines || 0).toFixed(2),
        moment(user.createdAt).format("LL")
      ]);

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: yPos,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { 
          fillColor: [251, 146, 60],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 30 },
          2: { cellWidth: 40 },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 20, halign: 'center' },
          6: { cellWidth: 30, halign: 'center' }
        },
        alternateRowStyles: { fillColor: [254, 243, 199] },
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
      doc.save(`BookNest_Users_Report_${currentDate.replace(/\s+/g, '_')}.pdf`);
      toast.success("User report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate report. Please try again.");
    }
  };

  const handleDeleteUser = (userId) => {
    toast.info(
      <div className="p-4">
        <p className="text-gray-800 font-medium text-lg mb-3">
          Are you sure you want to delete this user?
        </p>
        <p className="text-gray-600 text-sm mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${SummaryApi.deleteUser.url}/${userId}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                const data = await response.json();

                if (data.success) {
                  toast.success("User deleted successfully!");
                  fetchAllUsers();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error deleting user");
              }
              toast.dismiss();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Delete
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info("Deletion canceled");
            }}
            className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-xl transition-colors shadow-md hover:shadow-lg"
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

  const getFineColor = (amount) => {
    if (amount === 0) return "text-green-600 bg-green-100";
    if (amount <= 30) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-3xl min-h-screen">
      <div className="bg-white py-5 px-6 flex flex-col md:flex-row justify-between items-center rounded-2xl shadow-lg mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="font-bold text-2xl text-gray-800">User Management</h2>
          <p className="text-gray-600 text-sm">Manage all registered users</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email or registration number..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <motion.button
              onClick={generateUserReport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              disabled={isLoading || filteredUsers.length === 0}
            >
              <MdDownload className="text-white text-xl" />
              <span className="hidden sm:inline">Generate Report</span>
            </motion.button>
            
            <motion.button
              className="bg-amber-600 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              onClick={() => setOpenAddUser(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoMdAdd className="text-white text-lg" />
              <span>Add User</span>
            </motion.button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Profile
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaIdCard className="mr-1" />
                      Reg Number
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaMoneyBillWave className="mr-1" />
                      Fines (Rs.)
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id || index} className="hover:bg-amber-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 flex-shrink-0">
                          <img 
                            src={user?.profilePic || getDefaultProfilePic(user?.name)} 
                            alt={user?.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-200"
                            onError={(e) => {
                              e.target.src = getDefaultProfilePic(user?.name);
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`${
                          user?.registrationNumber?.startsWith('BN_ADM') 
                            ? 'text-purple-600' 
                            : 'text-amber-600'
                        }`}>
                          {user?.registrationNumber || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {getRoleIcon(user?.role)}
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                            user?.role === 'ADMIN' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {user?.role}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {moment(user?.createdAt).format("LL")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getFineColor(user?.fines || 0)}`}>
                          Rs. {(user?.fines || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-100 transition-colors"
                          onClick={() => {
                            setUpdateUserDetails(user);
                            setOpenUpdateRole(true);
                          }}
                          title="Edit Role"
                        >
                          <MdModeEdit className="text-xl" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete User"
                        >
                          <MdOutlineDelete className="text-xl" />
                        </motion.button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery ? "No users match your search." : "No users available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {openAddUser && (
        <AddUser 
          onClose={() => setOpenAddUser(false)}
          fetchAllUsers={fetchAllUsers}
        />
      )}
      
      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;