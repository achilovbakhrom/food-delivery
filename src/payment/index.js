import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import Cookies from "js-cookie";

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

    useEffect(() => {
        let orderString = Cookies.get('orders') || '[]';
        let orders = JSON.parse(orderString);
        setCost(orders.reduce((acc, o) => acc + parseFloat(o.count)*parseFloat(o.food.price), 0));
    }, []);


    const classes = useStyles();
    const [cost, setCost] = useState(0);
    const [value, setValue] = useState('master_card');

    const [fio, setFio] = useState();
    const [phone, setPhone] = useState();
    const [street, setStreet] = useState();
    const [houseNo, setHouseNo] = useState();
    const [door, setDoor] = useState();
    const [floor, setFloor] = useState();
    const [flatNo, setFlatNo] = useState();

    const isDisabled = () => {
        return !fio || !phone || !street || !houseNo || !door || !floor || !flatNo
    };

    return (
        <Grid container>
            <Grid item className={classes.title} xs={12}>
                Оформить заказ
            </Grid>

            <Grid container> Данные получателя </Grid>
            <Grid container direction="row" style={{marginTop: 10}}>
                <Grid item xs={6} md={4}>
                    <TextField
                        variant="outlined"
                        fullWidth label="ФИО"
                        onChange={(e) => {
                            setFio(e.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={5} style={{paddingLeft: 10}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Телефон"
                        onChange={(e) => {
                            setPhone(e.target.value)
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20, color: 'white', fontWeight: 'bold', fontSize: 20}}>
                Адрес доставки
            </Grid>

            {/*<Grid container style={{marginTop: 20, color: 'white', height: 50}}>*/}
            {/*    <Button variant="contained" fullWidth style={{borderRadius: 1000}}> Показать на карте </Button>*/}
            {/*</Grid>*/}
            <Grid container direction="row" style={{marginTop: 15}}>
                <Grid item xs={6} md={4}>
                    <TextField variant="outlined" fullWidth label="Улица"
                               onChange={(e) => {
                                   setStreet(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={6} md={5} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Номер дома"
                               onChange={(e) => {
                                   setHouseNo(e.target.value)
                               }}
                    />
                </Grid>
            </Grid>
            <Grid container direction="row" style={{marginTop: 8}}>
                <Grid item xs={4} md={3}>
                    <TextField variant="outlined" fullWidth label="Подъезд"
                               onChange={(e) => {
                                   setDoor(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Этаж"
                               onChange={(e) => {
                                   setFloor(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label="Квартира"
                               onChange={(e) => {
                                   setFlatNo(e.target.value)
                               }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={12} md={9}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Форма оплаты</FormLabel>
                        <RadioGroup value={value} onChange={(e) => { setValue(e.target.value) }}>
                            <FormControlLabel value="master_card" control={<Radio color="primary" />} label={
                                <img alt="matercard" src={require('../assets/img/mastercard.png')} width={200} height={100} style={{
                                    objectFit: 'contain'
                                }} />} />
                            <FormControlLabel value="visa" control={<Radio color="primary" />} label={
                                <img alt="visa" src={require('../assets/img/visa.png')} width={200} height={100} style={{
                                    objectFit: 'contain'
                                }}/>
                            } />
                            <FormControlLabel value="american_express" control={<Radio color="primary" />} label={
                                <img alt="american_express" src={require('../assets/img/american_express.png')} width={200} height={100} style={{
                                    objectFit: 'contain'
                                }} />
                            } />

                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={12} md={9}>
                    <Button
                        variant="contained"
                        fullWidth style={{borderRadius: 1000, color: 'white', height: 50}}
                        disabled={isDisabled()}
                    > Оформить заказ ({cost}$) </Button>
                </Grid>
            </Grid>


        </Grid>
    )
};

export default withRouter(Payment);
