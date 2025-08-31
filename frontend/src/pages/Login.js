import React, { useContext, useState } from 'react'
import { FaEye, FaEyeSlash, FaBookOpen, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from "react-toastify";
import Context from '../context';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const { fetchUserDetails } = useContext(Context)

    const handleOnChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const dataResponse = await fetch(SummaryApi.signIn.url, {
            method: SummaryApi.signIn.method,
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if (dataApi.success) {
            toast.success(dataApi.message)
            navigate('/')
            fetchUserDetails()
        }

        if (dataApi.error) {
            toast.error(dataApi.message)
        }
        
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4">
            <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl">
                {/* Left Side - Decorative Panel */}
                <div className="w-full md:w-2/5 bg-gradient-to-br from-amber-600 to-amber-800 text-white p-8 flex flex-col justify-center items-center">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                            <FaBookOpen className="text-4xl text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-amber-100">To the BookNest Library Community</p>
                    </div>
                    
                    <div className="space-y-4 mt-8">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                                <span className="text-white font-bold">1</span>
                            </div>
                            <p className="text-amber-100">Access thousands of books</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                                <span className="text-white font-bold">2</span>
                            </div>
                            <p className="text-amber-100">Join reading communities</p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mr-3">
                                <span className="text-white font-bold">3</span>
                            </div>
                            <p className="text-amber-100">Track your reading journey</p>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                        <p className="text-amber-200 text-sm">Don't have an account yet?</p>
                        <Link 
                            to={"/signup"} 
                            className="inline-block mt-2 px-6 py-2 bg-white text-amber-700 font-semibold rounded-full hover:bg-amber-50 transition-all"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-3/5 bg-white p-10 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                        <p className="text-gray-600 mt-2">Access your BookNest account</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    name="email"
                                    value={data.email}
                                    onChange={handleOnChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleOnChange}
                                    required
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                />
                                <div 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-5 w-5 text-amber-600 hover:text-amber-800" />
                                    ) : (
                                        <FaEye className="h-5 w-5 text-amber-600 hover:text-amber-800" />
                                    )}
                                </div>
                            </div>
                            <Link 
                                to={'/forgot-password'} 
                                className="text-amber-600 text-sm block w-fit ml-auto hover:underline hover:text-amber-800 mt-2"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    
                </div>
            </div>
        </div>
    )
}

export default Login