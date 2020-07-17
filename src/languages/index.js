import React from "react";
import { Grid } from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import i18n from '../i18';
import {withTranslation} from "react-i18next";
import Cookie from 'js-cookie';

const Languages = props => {
    return (
        <Grid container>

            <Grid item xs={12} style={{marginTop: 40}}>
                <Grid container direction="column" justify="center">
                    <Grid item>
                        <img
                            src={require('../assets/img/usa-flag.png')}
                            width={400}
                            height={300} alt=''
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                                Cookie.set('language', 'en');
                                i18n.changeLanguage('en').then(_ => {
                                    props.history.push('/app/address')
                                })

                            }}
                        />
                    </Grid>
                    <Grid item style={{fontWeight: 'bold', fontSize: 18}}>
                        ENG
                    </Grid>
                </Grid>

            </Grid>
            <Grid item xs={12} style={{marginTop: 20}}>
                <Grid container direction="column" justify="center">
                    <Grid item>
                        <img
                            src={require('../assets/img/russian-flag.png')}
                            width={400}
                            height={300}
                            alt=''
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                                Cookie.set('language', 'ru');
                                i18n.changeLanguage('ru').then(_ => {
                                    props.history.push('/app/address')
                                });
                            }}
                        />
                    </Grid>
                    <Grid item style={{fontWeight: 'bold', fontSize: 18}}>
                        RUS
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{marginTop: 20}}>
                <Grid container direction="column" justify="center">
                    <Grid item>
                        <img
                            src={require('../assets/img/uzb-flag.png')}
                            width={400}
                            height={300} alt=''
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                                Cookie.set('language', 'uz');
                                i18n.changeLanguage('uz').then(_ => {
                                    props.history.push('/app/address')
                                });
                            }}
                        />
                    </Grid>
                    <Grid item style={{fontWeight: 'bold', fontSize: 18}}>
                        UZB
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(Languages));
