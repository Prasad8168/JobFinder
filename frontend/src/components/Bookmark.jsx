import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import Job from './Job'
import Navbar from './shared/Navbar'

const Bookmark = () => {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        axios.get(`${USER_API_END_POINT}/bookmark`, { withCredentials: true })
            .then((res) => {
                setBookmarks(res.data);
            })
            .catch((err) => {
                console.log("Bookmark Fetch Error", err);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <h1 className='text-xl font-bold text-center my-5'>Bookmarked Jobs</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {bookmarks.length === 0 ? <p>No Bookmarked Jobs</p> :
                    bookmarks.map((job) => (
                        <Job key={job._id} job={job} />
                    ))
                }
            </div>
        </div>
    )
}

export default Bookmark;
