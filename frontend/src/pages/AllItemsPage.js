import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common/index';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const AllItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchData = await fetch(SummaryApi.getAllItems.url, {
          method: SummaryApi.getAllItems.method,
          credentials: 'include',
        });

        if (!fetchData.ok) {
          throw new Error(`HTTP error! status: ${fetchData.status}`);
        }

        const data = await fetchData.json();

        if (data.success) {
          setItems(data.data);
          setFilteredItems(data.data);
        }

        if (data.error) {
          toast.error(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch items', error);
        toast.error('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleDeleteConfirmation = (id) => {
    toast.info(
      <div className="p-4">
        <p className="text-gray-800 mb-4">Are you sure you want to delete this item?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              handleDelete(id);
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info('Deletion canceled');
            }}
            className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
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
        className: 'toast-confirmation'
      }
    );
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${SummaryApi.deleteItem.url}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        toast.success('Item deleted successfully');
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item', error);
      toast.error('Error deleting item');
    }
  };

  
  const displayQuantity = (count) => {
    if (count === 0 || count === '0') {
      return <span className="text-red-600 font-medium">Not Available</span>;
    }
    return count;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Laboratory Inventory</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search Lab Items . . ."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => navigate("/pharmacy-lab-panel/lab-itemiform")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={item._id} className={`hover:bg-gray-50 transition-colors ${item.itemCount === 0 ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {displayQuantity(item.itemCount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.itemCount === 0 ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Out of Stock</span>
                      ) : item.itemCount < 5 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                        <Link
                          to={`/pharmacy-lab-panel/edit-item/${item._id}`}
                          className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No items match your search' : 'No items found in inventory'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllItemsPage;