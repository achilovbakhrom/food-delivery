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
import { Restaurant, MenuBook, ExitToApp, Fastfood, History } from '@material-ui/icons';
import AdminRestaurants from "../admin/restaurants";
import AddEditRestaurants from '../admin/addEditRestaurant';
import AdminFoods from '../admin/foods';
import AddEditFoods from '../admin/addEditFood';
import AdminMenu from '../admin/menu';
import AddEditMenu from '../admin/addEditMenu';
import AdminHistory from '../admin/history';

import Cookies from 'js-cookie';

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
                    {[
                        {name: 'Рестораны', icon: <Restaurant />},
                        {name: 'Блюда', icon: <Fastfood />},
                        {name: 'Меню', icon: <MenuBook />},
                        {name: 'Заказы', icon: <History />},
                        {name: 'Выйти', icon: <ExitToApp />}].map((obj, index) => (
                        <ListItem button key={obj.name} onClick={() => {
                            setOpen(false);
                            switch (index) {
                                case 0:
                                    props.history.push('/admin/restaurants');
                                    break;
                                case 1:
                                    props.history.push('/admin/foods');
                                    break;
                                case 2:
                                    props.history.push('/admin/menu');
                                    break;
                                case 3:
                                    props.history.push('/admin/history');
                                    break;
                                case 4:
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
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <Switch>
                    <Route path="/admin/restaurants" component={AdminRestaurants}/>
                    <Route path="/admin/restaurant-add-edit" component={AddEditRestaurants}/>
                    <Route path="/admin/foods" component={AdminFoods}/>
                    <Route path="/admin/food-add-edit" component={AddEditFoods}/>
                    <Route path="/admin/menu" component={AdminMenu}/>
                    <Route path="/admin/menu-add-edit" component={AddEditMenu}/>
                    <Route path="/admin/history" component={AdminHistory}/>
                </Switch>
            </main>
        </div>
    )
};

export default withRouter(AdminRoot);
