import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchMyOrders } from "../api/restaurants";
import {withTranslation} from "react-i18next";
import {currentUser} from "../api/auth";

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
                <Grid className={classes.title} xs={12} md={6}> {props.t('regions.region')} - <span style={{fontWeight: 500, fontSize: 14}}>({props.t('regions.region_desc')})</span> </Grid>
            </Grid>
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    <Paper className={classes.content}>
                        <Grid item>
                            <List>
                                { orders.map((i, index) => (
                                    <ListItem button key={index}>
                                        <ListItemText>
                                            <span>{ i.clent ? i.client.name : 'Unkonwn' }</span>&nbsp;
                                            <span>{ i.address ? `${i.address.regionId}, ${i.address.districtId}, ${i.address.house}, ${i.address.porch}, ${i.address.apartment}` : 'Unkonwn' }</span>&nbsp;
                                        </ListItemText>
                                        <ListItemSecondaryAction> 200 000 sum  </ListItemSecondaryAction>
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
        </Grid>
    )
};

export default withRouter(withTranslation()(History));
