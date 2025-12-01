import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchBanners,
    fetchBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    clearCurrentBanner,
    setPage,
} from '../features/banners/bannerSlilce.js';

export const useBanners = () => {
    const dispatch = useDispatch();
    const bannersState = useSelector((state) => state.banners);

    const getBanners = useCallback((params) => {
        dispatch(fetchBanners(params));
    }, [dispatch]);

    const getBanner = useCallback((id) => {
        dispatch(fetchBannerById(id));
    }, [dispatch]);

    const addBanner = useCallback((data) => {
        return dispatch(createBanner(data));
    }, [dispatch]);

    const editBanner = useCallback((id, data) => {
        return dispatch(updateBanner({ id, data }));
    }, [dispatch]);

    const removeBanner = useCallback((id) => {
        return dispatch(deleteBanner(id));
    }, [dispatch]);

    const clearBanner = useCallback(() => {
        dispatch(clearCurrentBanner());
    }, [dispatch]);

    const changePage = useCallback((page) => {
        dispatch(setPage(page));
    }, [dispatch]);

    return {
        ...bannersState,
        getBanners,
        getBanner,
        addBanner,
        editBanner,
        removeBanner,
        clearBanner,
        changePage,
    };
};