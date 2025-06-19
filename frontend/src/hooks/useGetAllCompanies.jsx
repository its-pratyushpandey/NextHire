import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                if (!user) return;

                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.error('Failed to fetch companies:', error);
                if (error.response?.status === 401) {
                    toast.error('Please login to view companies');
                } else {
                    toast.error('Failed to load companies');
                }
            }
        };
        fetchCompanies();
    }, [user, dispatch]);
};

export default useGetAllCompanies;