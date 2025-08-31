import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    useEffect(()=>{
          if(user?.role !== ROLE.ADMIN){
            navigate("/")
          }
    },[user])

  return (
    <div className='min-h-[calc(100vh-120px)] lg:flex hidden bg-gradient-to-br from-amber-50 to-amber-100'>
        <aside className='bg-white min-h-full w-full max-w-64 rounded-r-2xl shadow-lg'>
              <div className='h-40 flex justify-center items-center flex-col p-4 border-b border-amber-100'>
                    <div className='text-5xl cursor-pointer relative flex justify-center mb-3'>
                                {
                                    user?.profilePic ? (
                                    <img src={user?.profilePic} className='w-20 h-20 rounded-full object-cover shadow-md' alt={user?.name}/>
                                    ) : (
                                    <div className='w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center'>
                                        <FaRegUserCircle className='text-amber-600 text-3xl'/>
                                    </div>
                                    )
                                }
                    </div>
                    <p className='capitalize text-lg font-semibold text-gray-800'>{user?.name}</p>
                    <p className='text-sm text-amber-600 bg-amber-100 px-2 py-1 rounded-full mt-1'>{user?.role}</p>
              </div>
              
             
              <div className='p-4'>
                  <nav className='grid gap-1'> 
                       <Link 
                         to={"all-users"} 
                         className='px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-all flex items-center gap-2'
                       >
                         <span className='w-2 h-2 bg-amber-400 rounded-full'></span>
                         All Users
                       </Link>
                       <Link 
                         to={"membership-management"} 
                         className='px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-all flex items-center gap-2'
                       >
                         <span className='w-2 h-2 bg-amber-400 rounded-full'></span>
                         Membership Management
                       </Link>
                       <Link 
                         to={"book-management"} 
                         className='px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-all flex items-center gap-2'
                       >
                         <span className='w-2 h-2 bg-amber-400 rounded-full'></span>
                         Book Management
                       </Link>
                       <Link 
                         to={"admin-reservations"} 
                         className='px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-all flex items-center gap-2'
                       >
                         <span className='w-2 h-2 bg-amber-400 rounded-full'></span>
                         Manage Reservations
                       </Link>
                       <Link 
                         to={"admin/e-books"} 
                         className='px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-700 transition-all flex items-center gap-2'
                       >
                         <span className='w-2 h-2 bg-amber-400 rounded-full'></span>
                         E-Library Management
                       </Link>
                  </nav>
              </div>
        </aside>

        <main className='w-full h-full p-6'>
            <div className='bg-white rounded-2xl shadow-lg p-6 h-full'>
                <Outlet/>
            </div>
        </main>
    </div>
  )
}

export default AdminPanel