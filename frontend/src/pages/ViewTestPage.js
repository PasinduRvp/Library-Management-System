import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SummaryApi from "../common/index";

const ViewTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${SummaryApi.getTestById.url}/${id}`, {
          method: SummaryApi.getTestById.method,
        });
        const result = await response.json();
        if (response.ok) {
          setTest(result.data);
        } else {
          toast.error(result.message || "Failed to fetch test details.");
        }
      } catch (error) {
        toast.error("Error fetching test details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const formatAge = (ageYears, ageMonths) => {
    if (ageYears === 0) {
      return `${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
    }
    return `${ageYears} year${ageYears !== 1 ? 's' : ''} ${ageMonths} month${ageMonths !== 1 ? 's' : ''}`;
  };

  const downloadPDF = () => {
    if (!test) {
      toast.error("No test data available to generate PDF");
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

      // Patient Information Section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`${test.name || "N/A"}`, 14, 63);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Age: ${formatAge(test.ageYears, test.ageMonths)}`, 14, 70);
      doc.text(`Gender: ${test.gender || "N/A"}`, 14, 77);
      doc.text(`Address: ${test.address || "N/A"}`, 14, 84);
      doc.text(`Mobile: ${test.mobile || "N/A"}`, 14, 91);

      const testDate = new Date(test.testDate);
      const formattedDate = testDate.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + ` ${testDate.getDate()} ${testDate.toLocaleString("en-US", { month: "short" })}, ${testDate.getFullYear()}`;
      
      doc.text(`Test Date: ${formattedDate}`, 100, 63);
      doc.text(`Reported on: ${formattedDate}`, 100, 70);

      // Test Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("LABORATORY TEST REPORT", 84, 103);

      // Test Results Section
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Test Results:", 14, 110);
      
      // Parse testData if it's a string
      let testDataArray = [];
      try {
        testDataArray = typeof test.testData === 'string' 
          ? JSON.parse(test.testData) 
          : test.testData || [];
      } catch (e) {
        console.error("Error parsing test data:", e);
        testDataArray = [];
      }

      if (Array.isArray(testDataArray) && testDataArray.length > 0) {
        const tableColumn = ["Parameter", "Result", "Reference Value", "Unit"];
        const tableRows = testDataArray.map(data => [
          data.parameter || "N/A",
          data.result || "N/A",
          data.referenceValue || "N/A",
          data.unit || "N/A",
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 115,
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
          bodyStyles: { textColor: [0, 0, 0] },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 30, halign: "center" },
            2: { cellWidth: 50, halign: "center" },
            3: { cellWidth: 30, halign: "center" },
          },
        });
      } else {
        doc.text(typeof test.testData === 'string' ? test.testData : "No structured data available", 14, 120);
      }

      // Footer Section
      const finalY = Array.isArray(testDataArray) && testDataArray.length > 0 
        ? doc.lastAutoTable.finalY + 20 
        : 130;
      
      doc.setFontSize(10);
      doc.text("***End of Report***", 105, finalY, { align: "center" });

      doc.setFontSize(10);
      doc.text("Medical Lab Technician", 14, finalY + 20);
      doc.text("(DMLT, BMLT)", 14, finalY + 25);
      doc.text("Dr. Menaka Ambepitiya", 80, finalY + 20);
      doc.text("(MD, Pathologist)", 80, finalY + 25);
      doc.text("Dr. Menaka Ambepitiya", 140, finalY + 20);
      doc.text("(MD, Pathologist)", 140, finalY + 25);

      // Footer bottom
      doc.setFontSize(9);
      const generatedDate = new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      doc.text(`Generated on: ${generatedDate}`, 14, 280);
      doc.text("Page 1 of 1", 180, 280);
      doc.text("Sample Collection 0123456789", 105, 280, { align: "center" });

      // Save the PDF
      doc.save(`Lab_Test_Report_${test.name.replace(/\s+/g, '_')}.pdf`);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Not Found</h2>
          <p className="text-gray-600 mb-6">The requested test details could not be loaded.</p>
          <button
            onClick={() => navigate("/pharmacy-lab-panel/all-tests")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Back to All Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Laboratory Test Report</h1>
          <p className="text-center text-blue-100 mt-1">Detailed Patient Test Information</p>
        </div>

        {/* Patient Info Card */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Patient Information</h3>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-800">{test.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Age:</span>
                <span className="text-gray-800">{formatAge(test.ageYears, test.ageMonths)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Gender:</span>
                <span className="text-gray-800">{test.gender || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Mobile:</span>
                <span className="text-gray-800">{test.mobile || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Test Information</h3>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Test Date:</span>
                <span className="text-gray-800">
                  {test.testDate ? new Date(test.testDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Address:</span>
                <span className="text-gray-800">{test.address || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Data Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Results</h3>
          
          {test.testData ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {typeof test.testData === 'string' ? test.testData : JSON.stringify(test.testData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No test results available
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF Report
          </button>
                    

          <button
            onClick={() => navigate("/pharmacy-lab-panel/all-tests")}
            className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Tests
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTestPage;