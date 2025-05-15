import React, { useState } from 'react'
import loginIcons from '../assest/loginIcon.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from "react-toastify";




const SignUp = () => {

    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

        const [data,setData] = useState({
            email : "",
            password : "",
            name : "",
            confirmPassword : "",
            profilePic : ""
        })

        const navigate = useNavigate()
    
        const handleOnChange = (e) =>{
            const { name , value } = e.target
    
            setData((preve)=>{
                return{
                    ...preve,
                    [name] : value
                }
            })
        } 


        const handleUploadPic = async(e) =>{
            const file = e.target.files[0]

            const imagePic = await imageTobase64(file)
            
            setData((preve)=>{
                return{
                    ...preve,
                    profilePic : imagePic
                }
            })

        }
    


        const handleSubmit = async(e) =>{
            e.preventDefault()

            if(data.password == data.confirmPassword){

              const dataResponse = await fetch(SummaryApi.signUp.url,{
                method : SummaryApi.signUp.method,
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(data)
            })
            const dataApi = await dataResponse.json()

            if(dataApi.success){
                toast.success(dataApi.message)
                navigate("/login")
            }

            else if(dataApi.error){
                toast.error(dataApi.message || "An error occurred");
            }

        }else{
            toast.error("Please Check Password and Confirm Password !")
        }

    }

    


  return (
    <section id='signup'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto rounded-3xl mt-4'>
                   
                   <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                       <div>
                          <img src={data.profilePic || loginIcons} alt='Login Icons'></img>
                       </div>
                       <form>
                        <label>
                            <div className='text-xs bg-opacity-70 pt-2 pb-4 bg-slate-200 text-center absolute bottom-0 w-full cursor-pointer'>
                            Upload Photo
                            </div>
                            <input type='file' className='hidden' onChange={handleUploadPic}/>
                        </label>
                        
                       </form>
                   </div>



                   <form className='pt-8 flex-col gap-4' onSubmit={handleSubmit}>
                      
                     <div className='grid'>
                        <label>Name : </label>
                           <div className='bg-slate-100 p-2 rounded-md'>
                              <input type='Text' 
                              placeholder='Enter Your Name' 
                              name='name'
                              value={data.name}
                              onChange={handleOnChange}
                              required
                              className='w-full h-full outline-none bg-transparent'></input>
                           </div>
                      </div>



                      <div className='grid'>
                        <label>Email : </label>
                           <div className='bg-slate-100 p-2 rounded-md'>
                              <input type='email' 
                              placeholder='Enter Email' 
                              name='email'
                              value={data.email}
                              onChange={handleOnChange}
                              required
                              className='w-full h-full outline-none bg-transparent'></input>
                           </div>
                      </div>

                      <div>
                        <label>Password:</label>
                        <div className='bg-slate-100 p-2 flex rounded-md'>
                            <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Enter Password'
                            name='password'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                            minLength={6}
                            className='w-full h-full outline-none bg-transparent'
                            />
                        </div>
                        {data.password && data.password.length < 6 && (
                            <p className="text-sm text-red-500 mt-1">Password must be at least 6 characters long.</p>
                        )}
                    </div>


                      <div>
                      <label>Confirm Password : </label>
                         <div className='bg-slate-100 p-2 flex rounded-md'>
                            <input type={showConfirmPassword ? "text" : "password"} 
                                placeholder='Enter Confirm Password'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleOnChange} 
                                required
                                className='w-full h-full outline-none bg-transparent'></input>
                            </div>
                      </div>

                      <button className='bg-blue-600 hover:bg-blue-800 hover:scale-105 text-white px-6 py-2 w-full max-w-[180px] rounded-full transition-all mx-auto block mt-4'>Sign Up</button>

                   </form>

                   <p className='my-6'>Already have account ? <Link to={"/login"} className='hover:underline hover:text-blue-800 text-blue-600'>Login</Link></p>
            </div>

        </div>
    </section>
  )
}

export default SignUp