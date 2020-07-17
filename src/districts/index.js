import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {fetchDistrictsByRegionId} from "../api/restaurants";
import {withTranslation} from "react-i18next";

const queryString = require('query-string');

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

const Districts = props => {

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        const parsed = queryString.parse(props.location.search);
        const regionId = parsed ? parsed['regionId'] : undefined;
        if (regionId) {
            setIsLoading(true)
            fetchDistrictsByRegionId(regionId)
                .then(response => {
                    setIsLoading(false);
                    setDistricts(response.data);
                })
                .catch(() => {
                    props.history.push('/app/restaurants');
                })
        } else {
            props.history.push('/app/restaurants');
        }

    }, []);

    return (
        <Grid container>
            <Grid container justify="center">
                <Grid className={classes.title} xs={12} md={6}> {props.t("district.district")} - <span style={{fontWeight: 500, fontSize: 14}}>({props.t("district.district_desc")})</span> </Grid>
            </Grid>
            <Grid container justify="center">
                <Grid item xs={12} md={6}>
                    <Paper className={classes.content}>
                        <Grid item>
                            <List>
                                { districts.map((i, index) => (
                                    <ListItem button key={index} onClick={() => {
                                        props.history.push(`/app/restaurants?districtId=${i.district.id}`)
                                    }}>
                                        <ListItemText>
                                            { i.district.name || 'Unknown' }
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
                                            const parsed = queryString.parse(props.location.search);
                                            const regionId = parsed ? parsed['regionId'] : undefined;
                                            if (regionId) {
                                                setIsLoading(true)
                                                fetchDistrictsByRegionId(regionId)
                                                    .then(response => {
                                                        setIsLoading(false);
                                                        setDistricts(response.data);
                                                    })
                                                    .catch(() => {
                                                        props.history.push('/app/restaurants');
                                                    })
                                            } else {
                                                props.history.push('/app/restaurants');
                                            }
                                        }}
                                    > {props.t('districts.reload')} </Button>
                                )}
                            </Grid>
                        )}
                    </Paper>
                </Grid>

            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(Districts));
