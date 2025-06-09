import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  User2, Pen, Calendar, MapPin, MessageCircle, 
  CheckCircle2, Mail, Phone, Globe, FileText,
  Download, Sparkles, Share2, Bookmark, Award, XCircle, Clock, Star, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import UpdateProfileDialog from '../UpdateProfileDialog';
import { Tooltip, TooltipContent, TooltipProvider } from '../ui/tooltip';
import AppliedJobTable from '../AppliedJobTable';
import { motion } from 'framer-motion';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

// Components
const ContactSection = ({ user }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-4"
  >
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
      <User2 className="h-5 w-5 text-purple-500" />
      Contact Information
    </h2>
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Mail className="h-4 w-4 text-blue-500" />
        <span>{user?.email}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Phone className="h-4 w-4 text-green-500" />
        <span>{user?.phoneNumber}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Globe className="h-4 w-4 text-purple-500" />
        <span>{user?.profile?.website || 'Website not added'}</span>
      </div>
    </div>
  </motion.div>
);

const SkillsSection = ({ skills }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-8"
  >
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="h-5 w-5 text-purple-500" />
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills & Expertise</h2>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills?.length > 0 ? (
        skills.map((skill, index) => (
          <Badge 
            key={index}
            className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
          >
            {skill}
          </Badge>
        ))
      ) : (
        <span className="text-gray-500">No skills added yet</span>
      )}
    </div>
  </motion.div>
);

const ResumeSection = ({ resume }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(resume);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Resume download started!");
    } catch {
      toast.error("Error downloading resume");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Resume</h2>
        </div>
        {resume && (
          <Button 
            onClick={handleDownload}
            variant="outline" 
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CV
          </Button>
        )}
      </div>
      {resume ? (
        <motion.a 
          whileHover={{ scale: 1.01 }}
          href={resume}
          target="_blank"
          className="block p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">
                Professional Resume
              </p>
              <p className="text-sm text-gray-500">
                Click to view your full resume
              </p>
            </div>
          </div>
        </motion.a>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <p className="text-gray-500">
            No resume uploaded yet. Add your resume to increase your chances of getting hired.
          </p>
        </div>
      )}
    </motion.div>
  );
};

const UserProfile = () => {
  useGetAppliedJobs();
  const { user } = useSelector(store => store.auth);
  const { allAppliedJobs } = useSelector(store => store.job);
  const joinDate = format(new Date(user?.createdAt || new Date()), 'MMM yyyy');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
            <motion.div className="absolute top-4 right-4">
              <Button 
                onClick={() => setIsEditDialogOpen(true)}
                variant="ghost" 
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
              >
                <Pen className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 -mt-16 relative">
              <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-gray-800">
                <AvatarImage src={user?.profile?.profilePhoto} />
                <AvatarFallback className="bg-purple-600">
                  {user?.fullname?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.fullname}
                    </h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {user?.profile?.bio || 'No bio added yet'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {joinDate}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    {user?.profile?.location || 'Location not added'}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Open to opportunities
                  </Badge>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <ContactSection user={user} />
              <SkillsSection skills={user?.profile?.skills} />
            </div>
            <ResumeSection resume={user?.profile?.resume} />

            {/* Premium Applied Jobs Table Section */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl my-8 p-8">
              <h1 className="font-bold text-lg my-5 text-purple-700 flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-500" />
                Applied Jobs
              </h1>
              <AppliedJobTable />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add the UpdateProfileDialog */}
      <UpdateProfileDialog 
        open={isEditDialogOpen} 
        setOpen={setIsEditDialogOpen} 
      />
    </div>
  );
};

export default UserProfile;
