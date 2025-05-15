import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/index';

const EditItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState({ itemName: '', itemCount: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${SummaryApi.getItemById.url}/${id}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Failed to fetch item", error);
      }
    };
    fetchItem();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(SummaryApi.updateItem.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...item, _id: id}),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Item updated successfully');
        setTimeout(() => navigate('/pharmacy-lab-panel/all-items'), 1000);
      } else {
        toast.error('Failed to update item');
      }
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Edit Laboratory Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Item Name:</label>
          <input
            type="text"
            value={item.itemName}
            readOnly
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-2">Item Count:</label>
          <input
            type="number"
            value={item.itemCount}
            onChange={(e) => setItem({ ...item, itemCount: e.target.value })}
            min="0"
            required
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        > 
          Update Item
        </button>
      </form> 
    </div>
  );
};

export default EditItemPage;