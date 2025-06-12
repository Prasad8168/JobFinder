import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector, useDispatch } from 'react-redux'; // ✅ Ye import zaroori hai
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { setSingleJob } from '@/redux/jobSlice';

const AdminJobUpdate = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: ''
    });

    const { companies } = useSelector(store => store.company);
    const { singleJob } = useSelector(state => state.job); // ✅ Yeh line idhar paste kar

    const dispatch = useDispatch(); // Yeh zaroori hai bhai
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => {
        if (jobId) {
            const fetchJob = async () => {
                try {
                    const { data } = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                    if (data.success) {
                        dispatch(setSingleJob(data.job)); // ✅ Redux mein job set hoga
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to fetch job details');
                }
            };
            fetchJob();
        }
    }, [jobId, dispatch]);

    // ✅ Yeh useEffect input ko pre-filled karne ke liye
    useEffect(() => {
        if (singleJob) {
            setInput({
                title: singleJob.title,
                description: singleJob.description,
                requirements: singleJob.requirements,
                salary: singleJob.salary,
                location: singleJob.location,
                jobType: singleJob.jobType,
                experience: singleJob.experienceLevel,
                position: singleJob.position,
                companyId: singleJob.company?._id,
            });
        }
    }, [singleJob]);

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.name === 'position' ? Number(e.target.value) : e.target.value
        });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.title || !input.companyId) {
            toast.error("Selecting a Company is mandatory.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (data.success) {
                toast.success("Job Updated Successfully.");
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update job.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-10'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-6'>
                        {Object.keys(input).map((key) =>
                            key !== 'companyId' && (
                                <div key={key}>
                                    <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                                    <Input
                                        type={key === 'position' ? 'number' : 'text'}
                                        name={key}
                                        value={input[key]}
                                        onChange={changeEventHandler}
                                        placeholder={`Enter ${key}`}
                                        className='focus-visible:ring-0 my-1'
                                    />
                                </div>
                            )
                        )}

                        {companies?.length > 0 && (
                            <div className="col-span-2">
                                <Label>Select Company</Label>
                                <Select onValueChange={selectChangeHandler} value={input.companyId}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a Company' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <Button type='submit' className='w-full my-6' disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
                            </>
                        ) : (
                            'Update Job'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminJobUpdate;
