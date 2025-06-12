import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";

// Async function to fetch all applicants
export const fetchApplicants = createAsyncThunk("application/fetchApplicants", async () => {
    axios.defaults.withCredentials = true;
    const res = await axios.get(`${APPLICATION_API_END_POINT}/applications`);
    return res.data.applications; // Ensure your API response has `applications`
});

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicants: null,
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchApplicants.fulfilled, (state, action) => {
            state.applicants = action.payload;
        });
    }
});

export const { setAllApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
