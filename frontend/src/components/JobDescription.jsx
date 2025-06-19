import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import ApplyJobForm from './ApplyJobForm'; // Changed from PremiumApplicationForm
import FullScreenChat from './chat/FullScreenChat';
import MockInterviewModal from './MockInterviewModal';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [showApplicationForm, setShowApplicationForm] = useState(false); // Changed from showPremiumForm
    const [showChat, setShowChat] = useState(false);
    const [showMockTest, setShowMockTest] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = () => {
        if (!user) {
            toast.error("Please login to apply");
            navigate("/login");
            return;
        }
        setShowApplicationForm(true); // Changed from setShowPremiumForm
    };

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
                toast.error("Error fetching job details");
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    if (!singleJob) {
        return (
            <div className="max-w-7xl mx-auto my-10">
                <h2 className="text-center text-lg font-semibold">Loading job details...</h2>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                {/* Premium Chat Button */}
                <div className="flex gap-2">
                  {user && (
                    <Button
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                        onClick={() => setShowChat(true)}
                    >
                        💬 Premium Chat
                    </Button>
                  )}
                  {user && (
                    <Button
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
                        onClick={() => setShowMockTest(true)}
                    >
                        📝 Mock Test
                    </Button>
                  )}
                </div>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
            </div>
            {showApplicationForm && (
                <ApplyJobForm
                    jobId={jobId}
                    job={singleJob}
                    onClose={() => setShowApplicationForm(false)}
                />
            )}
            {/* Premium Chat Modal */}
            {showChat && user && (
                <FullScreenChat
                    open={showChat}
                    onClose={() => setShowChat(false)}
                    candidateId={user.role === 'student' ? user._id : singleJob?.applications?.[0]?.applicant}
                    recruiterId={user.role === 'recruiter' ? user._id : singleJob?.created_by}
                    userId={user._id}
                    userRole={user.role}
                    otherUser={user.role === 'student'
                        ? { name: singleJob?.company?.name || 'Recruiter', avatar: singleJob?.company?.logo, role: 'recruiter' }
                        : { name: singleJob?.applications?.[0]?.applicantName || 'Candidate', avatar: '', role: 'candidate' }
                    }
                />
            )}
            {/* Mock Interview Modal */}
            {showMockTest && (
                <MockInterviewModal
                    open={showMockTest}
                    onClose={() => setShowMockTest(false)}
                    jobTitle={singleJob?.title}
                    jobRequirements={singleJob?.requirements || []}
                />
            )}
        </div>
    )
}

export default JobDescription