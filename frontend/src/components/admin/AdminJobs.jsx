import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
import Swal from "sweetalert2";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  const handleSelectJob = (id) => {
    setSelectedJobId(id);
  };

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
          <Input
            className='w-fit'
            placeholder='Filter by name, role'
            onChange={(e) => setInput(e.target.value)}
          />
          <div className='flex gap-4'>
            <Button onClick={() => navigate('/admin/jobs/create')}>New Jobs</Button>
            <Button
              onClick={() => {
                if (!selectedJobId) {
                  Swal.fire({
                    icon: "warning",
                    title: "⚠️ Please Select a Job!",
                    text: "You must select a job before updating.",
                    confirmButtonColor: "#2563EB", // Blue Button
                    confirmButtonText: "Ok",
                  });
                } else {
                  navigate(`/admin/jobs/${selectedJobId}/update`);
                }
              }}
            >
              Update Job
            </Button>
         </div>
        </div>
        <AdminJobsTable onSelectJob={handleSelectJob} selectedJobId={selectedJobId} />
      </div>
    </div>
  );
};

export default AdminJobs;
