import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    InputLabel
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import Cookies from "js-cookie";
import {withTranslation} from "react-i18next";
import {order} from "../api/restaurants";
import {fetchDistricts, fetchRegions} from "../api/admin";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CreditCardInput from 'react-credit-card-input';
import { dispatch } from 'use-bus'
import i18n from "../i18";
import { LongLatMap } from "../long-lat-map";
import UpdateUserModal from "../update-user-modal";

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

    const [cvc, setCvc] = useState('');
    const [expiry, setExpiry] = useState('');
    const [number, setNumber] = useState('');
    const [description, setDescription] = useState();

    const [latLongMapModalProps, setLatLongMapModalProps] = useState({
        visible: false,
        shouldRender: false
    });

    const [latLongCoords, setLatLongCoords] = useState(null);

    const isDisabled = () => {
        let type = cardType() || '';
        return !fio || !phone || !street || !houseNo ||
            regionId === undefined || districtId === undefined || !cvc || !expiry || (type.toUpperCase() !== 'VISA' && type.toUpperCase() !== 'MASTERCARD' && type.toUpperCase() !== 'AMERICAN_EXPRESS')
    };

    const cardType = () => {
        var cards = {
            electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
            maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
            dankort: /^(5019)\d+$/,
            interpayment: /^(636)\d+$/,
            unionpay: /^(62|88)\d+$/,
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            american_express: /^3[47][0-9]{13}$/,
            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}$/
        };
        for (let card in cards) {
            if (cards[card].test(number.replace(/ /g,''))) {
                return card;
            }
        }
    };

    const showLatLongMap = () => {
        setLatLongMapModalProps({
            visible: true,
            shouldRender: true,
        });
    };

    const setCoors = (coors) => {
        setLatLongCoords(coors);
    };

    const region = regionList.find((item) => item.id === regionId);
    const district = districtList.find((item) => item.id === districtId);

    return (
        <Grid container>
            {latLongMapModalProps.shouldRender && <LongLatMap
                modalProps={latLongMapModalProps}
                setModalProps={setLatLongMapModalProps}
                title={props.t('payment.showOnMap')}
                coords={latLongCoords}
                setCoors={setCoors}
                region={region ? region.name : null}
                district={district ? district.name : null}
                street={street}
                house={houseNo}
            />}
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
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                        <InputLabel id="region">{props.t('payment.region')}</InputLabel>
                        <Select
                            id="region"
                            labelId="region-label"
                            labelWidth={80}
                            variant="outlined"
                            value={regionList ? regionId : ''}
                            fullWidth
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
                    </FormControl>

                </Grid>
                <Grid item xs={6} md={5} style={{paddingLeft: 10}}>
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                        <InputLabel id="district">{props.t('payment.district')}</InputLabel>
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
                    </FormControl>

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
            <div style={{marginTop: 10}}>
                <Button variant="contained" className={classes.button} onClick={showLatLongMap}>
                    {props.t('payment.showOnMap')}
                </Button>
            </div>

            {/*<Grid container style={{marginTop: 20}}>*/}
            {/*    <Grid item xs={12} md={9}>*/}
            {/*        <FormControl component="fieldset">*/}
            {/*            <FormLabel component="legend">Форма оплаты</FormLabel>*/}
            {/*            <RadioGroup value={value} onChange={(e) => { setValue(e.target.value) }}>*/}
            {/*                <FormControlLabel value="MASTERCARD" control={<Radio color="primary" />} label={*/}
            {/*                    <img alt="matercard" src={require('../assets/img/mastercard.png')} width={200} height={100} style={{*/}
            {/*                        objectFit: 'contain'*/}
            {/*                    }} />} />*/}
            {/*                <FormControlLabel value="VISA" control={<Radio color="primary" />} label={*/}
            {/*                    <img alt="visa" src={require('../assets/img/visa.png')} width={200} height={100} style={{*/}
            {/*                        objectFit: 'contain'*/}
            {/*                    }}/>*/}
            {/*                } />*/}
            {/*                <FormControlLabel value="AMERICAN_EXPRESS" control={<Radio color="primary" />} label={*/}
            {/*                    <img alt="american_express" src={require('../assets/img/american_express.png')} width={200} height={100} style={{*/}
            {/*                        objectFit: 'contain'*/}
            {/*                    }} />*/}
            {/*                } />*/}

            {/*            </RadioGroup>*/}
            {/*        </FormControl>*/}
            {/*    </Grid>*/}
            {/*</Grid>*/}
            <Grid container direction="row" style={{marginTop: 20}}>
                <Grid item xs={12} md={9}>
                    <CreditCardInput
                        cardNumberInputProps={{ value: number, onChange: (e) => { setNumber(e.target.value) } }}
                        cardExpiryInputProps={{ value: expiry, onChange: (e) => { setExpiry(e.target.value) } }}
                        cardCVCInputProps={{ value: cvc, onChange: (e) => { setCvc(e.target.value) } }}

                        fieldClassName="input"
                    />
                </Grid>

            </Grid>

            <Grid container direction="row" style={{marginTop: 15}}>
                <Grid item xs={9}>

                    <TextField
                        variant="outlined"
                        fullWidth
                        label={props.t('payment.description')}
                        rows={4}
                        multiline
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                {props.t('payment.delivery_price')} 2.5$
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
                            const [firstName, lastName] = fio ? fio.split(" "): [];
                            order({
                                card: {
                                    cardNumber: number,
                                    cardType: value,
                                    expiryDate: expiry

                                },
                                items: orders.map(o => ({ id: o.food.food.id, price: o.food.price, quantity: o.count })),
                                description,
                                receiver: {
                                    address: {
                                        apartment: flatNo,
                                        districtId: districtId,
                                        floor: floor,
                                        house: houseNo,
                                        porch: door,
                                        regionId: regionId,
                                        street: street,
                                        latitude: latLongCoords ? latLongCoords[0]: undefined,
                                        longitude: latLongCoords ? latLongCoords[1]: undefined,
                                    },
                                    firstName: firstName,
                                    lastName: lastName,
                                    phone: phone
                                },
                                totalPrice: cost,
                                deleveryPrice: 2.5,
                                "restaurantId": Cookies.get('restaurantId') ? parseInt(Cookies.get('restaurantId')) : 0
                            }).then(response => {
                                Cookies.remove('orders');
                                Cookies.remove('restaurantId');
                                dispatch('order_changed');
                                props.history.push('/app/history')
                            }).catch(error => {
                                alert(error);
                            })
                        }}
                    > {props.t('payment.purchase_order')} ({cost.toFixed(2)}$) </Button>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(Payment));
