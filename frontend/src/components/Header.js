import React, { useState } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { PiHandshakeFill } from "react-icons/pi";
import { FaShoppingCart } from 'react-icons/fa';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from "../store/userSlice";
import ROLE from '../common/role';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)

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
      <div>
        <p className="text-gray-800">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              handleLogout();
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              toast.info('Logout cancelled');
            }}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
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
      }
    );
  }

  const navLinkClass = ({ isActive }) =>
    `px-2 py-1 font-semibold cursor-pointer ${isActive ? "text-blue-600 border-b-2 border-blue-600" : ""}`;

  return (
    <header className='h-20 shadow-md bg-white sticky top-0 z-50'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className='mt-7'>
          <Link to={"/"}>
            <Logo w={100} h={100} />
          </Link>
        </div>

        <div className='hidden md:flex items-center gap-6'>
          <NavLink to="/all-channelings" className={navLinkClass}>
            Doctor Channelings
          </NavLink>

          <NavLink to="/all-homevisits" className={navLinkClass}>
            Home Visit Appointment
          </NavLink>

          <NavLink to="/nursing-school" className={navLinkClass}>
            Nursing School
          </NavLink>

          <NavLink to="/all-generalnotices" className={navLinkClass}>
            General Notices
          </NavLink>

          <NavLink to="/all-onlineConsultations" className={navLinkClass}>
            Online Consultations
          </NavLink>

        {(user?.role === ROLE.PHARMACY || user?.role === ROLE.LABORATORY) && (
            <NavLink to="/pharmacy-lab-panel/all-items" className={navLinkClass}>
              Pharmacy & Lab Panel
            </NavLink>
          )}
        </div>

        <div className='flex items-center gap-7'>
          <div className='relative group flex justify-center'>
            {
              user?._id && (
                <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                  {
                    user?.profilePic ? (
                      <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                    ) : (
                      <FaRegUserCircle />
                    )
                  }
                </div>
              )
            }

            {
              menuDisplay && (
                <div className='absolute bg-white top-12 right-0 min-w-[200px] shadow-lg rounded-md z-50'>
                  <nav className='flex flex-col p-2'>
                    {
                      user?.role === ROLE.ADMIN && (
                        <Link 
                          to={"/admin-panel/all-users"} 
                          className='whitespace-nowrap hover:bg-slate-100 p-2 rounded'
                          onClick={() => setMenuDisplay(false)}
                        >
                          Admin Panel
                        </Link>
                      )
                    }
                    {
                      (user?.role === ROLE.PHARMACY || user?.role === ROLE.LABORATORY ) && (
                        <Link 
                          to={"pharmacy-lab-panel/all-items"} 
                          className='whitespace-nowrap hover:bg-slate-100 p-2 rounded'
                          onClick={() => setMenuDisplay(false)}
                        >
                          Pharmacy Lab Panel
                        </Link>
                      )
                    }
                    {
                      (user?.role === ROLE.ADMIN || user?.role === ROLE.DOCTOR ) && (
                        <Link 
                          to={"/patient-records"} 
                          className='whitespace-nowrap hover:bg-slate-100 p-2 rounded'
                          onClick={() => setMenuDisplay(false)}
                        >
                          Patient Records
                        </Link>
                      )
                    }
                    {
                      <Link 
                      to={"/profile"} 
                      className='whitespace-nowrap hover:bg-slate-100 p-2 rounded'
                      onClick={() => setMenuDisplay(false)}
                    >
                      Profile
                    </Link>
                    }
                    
                  </nav>
                </div>
              )
            }
          </div>

          <div className='text-3xl relative'>
            <span>
              <PiHandshakeFill />
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute top-0 -right-3'>
                <p className='text-sm'>0</p>
              </div>
            </span>
          </div>

          <div>
            {
              user?._id ? (
                <button 
                  onClick={showLogoutConfirmation} 
                  className='px-3 py-1 rounded-full bg-red-600 hover:bg-red-800 text-white transition-colors'
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to={"/login"} 
                  className='px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-800 text-white transition-colors'
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