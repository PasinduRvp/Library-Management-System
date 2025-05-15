import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import SummaryApi from "../common";

const CourseMaterialManager = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.getMaterials.url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch materials");
      }

      setMaterials(data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Error loading materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDownload = (material) => {
    if (!material.downloadUrl) {
      toast.error("File not available for download");
      return;
    }

    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = material.downloadUrl;
      link.setAttribute('download', material.originalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading ${material.originalFileName}`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Course Materials</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : materials.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No materials available</p>
      ) : (
        <div className="space-y-3">
          {materials.map((material) => (
            <div 
              key={material._id} 
              className={`p-3 border rounded flex justify-between items-center ${
                !material.downloadUrl ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{material.topic}</h3>
                <p className="text-sm text-gray-600 truncate">{material.subtopic}</p>
                <p className="text-xs text-gray-500 truncate">
                  {material.originalFileName}
                  {!material.downloadUrl && (
                    <span className="text-red-500 ml-2">
                      <FaExclamationTriangle className="inline mr-1" />
                      File missing
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={() => handleDownload(material)}
                disabled={!material.downloadUrl}
                className={`ml-4 px-3 py-1 rounded flex items-center ${
                  material.downloadUrl
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaDownload className="mr-1" /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseMaterialManager;