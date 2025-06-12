import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className="p-3 rounded-lg shadow-xl bg-white border border-gray-200 cursor-pointer transition-transform hover:scale-[1.02]"
        >
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
        </div>
    );
};

export default LatestJobCards;
