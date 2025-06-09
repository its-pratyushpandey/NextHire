import React, { useState } from "react";
import { parseResumeAI } from "../../services/ai/resumeParserClient";

const PremiumStudentProfile = ({ user, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    skills: user?.skills || [],
    education: user?.education || [],
    experience: user?.experience || [],
    linkedIn: user?.linkedIn || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await parseResumeAI(file);
      setProfile((prev) => ({
        ...prev,
        ...data,
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || [],
      }));
      if (onProfileUpdate) onProfileUpdate(data);
      alert("Resume parsed and profile auto-filled!");
    } catch (err) {
      alert("Failed to parse resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl shadow-2xl border-0 bg-white rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-purple-700">✨ Premium Student Profile</span>
        </div>
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-2xl mb-2">📄</span>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop your resume (PDF)
              </p>
              <p className="text-xs text-gray-500">PDF only, max 5MB</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} disabled={loading} />
          </label>
          {loading && (
            <div className="flex justify-center mt-4">
              <span className="animate-spin text-purple-600">⏳</span>
            </div>
          )}
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input className="input input-bordered w-full" value={profile.fullname} readOnly />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input className="input input-bordered w-full" value={profile.email} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input className="input input-bordered w-full" value={profile.phoneNumber} readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <ul className="list-disc ml-5 text-gray-700">
              {profile.education.map((edu, i) => <li key={i}>{edu}</li>)}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <ul className="list-disc ml-5 text-gray-700">
              {profile.experience.map((exp, i) => <li key={i}>{exp}</li>)}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <div className="flex items-center gap-2">
              <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{profile.linkedIn}</a>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea className="input input-bordered w-full" value={profile.bio} rows={3} readOnly />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PremiumStudentProfile;