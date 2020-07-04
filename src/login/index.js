import React from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { green } from "@material-ui/core/colors";
import { Link, withRouter } from 'react-router-dom';

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
                    label="Телефон или E-mail"
                    fullWidth
                />
                <TextField
                    variant="outlined"
                    type="password"
                    label="Пароль"
                    fullWidth
                    className={classes.mt20}
                />
                <Button
                    variant="contained"
                    fullWidth
                    className={classes.button}
                    onClick={() => { props.history.push('/app/address') }}
                > Войти </Button>
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
