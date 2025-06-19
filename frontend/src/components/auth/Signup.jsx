import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
    UserCircle2,
    Mail, 
    Phone,
    Lock,
    User,
    Building2,
    ImagePlus,
    Loader2,
    ArrowRight,
    CheckCircle2,
    GraduationCap
} from 'lucide-react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl"
                >
                    <form onSubmit={submitHandler} className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 my-10 space-y-6'>
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
                                    <UserCircle2 className="h-10 w-10 text-white" />
                                </div>
                            </motion.div>
                            <h1 className='font-bold text-2xl mt-4 text-gray-900 dark:text-white'>Create an Account</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Join our community today</p>
                        </div>

                        <div className='space-y-4'>
                            <div className="relative">
                                <Label className="text-gray-700 dark:text-gray-300">Full Name</Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="Pratyush Pandey"
                                        className="pl-10"
                                    />
                                    <User className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        placeholder="pratyush@example.com"
                                        className="pl-10"
                                    />
                                    <Mail className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="+1 234 567 8900"
                                        className="pl-10"
                                    />
                                    <Phone className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="relative">
                                <Label className="text-gray-700 dark:text-gray-300">Password</Label>
                                <div className="relative">
                                    <Input
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="••••••••"
                                        className="pl-10"
                                    />
                                    <Lock className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row gap-6 items-start md:items-center justify-between'>
                                <div className="relative">
                                    <Label className="text-gray-700 dark:text-gray-300">Select Role</Label>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setInput(prev => ({ ...prev, role: 'student' }))}
                                            className={`p-3 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                                                input.role === 'student'
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg ${
                                                input.role === 'student'
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                            }`}>
                                                <GraduationCap className="h-5 w-5" />
                                            </div>
                                            <span className={`mt-2 text-sm font-medium ${
                                                input.role === 'student'
                                                ? 'text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                Job Seeker
                                            </span>
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setInput(prev => ({ ...prev, role: 'recruiter' }))}
                                            className={`p-3 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                                                input.role === 'recruiter'
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg ${
                                                input.role === 'recruiter'
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800'
                                            }`}>
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <span className={`mt-2 text-sm font-medium ${
                                                input.role === 'recruiter'
                                                ? 'text-purple-600 dark:text-purple-400'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                Recruiter
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Label className="text-gray-700 dark:text-gray-300">Profile Photo</Label>
                                    <div className="relative">
                                        <Input
                                            accept="image/*"
                                            type="file"
                                            onChange={changeFileHandler}
                                            className="cursor-pointer pl-10"
                                        />
                                        <ImagePlus className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {loading ? (
                                <Button disabled className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Creating account...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                    Create Account
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </motion.div>

                        <p className='text-center text-gray-600 dark:text-gray-400 text-sm'>
                            Already have an account?{' '}
                            <Link to="/login" className='text-purple-600 hover:text-purple-700 font-medium'>
                                Sign in
                            </Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default Signup