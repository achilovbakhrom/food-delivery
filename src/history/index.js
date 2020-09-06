import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import {
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchOrderById, fetchMyOrders } from "../api/restaurants";
import {withTranslation} from "react-i18next";
import {currentUser} from "../api/auth";
import MaterialTable from "material-table";

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
        textAlign: 'center'
    }
}));

const History = props => {

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [orders, setOrders] = useState([]);

    const [client, setClient] = useState();
    const [clientDialog, setClientDialog] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        currentUser()
            .then(response => {
                let id = response.data.id;
                fetchMyOrders({clientId: id, page: page, size: size})
                    .then(response => {
                        setIsLoading(false);
                        setOrders(response.data.content)
                        setIsEnd(response.data.content.length < size);
                    })
            });
    }, []);

    return (
        <Grid container>
            <Grid container justify="center">
                <Grid className={classes.title} xs={12} md={6}> {props.t('history.desc')}</Grid>
            </Grid>
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    <Paper className={classes.content}>
                        <Grid item>
                            <List>
                                { orders.map((i, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        onClick={() => {
                                            fetchOrderById(i.id)
                                                .then(response => {
                                                    setClient(response.data);
                                                    setClientDialog(true)
                                                })

                                        }}
                                    >
                                        <ListItemText>
                                            <span>{props.t('history.orderNo')}&nbsp;#{ i.id}</span>&nbsp; <br />
                                            <span>{props.t('history.name')}&nbsp;{ i.client ? i.client.name : 'Unkonwn' }</span>&nbsp; <br />
                                            <span>
                                                {props.t('history.address')}&nbsp;
                                                { i.address ? `${i.address.region.name},
                                                ${i.address.district.name},
                                                ${i.address.street},
                                                ${i.address.house}
                                                ${i.address.porch ? ", "+i.address.porch : ""}
                                                ${i.address.floor ? ", "+i.address.floor : ""}
                                                ${i.address.apartment ? ", "+i.address.apartment : ""}` : 'Unkonwn' }
                                            </span>
                                            &nbsp; <br />
                                            <span>{props.t('history.restaraunt')}&nbsp;{ i.restaurant ? `${i.restaurant.name}` : 'Unkonwn' }</span>&nbsp; <br />
                                        </ListItemText>
                                        <ListItemSecondaryAction> {i.status}  </ListItemSecondaryAction>
                                    </ListItem>
                                )) }
                            </List>
                        </Grid>
                        { isEnd ? undefined : (
                            <Grid item className={classes.footer}>
                                {isLoading ? (
                                    <CircularProgress variant="indeterminate" />
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => {
                                            setPage(page+1);
                                            setIsLoading(true);
                                            currentUser()
                                                .then(response => {
                                                    let id = response.data.id;
                                                    fetchMyOrders({clientId: id, page: page, size: size})
                                                        .then(response => {
                                                            setIsLoading(false);
                                                            setOrders([...orders, ...response.data.content]);
                                                            setIsEnd(response.data.content.length < size);
                                                        })
                                                });
                                        }}
                                    > {props.t('regions.reload')} </Button>
                                )}
                            </Grid>
                        )}
                    </Paper>
                </Grid>

            </Grid>
            <Dialog
                open={clientDialog}
                onClose={() => {
                    setClientDialog(false);
                    setClient(undefined);
                }}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Заказ клиента"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container style={{padding: 10}}>
                            <Grid item xs={12}>
                                Заказ:
                            </Grid>
                            <div  style={{width: '100%', height: 1, backgroundColor: '#eee'}}/>
                            <Grid item xs={12}>
                                {client && client.items.map(i => (
                                    <List>
                                        <ListItem>
                                            <ListItemText>{i.name} - {i.quantity || 0} x {i.price}</ListItemText>
                                            <ListItemSecondaryAction>{(i.quantity || 0)*parseFloat(i.price)}</ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                ))}

                            </Grid>
                            <div  style={{width: '100%', height: 1, backgroundColor: '#eee'}}/>
                            <Grid item xs={12}>
                                Сумма: { client ? client.items.reduce((acc, i) => acc + parseFloat(i.price)*(i.quantity || 0), 0): 0 }
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setClientDialog(false);
                        setClient(undefined);
                    }} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
};

export default withRouter(withTranslation()(History));
