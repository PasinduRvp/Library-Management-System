const backendDomain = "http://localhost:8080";

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
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomain}/api/all-users`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : 'post'
    },
    deleteUser: {
        url: `${backendDomain}/api/delete-user`,
        method: "DELETE"
    },
    checkIndexNumber: {
        url: `${backendDomain}/api/check-index-number`,
        method: 'get'
    },
    allChannelings : {
        url : `${backendDomain}/api/all-channelings`,
        method : 'get' 
    },
    AddChannelingAppointment : {
        url : `${backendDomain}/api/add-channeling-appointment`,
        method : 'post'
    },
    allChannelingAppointments : {
        url : `${backendDomain}/api/get-channeling-appointments`,
        method : 'get' 
    },
    updateChannelingAppointment :{
        url : `${backendDomain}/api/update-channeling-appointment`,
        method : 'post'
    },
    deleteChannelingAppointment: {
        url: `${backendDomain}/api/delete-channeling-appointment`,
        method: "POST"
    },
    

    addNotice : {
        url : `${backendDomain}/api/add-notice`,
        method : 'post'
    },
    allNotices : {
        url : `${backendDomain}/api/get-notice`,
        method : 'get'
    },
    updateNotice : {
        url : `${backendDomain}/api/update-notice`,
        method : 'post'
    },
    deleteNotice: {
        url: `${backendDomain}/api/delete-notice`,
        method: "POST",
    },


    allHomeVisits : {
        url : `${backendDomain}/api/all-homevisits`,
        method : 'get' 
    },
    AddHomeVisitAppointment : {
        url : `${backendDomain}/api/add-homevisit-appointment`,
        method : 'post'
    },
    allHomeVisitAppointments : {
        url : `${backendDomain}/api/get-homevisit-appointments`,
        method : 'get' 
    },
    updateHomeVisitAppointment :{
        url : `${backendDomain}/api/update-homevisit-appointment`,
        method : 'post'
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
