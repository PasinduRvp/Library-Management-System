// common/index.js - Fixed SummaryApi
const backendDomain = "http://localhost:8000";

const baseUrl = process.env.REACT_APP_API_URL || '';


const SummaryApi = {
    signUp: {
        url: `${backendDomain}/api/signup`,  
        method: "POST"
    },
    signIn : {
        url: `${backendDomain}/api/signin`,
        method: "POST"
    },
    current_user :{
        url : `${backendDomain}/api/user-details`,
        method : "GET"
    },

    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : 'GET'
    },
    allUser : {
        url : `${backendDomain}/api/all-users`,
        method : 'GET'
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : 'POST'
    },
    deleteUser: {
        url: `${backendDomain}/api/delete-user`,
        method: "DELETE"
    },
    checkIndexNumber: {
        url: `${backendDomain}/api/check-index-number`,
        method: 'GET'
    },
    allChannelings : {
        url : `${backendDomain}/api/all-channelings`,
        method : 'GET' 
    },
    AddChannelingAppointment : {
        url : `${backendDomain}/api/add-channeling-appointment`,
        method : 'POST'
    },
    allChannelingAppointments : {
        url : `${backendDomain}/api/get-channeling-appointments`,
        method : 'GET' 
    },
    updateChannelingAppointment :{
        url : `${backendDomain}/api/update-channeling-appointment`,
        method : 'POST'
    },
    deleteChannelingAppointment: {
        url: `${backendDomain}/api/delete-channeling-appointment`,
        method: "POST"
    },
    

    addNotice : {
        url : `${backendDomain}/api/add-notice`,
        method : 'POST'
    },
    allNotices : {
        url : `${backendDomain}/api/get-notice`,
        method : 'GET'
    },
    updateNotice : {
        url : `${backendDomain}/api/update-notice`,
        method : 'POST'
    },
    deleteNotice: {
        url: `${backendDomain}/api/delete-notice`,
        method: "POST",
    },


    allHomeVisits : {
        url : `${backendDomain}/api/all-homevisits`,
        method : 'GET' 
    },
    AddHomeVisitAppointment : {
        url : `${backendDomain}/api/add-homevisit-appointment`,
        method : 'POST'
    },
    allHomeVisitAppointments : {
        url : `${backendDomain}/api/get-homevisit-appointments`,
        method : 'GET' 
    },
    updateHomeVisitAppointment :{
        url : `${backendDomain}/api/update-homevisit-appointment`,
        method : 'POST'
    },
    deleteHomeVisitAppointment: {
        url: `${backendDomain}/api/delete-home-visit-appointment`,
        method: "POST"
    },
    
    createItem: {
        url: `${backendDomain}/api/add-item`,
        method: "POST",
    },
    getAllItems: {
        url: `${backendDomain}/api/get-items`,
        method: "GET",
    },
    getItemById: {
        url: `${backendDomain}/api/get-item`,
        method: "GET",
    },
    updateItem: {
        url: `${backendDomain}/api/edit-item/:id`,
        method: "POST",
    },
    deleteItem: {
        url: `${backendDomain}/api/delete-item`,
        method: "DELETE",
    },
    createStock: {
        url: `${backendDomain}/api/add-stock`,
        method: "POST",
    },
    getAllStocks: {
        url: `${backendDomain}/api/get-stocks`,
        method: "GET",
    },
    getStockById: {
        url: `${backendDomain}/api/get-stock`,
        method: "GET",
    },
    updateStock: {
        url: `${backendDomain}/api/edit-stock/:id`,
        method: "POST",
    },
    deleteStock: {
        url: `${backendDomain}/api/delete-stock`,
        method: "DELETE",
    },

    createTest: {
        url: `${backendDomain}/api/add-test`,
        method: "POST",
    },
    getAllTests: {
        url: `${backendDomain}/api/get-tests`,
        method: "GET",
    },
    getTestById: {
        url: `${backendDomain}/api/get-test`,
        method: "GET",
    },
    updateTest: {
        url: `${backendDomain}/api/edit-test/:id`,
        method: "POST",
    },
    deleteTest: {
        url: `${backendDomain}/api/delete-test`,
        method: "DELETE",
    },

    getResources: {
        url: `${backendDomain}/api/resources`,
        method: "GET",
      },
      addResource: {
        url: `${backendDomain}/api/resources`,
        method: "POST",
      },
      updateResource: {
        url: `${backendDomain}/api/resources`,
        method: "PATCH", 
      },
      deleteResource: {
        url: `${backendDomain}/api/resources`,
        method: "DELETE",
      },

      // Book APIs
      getBooks: {
    url: `${backendDomain}/api/books`,
    method: "GET",
  },
  getBookById: {
    url: (id) => `${backendDomain}/api/books/${id}`,
    method: "GET",
  },
  addBook: {
    url: `${backendDomain}/api/books`,
    method: "POST",
  },
  updateBook: {
    url: (id) => `${backendDomain}/api/books/${id}`,
    method: "PUT",
  },
  deleteBook: {
    url: (id) => `${backendDomain}/api/books/${id}`,
    method: "DELETE",
  },

  createReservation: {
    url: `${backendDomain}/api/book-reservation`,
    method: "POST",
  },
  getUserReservations: {
    url: `${backendDomain}/api/user-reservations`,
    method: "GET",
  },
  getAllReservations: {
    url: `${backendDomain}/api/all-reservations`,
    method: "GET",
  },

 updateReservationStatus: {
  url: (id) => `${backendDomain}/api/reservation-status/${id}`,
  method: "PUT"
},
  cancelReservation: {
    url: (id) => `${backendDomain}/api/cancel-reservation/${id}`,
    method: "PUT",
  },



  getEBooks: {
    url: `${backendDomain}/api/e-books`,
    method: "GET",
  },
  getEBookById: {
    url: (id) => `${backendDomain}/api/e-books/${id}`,
    method: "GET",
  },
  addEBook: {
    url: `${backendDomain}/api/e-books`,
    method: "POST",
  },
  updateEBook: {
    url: (id) => `${backendDomain}/api/e-books/${id}`,
    method: "PUT",
  },
  
  deleteEBook: {
    url: (id) => `${backendDomain}/api/e-books/${id}`,
    method: "DELETE",
  },
  downloadEBook: {
    url: (id) => `${backendDomain}/api/e-books/download/${id}`,
    method: "GET",
  },
  changePassword: {
        url: `${baseUrl}/api/change-password`,
        method: "PUT"
    },

    uploadMembershipSlip: {
    url: `${backendDomain}/api/upload-membership-slip`,
    method: "POST"
  },
  approveMembership: {
    url: `${backendDomain}/api/approve-membership`,
    method: "POST"
  },
  getAllPendingMemberships: {
    url: `${backendDomain}/api/pending-memberships`,
    method: "GET"
  },
  
  // E-Book Viewer
  viewEBook: {
    url: (id) => `${backendDomain}/api/e-books/view-pdf/${id}`,
    method: "GET"
  },






      getMaterials: {
        url: `${backendDomain}/api/get-course-materials`,
        method: "GET",
      },
      addMaterial: {
        url: `${backendDomain}/api/add-course-materials`,
        method: "POST",
      },
      updateMaterial: {
        url: `${backendDomain}/api/update-course-materials`,
        method: "PATCH", 
      },
      deleteMaterial: {
        url: `${backendDomain}/api/delete-course-materials`,
        method: "DELETE",
      },


      getMarks: {
        url: `${backendDomain}/api/get-marks`,
        method: "GET",
      },
      addMark: {
        url: `${backendDomain}/api/add-marks`,
        method: "POST",
      },
      updateMark: {
        url: `${backendDomain}/api/update-marks`,
        method: "PATCH",
      },
      deleteMark: {
        url: `${backendDomain}/api/delete-marks`,
        method: "DELETE",
      },
      getMarksByStudent: {
        url: (studentNumber) => `${backendDomain}/api/marks/student/${studentNumber}`,
        method: "GET",
      },
      
getUserById: {
    url: (id) => `${backendDomain}/api/users/${id}`,
    method: "GET"
},
getMedicalRecords: {
    url: (id) => `${backendDomain}/api/users/${id}/medical-records`,
    method: "GET"
},
updateMedicalRecords: {
    url: (id) => `${backendDomain}/api/users/${id}/medical-records`,
    method: "POST"
}

};

export default SummaryApi;