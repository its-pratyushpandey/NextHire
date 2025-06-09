import PremiumStudentProfile from "../components/profile/PremiumStudentProfile";
import { useSelector } from "react-redux";

export default function StudentProfilePage() {
  const user = useSelector(state => state.auth.user);
  return <PremiumStudentProfile user={user} />;
}

{application.coverLetter && (
  <div className="mt-6 bg-white rounded-lg p-4 shadow border border-purple-100">
    <h3 className="font-semibold mb-2 text-purple-700">Your Cover Letter:</h3>
    <pre className="whitespace-pre-wrap text-gray-700">{application.coverLetter}</pre>
  </div>
)}