import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from "@material-ui/core/Badge";
import { Switch, Route, withRouter } from 'react-router-dom';
import { Restaurant, LocationCity, Memory, Contacts as ContactIcon, Language, Person, ExitToApp, ShoppingBasket } from '@material-ui/icons';
import Restaurants from "../restaurants";
import Categories from '../categories';
import Menu from '../menu';
import Address from '../regions';
import Basket from '../basket';
import Payment from '../payment';
import District from '../districts';
import useBus from 'use-bus';
import Cookies from 'js-cookie';
import Languages from '../languages';
import {withTranslation} from "react-i18next";
import Profile from "../profile";
import Contacts  from '../contacts';
import History from '../history';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: 'white'
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        padding: theme.spacing(3),
        position: 'relative',
        width: '100%',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));


const Main = props => {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [price, setPrice] = useState(0);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let orderString = Cookies.get('orders') || '[]';
        let orders = JSON.parse(orderString);
        let counter = 0;
        let acc = 0;
        orders.forEach(o => { if (o.count) {
            acc = acc + parseFloat(o.count)*parseFloat(o.food.price);
            counter++
        } });
        setCount(counter);
        setPrice(acc);
    }, []);

    useBus('order_changed', () => {
        let orderString = Cookies.get('orders') || '[]';
        let orders = JSON.parse(orderString);
        let counter = 0;
        let acc = 0;
        orders.forEach(o => { if (o.count) {
            acc = acc + parseFloat(o.count)*parseFloat(o.food.price);
            counter++
        } });
        setCount(counter);
        setPrice(acc);
    }, [count]);

    const hasToken = () => {
        return Cookies.get('token') !== undefined
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        color="inherit" style={{color: 'white', flex: 1, cursor: 'pointer'}}
                        onClick={() => {
                            props.history.push('/app/address')
                        }}
                    >
                        {props.t('main.uzchef')}
                    </Typography>
                    {
                        price > 0 ? (
                            <Typography
                                variant="h6"
                                noWrap
                                color="inherit" style={{color: 'white', marginRight: 10}}

                            >
                                {price.toFixed(2)}$
                            </Typography>
                        ) : undefined

                    }
                    { count ? (
                        <IconButton onClick={() => {
                            props.history.push('/app/basket')
                        }}>
                            <Badge badgeContent={count} color="secondary">
                                <ShoppingBasket />
                            </Badge>
                        </IconButton>

                    ) : (
                        <IconButton onClick={() => {
                            props.history.push('/app/basket')
                        }}><ShoppingBasket /></IconButton>
                    )}

                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="left"
                open={open}
                ModalProps={{ onBackdropClick: () => { setOpen(false) } }}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {hasToken() ? [
                        {name: props.t('main.address'), icon: <LocationCity />},
                        {name: props.t('main.restaurants'), icon: <Restaurant />},
                        {name: props.t('main.history'), icon: <Memory />},
                        {name: props.t('main.contacts'), icon: <ContactIcon />},
                        {name: props.t('main.languages'), icon: <Language />},
                        {name: props.t('main.profile'), icon: <Person />},
                        {name: props.t('main.signOut'), icon: <ExitToApp />}].map((obj, index) => (
                        <ListItem button key={obj.name} onClick={() => {
                            setOpen(false);
                            switch (index) {
                                case 0:
                                    props.history.push('/app/address');
                                    break;
                                case 1:
                                    props.history.push('/app/restaurants');
                                    break;
                                case 2:
                                    props.history.push('/app/history');
                                    break;
                                case 3:
                                    props.history.push('/app/contacts');
                                    break;
                                case 4:
                                    props.history.push('/app/languages');
                                    break;
                                case 5:
                                    props.history.push('/app/profile');
                                    break;
                                case 6:
                                    Cookies.remove('token');
                                    Cookies.remove('orders');
                                    props.history.push('/login');
                                    break;
                                default:
                                    break
                            }
                        }}>
                            <ListItemIcon>{obj.icon}</ListItemIcon>
                            <ListItemText primary={obj.name} />
                        </ListItem>
                    )) : [
                        {name: props.t('main.address'), icon: <LocationCity />},
                        {name: props.t('main.restaurants'), icon: <Restaurant />},
                        {name: props.t('main.contacts'), icon: <ContactIcon />},
                        {name: props.t('main.languages'), icon: <Language />},
                        {name: props.t('main.login'), icon: <ExitToApp />}].map((obj, index) => (
                        <ListItem button key={obj.name} onClick={() => {
                            setOpen(false);
                            switch (index) {
                                case 0:
                                    props.history.push('/app/address');
                                    break;
                                case 1:
                                    props.history.push('/app/restaurants');
                                    break;
                                case 2:
                                    props.history.push('/app/contacts');
                                    break;
                                case 3:
                                    props.history.push('/app/languages');
                                    break;
                                case 4:
                                    Cookies.remove('token');
                                    props.history.push('/login');
                                    break;
                                default:
                                    break
                            }
                        }}>
                            <ListItemIcon>{obj.icon}</ListItemIcon>
                            <ListItemText primary={obj.name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <Switch>
                    <Route path="/app/address" component={Address}/>
                    <Route path="/app/districts" component={District}/>
                    <Route path="/app/restaurants" component={Restaurants}/>
                    <Route path="/app/categories" component={Categories}/>
                    <Route path="/app/menu" component={Menu}/>
                    <Route path="/app/basket" component={Basket}/>
                    <Route path="/app/payment" component={Payment}/>
                    <Route path="/app/languages" component={Languages}/>
                    <Route path="/app/profile" component={Profile}/>
                    <Route path="/app/contacts" component={Contacts}/>
                    <Route path="/app/history" component={History}/>
                </Switch>
            </main>
        </div>
    );
};

export default withRouter(withTranslation()(Main));
