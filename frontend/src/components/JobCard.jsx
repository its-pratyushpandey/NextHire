import React, { useState } from 'react';
import ApplyJobForm from './ApplyJobForm'; // Ensure this is exactly correct

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 hover:shadow-xl transition duration-300 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">
            {job.title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {job.type}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          {job.company} — {job.location}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {job.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-purple-600 dark:text-purple-300 font-bold">
            ${job.salary}
          </span>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            onClick={() => setOpen(true)}
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {open && <ApplyJobForm jobId={job._id} onClose={() => setOpen(false)} />}
    </>
  );
};

export default JobCard;
