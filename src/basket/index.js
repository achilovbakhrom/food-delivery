import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Grid, GridList, Typography, ListItem, ListItemIcon, isWidthUp, Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {green} from "@material-ui/core/colors";
import Cookies from 'js-cookie';
import {dispatch} from "use-bus";

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


    return (
        <Grid container>
            <Grid item xs={12} className={classes.title}> Мои заказы - Корзина </Grid>
            <Grid container className={classes.footer} justify="flex-end">
                Общая сумма:&nbsp;<strong style={{color: green.A700, fontSize: 32}}>{ foods.reduce((acc, o) => acc + parseFloat(o.count)*parseFloat(o.food.price), 0) } $</strong>&nbsp;
            </Grid>
            <Grid item xs={12}>
                <GridList spacing={15} cellHeight={200} cols={getGridListCols()}>
                    {
                        foods.length ? foods.map((item, index) => (
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
                                        <Typography variant='inherit' style={{color: 'white', fontSize: 20}}><strong>{item.food.name}</strong></Typography> <br />
                                        <Typography variant='inherit' style={{fontSize: 24, color: green.A700, marginTop: 30}}><strong>{item.food.price}$</strong></Typography> <br />
                                    </div>
                                    <div style={{display: 'flex', flexFlow: 'column', width: 50, alignItems: 'center'}}>
                                        <Button
                                            variant='outlined'
                                            color="primary"
                                            style={{fontSize: 25}}
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
                                        <div style={{flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 'bold'}}>{item.count}</div>
                                        <Button
                                            variant='outlined'
                                            color="secondary"
                                            style={{fontSize: 25}}
                                            onClick={() => {
                                                foods.forEach((i, index) => {
                                                    if (i.food.id === item.food.id) {
                                                        if (i.count > 1) {
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
                                    Список пуст!
                                </Paper>
                            </Grid>
                        )
                    }
                </GridList>
                { foods.length ? (
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
                            Перейти к оплате ({foods.reduce((acc, o) => acc + parseFloat(o.count)*parseFloat(o.food.price), 0)}$)
                        </Button>
                    </Grid>
                ) : undefined }

            </Grid>

        </Grid>
    )
};

export default withRouter(Basket)
