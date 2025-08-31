import React, { useState } from 'react'
import Logo from '../assest/liblogo.png'
import { GrSearch } from "react-icons/gr";
import { FaRegUserCircle, FaBook, FaUsers, FaCog, FaIdCard } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from "../store/userSlice";
import ROLE from '../common/role';
import defaultProfilePic from '../assest/loginIcon.jpg';
import { MdLogout } from 'react-icons/md';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include'
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate('/login');
      }

      if (data.error) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  }

  const showLogoutConfirmation = () => {
    toast.info(
      <div className="p-4">
        <p className="text-gray-800 font-medium text-lg mb-4">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              handleLogout();
              toast.dismiss();
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info('Logout cancelled');
            }}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition-colors shadow-md"
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
        className: "shadow-xl rounded-xl"
      }
    );
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const navLinkClass = ({ isActive }) =>
    `px-2 py-1 font-semibold cursor-pointer ${isActive ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-700 hover:text-amber-600"}`;

  return (
    <header className='h-24 shadow-md bg-white sticky top-0 z-50'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        {/* Logo */}
        <div className='flex items-center'>
          <Link to={"/"}>
            <img src={Logo} className='w-16 h-15' alt="BookNest Library Logo" />
          </Link>
          <span className='ml-2 text-xl font-bold text-amber-700 hidden md:block'>BookNest</span>
        </div>

        {/* Search Bar */}
        <div className='flex-1 max-w-lg mx-4 hidden md:block'>
          <form onSubmit={handleSearch} className='relative'>
            <input
              type="text"
              placeholder="Search books, authors..."
              className='w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-600'
            >
              <GrSearch className='text-xl' />
            </button>
          </form>
        </div>

        {/* Navigation Links */}
        <div className='hidden md:flex items-center gap-6'>
          <NavLink to="/book-collection" className={navLinkClass}>
            Book Collection
          </NavLink>

          <NavLink to="/book-reservation" className={navLinkClass}>
            Book Reservation
          </NavLink>

          <NavLink to="/my-reservations" className={navLinkClass}>
            My Reservation
          </NavLink>

          <NavLink to="/e-books" className={navLinkClass}>
            E-Books Library
          </NavLink>

          <NavLink to="/aboutUs" className={navLinkClass}>
            About Us
          </NavLink>

          {(user?.role === ROLE.ADMIN) && (
            <NavLink to="/admin-panel/book-management" className={navLinkClass}>
              <FaBook className="inline mr-1" /> Manage
            </NavLink>
          )}
          
          {(user?.role === ROLE.ADMIN) && (
            <NavLink to="/admin-panel/all-users" className={navLinkClass}>
              <FaUsers className="inline mr-1" /> Users
            </NavLink>
          )}
        </div>

        {/* User Actions */}
        <div className='flex items-center gap-4'>
          {/* Mobile Search */}
          <div className='md:hidden'>
            <GrSearch className='text-xl text-gray-600 cursor-pointer' />
          </div>

          {/* User Profile */}
          <div className='relative group flex justify-center'>
            {
              user?._id ? (
                <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                  {
                    user?.profilePic ? (
                      <img 
                        src={user?.profilePic} 
                        className='w-10 h-10 rounded-full object-cover border-2 border-amber-600' 
                        alt={user?.name} 
                        onError={(e) => {
                          e.target.src = defaultProfilePic;
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <FaRegUserCircle className='text-amber-600 text-3xl' />
                    )
                  }
                </div>
              ) : (
                <Link to="/login" className='text-amber-600 hover:text-amber-700'>
                  <FaRegUserCircle className='text-2xl' />
                </Link>
              )
            }

            {
              menuDisplay && user?._id && (
                <div className='absolute bg-white top-12 right-0 min-w-[250px] shadow-lg rounded-md z-50 border border-gray-200'>
                  <nav className='flex flex-col p-2'>
                    <div className='px-2 py-1 border-b border-gray-100 mb-2'>
                      <p className='font-semibold text-gray-800'>{user?.name}</p>
                      <p className='text-sm text-gray-500'>{user?.email}</p>
                      {user?.registrationNumber && (
                        <p className='text-xs text-amber-600 font-medium mt-1 flex items-center'>
                          <FaIdCard className="mr-1" />
                          ID: {user.registrationNumber}
                        </p>
                      )}
                      <p className='text-xs text-gray-500 mt-1'>
                        Role: <span className='font-medium'>{user?.role}</span>
                      </p>
                    </div>
                    
                    <Link 
                      to={"/profile"} 
                      className='whitespace-nowrap hover:bg-amber-50 p-2 rounded flex items-center'
                      onClick={() => setMenuDisplay(false)}
                    >
                      <FaRegUserCircle className="mr-2" /> My Profile
                    </Link>

                    <Link 
                      to={"/my-books"} 
                      className='whitespace-nowrap hover:bg-amber-50 p-2 rounded flex items-center'
                      onClick={() => setMenuDisplay(false)}
                    >
                      <FaBook className="mr-2" /> My Books
                    </Link>

                    {(user?.role === ROLE.ADMIN) && (
                      <Link 
                        to={"/admin-panel"} 
                        className='whitespace-nowrap hover:bg-amber-50 p-2 rounded flex items-center'
                        onClick={() => setMenuDisplay(false)}
                      >
                        <FaCog className="mr-2" /> Admin Panel
                      </Link>
                    )}

                    <div className='border-t border-gray-100 mt-2 pt-2'>
                      <button 
                        onClick={showLogoutConfirmation} 
                        className='w-full text-left text-red-600 hover:bg-red-50 p-2 rounded flex items-center'
                      >
                        <MdLogout className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </nav>
                </div>
              )
            }
          </div>

          {/* Login/Logout Button */}
          <div className='hidden md:block'>
            {
              user?._id ? (
                <button 
                  onClick={showLogoutConfirmation} 
                  className='px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white transition-colors text-sm'
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to={"/login"} 
                  className='px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white transition-colors text-sm'
                >
                  Login
                </Link>
              )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header