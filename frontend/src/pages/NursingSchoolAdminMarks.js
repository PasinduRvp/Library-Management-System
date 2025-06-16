import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MdOutlineDelete, MdSearch, MdDownload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { motion } from "framer-motion";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SummaryApi from "../common";

const MarkAllocationAdmin = () => {
  const [marks, setMarks] = useState([]);
  const [filteredMarks, setFilteredMarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMark, setNewMark] = useState({ 
    testName: "", 
    studentNumber: "", 
    studentName: "", 
    marks: "",
    year: "Y1",
    semester: "S1"
  });
  const [selectedMark, setSelectedMark] = useState(null); 
  const [isUpdateOpen, setIsUpdateOpen] = useState(false); 
  const [allStudents, setAllStudents] = useState([]);

  const yearOptions = ["Y1", "Y2", "Y3"];
  const semesterOptions = ["S1", "S2"];

  const fetchAllStudents = async () => {
    try {
      const response = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        const students = data.data.filter(user => user.role === 'STUDENT');
        setAllStudents(students);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching students data");
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await fetch(SummaryApi.getMarks.url, {
        method: SummaryApi.getMarks.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setMarks(data.data);
        setFilteredMarks(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching marks");
    }
  };

  useEffect(() => {
    fetchMarks();
    fetchAllStudents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMarks(marks);
    } else {
      const filtered = marks.filter(mark =>
        mark.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMarks(filtered);
    }
  }, [searchTerm, marks]);

  const isDuplicateMark = (studentNumber) => {
    return marks.some(mark => mark.studentNumber === studentNumber);
  };

  const handleStudentNumberChange = (e) => {
    const studentNumber = e.target.value;
    setNewMark({ ...newMark, studentNumber });
    
    const foundStudent = allStudents.find(student => student.indexNumber === studentNumber);
    if (foundStudent) {
      setNewMark(prev => ({
        ...prev,
        studentName: foundStudent.name,
        year: foundStudent.year || "Y1",
        semester: foundStudent.semester || "S1"
      }));
    } else {
      setNewMark(prev => ({
        ...prev,
        studentName: "",
        year: "Y1",
        semester: "S1"
      }));
    }
  };

  const handleUpdateStudentNumberChange = (e) => {
    const studentNumber = e.target.value;
    setSelectedMark({ ...selectedMark, studentNumber });
    
    const foundStudent = allStudents.find(student => student.indexNumber === studentNumber);
    if (foundStudent) {
      setSelectedMark(prev => ({
        ...prev,
        studentName: foundStudent.name,
        year: foundStudent.year || "Y1",
        semester: foundStudent.semester || "S1"
      }));
    } else {
      setSelectedMark(prev => ({
        ...prev,
        studentName: "",
        year: "Y1",
        semester: "S1"
      }));
    }
  };

  const handleAddMark = async () => {
    if (!newMark.testName || !newMark.studentNumber || !newMark.studentName || !newMark.marks) {
      return toast.error("Please fill in all fields!");
    }

    if (isDuplicateMark(newMark.studentNumber)) {
      return toast.error("This student already has marks allocated!");
    }

    try {
      const response = await fetch(SummaryApi.addMark.url, {
        method: SummaryApi.addMark.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMark),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Mark allocated successfully!");
        fetchMarks();
        setNewMark({ 
          testName: "", 
          studentNumber: "", 
          studentName: "", 
          marks: "",
          year: "Y1",
          semester: "S1"
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding mark");
    }
  };

  const handleUpdateMark = async () => {
    if (!selectedMark.testName || !selectedMark.studentNumber || !selectedMark.studentName || !selectedMark.marks) {
      return toast.error("Please fill in all fields!");
    }

    const isDuplicate = marks.some(mark => 
      mark.studentNumber === selectedMark.studentNumber &&
      mark._id !== selectedMark._id
    );

    if (isDuplicate) {
      return toast.error("This student already has marks allocated!");
    }

    try {
      const response = await fetch(`${SummaryApi.updateMark.url}/${selectedMark._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMark),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Mark updated successfully!");
        fetchMarks();
        setIsUpdateOpen(false); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating mark");
    }
  };

  const handleDeleteMark = async (id) => {
    toast.info(
      <div className="p-2">
        <p className="text-gray-800 font-medium">Are you sure you want to delete this mark?</p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${SummaryApi.deleteMark.url}/${id}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                const data = await response.json();
                if (data.success) {
                  toast.success("Mark deleted successfully!");
                  fetchMarks();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error deleting mark");
              }
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

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Marks Report');
      
      worksheet.columns = [
        { header: 'No.', key: 'no', width: 5 },
        { header: 'Test Name', key: 'testName', width: 25 },
        { header: 'Student Number', key: 'studentNumber', width: 15 },
        { header: 'Student Name', key: 'studentName', width: 25 },
        { header: 'Year', key: 'year', width: 5 },
        { header: 'Semester', key: 'semester', width: 8 },
        { header: 'Marks', key: 'marks', width: 8 }
      ];
      
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      
      filteredMarks.forEach((mark, index) => {
        worksheet.addRow({
          no: index + 1,
          testName: mark.testName,
          studentNumber: mark.studentNumber,
          studentName: mark.studentName,
          year: mark.year,
          semester: mark.semester,
          marks: mark.marks
        });
      });
      
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const date = new Date().toISOString().split('T')[0];
      saveAs(blob, `Marks_Report_${date}.xlsx`);
      
    } catch (error) {
      toast.error("Failed to generate report: " + error.message);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="bg-white py-4 px-6 flex justify-between items-center rounded-lg shadow-md">
        <h2 className="font-bold text-xl text-gray-700">Manage Marks</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by student number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-all shadow-md"
            onClick={handleDownloadExcel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdDownload className="text-white text-lg" /> Download Report
          </motion.button>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Test Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newMark.testName}
            onChange={(e) => setNewMark({ ...newMark, testName: e.target.value })}
            placeholder="Test Name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Student Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newMark.studentNumber}
            onChange={handleStudentNumberChange}
            placeholder="Student Number"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newMark.studentName}
            onChange={(e) => setNewMark({ ...newMark, studentName: e.target.value })}
            placeholder="Student Name"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Marks</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={newMark.marks}
            onChange={(e) => setNewMark({ ...newMark, marks: e.target.value })}
            placeholder="Marks"
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select
            className="w-full p-2 border rounded"
            value={newMark.year}
            onChange={(e) => setNewMark({ ...newMark, year: e.target.value })}
            readOnly
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <select
            className="w-full p-2 border rounded"
            value={newMark.semester}
            onChange={(e) => setNewMark({ ...newMark, semester: e.target.value })}
            readOnly
          >
            {semesterOptions.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <motion.button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
            onClick={handleAddMark}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoMdAdd className="text-white text-lg" /> Add Mark
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4 bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-gray-700">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-6">Sr.</th>
              <th className="py-3 px-6">Test Name</th>
              <th className="py-3 px-6">Student Number</th>
              <th className="py-3 px-6">Student Name</th>
              <th className="py-3 px-6">Year</th>
              <th className="py-3 px-6">Semester</th>
              <th className="py-3 px-6">Marks</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarks.map((mark, index) => (
              <tr key={mark._id || index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6 text-center">{index + 1}</td>
                <td className="py-3 px-6 text-center">{mark.testName}</td>
                <td className="py-3 px-6 text-center">{mark.studentNumber}</td>
                <td className="py-3 px-6 text-center">{mark.studentName}</td>
                <td className="py-3 px-6 text-center">{mark.year}</td>
                <td className="py-3 px-6 text-center">{mark.semester}</td>
                <td className="py-3 px-6 text-center">{mark.marks}</td>
                <td className="py-3 px-6 text-center flex justify-center gap-3">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
                    onClick={() => {
                      setSelectedMark(mark);
                      setIsUpdateOpen(true); 
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-all shadow-md"
                    onClick={() => handleDeleteMark(mark._id)}
                  >
                    <MdOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isUpdateOpen && selectedMark && (
        <div className="fixed inset-0 bg-slate-200 bg-opacity-60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Update Mark</h2>
              <button 
                onClick={() => setIsUpdateOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Test Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value={selectedMark.testName}
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Student Number</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value={selectedMark.studentNumber}
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value={selectedMark.studentName}
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value={selectedMark.year}
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                  value={selectedMark.semester}
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Marks</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-yellow-50 focus:bg-white focus:ring-2 focus:ring-yellow-200"
                  value={selectedMark.marks}
                  onChange={(e) => setSelectedMark({ ...selectedMark, marks: e.target.value })}
                  min="0"
                  max="100"
                  autoFocus
                />
              </div>

              <button
                className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all"
                onClick={handleUpdateMark}
              >
                Update Mark
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAllocationAdmin;