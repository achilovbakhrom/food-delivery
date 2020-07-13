import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import Cookies from "js-cookie";
import {withTranslation} from "react-i18next";
import {order} from "../api/restaurants";
import {fetchDistricts, fetchRegions} from "../api/admin";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
        console.log(orders);
        setCost(orders.reduce((acc, o) => acc + parseFloat(o.count)*parseFloat(o.food.price), 0));

        fetchRegions()
            .then(response => {
                setRegionList(response.data)
            })


    }, []);

    const classes = useStyles();
    const [cost, setCost] = useState(0);
    const [value, setValue] = useState('MASTERCARD');
    const [fio, setFio] = useState();
    const [phone, setPhone] = useState();
    const [street, setStreet] = useState();
    const [houseNo, setHouseNo] = useState();
    const [door, setDoor] = useState();
    const [floor, setFloor] = useState();
    const [flatNo, setFlatNo] = useState();
    const [regionList, setRegionList] = useState([]);
    const [regionId, setRegionId] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [districtId, setDistrictId] = useState('');
    const [cardNumber, setCardNumber] = useState();
    const [expiryDate, setExpiryDate] = useState();

    const isDisabled = () => {
        return !fio || !phone || !street || !houseNo || !door || !floor || !flatNo ||
            regionId === undefined || districtId === undefined || !cardNumber || !expiryDate
    };

    return (
        <Grid container>
            <Grid item className={classes.title} xs={12}>
                {props.t('payment.order')}
            </Grid>

            <Grid container> {props.t('payment.recipient_data')} </Grid>
            <Grid container direction="row" style={{marginTop: 10}}>
                <Grid item xs={6} md={4}>
                    <TextField
                        variant="outlined"
                        fullWidth label={props.t('payment.name')}
                        onChange={(e) => {
                            setFio(e.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={6} md={5} style={{paddingLeft: 10}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        label={props.t('payment.phone')}
                        onChange={(e) => {
                            setPhone(e.target.value)
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20, color: 'white', fontWeight: 'bold', fontSize: 20}}>
                {props.t('payment.delivery_address')}
            </Grid>

            {/*<Grid container style={{marginTop: 20, color: 'white', height: 50}}>*/}
            {/*    <Button variant="contained" fullWidth style={{borderRadius: 1000}}> Показать на карте </Button>*/}
            {/*</Grid>*/}

            <Grid container style={{marginTop: 20}}>
                <Grid item xs={6} md={4}>
                    <Select
                        id="region"
                        labelId="region-label"
                        labelWidth={80}
                        variant="outlined"
                        value={regionList ? regionId : ''}
                        fullWidth
                        label={props.t('payment.region')}
                        onChange={(e) => {
                            setRegionId(e.target.value);
                            setDistrictList([]);
                            fetchDistricts(e.target.value)
                                .then(response => {
                                    setDistrictList(response.data);
                                })
                        }}
                    >
                        {
                            regionList.map((r) => (
                                <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
                <Grid item xs={6} md={5} style={{paddingLeft: 10}}>
                    <Select
                        id="district"
                        labelId="district-label"
                        variant="outlined"
                        value={districtList.length ? districtId : ''}
                        labelWidth={80}
                        fullWidth
                        label={props.t('payment.district')}
                        onChange={(e) => {
                            setDistrictId(e.target.value);
                        }}
                    >
                        {
                            districtList.map((d) => (
                                <MenuItem value={d.id} key={d.id}>{d.name}</MenuItem>
                            ))
                        }
                    </Select>
                </Grid>
            </Grid>
            <Grid container direction="row" style={{marginTop: 15}}>
                <Grid item xs={6} md={4}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.street')}
                               onChange={(e) => {
                                   setStreet(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={6} md={5} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.house')}
                               onChange={(e) => {
                                   setHouseNo(e.target.value)
                               }}
                    />
                </Grid>
            </Grid>
            <Grid container direction="row" style={{marginTop: 8}}>
                <Grid item xs={4} md={3}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.porch')}
                               onChange={(e) => {
                                   setDoor(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.floor')}
                               onChange={(e) => {
                                   setFloor(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.flat')}
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
                            <FormControlLabel value="MASTERCARD" control={<Radio color="primary" />} label={
                                <img alt="matercard" src={require('../assets/img/mastercard.png')} width={200} height={100} style={{
                                    objectFit: 'contain'
                                }} />} />
                            <FormControlLabel value="VISA" control={<Radio color="primary" />} label={
                                <img alt="visa" src={require('../assets/img/visa.png')} width={200} height={100} style={{
                                    objectFit: 'contain'
                                }}/>
                            } />
                            <FormControlLabel value="AMERICAN_EXPRESS" control={<Radio color="primary" />} label={
                                <img alt="american_express" src={require('../assets/img/american_express.png')} width={200} height={100} style={{
                                    objectFit: 'contain'
                                }} />
                            } />

                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container direction="row" style={{marginTop: 8}}>
                <Grid item xs={4} md={6}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.cardNo')}
                               onChange={(e) => {
                                   setCardNumber(e.target.value)
                               }}
                    />
                </Grid>
                <Grid item xs={4} md={3} style={{paddingLeft: 10}}>
                    <TextField variant="outlined" fullWidth label={props.t('payment.expiry')}
                               onChange={(e) => {
                                   setExpiryDate(e.target.value)
                               }}
                    />
                </Grid>

            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={12} md={9}>
                    <Button
                        variant="contained"
                        fullWidth style={{borderRadius: 1000, color: 'white', height: 50}}
                        disabled={isDisabled()}
                        onClick={() => {
                            let orderString = Cookies.get('orders') || '[]';
                            let orders = JSON.parse(orderString);
                            order({
                                card: {
                                    cardNumber: cardNumber,
                                    cardType: value,
                                    expiryDate: expiryDate

                                },
                                items: orders.map(o => ({ id: o.food.id, price: o.food.price, count: o.count })),
                                receiver: {
                                    address: {
                                        apartment: flatNo,
                                        districtId: districtId,
                                        floor: floor,
                                        house: houseNo,
                                        porch: door,
                                        regionId: regionId,
                                        street: street
                                    },
                                    firstName: fio,
                                    lastName: fio,
                                    phone: phone
                                },
                                "restaurantId": Cookies.get('restaurantId') ? parseInt(Cookies.get('restaurantId')) : 0
                            }).then(response => {
                                Cookies.remove('orders');
                                Cookies.remove('restaurantId');
                                props.history.push('/app/history')
                            }).catch(error => {
                                alert(error);
                            })
                        }}
                    > {props.t('payment.purchase_order')} ({cost}$) </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(Payment));
