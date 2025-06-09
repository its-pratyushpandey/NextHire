import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
    Mail, 
    Lock,
    Loader2,
    ArrowRight,
    KeyRound,
    Building2,
    User
} from 'lucide-react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student" // Set default role
    });
    const [errors, setErrors] = useState({});
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateForm = () => {
        const newErrors = {};
        
        // Email validation
        if (!input.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!input.password) {
            newErrors.password = 'Password is required';
        } else if (input.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Role validation
        if (!input.role) {
            newErrors.role = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                // Store the token in localStorage
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <form onSubmit={submitHandler} className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 my-10 space-y-6'>
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
                                    <KeyRound className="h-10 w-10 text-white" />
                                </div>
                            </motion.div>
                            <h1 className='font-bold text-2xl mt-4 text-gray-900 dark:text-white'>Welcome Back</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
                        </div>

                        <div className='space-y-4'>
                            <div className="relative">
                                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeHandler}
                                        placeholder="pratyush@example.com"
                                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                    <Mail className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Label className="text-gray-700 dark:text-gray-300">Password</Label>
                                <div className="relative">
                                    <Input
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeHandler}
                                        placeholder="••••••••"
                                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    <Lock className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300">Login as</Label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={input.role === 'student' ? 'default' : 'outline'}
                                        className="flex-1 gap-2"
                                        onClick={() => changeHandler({ target: { name: 'role', value: 'student' } })}
                                    >
                                        <User className="h-4 w-4" />
                                        Student
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={input.role === 'recruiter' ? 'default' : 'outline'}
                                        className="flex-1 gap-2"
                                        onClick={() => changeHandler({ target: { name: 'role', value: 'recruiter' } })}
                                    >
                                        <Building2 className="h-4 w-4" />
                                        Recruiter
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        <p className='text-center text-gray-600 dark:text-gray-400 text-sm'>
                            Don't have an account?{' '}
                            <Link to="/signup" className='text-purple-600 hover:text-purple-700 font-medium'>
                                Create account
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;