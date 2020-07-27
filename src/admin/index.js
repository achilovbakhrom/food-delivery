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
import { Switch, Route, withRouter } from 'react-router-dom';
import { Restaurant, MenuBook, ExitToApp, Fastfood, History, Category, People } from '@material-ui/icons';
import AdminRestaurants from "../admin/restaurants";
import AddEditRestaurants from '../admin/addEditRestaurant';

import AdminRestaurantCategories from "../admin/restaurant-categories";
import AddEditRestaurantCategory from "../admin/addEditRestaurantCategory";


import AdminFoods from '../admin/foods';
import AddEditFoods from '../admin/addEditFood';
import AdminMenu from '../admin/menu';
import AddEditMenu from '../admin/addEditMenu';
import AdminHistory from '../admin/history';
import AdminCategory from '../admin/category';
import AddEditCategory from '../admin/addEditCategory';
import AdminUsers from '../admin/users';
import AddEditUsers from '../admin/addEditUser';

import AdminTimeSlots from '../admin/timeSlots';
import AddEditTimeSlot from '../admin/addEditTimeSlot';

import AdminTimeSlotItems from '../admin/timeSlotItems';
import AddEditTimeSlotItem from '../admin/addEditTimeSlotItem';

import Cookies from 'js-cookie';
import { useStore } from "effector-react";
import { getCurrentUserEffect } from "../model/effects";
import { $store } from "../model/stores";
import CircularProgress from '@material-ui/core/CircularProgress';

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

const AdminRoot = props => {
    const { $currentUser } = useStore($store);

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

        getCurrentUserEffect();
    }, []);

    if (!$currentUser.data) {
        return (
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </div>
        );
    }

    if ($currentUser.isClient) {
        return (
            <div></div>
        );
    }

    const isSupervisor = $currentUser.isSupervisor;
    const isDriver = $currentUser.isDriver;
    let menuData = [];

    if (!isDriver) menuData.push({name: 'Рестораны', icon: <History />, path: "/admin/restaurants"});
    if (!isDriver) menuData.push({name: 'Категории', icon: <History />, path: "/admin/categories"});
    if (!isDriver) menuData.push({name: 'Категории ресторанов', icon: <History />, path: "/admin/restaurant-categories"});
    if (!isDriver) menuData.push({name: 'Блюда', icon: <History />, path: "/admin/foods"});
    if (!isDriver) menuData.push({name: 'Меню', icon: <History />, path: "/admin/menu"});
    menuData.push({name: 'Заказы', icon: <History />, path: "/admin/history"});
    if (!isDriver && !isSupervisor) menuData.push({name: 'Пользователи', icon: <History />, path: "/admin/users"});
    if (!isDriver) menuData.push({name: 'Даты доставки', icon: <History />, path: "/admin/time-slots"});
    menuData.push({name: 'Выйти', icon: <History />, logout: true});

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
                            props.history.push('/admin/restaurants')
                        }}
                    >
                        Уз Шеф - Админ
                    </Typography>
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
                    {menuData.map((obj) => (
                        <ListItem button key={obj.name} onClick={() => {
                            setOpen(false);
                            if (obj.path) {
                                props.history.push(obj.path);
                            }

                            if (obj.logout) {
                                Cookies.remove('token');
                                Cookies.remove('orders');
                                props.history.push('/login');
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
                    {!isDriver && <Route path="/admin/restaurants" component={AdminRestaurants}/>}
                    {!isDriver && <Route path="/admin/categories" component={AdminCategory}/>}
                    {!isDriver && <Route path="/admin/category-add-edit" component={AddEditCategory}/>}
                    {!isDriver && <Route path="/admin/restaurant-add-edit" component={AddEditRestaurants}/>}

                    {!isDriver && <Route path="/admin/restaurant-categories" component={AdminRestaurantCategories}/>}
                    {!isDriver && <Route path="/admin/restaurant-categories-add-edit" component={AddEditRestaurantCategory}/>}

                    {!isDriver && <Route path="/admin/foods" component={AdminFoods}/>}
                    {!isDriver && <Route path="/admin/food-add-edit" component={AddEditFoods}/>}
                    {!isDriver && !isSupervisor && <Route path="/admin/users" component={AdminUsers}/>}
                    {!isDriver && !isSupervisor && <Route path="/admin/user-add-edit" component={AddEditUsers}/>}
                    {!isDriver && <Route path="/admin/menu" component={AdminMenu}/>}
                    {!isDriver && <Route path="/admin/menu-add-edit" component={AddEditMenu}/>}
                    {!isDriver && <Route path="/admin/time-slots" component={AdminTimeSlots}/>}
                    {!isDriver && <Route path="/admin/time-slot-add-edit" component={AddEditTimeSlot}/>}
                    {!isDriver && <Route path="/admin/time-slot-items" component={AdminTimeSlotItems}/>}
                    {!isDriver && <Route path="/admin/time-slot-item-add-edit" component={AddEditTimeSlotItem}/>}
                    <Route path="/admin/history" component={AdminHistory}/>
                </Switch>
            </main>
        </div>
    )
};

export default withRouter(AdminRoot);
