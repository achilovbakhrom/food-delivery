import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Typography,
  GridList,
  withWidth,
  isWidthUp,
  CircularProgress,
  Button,
  Paper,
  FormControl, InputLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { fetchRestaurants } from "../api/restaurants";
import { withTranslation } from "react-i18next";
import Cookies from 'js-cookie';
import { fetchDistricts, fetchRegions } from "../api/admin";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";

const queryString = require('query-string');

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: '80px',
    fontSize: '24px',
    color: 'white',
    fontWeight: 'bold'
  },
  icon: {
    color: 'white',
  },
  image: {
    width: '300px',
    height: '300px'
  },

  gridItem: {
    display: 'flex',
    flexFlow: 'row'

  }
}));
const size = 40;

const Restaurants = props => {

  const classes = useStyles();

  const [restaurants, setRestaurants] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [filterProps, setFilterProps] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    fetchRegions()
      .then(response => {
        setRegionList(response.data)
      })
  }, []);

  useEffect(() => {
    // const parsed = queryString.parse(props.location.search);
    setIsLoading(true);
    setIsEnd(false);
    setPage(0);

    fetchRestaurants({ ...filterProps, size, page: 0 })
      .then(response => {
        setIsLoading(false);
        setRestaurants(response.data.content);
        setIsEnd(response.data.content.length < size)
      })
      .catch(error => {
        setIsLoading(false);
        props.history.push('/app/restaurants')
      })
  }, [filterProps]);

  useEffect(() => {
    // const parsed = queryString.parse(props.location.search);
    setIsLoading(true);
    fetchRestaurants({ ...filterProps, size, page })
      .then(response => {
        setIsLoading(false);
        setRestaurants([...restaurants, ...response.data.content]);
        setIsEnd(response.data.content.length < size)
      })
      .catch(error => {
        setIsLoading(false);
        props.history.push('/app/restaurants')
      })
  }, [page]);

  const getGridListCols = () => {
    // if (isWidthUp('lg', props.width)) {
    //     return 3;
    // }
    if (isWidthUp('md', props.width)) {
      return 2;
    }

    if (isWidthUp('xs', props.width)) {
      return 1;
    }
    return 1;
  };

  const imageSize = () => {
    if (isWidthUp('md', props.width)) {
      return 250;
    }

    if (isWidthUp('xs', props.width)) {
      return 140;
    }
    return 1;
  };

  const onFilterChange = (prop, value, resetPage = false) => {
    const data = { ...filterProps, [prop]: value,  };
    if (resetPage) {
      delete data.page;
    }
    setFilterProps(data);
  };

  const onRegionChange = (e) => {
    const regionId = e.target.value;
    const newFilterProps = { ...filterProps, regionId, districtId: undefined }

    setDistrictList([]);
    setFilterProps(newFilterProps);

    fetchDistricts(regionId)
      .then(response => {
        setDistrictList(response.data);
      })
  };

  return (
    <Grid container justify='center'>
      <Grid item className={classes.title} xs={12}>
        <div> {props.t("restaurants.restaurants")} </div>
      </Grid>

      <Grid container style={{ margin: "20px 0 25px" }}>
        <Grid item xs={6} md={4}>
          <FormControl variant="outlined" fullWidth className={classes.formControl}>
            <InputLabel id="region">{props.t('payment.region')}</InputLabel>
            <Select
              id="region"
              labelId="region-label"
              labelWidth={80}
              variant="outlined"
              value={regionList ? filterProps.regionId : ''}
              fullWidth
              onChange={onRegionChange}
            >
              <MenuItem value={undefined} key={null}>Все</MenuItem>
              {
                regionList.map((r) => (
                  <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={5} style={{ paddingLeft: 10 }}>
          <FormControl variant="outlined" fullWidth className={classes.formControl}>
            <InputLabel id="district">{props.t('payment.district')}</InputLabel>
            <Select
              id="district"
              labelId="district-label"
              variant="outlined"
              value={districtList.length ? filterProps.districtId : ''}
              labelWidth={80}
              fullWidth
              label={props.t('payment.district')}
              onChange={(e) => onFilterChange("districtId", e.target.value)}
            >
              <MenuItem value={undefined} key={null}>Все</MenuItem>
              {
                districtList.map((d) => (
                  <MenuItem value={d.id} key={d.id}>{d.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </Grid>
      </Grid>

      <Grid item xs={12}>
        {
          isLoading ? undefined : (
            <GridList spacing={15} cellHeight={imageSize() * 1.1} cols={getGridListCols()}>
              {
                restaurants && restaurants.length ? restaurants.map((item, index) => (
                  <ListItem key={index} cols={1} style={{ pointer: 'cursor' }} onClick={() => {
                    Cookies.set('restaurantId', item.id);
                    props.history.push(`/app/categories?restaurantId=${item.id}`)
                  }}>
                    <ListItemIcon>
                      <img
                        src={item.photo ? item.photo.url : require("../assets/img/burgers.jpg")}
                        alt="burger"
                        width={imageSize()}
                        height={imageSize() * 1.1}
                        style={{ borderBottomLeftRadius: 10, borderTopLeftRadius: 10, objectFit: 'cover' }} />
                    </ListItemIcon>
                    <div style={{
                      height: '100%',
                      backgroundColor: 'white',
                      flexGrow: 1,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      padding: 20
                    }}>
                      <Typography variant='inherit' style={{ color: '#555', fontSize: 20 }}>{item.name}</Typography>
                      <br />
                    </div>
                  </ListItem>
                )) : (
                  <Grid container>
                    <Grid xs={12}>
                      <Paper style={{
                        width: '100%',
                        padding: 20,
                        textAlign: 'center',
                        color: '#555',
                        backgroundColor: 'white'
                      }}>
                        {props.t("restaurants.empty")}
                      </Paper>
                    </Grid>
                  </Grid>
                )
              }
            </GridList>
          )
        }
      </Grid>
      <Grid container justify="center">
        {isEnd ? undefined : (
          isLoading ? (
            <CircularProgress color="primary" variant="indeterminate" />
          ) : (
            <Button variant="contained" fullWidth onClick={() => {
              setPage(page + 1)
            }}> {props.t("restaurants.more")} </Button>
          )
        )}
      </Grid>
    </Grid>
  )
};

export default withRouter(withTranslation()(withWidth()(Restaurants)));
