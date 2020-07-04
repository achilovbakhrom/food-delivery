import React, { useState } from 'react';
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
import { Restaurant, LocationCity, Memory, Contacts, Language, Person, ExitToApp, ShoppingBasket } from '@material-ui/icons';
import Restaurants from "../restaurants";
import Categories from '../categories';
import Menu from '../menu';
import Address from '../addresses';
import Basket from '../basket';
import Payment from '../payment';

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

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
                        Уз Шеф
                    </Typography>
                    <IconButton onClick={() => {
                        props.history.push('/app/basket')
                    }}><ShoppingBasket /></IconButton>

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
                        {name: 'Адрес', icon: <LocationCity />},
                        {name: 'Рестораны', icon: <Restaurant />},
                        // {name: 'Отправленные', icon: <Memory />},
                        {name: 'Контакты', icon: <Contacts />},
                        {name: 'Язык', icon: <Language />},
                        {name: 'Профиль', icon: <Person />},
                        {name: 'Выйти', icon: <ExitToApp />}].map((obj, index) => (
                        <ListItem button key={obj.name} onClick={() => {
                            setOpen(false)
                            switch (index) {
                                case 0:
                                    props.history.push('/app/address');
                                    break;
                                case 1:
                                    props.history.push('/app/restaurants');
                                    break;
                                case 2:
                                    break;
                                case 3:
                                    break;
                                case 4:
                                    break;
                                case 5:
                                    props.history.push('/login');
                                    break;
                                case 6:
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
                    <Route path="/app/restaurants" component={Restaurants}/>
                    <Route path="/app/categories" component={Categories}/>
                    <Route path="/app/menu" component={Menu}/>
                    <Route path="/app/basket" component={Basket}/>
                    <Route path="/app/payment" component={Payment}/>
                </Switch>
            </main>
        </div>
    );
};

export default withRouter(Main);
