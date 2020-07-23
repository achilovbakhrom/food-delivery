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
import {currentUser, forgot, login} from "../api/auth";
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
const Forgot = props => {
    const classes = useStyles();

    const [username, setUsername] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const isActionDisabled = () => {
        return isLoading || !username
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
                    label={props.t("auth.enter_email")}
                    fullWidth
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setSuccess(false);
                        setError(false);
                    }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    className={classes.button}
                    disabled={isActionDisabled()}
                    onClick={() => {
                        setIsLoading(true);
                        forgot(username)
                            .then(response => {
                                setIsLoading(false);
                                setSuccess(true);
                                setError(false);
                            })
                            .catch(e => {
                                setIsLoading(false);
                                setSuccess(false);
                                setError(true);
                            })
                    }}
                > {props.t("auth.send")} </Button>
                { success ? (
                    <div style={{marginTop: 10, color: 'green'}}> { props.t("auth.sent_success") }  </div>
                ) : undefined}
                { error ? (
                    <div style={{marginTop: 10, color: 'red'}}> { props.t("auth.wrong_email") }  </div>
                ) : undefined}
                <div style={{marginTop: 30, color: 'white', textAlign: 'center'}}>
                    {props.t("auth.have_account")} <Link to="/login">{props.t("auth.login")}</Link>
                </div>
            </Grid>


        </Grid>
    )

};

export default withRouter(withTranslation()(Forgot));
