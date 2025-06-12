import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        axios
            .get(`${USER_API_END_POINT}/bookmark`, { withCredentials: true })
            .then((res) => {
                const bookmarkedJobs = res.data.map((job) => job._id);
                setIsBookmarked(bookmarkedJobs.includes(job?._id));
            })
            .catch((err) => console.error("Bookmark Fetch Error: ", err));
    }, [job?._id]);

    const handleBookmark = async () => {
        try {
            if (isBookmarked) {
                await axios.delete(`${USER_API_END_POINT}/bookmark/${job._id}`, { withCredentials: true });
                toast.success("Job Removed from Saved Jobs");
            } else {
                await axios.post(`${USER_API_END_POINT}/bookmark/${job._id}`, {}, { withCredentials: true });
                toast.success("Job Saved");
            }
            setIsBookmarked(!isBookmarked);
        } catch (err) {
            console.error("Bookmark Error: ", err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-[350px] w-full p-4 rounded-lg shadow-lg bg-white border border-gray-200 transition-transform hover:scale-[1.02]">
            {/* Header: Date & Bookmark Button */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Unknown Date"}
                </p>
                <Button
                    onClick={handleBookmark}
                    variant="outline"
                    className={`rounded-full transition-all duration-300 ${
                        isBookmarked ? "bg-[#7209b7] text-white" : "hover:bg-gray-100"
                    }`}
                    size="icon"
                >
                    <Bookmark fill={isBookmarked ? "#fff" : "none"} />
                </Button>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-12 h-12 border">
                    <AvatarImage src={job?.company?.logo || "/default-logo.png"} alt="Company Logo" />
                </Avatar>
                <div>
                    <h1 className="font-semibold text-lg">{job?.company?.name || "Unknown Company"}</h1>
                    <p className="text-sm text-gray-600">{job?.company?.location || "Unknown Location"}</p>
                </div>
            </div>

            {/* Job Title & Description */}
            <div className="mb-2">
                <h1 className="font-bold text-lg">{job?.title || "Job Title"}</h1>
                <p className="text-sm text-gray-600 line-clamp-2">{job?.description || "No description available"}</p>
            </div>

            {/* Job Details Badges */}
            <div className="flex flex-wrap gap-2">
                <Badge className="text-blue-700 font-bold" variant="ghost">
                    {job?.position} Positions
                </Badge>
                <Badge className="text-[#F83002] font-bold" variant="ghost">
                    {job?.jobType}
                </Badge>
                <Badge className="text-[#7209b7] font-bold" variant="ghost">
                    {job?.salary} LPA
                </Badge>
            </div>

            {/* Action Button */}
            <div className="mt-4">
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    variant="outline"
                    className="bg-[#7209b7] text-white w-full hover:bg-[#5c0895] transition-all duration-300"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
};

export default Job;
