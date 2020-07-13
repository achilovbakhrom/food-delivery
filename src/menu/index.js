import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Typography, GridList, isWidthUp, Button, withWidth, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {green} from "@material-ui/core/colors";
import {fetchFoods} from "../api/restaurants";
import Cookies from 'js-cookie';
import { dispatch } from 'use-bus'
import { withTranslation } from "react-i18next";

const queryString = require('query-string');

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

const Menu = props => {

    const classes = useStyles();
    const [foods, setFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const parsed = queryString.parse(props.location.search);
        if (parsed['categoryId'] && parsed['restaurantId']) {
            // fetchFoods({categoryId: parsed['categoryId'], restaurantId: parsed['restaurantId'], page: 0, size: 500})
            setIsLoading(true);
            fetchFoods({categoryId: 4, restaurantId: 1, page: 0, size: 500})
                .then(response => {
                    setIsLoading(false);
                    setFoods(response.data.content);
                    let orderString = Cookies.get('orders') || '[]';
                    let cookieOrders = JSON.parse(orderString);
                    setOrders([...cookieOrders]);
                })
        } else {
            // props.history.push('/app/address');
        }
    }, [])

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

    return (
        <Grid container >
            <Grid item className={classes.title} xs={12}>
                <div> {props.t('menu.menu')} </div>
            </Grid>
            <Grid item>
                <GridList spacing={15} cellHeight={200} cols={getGridListCols()}>
                    {
                        foods.map((item, index) => {
                            let f = orders.find(o => item.id === o.food.id);
                            let count = f ? f.count : 0;
                            return (
                                <ListItem key={index} cols={1} >
                                    <ListItemIcon>
                                        <img
                                            src={require("../assets/img/burgers.jpg")}
                                            alt="burger"
                                            width={250}
                                            height={200}
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
                                                borderBottomStyle: "solid"
                                            }} />
                                    </ListItemIcon>
                                    <div style={{
                                        height: '100%',
                                        backgroundColor: '#0007',
                                        flexGrow: 1,
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10,
                                        padding: 20,
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
                                            <Typography variant='inherit' style={{color: 'white', fontSize: 20}}><strong>{item.name}</strong></Typography> <br />
                                            <Typography variant='inherit' style={{fontSize: 24, color: green.A700, marginTop: 30}}><strong>{item.price}$</strong></Typography> <br />
                                        </div>
                                        <div style={{display: 'flex', flexFlow: 'column', width: 50, alignItems: 'center'}}>
                                            <Button
                                                variant='outlined'
                                                color="primary"
                                                style={{fontSize: 25}}
                                                onClick={() => {
                                                    let orderString = Cookies.get('orders') || '[]';
                                                    let cookieOrders = JSON.parse(orderString);
                                                    let found = false;
                                                    cookieOrders.forEach((i) => {
                                                        if (i.food.id === item.id) {
                                                            i.count = i.count + 0.5;
                                                            found = true
                                                        }
                                                    });
                                                    if (!found) {
                                                        cookieOrders.push({ food: item, count: 1});
                                                    }
                                                    Cookies.set('orders', cookieOrders);
                                                    setOrders([...cookieOrders]);
                                                    dispatch('order_changed');
                                                }}
                                            > + </Button>
                                            <div style={{flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 'bold'}}>{count}</div>
                                            <Button
                                                variant='outlined'
                                                color="secondary"
                                                style={{fontSize: 25}}
                                                onClick={() => {
                                                    let orderString = Cookies.get('orders') || '[]';
                                                    let cookieOrders = JSON.parse(orderString);
                                                    let removeIndex = -1;

                                                    cookieOrders.forEach((i, index) => {
                                                        if (i.food.id === item.id) {
                                                            if (i.count > 0.5) {
                                                                i.count = i.count - 0.5;
                                                            } else {
                                                                i.count = 0;
                                                                removeIndex = index;
                                                            }
                                                        }
                                                    });
                                                    if (removeIndex !== -1) {
                                                        cookieOrders.splice(removeIndex, 1);
                                                    }
                                                    Cookies.set('orders', cookieOrders);
                                                    setOrders([...cookieOrders]);
                                                    dispatch('order_changed');
                                                }}
                                            > - </Button>
                                        </div>
                                    </div>
                                </ListItem>
                            )
                        })
                    }
                </GridList>
            </Grid>
            <Grid container justify="center" style={{marginTop: 20}}>
                {
                    isLoading ? (
                        <CircularProgress variant="indeterminate" color="primary" />
                    ) : undefined
                }
            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(withWidth()(Menu)));
