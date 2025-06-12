import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const AdminJobsTable = ({ onSelectJob, selectedJobId }) => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = allAdminJobs.filter((job) =>
      job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
      job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
    );
    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  const deleteJob = async (jobId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this job!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
            withCredentials: true,
          });

          if (data.success) {
            toast.success('Job Deleted Successfully');
            onSelectJob("");
            setFilterJobs(filterJobs.filter((job) => job._id !== jobId));
          } else {
            toast.error('Failed to delete job');
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to delete job');
        }
      }
    });
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.map((job) => (
            <TableRow
              key={job._id}
              onClick={() => onSelectJob(job._id)}
              className={`${selectedJobId === job._id ? "bg-blue-100" : ""} cursor-pointer`}
            >
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center w-fit gap-2 cursor-pointer">
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                    <div onClick={() => deleteJob(job._id)} className="flex items-center w-fit gap-2 cursor-pointer text-red-500 mt-2">
                      <Trash2 className="w-4" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;