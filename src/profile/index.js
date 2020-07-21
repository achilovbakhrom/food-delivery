import React, { useEffect, useState } from "react";
import {
    Grid,
    IconButton,
    Paper,
} from '@material-ui/core';
import {withTranslation} from "react-i18next";
import { Create } from "@material-ui/icons";
import { useStore } from "effector-react";

import { $store } from "../model/stores";
import { getCurrentUserEffect } from "../model/effects";

import { $store as $updateUserStore } from "../update-user-modal/model/stores";
import UpdateUserModal from "../update-user-modal";


const Profile = props => {
    const { $currentUser } = useStore($store);
    const { $updateUser } = useStore($updateUserStore);
    const { data: current } = $currentUser;

    const [updateUserModalProps, setUpdateUserModalProps] = useState({
        visible: false,
        userId: null
    });

    const isClient = current ? current.roles.indexOf('CLIENT') >= 0: false;

    useEffect(() => {
        if ($updateUser.success) {
            getCurrentUserEffect();
        }
    }, [$updateUser.success]);

    const onUpdateUserClick = (userId) => {
        setUpdateUserModalProps({
            visible: true,
            userId
        });
    };

    return (
        <Grid container style={{marginTop: 70}}>
            <Grid item xs={12}>
                <Paper style={{padding: 20, width: '100%', backgroundColor: 'white'}}>
                    <Grid container>
                        <Grid item xs={12} style={{fontSize: 18, fontWeight: 'bold', color: '#555'}}>
                            {props.t('profile.profile')}
                            {isClient && <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => onUpdateUserClick(current.id)}
                                onMouseDown={(event) => {event.preventDefault();}}
                                edge="end"
                                style={{ color: "#555", margin: "-5px 0 0" }}
                            >
                                <Create style={{ color: "#555"}} />
                            </IconButton>}
                        </Grid>
                        {current && <>
                            <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 20}}> {props.t('profile.firstName')}: {current.firstName} </Grid>
                            <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 8}}> {props.t('profile.lastName')}: {current.lastName} </Grid>
                            <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 8}}> {props.t('profile.phone')}: {current.phone} </Grid>
                            <Grid item xs={12} style={{fontSize: 15, color: '#555', marginTop: 8}}> {props.t('profile.email')}: {current.email} </Grid>
                        </>}
                    </Grid>
                </Paper>
            </Grid>
            <UpdateUserModal modalProps={updateUserModalProps} setModalProps={setUpdateUserModalProps} />
        </Grid>
    )
};

export default withTranslation()(Profile);
