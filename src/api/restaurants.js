import instance from './instance';

export const fetchRestaurantsByRegions = () => {
    return instance.get('/restaurants/by-regions');
};

export const fetchDistrictsByRegionId = (regionId) => {
    return instance.get(`/districts/${regionId}`)
};

export const fetchRestaurants = (filter) => {
    return instance.get('/restaurants', { params: filter })
};

export const fetchCategories = (filter) => {
    return instance.get('/categories', { params: filter })
};

export const fetchFoods = (filter) => {
    return instance.get('/foods', { params: filter })
};
