import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './shared/Navbar';
import UserProfile from './profile/UserProfile';
import RecruiterProfile from './profile/RecruiterProfile';

const Profile = () => {
  const { user } = useSelector(store => store.auth);
  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      {isRecruiter ? <RecruiterProfile /> : <UserProfile />}
    </div>
  );
};

export default Profile;