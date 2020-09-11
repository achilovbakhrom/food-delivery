import React, { useEffect, useState } from "react";
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    FormControl,
    Select,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import InputLabel from "@material-ui/core/InputLabel";

import MenuItem from "@material-ui/core/MenuItem";
import {
    fetchRestaurants,
    createTimeSlot,
    updateTimeSlot,
    fetchTimeSlotById,
} from "../../api/admin";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
const queryString = require('query-string');


const AddEditTimeSlot = props => {
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantId, setRestaurantId] = useState('');
    const [timeslotDate, setTimeslotDate] = useState('');
    const [defaultChecker, setDefaultChecker] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        let parsed = queryString.parse(props.history.location.search);
        if (parsed['timeslot_id'] !== undefined) {
            setIsLoading(true);
            fetchTimeSlotById(parsed['timeslot_id'])
                .then(response => {
                    setIsLoading(false);
                    setRestaurantId(response.data.restaurant.id);
                    setTimeslotDate(response.data.timeslotDate);
                    setDefaultChecker(response.data.default);
                })
        }
        fetchRestaurants({page: 0, size: 1000000})
            .then(response => {
                setRestaurants(response.data.content)
            });
    }, []);


    return (
        <Paper style={{width: '100%', padding: 20, color: '#555', marginTop: 50}}>
            <Grid container>
                <Typography variant="h5" color="primary">Добавить/Редактировать дату</Typography>
            </Grid>

            <Grid container style={{marginTop: 20}}>
                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-region-label">Ресторан</InputLabel>
                        <Select
                            id="region"
                            labelId="region-label"
                            labelWidth={80}
                            value={restaurantId}
                            onChange={(e) => {
                                setRestaurantId(e.target.value);
                            }}
                        >
                            {
                                restaurants.map((r) => (
                                    <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4} style={{paddingLeft: 10}}>
                    <FormControl variant="outlined" fullWidth>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          inputVariant="outlined"
                          format="yyyy-MM-dd"
                          id="date-picker-inline"
                          label="Дата"
                          value={timeslotDate ? new Date(timeslotDate): undefined}
                          onChange={(date, value) => {
                            setTimeslotDate(value);
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                </Grid>
            </Grid>

            <div style={{ textAlign: "left", margin: "10px 0 0" }}>
                <FormControlLabel
                  control={<Checkbox checked={defaultChecker} onChange={(event) => setDefaultChecker(event.target.checked)} />}
                  label="По умолчанию"
                  style={{ color: "#fff" }}
                />
            </div>

            <Grid container style={{marginTop: 30}} justify="flex-end">
                <Button
                    variant="contained"
                    disabled={
                        isLoading ||
                        !timeslotDate ||
                        restaurantId === ''
                    }
                    onClick={() => {
                        let parsed = queryString.parse(props.history.location.search);
                        setIsLoading(true);
                        if (parsed['timeslot_id']) {
                            updateTimeSlot({
                                id: parsed['timeslot_id'],
                                restaurantId,
                                timeslotDate,
                                default: defaultChecker
                            }).then(response => {
                                setIsLoading(false);
                                props.history.goBack()
                            })
                        } else {
                            setIsLoading(true);
                            createTimeSlot({
                                restaurantId,
                                timeslotDate,
                                default: defaultChecker
                            }).then(response => {
                                setIsLoading(false);
                                props.history.goBack();
                            })
                        }
                    }}
                >
                    Сохранить
                </Button>
            </Grid>
        </Paper>

    )
};

export default withRouter(AddEditTimeSlot);
