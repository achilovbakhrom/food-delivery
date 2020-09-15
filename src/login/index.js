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
import { red } from "@material-ui/core/colors";
import { Link, withRouter } from 'react-router-dom';
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {currentUser, login} from "../api/auth";
import Cookie from 'js-cookie';
import { store } from 'react-notifications-component';
import {withTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        padding: '30px 0',
        zIndex: 1000
    },
    mt20: {
        marginTop: '20px'
    },
    button: {
        marginTop: '50px',
        height: '50px',
        '&:hover': {
            backgroundColor: red.A700
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
                    label={props.t("auth.login")}
                    fullWidth
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <FormControl className={classes.mt20} variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">{props.t("auth.password")}</InputLabel>
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

                                if (response.data["id_token"]) {
                                    Cookie.set('token', response.data["id_token"]);
                                    currentUser()
                                        .then(response => {
                                            console.log('current user', response.data)
                                            if (response.data.roles.indexOf('ADMIN') >= 0) {
                                                props.history.push('/admin/restaurants')
                                            } else if (response.data.roles.indexOf('DRIVER') >= 0 || response.data.roles.indexOf('SUPERVISOR') >= 0) {
                                                props.history.push('/admin/history')

                                            } else {
                                                let orderString = Cookie.get('orders') || '[]';
                                                let orders = JSON.parse(orderString);
                                                if (orders && orders.length) {
                                                    props.history.push('/app/basket')
                                                } else {
                                                    props.history.push('/app/restaurants')
                                                }
                                            }
                                        })
                                        .catch(e => {
                                            setIsLoading(false);
                                            store.addNotification({
                                                title: "Ошибка!",
                                                message: e,
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
                                        });
                                }
                            })
                            .catch(response => {
                                setIsLoading(false);
                                store.addNotification({
                                    title: props.t("auth.error"),
                                    message: props.t("auth.invalid_credentials"),
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
                > { isLoading ? `${props.t("auth.register")}...` : props.t("auth.enter") } </Button>
                <div style={{marginTop: 30, color: 'white', textAlign: 'center'}}>
                    {props.t("auth.no_account")} <Link to="/register">{props.t("auth.register")}</Link>
                </div>
                <div style={{marginTop: 10, color: 'white', textAlign: 'center'}}>
                    {props.t("auth.forgot")} <Link to="/forgot" >{props.t("auth.restore")}</Link>
                </div>
            </Grid>


        </Grid>
    )

};

export default withRouter(withTranslation()(Login));
