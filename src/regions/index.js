import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {fetchRestaurantsByRegions} from "../api/restaurants";

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

const Regions = props => {

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        fetchRestaurantsByRegions()
            .then(response => {
                setIsLoading(false);
                setRegions(response.data);
            })
    }, []);

    return (
        <Grid container>
            <Grid container justify="center">
                <Grid className={classes.title} xs={12} md={6}> Регион - <span style={{fontWeight: 500, fontSize: 14}}>(Выберите ваш регион для доставки)</span> </Grid>
            </Grid>
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    <Paper className={classes.content}>
                        <Grid item>
                            <List>
                                { regions.map((i, index) => (
                                    <ListItem button key={index} onClick={() => {
                                        props.history.push(`/app/districts?regionId=${i.region.id}`)
                                    }}>
                                        <ListItemText>
                                            { i.region ? i.region.name : 'Unkonwn' }
                                        </ListItemText>
                                        <ListItemSecondaryAction> {i.restaurantCount}  </ListItemSecondaryAction>
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
                                            setIsLoading(true);
                                            fetchRestaurantsByRegions()
                                                .then(response => {
                                                    setIsLoading(false);
                                                    setRegions(response.data);
                                                })
                                        }}
                                    > Перезагрузить </Button>
                                )}
                            </Grid>
                        )}
                    </Paper>
                </Grid>

            </Grid>
        </Grid>
    )
};

export default withRouter(Regions);
