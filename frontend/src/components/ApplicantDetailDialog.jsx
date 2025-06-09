import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download, Mail, Phone, Calendar, Award, Briefcase, User2 } from 'lucide-react';

const ApplicantDetailDialog = ({ open, setOpen, applicant }) => {
  if (!applicant) return null;
  const application = applicant.application || applicant; // fallback if structure is flat

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-700">
            <User2 className="h-6 w-6 text-purple-500" />
            {application.fullname || application.fullName}
          </DialogTitle>
          <DialogDescription>
            <span className="flex items-center gap-2 text-gray-500">
              <Mail className="h-4 w-4" /> {application.email}
              <Phone className="h-4 w-4 ml-4" /> {application.contactNumber}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="mb-2">
              <Badge className="bg-purple-100 text-purple-700">Status: {application.status?.toUpperCase()}</Badge>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Applied On:</span> {application.createdAt?.split('T')[0]}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Job:</span> {application.job?.title}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Company:</span> {application.job?.company?.name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Location:</span> {application.currentAddress}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Date of Birth:</span> {application.dateOfBirth?.split('T')[0]}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Education:</span> {application.collegeName}, {application.degree} ({application.branch}), {application.passingYear}, CGPA: {application.cgpa}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Skills:</span> {Array.isArray(application.technicalSkills) ? application.technicalSkills.join(', ') : application.technicalSkills}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Preferred Roles:</span> {Array.isArray(application.preferredRoles) ? application.preferredRoles.join(', ') : application.preferredRoles}
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold">Internships:</span>
              <ul className="list-disc ml-5 text-sm">
                {application.internships?.length > 0 ? application.internships.map((i, idx) => (
                  <li key={idx}>{i.company} - {i.role} ({i.duration})</li>
                )) : <li>None</li>}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Work Experience:</span>
              <ul className="list-disc ml-5 text-sm">
                {application.workExperience?.length > 0 ? application.workExperience.map((w, idx) => (
                  <li key={idx}>{w.company} - {w.role} ({w.duration})</li>
                )) : <li>None</li>}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Projects:</span>
              <ul className="list-disc ml-5 text-sm">
                {application.projects?.length > 0 ? application.projects.map((p, idx) => (
                  <li key={idx}>{p.title} - {p.technologies}: {p.description}</li>
                )) : <li>None</li>}
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Cover Letter:</span>
              <div className="bg-gray-50 border rounded p-2 text-sm max-h-32 overflow-auto mt-1">
                {application.coverLetter || 'Not provided'}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Resume:</span>
              {application.resume ? (
                <Button asChild variant="outline" className="ml-2">
                  <a href={application.resume} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-1" /> Download Resume
                  </a>
                </Button>
              ) : (
                <span className="ml-2 text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantDetailDialog;
