import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Button,
    Grid,
    GridList,
    Typography,
    ListItem,
    ListItemIcon,
    isWidthUp,
    Paper,
    withWidth
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {green} from "@material-ui/core/colors";
import Cookies from 'js-cookie';
import {dispatch} from "use-bus";
import {withTranslation} from "react-i18next";
import { ShoppingCart } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: 60,
        marginLeft: 20,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    content: {
        padding: 20,
        marginTop: 10,
        color: '#555',
        backgroundColor: 'white',
        width: '100%',
        flex: 1
    },
    footer: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'right',
        borderTop: '1px solid #eee',
        paddingTop: 8,
        fontSize: 22
    }
}));

const Basket = props => {

    const classes = useStyles();
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        let orderString = Cookies.get('orders') || '[]';
        let orders = JSON.parse(orderString);
        console.log(orders)
        setFoods(orders);

    }, []);

    const getGridListCols = () => {
        if (isWidthUp('md', props.width)) {
            return 2;
        }
        if (isWidthUp('xs', props.width)) {
            return 1;
        }
        return 1;
    };



    let borderColor = '#fff3';

    let height = (() => {
        if (isWidthUp('md', props.width)) {
            return 250;
        }
        if (isWidthUp('xs', props.width)) {
            return 120;
        }
        return 1;
    })();

    return (
        <Grid container>
            <Grid item xs={12} className={classes.title}> {props.t('basket.my')} </Grid>
            <Grid container className={classes.footer} justify="flex-end">
                {props.t('basket.total')}&nbsp;<strong style={{color: green.A700, fontSize: 32}}>{ foods.reduce((acc, o) => acc + parseFloat(o.count)*parseFloat(o.food.price), 0).toFixed(2) } $</strong>&nbsp;
            </Grid>
            <Grid item xs={12}>
                <GridList spacing={15} cellHeight={height} cols={getGridListCols()}>
                    {
                        foods.length ? foods.map((item, index) => (
                            <ListItem key={index} cols={1} >
                                <ListItemIcon>
                                    <img
                                        src={item.food.photo ? item.food.photo.url : require("../assets/img/noimage.png")}
                                        alt="burger"
                                        width={height*1.1}
                                        height={height}
                                        style={{
                                            borderBottomLeftRadius: 10,
                                            borderTopLeftRadius: 10,
                                            borderLeftColor: borderColor,
                                            borderLeftWidth: 1,
                                            borderLeftStyle: "solid",
                                            borderTopColor: borderColor,
                                            borderTopWidth: 1,
                                            borderTopStyle: "solid",
                                            borderBottomColor: borderColor,
                                            borderBottomWidth: 1,
                                            borderBottomStyle: "solid",
                                            objectFit: "cover"
                                        }} />
                                </ListItemIcon>
                                <div style={{
                                    height: '100%',
                                    backgroundColor: '#0007',
                                    flexGrow: 1,
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10,
                                    padding: 10,
                                    display: 'flex',
                                    flexFlow: 'row',
                                    borderRightColor: borderColor,
                                    borderRightWidth: 1,
                                    borderRightStyle: "solid",
                                    borderTopColor: borderColor,
                                    borderTopWidth: 1,
                                    borderTopStyle: "solid",
                                    borderBottomColor: borderColor,
                                    borderBottomWidth: 1,
                                    borderBottomStyle: "solid"

                                }}>
                                    <div style={{flexGrow: 1}}>
                                        <Typography variant='inherit' style={{color: 'white', fontSize: 20}}><strong>{item.food.food.name}</strong></Typography> <br />
                                        <Typography variant='inherit' style={{fontSize: 24, color: green.A700, marginTop: 30}}><strong>{item.food.price}$</strong></Typography> <br />
                                    </div>
                                    <div style={{display: 'flex', flexFlow: 'column', width: 50, alignItems: 'center'}}>
                                        <Button
                                            variant='outlined'
                                            color="inherit"
                                            style={{fontSize: 25, lineHeight: 1, width: "100%", minWidth: 0, padding: 0, height: (() => {
                                                    if (isWidthUp('md', props.width)) {
                                                        return 60;
                                                    }
                                                    if (isWidthUp('xs', props.width)) {
                                                        return 30;
                                                    }
                                                    return 1;
                                                })(), color: green.A700}}
                                            onClick={() => {
                                                foods.forEach((i) => {
                                                    if (i.food.id === item.food.id) {
                                                        i.count = i.count + 1;
                                                    }
                                                });
                                                Cookies.set('orders', foods);
                                                setFoods([...foods]);
                                                dispatch('order_changed');
                                            }}
                                        > + </Button>
                                        {/*<div style={{flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 'bold'}}>{item.count}</div>*/}
                                        <div style={{flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 'bold'}}>
                                            <div className="menu__amount-wr">
                                                <ShoppingCart className="menu__cart-icon" style={{ color: green.A700 }} />
                                                <div className="menu__amount">{item.count}</div>
                                            </div>
                                        </div>
                                        <Button
                                            variant='outlined'
                                            color="secondary"
                                            style={{fontSize: 25, lineHeight: 1, width: "100%", minWidth: 0, padding: 0, height: (() => {
                                                    if (isWidthUp('md', props.width)) {
                                                        return 60;
                                                    }
                                                    if (isWidthUp('xs', props.width)) {
                                                        return 30;
                                                    }
                                                    return 1;
                                                })()}}
                                            onClick={() => {
                                                foods.forEach((i, index) => {
                                                    if (i.food.id === item.food.id) {
                                                        if (i.count > 0.5) {
                                                            i.count = i.count - 1;
                                                        } else {
                                                            foods.splice(index, 1);
                                                        }
                                                    }
                                                });
                                                Cookies.set('orders', foods);
                                                setFoods([...foods]);
                                                dispatch('order_changed');
                                            }}

                                        > - </Button>
                                    </div>
                                </div>
                            </ListItem>
                        )) : (
                            <Grid container>
                                <Paper style={{width: '100%', padding: 20, textAlign: 'center', backgroundColor: 'white', color: '#555'}}>
                                    { props.t('common.empty') }
                                </Paper>
                            </Grid>
                        )
                    }
                </GridList>

                { Cookies.get('token') ? (foods.length ? (
                    <Grid container style={{marginTop: 20, height: 50}}>
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            style={{color: 'white', fontWeight: 'bold'}}
                            onClick={() => {
                                props.history.push('/app/payment')
                            }}
                        >
                            {props.t('basket.pay')} ({foods.reduce((acc, o) => acc + parseFloat(o.count)*parseFloat(o.food.price), 0).toFixed(2)}$)
                        </Button>
                    </Grid>
                ) : undefined) : (
                    <Grid container style={{marginTop: 20, height: 50}}>
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            style={{color: 'white', fontWeight: 'bold'}}
                            onClick={() => {
                                props.history.push('/login')
                            }}
                        >
                            {props.t('auth.login')}
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(withWidth()(Basket)))
