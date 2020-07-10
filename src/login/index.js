import React, {useState} from "react";
import {
    Grid,
    TextField,
    Button,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormControl
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { green } from "@material-ui/core/colors";
import { Link, withRouter } from 'react-router-dom';
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {login} from "../api/auth";
import Cookie from 'js-cookie';
import { store } from 'react-notifications-component';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
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
    }
}));
const Login = props => {
    const classes = useStyles();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const isActionDisabled = () => {
        return isLoading || !username || !password || password.length < 5
    };

    return (
        <Grid
            container

            className={classes.root}
            alignItems='center'
            justify='center'
        >
            <Grid item xs={10} md={6} lg={4}>
                <TextField
                    variant="outlined"
                    label="Логин"
                    fullWidth
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <FormControl className={classes.mt20} variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
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
                        login({username, password})
                            .then(response => {
                                setIsLoading(false);
                                if (response.data["id_token"]) {
                                    Cookie.set('token', response.data["id_token"]);
                                    props.history.push('/app/address')
                                }
                            })
                            .catch(response => {
                                setIsLoading(false);
                                store.addNotification({
                                    title: "Ошибка!",
                                    message: `Неправильный логин или пароль`,
                                    type: "danger",
                                    insert: "top",
                                    container: "top-right",
                                    animationIn: ["animated", "fadeIn"],
                                    animationOut: ["animated", "fadeOut"],
                                    dismiss: {
                                        duration: 5000,
                                        onScreen: true
                                    }
                                });
                            })
                    }}
                > { isLoading ? 'Идет загрузка...' : 'Войти' } </Button>
                <div style={{marginTop: 30, color: 'white', textAlign: 'center'}}>
                    Нет аккаунта? <Link to="/register">Зарегистрируйтесь!</Link>
                </div>

                <div style={{marginTop: 10, color: 'white', textAlign: 'center'}}>
                    Забыли Пароль? <Link to="/forgot" >Восстановите аккаут!</Link>
                </div>
            </Grid>


        </Grid>
    )

};

export default withRouter(Login);
