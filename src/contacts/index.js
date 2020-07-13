import React, {useState} from "react";
import { Grid, Paper } from '@material-ui/core';
import {withTranslation} from "react-i18next";

const Contacts = props => {

    return (
        <Grid container style={{marginTop: 70}}>
            <Grid item xs={12}>
                <Paper style={{padding: 20, width: '100%', backgroundColor: 'white'}}>
                    <Grid container>
                        <Grid item xs={12} style={{fontSize: 18, fontWeight: 'bold', color: '#555'}}> {props.t('contacts.contacts')} </Grid>
                        <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 20}}> {props.t('contacts.phone')}: <strong>(209)-733-7777</strong> </Grid>
                        <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 20}}> {props.t('contacts.email')}: <strong>uzchef@gmail.com</strong> </Grid>

                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
};

export default withTranslation()(Contacts);
