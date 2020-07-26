import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  FormControl,
  Select
} from '@material-ui/core';

import InputLabel from "@material-ui/core/InputLabel";

import MenuItem from "@material-ui/core/MenuItem";
import {
  fetchRestaurants,
  fetchTimeSlots,
  fetchTimeSlotStatuses,
  fetchTimeSlotItemById,
  createTimeSlotItem,
  updateTimeSlotItem,
} from "../../api/admin";

const queryString = require('query-string');


const AddEditTimeSlot = props => {
  const [restaurants, setRestaurants] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [restaurantId, setRestaurantId] = useState('');
  const [timeslotId, setTimeslotId] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let parsed = queryString.parse(props.history.location.search);
    if (parsed['timeslot_item_id'] !== undefined) {
      setIsLoading(true);

      fetchTimeSlotItemById(parsed['timeslot_item_id'])
        .then(response => {
          const restaurantId = response.data.restaurant.id;

          fetchTimeSlots({ restaurantId })
            .then(response => {
              setTimeSlots(response.data)
            });

          setIsLoading(false);
          setRestaurantId(restaurantId);
          setTimeslotId(response.data.timeslot.id);
          setStartDate(response.data.startDate);
          setEndDate(response.data.endDate);
          setStatus(response.data.status);
          setDescription(response.data.description);
        })
    }
    fetchRestaurants({ page: 0, size: 1000000 })
      .then(response => {
        setRestaurants(response.data.content)
      });

    fetchTimeSlotStatuses()
      .then(response => {
        setStatuses(response.data)
      });
  }, []);

  const restaurantChange = (e) => {
    const restaurantId = e.target.value;

    setRestaurantId(restaurantId);

    fetchTimeSlots({ restaurantId })
      .then(response => {
        setTimeSlots(response.data)
      });

    setTimeslotId('')
  };

  return (
    <Paper style={{ width: '100%', padding: 20, color: '#555', marginTop: 50 }}>
      <Grid container>
        <Typography variant="h5" color="primary">Добавить/Редактировать дату</Typography>
      </Grid>

      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="region-label">Ресторан</InputLabel>
            <Select
              id="region"
              labelId="region-label"
              labelWidth={80}
              value={restaurantId}
              onChange={restaurantChange}
            >
              {
                restaurants.map((r) => (
                  <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4} style={{ paddingLeft: 10 }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="timeslot-label">Даты</InputLabel>
            <Select
              id="timeslot"
              labelId="timeslot-label"
              labelWidth={80}
              value={timeslotId}
              onChange={(e) => setTimeslotId(e.target.value)}
            >
              {
                timeSlots.map((r) => (
                  <MenuItem value={r.id} key={r.id}>{r.timeslotDate}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              id="date"
              label="От"
              type="datetime-local"
              value={startDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={4} style={{ paddingLeft: 10 }}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              id="date"
              label="До"
              type="datetime-local"
              value={endDate}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid item xs={4} style={{ paddingLeft: 10 }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-status-label">Статус</InputLabel>
            <Select
              id="status"
              labelId="status-label"
              labelWidth={80}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {
                statuses.map((r) => (
                  <MenuItem value={r.code} key={r.code}>{r.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <div style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              label="Описание"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </Grid>
      </div>

      <Grid container style={{ marginTop: 30 }} justify="flex-end">
        <Button
          variant="contained"
          disabled={
            isLoading ||
            !timeslotId ||
            !startDate ||
            !endDate ||
            !status ||
            !description
          }
          onClick={() => {
            let parsed = queryString.parse(props.history.location.search);
            setIsLoading(true);
            if (parsed['timeslot_item_id']) {
              updateTimeSlotItem({
                id: parsed['timeslot_item_id'],
                timeslotId,
                startDate,
                endDate,
                status,
                description
              }).then(response => {
                setIsLoading(false);
                props.history.goBack()
              })
            } else {
              setIsLoading(true);
              createTimeSlotItem({
                timeslotId,
                startDate,
                endDate,
                status,
                description
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
