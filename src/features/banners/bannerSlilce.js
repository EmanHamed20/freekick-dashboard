import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bannerService from '../../services/banners/bannerService.js';

const initialState = {
    banners: [],
    currentBanner: null,
    loading: false,
    error: null,
    totalCount: 0,
    page: 1,
    hasNext: false,
    hasPrevious: false,
};

export const fetchBanners = createAsyncThunk(
    'banners/fetchAll',
    async (params) => {
        return await bannerService.getBanners(params);
    }
);

export const fetchBannerById = createAsyncThunk(
    'banners/fetchById',
    async (id) => {
        return await bannerService.getBannerById(id);
    }
);

export const createBanner = createAsyncThunk(
    'banners/create',
    async (data) => {
        return await bannerService.createBanner(data);
    }
);

export const updateBanner = createAsyncThunk(
    'banners/update',
    async ({ id, data }) => {
        return await bannerService.updateBanner(id, data);
    }
);

export const deleteBanner = createAsyncThunk(
    'banners/delete',
    async (id) => {
        await bannerService.deleteBanner(id);
        return id;
    }
);

const bannerSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {
        clearCurrentBanner: (state) => {
            state.currentBanner = null;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload.results;
                state.totalCount = action.payload.count;
                state.hasNext = !!action.payload.next;
                state.hasPrevious = !!action.payload.previous;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch banners';
            })
            .addCase(fetchBannerById.fulfilled, (state, action) => {
                state.currentBanner = action.payload;
            })
            .addCase(createBanner.fulfilled, (state, action) => {
                state.banners.unshift(action.payload);
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                const index = state.banners.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                }
                if (state.currentBanner?.id === action.payload.id) {
                    state.currentBanner = action.payload;
                }
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter(b => b.id !== action.payload);
                if (state.currentBanner?.id === action.payload) {
                    state.currentBanner = null;
                }
            });
    },
});

export const { clearCurrentBanner, setPage } = bannerSlice.actions;
export default bannerSlice.reducer;