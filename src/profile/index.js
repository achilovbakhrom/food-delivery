import React, {useState} from "react";
import { Grid, Paper } from '@material-ui/core';
import {currentUser} from "../api/auth";
import {withTranslation} from "react-i18next";

const Profile = props => {

    const [current, setCurrent] = useState();

    React.useEffect(() => {
        currentUser()
            .then(response => {
                console.log(response.data)
                setCurrent(response.data);
            })
    }, [])

    return (
        <Grid container style={{marginTop: 70}}>
            <Grid item xs={12}>
                <Paper style={{padding: 20, width: '100%', backgroundColor: 'white'}}>
                    <Grid container>
                        <Grid item xs={12} style={{fontSize: 18, fontWeight: 'bold', color: '#555'}}> {props.t('profile.profile')} </Grid>
                        <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 20}}> {props.t('profile.firstName')}: {current && current.firstName} </Grid>
                        <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 8}}> {props.t('profile.lastName')}: {current && current.lastName} </Grid>
                        <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 8}}> {props.t('profile.phone')}: {current && current.phone} </Grid>
                        <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 8}}> {props.t('profile.email')}: {current && current.email} </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
};

export default withTranslation()(Profile);
