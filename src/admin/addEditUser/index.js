import React, { useEffect, useState } from "react";
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    FormControl,
    OutlinedInput, InputAdornment, IconButton
} from '@material-ui/core';

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Alert from '@material-ui/lab/Alert';
import {
    createUser,
    fetchUserById,
    updateUser
} from "../../api/admin";
import {Visibility, VisibilityOff} from "@material-ui/icons";
const queryString = require('query-string');



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddEditUser = props => {

    const [current, setCurrent] = useState({address: {}});

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        // let restaurant = localStorage.getItem('restaurant');
        let parsed = queryString.parse(props.history.location.search);
        if (parsed['user_id'] !== undefined) {
            setIsLoading(true);
            fetchUserById(parsed['user_id'])
                .then(response => {
                    setIsLoading(false);
                    setCurrent(response.data);
                })
        }
    }, []);



    return (
        <Paper style={{width: '100%', padding: 20, color: '#555', marginTop: 50}}>
            <Grid container>
                <Typography variant="h5" color="primary">Добавить/Редактировать Пользователя</Typography>
            </Grid>

            {error && <Alert severity="error" style={{marginTop: 20}}>{error.title}</Alert>}

            <Grid container style={{marginTop: 20}}>
                <Grid item xs={6}>
                    <TextField
                        placeholder="Имя"
                        variant="outlined"
                        fullWidth
                        value={current.firstName}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                firstName: e.target.value
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={6} style={{paddingLeft: 10}}>
                    <TextField
                        placeholder="Фамилия"
                        variant="outlined"
                        fullWidth
                        value={current.lastName}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                lastName: e.target.value
                            })
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={6}>
                    <TextField
                        placeholder="Телефон"
                        variant="outlined"
                        fullWidth
                        value={current.phone}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                phone: e.target.value
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={6} style={{paddingLeft: 10}}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="role-id">Роль</InputLabel>
                        <Select
                            labelId="mutiple-chip-roles"
                            id="mutiple-roles"
                            variant="outlined"
                            value={current.role}
                            onChange={(e) => {
                                setCurrent({...current, role: e.target.value});
                            }}
                            MenuProps={MenuProps}
                            style={{padding: 0}}
                        >
                            {[
                                {id: "USER", name: "Пользователь"},
                                {id: "ADMIN", name: "Админ"},
                                {id: "SUPERVISOR", name: "Супервайзер"},
                                {id: "DRIVER", name: "Водитель"},
                                {id: "CLIENT", name: "Клиент"},
                                {id: "RECEIVER", name: "Получатель"}
                            ].map((cat) => (
                                <MenuItem key={cat.name} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>

            <Grid container style={{marginTop: 20}}>
                <Grid item xs={6}>
                    <TextField
                        placeholder="Логни"
                        variant="outlined"
                        fullWidth
                        value={current.username}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                username: e.target.value
                            })
                        }}
                    />
                </Grid>

                <Grid item xs={6} style={{paddingLeft: 10}}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={current.password}
                            fullWidth
                            onChange={(e) => { setCurrent({...current, password: e.target.value}) }}
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
                </Grid>

            </Grid>

            <Grid container style={{marginTop: 30}} justify="flex-end">
                <Button
                    variant="contained"
                    disabled={
                        isLoading ||
                        !current.firstName ||
                        !current.lastName ||
                        !current.phone ||
                        !current.role ||
                            !current.username ||
                            !current.password
                    }
                    onClick={() => {
                        let parsed = queryString.parse(props.history.location.search);
                        setIsLoading(true);
                        if (parsed['user_id']) {
                            updateUser({...current})
                                .then(response => {
                                    setIsLoading(false);
                                    props.history.goBack();
                                })
                        } else {
                            createUser({...current})
                                .then(response => {
                                    setIsLoading(false);
                                    setError(null);
                                    props.history.goBack();
                                })
                                .catch((error) => {
                                    setIsLoading(false);
                                    setError(error.response.data);
                                })
                        }

                    }}
                >
                    Сохранить
                </Button>
            </Grid>
        </Paper>

    )
};

export default withRouter(AddEditUser);
