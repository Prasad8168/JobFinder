import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { fetchApplicants } from '@/redux/applicationSlice'; // Ensure this action exists

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = ({ jobId }) => {
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    
    // Filter applicants for the specific job
    const filteredApplicants = applicants?.applications?.filter(app => app?.job?._id === jobId) || [];

    const [localApplicants, setLocalApplicants] = useState(filteredApplicants);

    useEffect(() => {
        setLocalApplicants(filteredApplicants);
    }, [applicants, jobId]); // Sync with Redux state when it updates

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });

            if (res.data.success) {
                toast.success(res.data.message);

                // Fetch updated data from the API to ensure changes reflect instantly
                dispatch(fetchApplicants());
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of applicants for this job</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localApplicants.length > 0 ? (
                        localApplicants.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                            {item?.applicant?.profile?.resumeOriginalName}
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending"}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, index) => (
                                                <div
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    key={index}
                                                    className='flex w-fit items-center my-2 cursor-pointer'
                                                >
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="7" className="text-center">No applicants found for this job.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
