import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

const statusStyles = {
    accepted: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
    rejected: 'bg-gradient-to-r from-red-400 to-red-600 text-white',
    pending: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
    under_review: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
}

const statusIcons = {
    accepted: <CheckCircle2 className="h-4 w-4 mr-1 text-white" />,
    rejected: <XCircle className="h-4 w-4 mr-1 text-white" />,
    pending: <Clock className="h-4 w-4 mr-1 text-white" />,
    under_review: <Clock className="h-4 w-4 mr-1 text-white animate-spin" />,
}

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                You haven't applied to any jobs yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        allAppliedJobs?.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className="hover:bg-purple-50/40 transition-all">
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="font-semibold text-purple-700">{appliedJob.job?.title}</TableCell>
                                <TableCell className="font-medium text-gray-700">{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge 
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full shadow-md text-sm font-bold border-0 ${statusStyles[appliedJob?.status] || statusStyles['pending']}`}
                                                >
                                                    {statusIcons[appliedJob?.status] || statusIcons['pending']}
                                                    {appliedJob.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {appliedJob.status === 'accepted' && 'Congratulations! Your application was accepted.'}
                                                {appliedJob.status === 'rejected' && 'Unfortunately, your application was rejected.'}
                                                {appliedJob.status === 'pending' && 'Your application is pending review.'}
                                                {appliedJob.status === 'under_review' && 'Your application is under review.'}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable