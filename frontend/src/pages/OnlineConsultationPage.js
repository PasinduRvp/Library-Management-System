import { FaUserMd, FaCalendarAlt, FaVideo, FaStethoscope, FaSearch } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { BsChatDots, BsPrescription } from 'react-icons/bs';
import { useState } from 'react';

const OnlineConsultationPage = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample doctor data
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      rating: 4.9,
      experience: '12 years',
      available: 'Today, 3:00 PM',
      image: '/doctor1.jpg'
    },
    // ... more doctors
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaStethoscope className="text-blue-500 text-2xl" />
            <h1 className="text-xl font-bold text-gray-800">MediConnect</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-blue-500">
              <IoMdNotifications className="text-xl" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Virtual Medical Consultations</h2>
          <p className="mb-4">Get expert medical advice from the comfort of your home</p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
            Book Now
          </button>
        </section>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mt-4 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm whitespace-nowrap">
              All Specialties
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm whitespace-nowrap">
              Cardiology
            </button>
            {/* More specialty filters */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'doctors' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'appointments' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('appointments')}
          >
            My Appointments
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'prescriptions' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            Prescriptions
          </button>
        </div>

        {/* Doctors List */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-700 ml-1">{doctor.rating}</span>
                        <span className="text-sm text-gray-500 ml-2">• {doctor.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      <span>{doctor.available}</span>
                    </div>
                    <button className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">
                      <FaVideo />
                      <span>Consult</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-lg mb-4">Upcoming Appointments</h3>
            {/* Appointment cards would go here */}
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming appointments</p>
            </div>
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Your Prescriptions</h3>
              <button className="flex items-center text-blue-500 text-sm">
                <BsPrescription className="mr-1" />
                Request Refill
              </button>
            </div>
            {/* Prescription list would go here */}
            <div className="text-center py-8 text-gray-500">
              <p>No prescriptions available</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation (for mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden">
        <div className="flex justify-around">
          <button className="p-4 text-blue-500">
            <FaUserMd className="text-xl" />
          </button>
          <button className="p-4 text-gray-500">
            <FaCalendarAlt className="text-xl" />
          </button>
          <button className="p-4 text-gray-500">
            <BsChatDots className="text-xl" />
          </button>
          <button className="p-4 text-gray-500">
            <BsPrescription className="text-xl" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default OnlineConsultationPage;