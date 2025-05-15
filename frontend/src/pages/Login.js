import React, { useContext, useState } from 'react'
import loginIcons from '../assest/loginIcon.jpg'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from "react-toastify";
import Context from '../context';

const Login = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [data,setData] = useState({
        email : "",
        password : ""
    })

    const navigate = useNavigate()
    const {fetchUserDetails} = useContext(Context)


    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    } 

    const handleSubmit = async(e) =>{
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.signIn.url,{
            method : SummaryApi.signIn.method,
            credentials : 'include',
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if(dataApi.success){
            toast.success(dataApi.message)
            navigate('/')
            fetchUserDetails()
        }

        if(dataApi.error){
            toast.error(dataApi.message)
        }


    }



    console.log("data login",data)

  return (
    <section id='login'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto rounded-3xl mt-4'>
                   
                   <div className='w-20 h-20 mx-auto'>
                       <img src={loginIcons} alt='Login Icons'></img>
                   </div>



                   <form className='pt-2 flex-col gap-4' onSubmit={handleSubmit}>
                      
                      <div className='grid'>
                        <label>Email : </label>
                           <div className='bg-slate-100 p-2 rounded-md'>
                              <input type='email' 
                              placeholder='Enter Email' 
                              name='email'
                              value={data.email}
                              onChange={handleOnChange}
                              className='w-full h-full outline-none bg-transparent'></input>
                           </div>
                      </div>

                      <div>
                      <label>Password : </label>
                         <div className='bg-slate-100 p-2 flex rounded-md'>
                            <input type={showPassword ? "text" : "password"} 
                                placeholder='Enter Password'
                                name='password'
                                value={data.password}
                                onChange={handleOnChange} 
                                className='w-full h-full outline-none bg-transparent'></input>
                            <div className='cursor-pointer text-lg'>
                                <span>

                                </span>
                              </div>
                         </div>
                         <Link to={'/forgot-password'} className='text-blue-600 block w-fit ml-auto hover:underline hover:text-blue-800 pt-1'>
                         Forgot Password ?
                         </Link>
                      </div>

                      <button className='bg-blue-600 hover:bg-blue-800 hover:scale-105 text-white px-6 py-2 w-full max-w-[180px] rounded-full transition-all mx-auto block mt-4'>Login</button>

                   </form>

                   <p className='my-6'>Don't have account ? <Link to={"/signup"} className='hover:underline hover:text-blue-800 text-blue-600'>Sign Up</Link></p>
            </div>

        </div>
    </section>
  )
}

export default Login