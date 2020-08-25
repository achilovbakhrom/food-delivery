import React, { useEffect, useState } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { fetchTimeSlots } from "../../api/restaurants";
import moment from "moment";
import Moment from "react-moment";
import 'moment/locale/ru';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import { withTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#fff",
  },
  wrapper: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  loader: {
    textAlign: "center",
    padding: 40
  },
  timeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  time: {
    minWidth: 200
  },
  close: {
    padding: "24px 24px 0"
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const PaymentOneTimeModal = (props) => {
  const {
    modalProps,
    setModalProps,
    restaurantId,
    setDeliveryTime,
  } = props;

  const classes = useStyles();

  const [timeSlots, setTimeSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [timeData, setTimeData] = React.useState({});

  useEffect(() => {
    setLoading(true);
    fetchTimeSlots({ restaurantId })
      .then(response => {
        setTimeSlots(response.data);
        setLoading(false);
        setLoaded(true);
      })
  }, []);

  const today = moment();
  const tomorrow = moment().add(1, 'days');
  const timeSlotsFormatted = [];

  timeSlots.forEach((item) => {
    const newItem = { ...item };
    const itemDate = moment(item.timeslotDate);
    const isToday = today.isSame(itemDate, 'day');
    const isTomorrow = tomorrow.isSame(itemDate, 'day');

    if (isToday || itemDate.isAfter()) {
      if (isToday) {
        newItem.today = true;
      }

      if (isTomorrow) {
        newItem.tomorrow = true;
      }

      timeSlotsFormatted.push(newItem);
    }
  });

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onTimeChange = (event, timeslot) => {
    const timeslotItemId = event.target.value;
    const timeslotItem = timeslot.items.filter((item) => item.id === parseInt(timeslotItemId));

    setTimeData({
      timeslotId: timeslot.id,
      timeslotItemId: parseInt(timeslotItemId),
      selected: timeslotItemId,
      timeslotDate: timeslot.timeslotDate,
      timeslotItem: timeslotItem[0]
    });
  };

  const onChooseCLick = () => {
    setDeliveryTime(Object.keys(timeData).length ? timeData : null);
    setModalProps({ ...modalProps, visible: false });
  };

  const handleClose = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const onExited = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  return (
    <Dialog
      open={modalProps.visible}
      onClose={handleClose}
      onExited={onExited}
      maxWidth={false}
      fullWidth={true}
      aria-labelledby="customized-dialog-title"
    >
      <div style={{ position: "relative", minHeight: 300 }}>
        <div className={classes.wrapper}>
          {loading && <div className={classes.loader}>
            <CircularProgress variant="indeterminate" color="primary" />
          </div>}
          {!!timeSlotsFormatted.length && <>
            <AppBar position="static" color="default">
              <Tabs
                value={tabValue}
                onChange={tabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {timeSlotsFormatted.map((item, index) => <Tab
                  key={item.id}
                  label={<span>
                    <Moment locale={"ru"} format="MMM Do" date={item.timeslotDate} />
                    <div>
                      {item.today ? props.t('payment.today') : item.tomorrow ? props.t('payment.tomorrow') : ""}
                    </div>
                  </span>
                  }
                  {...a11yProps(index)}
                />)}

              </Tabs>
            </AppBar>
            {timeSlotsFormatted.map((item, index) => <TabPanel key={item.id} value={tabValue} index={index}>
              <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="gender1" value={timeData.selected} onChange={(event) => onTimeChange(event, item)}>
                  {item.items.map((time) => <FormControlLabel
                    key={time.id}
                    value={time.id.toString()}
                    control={<Radio />}
                    label={<div className={classes.timeRow}>
                      <div className={classes.time}>
                        <Moment format="HH:mm" date={time.startDate} /> - <Moment format="HH:mm" date={time.endDate} />
                      </div>
                      <div>{time.status}</div>
                    </div>}
                  />)}
                </RadioGroup>

                {/*{item.items.map((time) => <div>*/}
                {/*  <Radio*/}
                {/*    checked={timeData.timeslotItemId === time.id.toString()}*/}
                {/*    onChange={(event) => onTimeChange(event, item, time)}*/}
                {/*    value={time.id.toString()}*/}
                {/*    name="radio-button-demo"*/}
                {/*    inputProps={{ 'aria-label': 'A' }}*/}
                {/*  />*/}
                {/*</div>)}*/}

                {!item.items.length && <div>
                  {props.t('payment.noData')}
                </div>}
              </FormControl>
            </TabPanel>)}
          </>}

          {loaded && !timeSlotsFormatted.length && <div className={classes.close}>
            {props.t('payment.noData')}
          </div>}

          <div className={classes.close}>
            <Button onClick={onChooseCLick} variant="contained" color="secondary">{props.t('payment.choose')}</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default withTranslation()(PaymentOneTimeModal);
