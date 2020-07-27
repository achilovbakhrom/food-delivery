import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  FormControl,
  CircularProgress
} from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone'
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  createRestaurantCategory, fetchCategories,
  fetchDistricts,
  fetchRegions, fetchRestaurantCategoryById, fetchRestaurants,
  updateRestaurantCategory,
  uploadPhotoRestaurant
} from "../../api/admin";

const queryString = require('query-string');


const AddEditRestaurantCategory = props => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formFields, setFormFields] = useState({});

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const { restaurant_category_id } = queryString.parse(props.history.location.search);
    if (restaurant_category_id) {
      setIsLoading(true);

      fetchRestaurantCategoryById(restaurant_category_id)
        .then(response => {
          setIsLoading(false);

          const { restaurant, category, sorder } = response.data;
          setFormFields({
            id: restaurant_category_id,
            restaurantId: restaurant.id,
            categoryId: category.id,
            sorder,
          });

        })
    }

    fetchRestaurants({ page: 0, size: 1000000 })
      .then(response => {
        setRestaurants(response.data.content)
      });

    fetchCategories({ page: 0, size: 1000000 })
      .then(response => {
        setCategories(response.data.content)
      });


  }, []);

  return (
    <Paper style={{ width: '100%', padding: 20, color: '#555', marginTop: 50 }}>
      <Grid container>
        <Typography variant="h5" color="primary">Добавить/Редактировать Категории ресторана</Typography>
      </Grid>

      <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-restaurant-label">Ресторан</InputLabel>
            <Select
              id="restaurant"
              labelId="restaurant-label"
              labelWidth={80}
              value={formFields.restaurantId || ""}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  restaurantId: e.target.value
                });
              }}
            >
              {restaurants.map((r) => (
                <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} style={{paddingLeft: 10}}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-category-label">Категория</InputLabel>
            <Select
              id="category"
              labelId="category-label"
              labelWidth={80}
              value={formFields.categoryId || ""}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  categoryId: e.target.value
                });
              }}
            >
              {categories.map((r) => (
                <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} style={{paddingLeft: 10}}>
          <TextField
            variant="outlined"
            fullWidth
            label="Порядок"
            type="number"
            value={formFields.sorder || ""}
            onChange={(e) => {
              setFormFields({
                ...formFields,
                sorder: e.target.value
              });
            }}
          />
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 30 }} justify="flex-end">
        <Button
          variant="contained"
          disabled={
            isLoading ||
            !formFields.restaurantId ||
            !formFields.categoryId ||
            !formFields.sorder
          }
          onClick={() => {
            let parsed = queryString.parse(props.history.location.search);
            setIsLoading(true);
            if (parsed['restaurant_category_id']) {
              updateRestaurantCategory(formFields)
                .then(response => {
                  setIsLoading(false);
                  props.history.goBack()
                })
            } else {
              createRestaurantCategory(formFields)
                .then(response => {
                  setIsLoading(false);
                  props.history.goBack()
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

export default withRouter(AddEditRestaurantCategory);
