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