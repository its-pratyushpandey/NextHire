import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { searchedQuery } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const [isLoading, setIsLoading] = useState(false);    useEffect(() => {
        // Fetch jobs for all users, even if not logged in
        const fetchAllJobs = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery || ''}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                    if (res.data.jobs.length === 0) {
                        toast.info('No jobs found for your search.');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    toast.error('Please login to view jobs');
                } else if (error.code === 'ERR_NETWORK') {
                    toast.error('Cannot connect to server. Please check if the server is running.');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to load jobs');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllJobs();
    }, [searchedQuery, user, dispatch, navigate]);

    return { isLoading };
};

export default useGetAllJobs;