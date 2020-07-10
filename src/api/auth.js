// import axios from 'axios';
//
// let instance = axios.create();
import instance from './instance';

export const fetchCountries = (params) => {
    return instance.get('/countries', { params });
};

export const fetchCurrencies = (params) => {
    return instance.get('/currencies', { params });
};

export const login = ({username, password}) => {
    return instance.post('/authenticate', {
        username, password, rememberMe: true,
    });
};

export const register = ({ countryId, currencyId, email, firstName, lastName, password, phone, username }) => {
    return instance.post('/clients/register', {
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
