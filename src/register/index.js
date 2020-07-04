import React, { useState } from "react";
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { green } from "@material-ui/core/colors";
import { Link } from 'react-router-dom';

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
    },
    phone: {
        marginTop: '30px'
    }
}));

const Register = () => {

    const [phonePrefix, setPhonePrefix] = useState(0);

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
                    label="Имя"
                    fullWidth
                />
                <TextField
                    variant="outlined"

                    label="Фамилия"
                    fullWidth
                    className={classes.mt20}
                />

                <Grid container className={classes.phone} direction="row">
                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">Phone</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={phonePrefix}
                                onChange={(e) => { setPhonePrefix(e.target.value) }}
                                label="Age"
                            >
                                <MenuItem value={0}>+1</MenuItem>
                                <MenuItem value={1}>+998</MenuItem>
                                <MenuItem value={2}>+850</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={9} style={{paddingLeft: 10}}>
                        <TextField
                            placeholder="Phone Number"
                            variant="outlined"
                            fullWidth
                        />
                    </Grid>
                </Grid>

                <Grid container className={classes.phone} direction="row">
                    <TextField
                        placeholder="E-mail"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>

                <Button
                    variant="contained"
                    fullWidth
                    className={classes.button}
                > Регистрация </Button>

                <div style={{marginTop: 30, color: 'white', textAlign: 'center'}}>
                    Есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </Grid>
        </Grid>
    )

};

export default Register;
