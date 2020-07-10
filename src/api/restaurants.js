import instance from './instance';

export const fetchRestaurantsByRegions = () => {
    return instance.get('/api/restaurants/by-regions');
};

export const fetchDistrictsByRegionId = (regionId) => {
    return instance.get(`/api/restaurants/by-districts/${regionId}`)
};

export const fetchRestaurants = (filter) => {
    return instance.get('/api/restaurants', { params: filter })
};

export const fetchCategories = (filter) => {
    return instance.get('/api/categories', { params: filter })
};

export const fetchFoods = (filter) => {
    return instance.get('/api/foods', { params: filter })
};
