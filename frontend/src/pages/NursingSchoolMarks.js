import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SummaryApi from "../common";
import { useSelector } from "react-redux";
import { FaSpinner, FaExclamationTriangle, FaChartLine, FaInfoCircle, FaSearch, FaUserGraduate, FaDownload } from "react-icons/fa";
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import ROLE from "../common/role";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const MarkAllocation = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchIndex, setSearchIndex] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [sortedGroups, setSortedGroups] = useState({});
  const [generatingPdf, setGeneratingPdf] = useState({});
  const user = useSelector((state) => state?.user?.user);

  const fetchAllMarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SummaryApi.getMarks.url, {
        method: SummaryApi.getMarks.method,
        credentials: "include",
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch marks");
      }

      if (data.success) {
        setMarks(data.data || []);
        groupMarksByTest(data.data || []);
      } else {
        setMarks([]);
        setSortedGroups({});
        throw new Error(data.message || "No marks found");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentMarks = async (indexNumber = null) => {
    setLoading(true);
    setError(null);
    try {
      const targetIndex = indexNumber || user?.indexNumber;
      if (!targetIndex) {
        throw new Error("No student selected");
      }

      const response = await fetch(
        SummaryApi.getMarksByStudent.url(targetIndex),
        {
          method: SummaryApi.getMarksByStudent.method,
          credentials: "include",
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch marks");
      }

      if (data.success) {
        const filteredMarks = data.data.filter(mark => 
          mark.year === user?.year && 
          mark.semester === user?.semester
        );
        setMarks(filteredMarks || []);
        groupMarksByTest(filteredMarks || []);
        if (data.studentInfo) {
          setStudentInfo(data.studentInfo);
        }
      } else {
        setMarks([]);
        setSortedGroups({});
        throw new Error(data.message || "No marks found");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const groupMarksByTest = (marksData) => {
    const groups = {};
    marksData.forEach(mark => {
      if (!groups[mark.testName]) {
        groups[mark.testName] = [];
      }
      groups[mark.testName].push(mark);
    });
    setSortedGroups(groups);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchIndex.trim()) {
      toast.error("Please enter an index number");
      return;
    }
    fetchStudentMarks(searchIndex.trim());
  };

  const handleDeleteMark = async (markId) => {
    if (!window.confirm("Are you sure you want to delete this mark record?")) {
      return;
    }

    try {
      const response = await fetch(SummaryApi.deleteMark.url, {
        method: SummaryApi.deleteMark.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: markId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete mark");
      }

      if (data.success) {
        toast.success("Mark record deleted successfully");
        user.role === ROLE.ADMIN ? fetchAllMarks() : fetchStudentMarks();
      }
    } catch (error) {
      toast.error(error.message || "Error deleting mark record");
    }
  };

  useEffect(() => {
    if (user?.role === ROLE.ADMIN) {
      fetchAllMarks();
    } else if (user?.role === ROLE.STUDENT) {
      fetchStudentMarks();
    }
  }, [user]);

  const calculateGrade = (score) => {
    if (score >= 75) return { grade: "A", color: "bg-green-100 text-green-800" };
    if (score >= 65) return { grade: "B", color: "bg-blue-100 text-blue-800" };
    if (score >= 50) return { grade: "C", color: "bg-yellow-100 text-yellow-800" };
    return { grade: "D", color: "bg-red-100 text-red-800" };
  };

  const calculateGPA = (marksList) => {
    if (!marksList || marksList.length === 0) return 0;
    const total = marksList.reduce((sum, mark) => {
      const grade = calculateGrade(mark.marks).grade;
      if (grade === "A") return sum + 4;
      if (grade === "B") return sum + 3;
      if (grade === "C") return sum + 2;
      return sum + 1;
    }, 0);
    return (total / marksList.length).toFixed(2);
  };

  const downloadTestPdf = async (testName, testMarks) => {
    setGeneratingPdf(prev => ({ ...prev, [testName]: true }));
    
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
      doc.text(`${testName.toUpperCase()} RESULTS`, 70, 60);

      // Student Info (if available)
      if (studentInfo || user.role === ROLE.STUDENT) {
        doc.setFontSize(12);
        doc.text(`Student: ${studentInfo?.name || user?.name || "N/A"}`, 14, 70);
        doc.text(`Index Number: ${studentInfo?.indexNumber || user?.indexNumber || "N/A"}`, 14, 77);
        doc.text(`Year/Semester: ${studentInfo?.year || user?.year || "N/A"} - ${studentInfo?.semester || user?.semester || "N/A"}`, 14, 84);
      }

      // Table data
      const tableData = testMarks.map(mark => [
        user.role === ROLE.ADMIN ? mark.studentNumber : mark.testName,
        mark.year,
        mark.semester,
        `${mark.marks}%`,
        calculateGrade(mark.marks).grade
      ]);

      // Create table
      autoTable(doc, {
        startY: 90,
        head: [
          [
            user.role === ROLE.ADMIN ? 'Student ID' : 'Test Name',
            'Year',
            'Semester',
            'Score',
            'Grade'
          ]
        ],
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
      doc.save(`${testName.replace(/\s+/g, '_')}_Results_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success(`${testName} results downloaded successfully!`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(`Failed to generate ${testName} results. Please try again.`);
    } finally {
      setGeneratingPdf(prev => ({ ...prev, [testName]: false }));
    }
  };

  if (![ROLE.STUDENT, ROLE.ADMIN].includes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md">
          <FaExclamationTriangle className="mx-auto text-4xl text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This page is only accessible to students and administrators.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {user.role === ROLE.ADMIN ? "All Student Results" : "My Academic Results"}
              </h1>
              <p className="text-gray-600">
                {user.role === ROLE.ADMIN 
                  ? "View and manage all student results" 
                  : `View your results for ${user?.year || ''} - ${user?.semester || ''}`}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2 flex">
              {user.role === ROLE.ADMIN && (
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Search by index number"
                    value={searchIndex}
                    onChange={(e) => setSearchIndex(e.target.value)}
                    className="border px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FaSearch className="mr-2" />
                    Search
                  </button>
                </form>
              )}
              <button
                onClick={() => user.role === ROLE.ADMIN ? fetchAllMarks() : fetchStudentMarks()}
                disabled={loading}
                className={`flex items-center px-4 py-2 rounded-lg shadow-sm ${
                  loading
                    ? "bg-gray-300 text-gray-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh Results"
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Student Info (shown when searching or for students) */}
        {(studentInfo || user.role === ROLE.STUDENT) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <p className="text-sm text-gray-500 font-medium">Student ID</p>
              <p className="text-lg font-semibold">
                {studentInfo?.indexNumber || user?.indexNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Name</p>
              <p className="text-lg font-semibold">
                {studentInfo?.name || user?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Year/Semester</p>
              <p className="text-lg font-semibold">
                {studentInfo?.year || user?.year || "N/A"} - {studentInfo?.semester || user?.semester || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Current GPA</p>
              <p className="text-lg font-semibold">{calculateGPA(marks)}</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <FaSpinner className="mx-auto animate-spin text-4xl text-blue-500 mb-4" />
              <p className="text-gray-600">
                {user.role === ROLE.ADMIN ? "Loading all results..." : "Loading your results..."}
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <FaExclamationTriangle className="mx-auto text-4xl text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Unable to load results
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => user.role === ROLE.ADMIN ? fetchAllMarks() : fetchStudentMarks()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : Object.keys(sortedGroups).length > 0 ? (
            Object.entries(sortedGroups).map(([testName, testMarks]) => (
              <div key={testName} className="mb-8 border-b last:border-b-0">
                <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {testName}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                      Average: {calculateGPA(testMarks)}
                    </span>
                    <button
                      onClick={() => downloadTestPdf(testName, testMarks)}
                      disabled={generatingPdf[testName]}
                      className={`flex items-center px-3 py-1 rounded-lg ${
                        generatingPdf[testName]
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-600 text-white hover:bg-green-700"
                      } transition-colors`}
                    >
                      <FaDownload className="mr-2" />
                      {generatingPdf[testName] ? "Generating..." : "Download"}
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        {user.role === ROLE.ADMIN && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student ID
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        {user.role === ROLE.ADMIN && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testMarks.map((mark, index) => {
                        const { grade, color } = calculateGrade(mark.marks);
                        return (
                          <tr key={mark._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {index + 1}
                            </td>
                            {user.role === ROLE.ADMIN && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {mark.studentNumber}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mark.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mark.semester}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mark.marks}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
                              >
                                {grade}
                              </span>
                            </td>
                            {user.role === ROLE.ADMIN && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => {/* Implement edit functionality */}}
                                >
                                  <MdEdit />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteMark(mark._id)}
                                >
                                  <MdOutlineDelete />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <FaUserGraduate className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {user.role === ROLE.ADMIN ? "No results found" : "No results available"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {user.role === ROLE.ADMIN 
                  ? "No student marks records found" 
                  : `You don't have any recorded marks for ${user?.year || ''} - ${user?.semester || ''}`}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MarkAllocation;