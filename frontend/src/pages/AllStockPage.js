import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common/index';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const AllStockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const fetchData = await fetch(SummaryApi.getAllStocks.url, {
          method: SummaryApi.getAllStocks.method,
          credentials: 'include',
        });

        if (!fetchData.ok) {
          throw new Error(`HTTP error! status: ${fetchData.status}`);
        }

        const data = await fetchData.json();
        console.log("API Response:", data); // Debug log

        if (data.success) {
          setStocks(data.data);
          setFilteredStocks(data.data);
        } else {
          toast.error(data.message || "Failed to fetch stocks");
        }
      } catch (error) {
        console.error('Failed to fetch stocks', error);
        toast.error('Failed to load stock items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStocks(stocks);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = stocks.filter(stock => 
        stock.stockName?.toLowerCase().includes(searchTermLower) ||
        stock.stockId?.toLowerCase().includes(searchTermLower) ||
        stock.company?.toLowerCase().includes(searchTermLower) ||
        stock.dealerName?.toLowerCase().includes(searchTermLower) ||
        stock.stockType?.toLowerCase().includes(searchTermLower)
      );
      setFilteredStocks(filtered);
    }
  }, [searchTerm, stocks]);

  const handleDeleteConfirmation = (id) => {
      toast.info(
        <div className="p-4">
          <p className="text-gray-800 mb-4">Are you sure you want to delete this item?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                handleDeleteStock(id);
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
        duration: Infinity,
        style: {
          minWidth: '400px'
        }
      }
    );
  };

  const handleDeleteStock = async (id) => {
    try {
      const response = await fetch(`${SummaryApi.deleteStock.url}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStocks(prevStocks => prevStocks.filter(stock => stock._id !== id));
        toast.success('Stock item deleted successfully');
      } else {
        toast.error('Failed to delete stock item');
      }
    } catch (error) {
      console.error('Failed to delete stock item', error);
      toast.error('Error deleting stock item');
    }
  };

  const displayQuantity = (count) => {
    if (count === 0 || count === '0') {
      return <span className="text-red-600 font-medium">Not Available</span>;
    }
    return count;
  };

  const displayStockType = (type) => {
    const typeMap = {
      tablet: 'Tablet',
      bottle: 'Bottle',
      boxes : 'boxes',
      other: 'Other'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Pharmacy Inventory</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by name, ID, company, type or dealer..."
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
                onClick={() => navigate("/pharmacy-lab-panel/pharmacy-stockform")}
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
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dealer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dealer Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <tr key={stock._id} className={`hover:bg-gray-50 transition-colors ${stock.stockCount === 0 ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stock.stockId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.stockName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {displayStockType(stock.stockType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {displayQuantity(stock.stockCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stock.stockCount === 0 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Out of Stock</span>
                        ) : stock.stockCount < 5 ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Low Stock</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">In Stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(stock.exDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.dealerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <Link
                            to={`/pharmacy-lab-panel/edit-stock/${stock._id}`}
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
                    <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No items match your search' : 'No stock items available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStockPage;