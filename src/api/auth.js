// import axios from 'axios';
//
// let instance = axios.create();
import instance from './instance';

export const fetchCountries = (params) => {
    return instance.get('/api/countries', { params });
};

export const fetchCurrencies = (params) => {
    return instance.get('/api/currencies', { params });
};

export const login = ({username, password}) => {
    return instance.post('/api/authenticate', {
        username, password, rememberMe: true,
    });
};

export const currentUser = () => {
    return instance.get('/api/users/current')
};

export const forgot = (username) => {
    return instance.post('/api/users/forgot-password', {username})
};


export const register = ({ countryId, currencyId, email, firstName, lastName, password, phone, username }) => {
    return instance.post('/api/clients/register', {
        countryId,
        currencyId,
        email,
        firstName,
        lastName,
        password,
        phone,
        username
    })
};
