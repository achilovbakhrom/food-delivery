import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { green } from "@material-ui/core/colors";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import {fetchCountries, fetchCurrencies, login, register} from "../api/auth";
import Cookie from 'js-cookie';
import { store } from 'react-notifications-component';
import { withTranslation } from "react-i18next";
import { withRouter } from 'react-router-dom';
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import i18n from "../i18";
import Alert from "@material-ui/lab/Alert/Alert";

const useStyles = makeStyles(() => ({
    root: {
        height: '100vh',
        overflow: 'auto',
        zIndex: 1000
    },
    mt20: {
        marginTop: '20px'
    },
    button: {
        marginTop: '50px',
        height: '50px',
        '&:hover': {
            backgroundColor: green.A700
        }
    },
    phone: {
        marginTop: '30px'
    }
}));

const Register = (props) => {

    const [phonePrefix, setPhonePrefix] = useState(0);
    const [countryId, setCountryId] = useState();
    const [countryList, setCountryList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [currencyId, setCurrencyId] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [language, setLanguage] = useState();

    const [error, setError] = useState(null);

    useEffect(() => {

        setIsLoading(true);

        login({username: 'admin', password: 'admin'})
            .then(response => {
                let token = response.data["id_token"];
                Cookie.set('token', token);
                setIsLoading(false);
                fetchCountries({page: 0, size: 10000})
                    .then(response => {
                        setCountryList(response.data);
                    });
                fetchCurrencies({page: 0, size: 10000})
                    .then(response => {
                        setCurrencyList(response.data)
                    });

            })


    }, []);

    const classes = useStyles();

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const isActionDisabled = () => {
        return isLoading || !firstName || !lastName || !email || !validateEmail(email) || !phonePrefix || !currencyId || !username || !password || password.length <= 5
    };

    return (
        <Grid
            container
            className={classes.root}
            alignItems='center'
            justify='center'
        >
            <Grid item xs={10} md={6} lg={4}>
                {error && <Alert severity="error" style={{marginBottom: 20}}>{error.title}</Alert>}
                <TextField
                    variant="outlined"
                    label={props.t('register.firstName')}
                    fullWidth
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value) }}
                />
                <TextField
                    variant="outlined"
                    label={props.t('register.lastName')}
                    fullWidth
                    value={lastName}
                    className={classes.mt20}
                    onChange={(e) => { setLastName(e.target.value) }}
                />
                <TextField
                    placeholder="E-mail"
                    variant="outlined"
                    fullWidth
                    value={email}
                    className={classes.mt20}
                    onChange={(e) => { setEmail(e.target.value) }}
                />

                <Grid container className={classes.phone} direction="row">
                    <Grid item xs={4}>

                        <Autocomplete
                            id="combo-box-demo"
                            options={countryList.map(c => ({
                                title: `+${c.telCode} (${c.code})`,
                                value: c.id
                            }))}
                            getOptionLabel={(option) => option.title}
                            onChange={(event, newInputValue) => {
                                let f = countryList.find(c => c.id === newInputValue.value);
                                setCountryId(newInputValue.value);
                                setPhonePrefix(f.telCode);
                            }}
                            fullWidth
                            renderInput={(params) => <TextField
                                {...params}
                                label={props.t('register.code')}
                                variant="outlined"

                            />}
                        />
                    </Grid>
                    <Grid item xs={8} style={{paddingLeft: 10}}>
                        <TextField
                            placeholder="Phone Number"
                            variant="outlined"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => {
                                let value = e.target.value;
                                let pn = isNaN(value) ? "" : value;
                                setPhoneNumber(pn);
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container className={classes.mt20} direction="row">
                    <Autocomplete
                        id="combo-box-currency"
                        options={currencyList.map(c => ({
                            title: `${c.symbol} (${c.code}, ${c.name})`,
                            value: c.id
                        }))}
                        getOptionLabel={(option) => option.title}
                        onChange={(event, newInputValue) => {
                            setCurrencyId(newInputValue.value);
                        }}
                        fullWidth
                        renderInput={(params) => <TextField
                            {...params}
                            label={props.t('register.currency')}
                            variant="outlined"

                        />}
                    />
                </Grid>
                <Grid item xs={12} className={classes.mt20} >
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                        <InputLabel id="language">{props.t('register.language')}</InputLabel>
                        <Select
                            id="language"
                            labelId="language-label"
                            variant="outlined"
                            value={language}
                            fullWidth
                            labelWidth={70}
                            onChange={(e) => {
                                setLanguage(e.target.value);
                                Cookie.set('language', 'uz');
                                i18n.changeLanguage(e.target.value).then();
                            }}
                        >
                            {
                                [{id: 'en', name: 'English'}, {id: 'uz', name: "O'zbek"}, {id: 'ru', name: 'Русский'}].map((d) => (
                                    <MenuItem value={d.id} key={d.id}>{d.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                </Grid>

                <TextField
                    placeholder={props.t('auth.login')}
                    variant="outlined"
                    fullWidth
                    className={classes.mt20}
                    onChange={(event) => { setUsername(event.target.value) }}
                />

                <FormControl className={classes.mt20} variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">{props.t('register.password')}</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        fullWidth
                        onChange={(e) => { setPassword(e.target.value) }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        setShowPassword(!showPassword)
                                    }}
                                    onMouseDown={(event) => {event.preventDefault();}}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        labelWidth={70}
                    />
                </FormControl>


                <Button
                    variant="contained"
                    fullWidth
                    className={classes.button}
                    disabled={isActionDisabled()}
                    onClick={() => {
                        setIsLoading(true);
                        register({
                            countryId,
                            currencyId,
                            email,
                            firstName,
                            lastName,
                            password,
                            phone: `${phonePrefix}${phoneNumber}`,
                            username
                        })
                            .then(response => {
                                setIsLoading(false);
                                setError(null);
                                login({username: response.data.username, password: response.data.password}).then(response2 => {
                                    if (response2.data["id_token"]) {
                                        Cookie.set('token', response2.data["id_token"]);
                                        window.location = "/app/restaurants"
                                    }
                                })
                            })
                            .catch(error => {
                                setIsLoading(false);
                                setError(error.response.data);
                            })
                    }}
                > {isLoading ? `${props.t('auth.loading')}...` : props.t('auth.register')} </Button>

                <div style={{marginTop: 30, color: 'white', textAlign: 'center'}}>
                    {props.t('register.have_account')} <Link to="/login">{props.t('auth.login')}</Link>
                </div>
            </Grid>
        </Grid>
    )

};

export default withRouter(withTranslation()(Register));