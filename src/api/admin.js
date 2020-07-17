import instance from './instance';

export const fetchRestaurants = (filter) => {
    return instance.get('/api/admin/restaurants', { params: filter });
};

export const fetchRegions = () => {
    return instance.get('/api/regions');
};

export const fetchDistricts = (regionId) => {
    return instance.get(`/api/districts/${regionId}`);
};

export const createRestaurant = (restaurant) => {
    return instance.post(`/api/admin/restaurants`, restaurant);
};

export const fetchRestaurantById = (id) => {
    return instance.get(`/api/admin/restaurants/${id}`);
};


export const updateRestaurant = (restaurant) => {
    return instance.put(`/api/admin/restaurants`, restaurant);
};

export const uploadPhotoRestaurant = (id, photo) => {
    let formData = new FormData();
    formData.append('file', photo);
    return instance.post(`/api/admin/restaurants/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const deleteRestaurant = (id) => {
    return instance.delete(`/api/admin/restaurants/${id}`)
};

export const fetchFoods = (filter) => {
    return instance.get('/api/admin/foods', { params: filter })
};

export const createFood = (food) => {
    return instance.post('/api/admin/foods', food);
};

export const updateFood = (food) => {
    return instance.put('/api/admin/foods', food);
};

export const fetchFoodById = (id) => {
    return instance.get(`/api/admin/foods/${id}`);
};

export const deleteFood = (id) => {
    return instance.delete(`/api/admin/foods/${id}`);
};

export const uploadPhotoFood = (id, photo) => {
    let formData = new FormData();
    formData.append('file', photo);
    return instance.post(`/api/admin/foods/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const fetchRestaurantFoods = (filter) => {
    return instance.get('/api/admin/restaurant/foods', { params: filter })
};

export const fetchRestaurantFoodsById = (id) => {
    return instance.get(`/api/admin/restaurant/foods/${id}`)
};

export const createRestaurantFoods = (food) => {
    return instance.post('/api/admin/restaurant/foods', food)
};

export const updateRestaurantFoods = (food) => {
    return instance.put('/api/admin/restaurant/foods', food)
};

export const deleteRestaurantFoodsById = (id) => {
    return instance.delete(`/api/admin/restaurant/foods/${id}`)
};


export const fetchCategories = (filter) => {
    return instance.get('/api/admin/categories', { params: filter })
};

export const createCategory = (food) => {
    return instance.post('/api/admin/categories', food);
};

export const updateCategory = (category) => {
    return instance.put('/api/admin/categories', category);
};

export const fetchCategoryById = (id) => {
    return instance.get(`/api/admin/categories/${id}`);
};

export const deleteCategory = (id) => {
    return instance.delete(`/api/admin/categories/${id}`);
};

export const uploadPhotoCategory = (id, photo) => {
    let formData = new FormData();
    formData.append('file', photo);
    return instance.post(`/api/admin/categories/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

export const fetchUsers = (filter) => {
    return instance.get('/api/users/list', { params: filter })
};

export const createUser = (user) => {
    return instance.post('/api/users/create', user);
};

export const updateUser = (user) => {
    return instance.put('/api/users/update', user);
};

export const fetchUserById = (id) => {
    return instance.get(`/api/admin/users/${id}`);
};

export const deleteUser = (id) => {
    return instance.delete(`/api/users/${id}`);
};
