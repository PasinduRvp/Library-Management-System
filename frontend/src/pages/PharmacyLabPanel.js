import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const PharmacyLabPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()


    useEffect(()=>{
          if((user?.role !== ROLE.PHARMACY)&&(user?.role !== ROLE.LABORATORY)){
            navigate("/")
          }
    },[user])

  return (
    <div className='min-h-[calc(100vh-120px)] lg:flex hidden'>
        <aside className='bg-white min-h-full w-full max-w-60 customShadow'>
              <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                                {
                                    user?.profilePic ? (
                                    <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name}/>
                                    ) : (
                                    <FaRegUserCircle/>
                                    )
                                }
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                    <p className='text-sm'>PHARMACY & LABORATORY</p>
              </div>
              
            
              <div>
                  <nav className='grid p-4 gap-2'> 
                       <Link to = {"/pharmacy-lab-panel/lab-itemiform"} className='px-2 py-1 hover:bg-slate-100'>Lab Item Form</Link>
                       <Link to = {"/pharmacy-lab-panel/all-items"} className='px-2 py-1 hover:bg-slate-100'>Lab Item View</Link>
                       <Link to = {"/pharmacy-lab-panel/lab-testform"} className='px-2 py-1 hover:bg-slate-100'>Laboratory test Form</Link>
                       <Link to = {"/pharmacy-lab-panel/all-tests"} className='px-2 py-1 hover:bg-slate-100'>Laboratory test View</Link>
                       <Link to = {"/pharmacy-lab-panel/pharmacy-stockform"} className='px-2 py-1 hover:bg-slate-100'>Pharmacy Stock Form</Link>
                       <Link to = {"/pharmacy-lab-panel/all-stocks"} className='px-2 py-1 hover:bg-slate-100'>Pharmacy Stock View</Link>

                  </nav>
              </div>
        </aside>

        <main className='w-full h-full p-2'>
            <Outlet/>
        </main>
    </div>
  )
}


export default PharmacyLabPanel