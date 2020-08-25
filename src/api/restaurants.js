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

export const fetchRestaurantCategories = filter => {
    return instance.get('/api/restaurant/categories', { params: filter })
};

export const fetchFoods = (filter) => {
    return instance.get('/api/foods', { params: filter })
};

export const fetchRestaurantFoods = (filter) => {
    return instance.get('/api/restaurant/foods', { params: filter })
};

export const order = (order) => {
    return instance.post('/api/admin/orders', order);
};

export const stripePayment = (data) => {
    return instance.post('/api/stripe/payment', data);
};

export const fetchMyOrders = (filter) => {
    return instance.get('/api/orders', {params: filter});
};

export const fetchOrderById = (id) => {
    return instance.get(`/api/orders/${id}`);
};

export const fetchTimeSlots = (params) => {
    return instance.get("/api/timeslots", { params });
};