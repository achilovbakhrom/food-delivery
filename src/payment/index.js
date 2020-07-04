import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, TextField, Button } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: '80px',
        fontSize: '24px',
        color: 'white',
        fontWeight: 'bold'
    },
    icon: {
        color: 'white',
    },
    image: {
        width: '300px',
        height: '300px'
    },
    gridItem: {
        display: 'flex',
        flexFlow: 'row'

    }
}));

const Payment = props => {

    const classes = useStyles();

    return (
        <Grid container>
            <Grid item className={classes.title} xs={12}>
                Оформить заказ
            </Grid>

            <Grid container direction="row" style={{marginTop: 10}}>
                <Grid item xs={6} md={3}>
                    <TextField variant="outlined" fullWidth label="ФИО" />
                </Grid>
                <Grid item xs={6} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Телефон" />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20, color: 'white', fontWeight: 'bold', fontSize: 20}}>
                Адрес доставки
            </Grid>

            <Grid container style={{marginTop: 20, color: 'white', height: 50}}>
                <Button variant="contained" fullWidth style={{borderRadius: 1000}}> Показать на карте </Button>
            </Grid>
            <Grid container direction="row" style={{marginTop: 15}}>
                <Grid item xs={6} md={3}>
                    <TextField variant="outlined" fullWidth label="Улица" />
                </Grid>
                <Grid item xs={6} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Номер дома" />
                </Grid>
            </Grid>
            <Grid container direction="row" style={{marginTop: 8}}>
                <Grid item xs={4} md={3}>
                    <TextField variant="outlined" fullWidth label="Подъезд" />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Этаж" />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Квартира" />
                </Grid>
            </Grid>
        </Grid>
    )
};

export default withRouter(Payment);
