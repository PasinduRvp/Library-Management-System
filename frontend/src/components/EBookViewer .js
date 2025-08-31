import React, { useState } from "react";

const EBookViewer = ({ ebookId, ebookName }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-screen overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{ebookName}</h3>
          <button
            onClick={() => {/* Close modal */}}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <div className="h-full">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          )}
          
          <iframe
            src={`http://localhost:8000/api/e-books/view-pdf/${ebookId}`}
            className="w-full h-full"
            onLoad={() => setIsLoading(false)}
            title={ebookName}
          />
        </div>
      </div>
    </div>
  );
};

export default EBookViewer;