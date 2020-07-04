import React from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Grid, GridList, Typography, ListItem, ListItemIcon, isWidthUp} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {green} from "@material-ui/core/colors";

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
            <Grid item xs={12}>
                <GridList spacing={15} cellHeight={200} cols={getGridListCols()}>
                    {
                        new Array(20).fill(0).map((item, index) => (
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
                                        <Typography variant='inherit' style={{color: 'white', fontSize: 20}}><strong>ОШ</strong></Typography> <br />
                                        <Typography variant='inherit' style={{fontSize: 24, color: green.A700, marginTop: 30}}><strong>35 000 сум</strong></Typography> <br />
                                    </div>
                                    <div style={{display: 'flex', flexFlow: 'column', width: 50, alignItems: 'center'}}>
                                        <Button variant='outlined' color="primary" style={{fontSize: 25}}> + </Button>
                                        <div style={{flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 'bold'}}>0</div>
                                        <Button variant='outlined' color="secondary" style={{fontSize: 25}}> - </Button>
                                    </div>
                                </div>
                            </ListItem>
                        ))
                    }
                </GridList>

            </Grid>
            <Grid container className={classes.footer} justify="flex-end">
                Общая сумма:&nbsp;<strong>250 000</strong>&nbsp;сум
            </Grid>
        </Grid>
    )
};

export default withRouter(Basket)
