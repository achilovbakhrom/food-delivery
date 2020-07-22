import React, { useState, useEffect } from "react";

import { Grid, TextField, Button, FormControl, InputLabel, withStyles, Paper } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { green } from "@material-ui/core/colors";

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { withTranslation } from "react-i18next";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { $store } from "./model/stores";
import { getCountriesEffect, getCurrenciesEffect, getUserDetailsEffect, updateUserEffect } from "./model/effects";
import { useStore } from "effector-react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { resetUpdateUserEvent, resetUserDetailsEvent } from "./model/events";
import { store } from "react-notifications-component";
import Alert from "@material-ui/lab/Alert/Alert";


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        overflow: 'auto',
        zIndex: 1000
    },
    mt20: {
        marginTop: '20px'
    },
    button: {
        marginTop: '50px',
        height: '50px',
        '&:hover': {
            backgroundColor: green.A700
        }
    },
    phone: {
        marginTop: '30px'
    },
    content: {
        padding: "10px 15px 30px",
    },
    loader: {
        padding: "20px 0",
        textAlign: "center"
    }
}));

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const UpdateUserModal = (props) => {
    const classes = useStyles();
    const { modalProps, setModalProps } = props;

    const { $userDetails, $countries, $currencies, $updateUser } = useStore($store);
    const { data: countryList } = $countries;
    const { data: currencyList } = $currencies;

    const [formFields, setFormFields] = useState(null);

    useEffect(() => {
        if (modalProps.userId) {
            getUserDetailsEffect(modalProps.userId);
            getCountriesEffect();
            getCurrenciesEffect();
        }
    }, [modalProps]);

    useEffect(() => {
        if ($userDetails.data && countryList.length) {
            const { firstName, lastName, phone, email, username, country, currency, language } = $userDetails.data;
            const countryT = country ? countryList.find(c => c.id === country.id) : null;

            setFormFields({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: countryT ? phone.replace(countryT.telCode, ""): phone,
                phonePrefix: countryT ? countryT.telCode : null,
                email: email,
                username: username,

                country: country ? { title: country.code, value: country.id }: null,
                currency: currency ? { title: `(${currency.code} ${currency.name})`, value: currency.id } : null,

                language: language,
            });
        }
    }, [$userDetails.data, countryList]);

    useEffect(() => {
        if ($updateUser.success) {
            store.addNotification({
                message: props.t('update_user.success'),
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });

            handleClose();
        }
    }, [$updateUser.success]);

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const isActionDisabled = () => {
        return $updateUser.loading || !formFields.firstName || !formFields.lastName || !formFields.email ||
            !validateEmail(formFields.email) || !formFields.country || !formFields.currency ||
            !formFields.username;
    };

    const onSubmit = () => {
        const data = {
            id: modalProps.userId,
            firstName: formFields.firstName,
            lastName: formFields.lastName,
            phone: `${formFields.phonePrefix}${formFields.phoneNumber}`,
            email: formFields.email,
            countryId: formFields.country.value,
            currencyId: formFields.currency.value,
            language: formFields.language,
            username: formFields.username,
        };

        updateUserEffect(data);
    };

    const handleClose = () => {
        setModalProps({
            visible: false,
            userId: null
        });
    };

    const onExited = () => {
        setFormFields(null);
        resetUserDetailsEvent();
        resetUpdateUserEvent();
    };

    const onFormFieldChange = (prop, val, propChild) => {
        if (propChild) {
            setFormFields({
                ...formFields,
                [prop]: {
                    ...formFields[prop],
                    [propChild]: val
                }
            });
        } else {
            setFormFields({
                ...formFields,
                [prop]: val
            });
        }
    };

    return (
        <Dialog
            open={modalProps.visible}
            onClose={handleClose}
            onExited={onExited}
            maxWidth={'sm'}
            fullWidth={true}
            aria-labelledby="customized-dialog-title"
        >
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                {props.t('update_user.update_user')}
            </DialogTitle>
            <DialogContent className={classes.content}>
                {$updateUser.error && <Alert severity="error" style={{marginBottom: 20}}>{$updateUser.error.title}</Alert>}
                <div>
                    {!formFields && <div className={classes.loader}>
                        <CircularProgress />
                    </div>}

                    {!!formFields && <Grid>
                        <TextField
                            variant="outlined"
                            label={props.t('register.firstName')}
                            fullWidth
                            value={formFields.firstName}
                            onChange={(e) => onFormFieldChange("firstName", e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label={props.t('register.lastName')}
                            fullWidth
                            value={formFields.lastName}
                            className={classes.mt20}
                            onChange={(e) => onFormFieldChange("lastName", e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label={"E-mail"}
                            fullWidth
                            value={formFields.email}
                            className={classes.mt20}
                            onChange={(e) => onFormFieldChange("email", e.target.value)}
                        />
                        <Grid container className={classes.phone} direction="row">
                            <Grid item xs={4}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={countryList.map(c => ({
                                        title: `+${c.telCode} (${c.code})`,
                                        value: c.id
                                    }))}
                                    getOptionLabel={(option) => option.title}
                                    onChange={(event, newInputValue) => {
                                        const f = countryList.find(c => c.id === newInputValue.value);
                                        setFormFields({
                                            ...formFields,
                                            country: newInputValue,
                                            phonePrefix: f.telCode
                                        });
                                    }}
                                    fullWidth
                                    value={formFields.country}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        label={props.t('register.code')}
                                        variant="outlined"
                                    />}
                                />
                            </Grid>
                            <Grid item xs={8} style={{ paddingLeft: 10 }}>
                                <TextField
                                    placeholder="Phone Number"
                                    variant="outlined"
                                    fullWidth
                                    value={formFields.phoneNumber}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        let pn = isNaN(value) ? "" : value;
                                        onFormFieldChange("phoneNumber", pn)
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.mt20} direction="row">
                            <Autocomplete
                                id="combo-box-currency"
                                options={currencyList.map(c => ({
                                    title: `${c.symbol} (${c.code}, ${c.name})`,
                                    value: c.id
                                }))}
                                getOptionLabel={(option) => option.title}
                                onChange={(event, newInputValue) => onFormFieldChange("currency", newInputValue)}
                                fullWidth
                                value={formFields.currency}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label={props.t('register.currency')}
                                    variant="outlined"
                                />}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.mt20}>
                            <FormControl variant="outlined" fullWidth className={classes.formControl}>
                                <InputLabel id="language">{props.t('register.language')}</InputLabel>
                                <Select
                                    id="language"
                                    labelId="language-label"
                                    variant="outlined"
                                    value={formFields.language}
                                    fullWidth
                                    labelWidth={70}
                                    onChange={(e) => onFormFieldChange("language", e.target.value)}
                                >
                                    {
                                        [{ id: 'en', name: 'English' }, { id: 'uz', name: "O'zbek" }, {
                                            id: 'ru',
                                            name: 'Русский'
                                        }].map((d) => (
                                            <MenuItem value={d.id} key={d.id}>{d.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <TextField
                            variant="outlined"
                            label={props.t('auth.login')}
                            fullWidth
                            value={formFields.username}
                            className={classes.mt20}
                            onChange={(e) => onFormFieldChange("username", e.target.value)}
                        />

                        <Button
                            variant="contained"
                            className={classes.mt20}
                            fullWidth
                            disabled={isActionDisabled()}
                            onClick={onSubmit}
                        >
                            {$updateUser.loading ? `${props.t('auth.loading')}...` : props.t('update_user.save')}
                        </Button>
                    </Grid>}
                </div>
            </DialogContent>
        </Dialog>
    );

};

export default withTranslation()(UpdateUserModal);
