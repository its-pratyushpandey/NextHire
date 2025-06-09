import RealTimeChat from '@/components/chat/RealTimeChat';

const ApplicationDetail = ({ application, user }) => (
  <div>
    {/* ...other application details... */}
    <RealTimeChat
      candidateId={application.applicant}
      recruiterId={application.recruiter}
      userId={user._id}
      userRole={user.role}
    />
  </div>
);