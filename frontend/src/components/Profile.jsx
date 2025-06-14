import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import Bookmark from './Bookmark'
import { Navigate } from 'react-router-dom'
import Job from './Job'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    const navigate = useNavigate();
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [bookmarks, setBookmarks] = useState([]);  // Store bookmarked jobs

    // ✅ Fetch bookmarked jobs when Profile page loads
    useEffect(() => {
        axios.get(`${USER_API_END_POINT}/bookmark`, { withCredentials: true })
            .then((res) => {
                setBookmarks(res.data);  // Store fetched bookmarks in state
            })
            .catch((err) => {
                console.error("Bookmark Fetch Error", err);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        user?.profile?.resume ? (
                            <a
                                href={user?.profile?.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-blue-500 hover:underline cursor-pointer'>
                                {user?.profile?.resumeOriginalName}
                            </a>
                        ) : <span>NA</span>
                    }
                </div>

            </div>
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
             {/* ✅ Bookmarked Jobs Section */}
             <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <h1 className='font-bold text-lg my-5'>Saved Jobs</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                    {bookmarks.length === 0 ? <p>No Saved Jobs Yet...!</p> :
                        bookmarks.map((job) => (
                            <Job key={job._id} job={job} />
                        ))
                    }
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div >
    )
}

export default Profile