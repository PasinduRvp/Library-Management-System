// src/components/MedicalRecordForm.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const MedicalRecordForm = ({ record, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'consultation',
    title: '',
    description: '',
    medications: [],
    notes: '',
    followUpDate: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type,
        title: record.title,
        description: record.description,
        medications: record.medications || [],
        notes: record.notes || '',
        followUpDate: record.followUpDate ? new Date(record.followUpDate).toISOString().split('T')[0] : ''
      });
    }
  }, [record]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = [...formData.medications];
    updatedMeds[index][field] = value;
    setFormData(prev => ({
      ...prev,
      medications: updatedMeds
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const removeMedication = (index) => {
    const updatedMeds = formData.medications.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      medications: updatedMeds
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      followUpDate: formData.followUpDate || undefined
    };
    onSubmit(dataToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {record ? 'Edit Medical Record' : 'Add New Medical Record'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="consultation">Consultation</option>
                <option value="diagnosis">Diagnosis</option>
                <option value="treatment">Treatment</option>
                <option value="lab_result">Lab Result</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Medications</h3>
              <button
                type="button"
                onClick={addMedication}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <FaPlus className="mr-1" /> Add Medication
              </button>
            </div>
            
            {formData.medications.length === 0 ? (
              <div className="text-center py-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-gray-500">No medications added</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.medications.map((med, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Medication name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. Twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Duration</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          placeholder="e.g. 7 days"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center"
                    >
                      <FaMinus className="mr-1" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {record ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordForm;