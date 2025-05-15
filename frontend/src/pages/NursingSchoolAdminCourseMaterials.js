import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { motion } from "framer-motion";
import SummaryApi from "../common";

const NursingSchoolAdminCourseMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ topic: "", subtopic: "", material: null });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [updatedMaterial, setUpdatedMaterial] = useState({ topic: "", subtopic: "", material: null });
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.getMaterials.url, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setMaterials(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching course materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAddMaterial = async () => {
    if (!newMaterial.topic || !newMaterial.subtopic || !newMaterial.material) {
      toast.error("Please fill all fields and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("topic", newMaterial.topic);
    formData.append("subtopic", newMaterial.subtopic);
    formData.append("material", newMaterial.material);

    try {
      const response = await fetch(SummaryApi.addMaterial.url, {
        method: SummaryApi.addMaterial.method,
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Course material added successfully!");
        fetchMaterials();
        setNewMaterial({ topic: "", subtopic: "", material: null });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error adding course material");
    }
  };

  const handleOpenUpdateModal = (material) => {
    setSelectedMaterial(material);
    setUpdatedMaterial({ 
      topic: material.topic, 
      subtopic: material.subtopic, 
      material: null 
    });
  };

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return;

    const formData = new FormData();
    formData.append("topic", updatedMaterial.topic);
    formData.append("subtopic", updatedMaterial.subtopic);
    if (updatedMaterial.material) {
      formData.append("material", updatedMaterial.material);
    }

    try {
      const response = await fetch(`${SummaryApi.updateMaterial.url}/${selectedMaterial._id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Course material updated successfully!");
        fetchMaterials();
        setSelectedMaterial(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating course material");
    }
  };

  const handleDeleteMaterial = async (id) => {
    toast.info(
      <div className="p-2">
        <p className="text-gray-800 font-medium">Are you sure you want to delete this course material?</p>
        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={async () => {
              try {
                const response = await fetch(`${SummaryApi.deleteMaterial.url}/${id}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                const data = await response.json();
                if (data.success) {
                  toast.success("Course material deleted successfully!");
                  fetchMaterials();
                } else {
                  toast.error(data.message);
                }
              } catch (error) {
                toast.error("Error deleting course material");
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

  const handleDownload = async (material) => {
    if (!material.downloadUrl) {
      toast.error("File not available for download");
      return;
    }
  
    try {
      // First verify the file exists
      const headResponse = await fetch(material.downloadUrl, { method: 'HEAD' });
      if (!headResponse.ok) {
        throw new Error('File not found on server');
      }
  
      // Create a temporary iframe for download (works better with auth)
      const iframe = document.createElement('iframe');
      iframe.src = material.downloadUrl;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Fallback for iframe issues
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = material.downloadUrl;
        link.setAttribute('download', material.originalFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(iframe);
      }, 1000);
  
      toast.success(`Downloading ${material.originalFileName}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(error.message || "Failed to download file");
      // Refresh the materials list in case of stale data
      fetchMaterials();
    }
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-4">Manage Course Materials</h2>

      {/* Add Material Form */}
      <div className="mb-6 flex gap-4 p-4 border rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Topic"
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          value={newMaterial.topic}
          onChange={(e) => setNewMaterial({ ...newMaterial, topic: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subtopic"
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          value={newMaterial.subtopic}
          onChange={(e) => setNewMaterial({ ...newMaterial, subtopic: e.target.value })}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
          className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNewMaterial({ ...newMaterial, material: e.target.files[0] })}
        />
        <motion.button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          onClick={handleAddMaterial}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoMdAdd className="text-lg" />
          Add Material
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li key={material._id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <strong>{material.topic}</strong> - {material.subtopic}
                <br />
                <button
                  onClick={() => handleDownload(material)}
                  className="text-blue-500 hover:underline"
                >
                  Download Material
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600"
                  onClick={() => handleOpenUpdateModal(material)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600"
                  onClick={() => handleDeleteMaterial(material._id)}
                >
                  <MdOutlineDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedMaterial && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="font-bold text-xl mb-4">Update Course Material</h3>
            <input
              type="text"
              className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Topic"
              value={updatedMaterial.topic}
              onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, topic: e.target.value })}
            />
            <input
              type="text"
              className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Subtopic"
              value={updatedMaterial.subtopic}
              onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, subtopic: e.target.value })}
            />
            <input
              type="file"
              className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(e) => setUpdatedMaterial({ ...updatedMaterial, material: e.target.files[0] })}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-500"
                onClick={() => setSelectedMaterial(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700"
                onClick={handleUpdateMaterial}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NursingSchoolAdminCourseMaterials;