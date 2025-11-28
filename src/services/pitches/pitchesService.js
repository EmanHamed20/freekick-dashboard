import api from '../api.js';
import { toast } from 'react-toastify';


// services/pitches/pitchesService.js
export const pitchesService = {
    // view all pitches
    getAllPitchess: async () => {
        try {
            const response = await api.get('/venue/pitch/pitches/');
            toast.success("Pitches loaded successfully!");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to load pitches";
            toast.error(message);
            throw error;
        }
    },

    // delete pitch
    deletePitch: async (id) => {
        try {
            const response = await api.delete(`/venue/pitch/pitches/${id}/`);
            toast.success("Pitch deleted successfully!");
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete pitch";
            toast.error(message);
            throw error;
        }
    },
};