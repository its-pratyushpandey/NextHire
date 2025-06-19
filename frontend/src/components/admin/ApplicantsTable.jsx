import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { label: 'Accept', value: 'accepted', color: 'bg-green-500' },
  { label: 'Reject', value: 'rejected', color: 'bg-red-500' }
];

const ApplicantsTable = ({ onStatusChange, onViewDetails }) => {
    const { applicants } = useSelector(store => store.application);
    const navigate = useNavigate();
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a
                                        className="text-blue-600 cursor-pointer"
                                        href={item.applicant?.profile?.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    >
                                        {item?.applicant?.profile?.resumeOriginalName || 'Resume'}
                                    </a>
                                ) : (
                                    <span>NA</span>
                                )}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${item.status === 'accepted' ? 'bg-green-500' : item.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                    {item.status?.toUpperCase()}
                                </span>
                            </TableCell>
                            <TableCell className="flex gap-2 justify-end">
                                {statusOptions.map(opt => (
                                    <Button
                                        key={opt.value}
                                        size="sm"
                                        className={`${opt.color} text-white px-3 py-1 rounded shadow hover:scale-105 transition-all`}
                                        disabled={item.status === opt.value}
                                        onClick={() => onStatusChange(item._id, opt.value)}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500 text-purple-700 hover:bg-purple-50"
                                    onClick={() => onViewDetails(item)}
                                >
                                    View Details
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded shadow hover:scale-105 transition-all"
                                    onClick={() => navigate(`/admin/nextchat?candidateId=${item.applicant._id}`)}
                                >
                                    Chat
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
export default ApplicantsTable;