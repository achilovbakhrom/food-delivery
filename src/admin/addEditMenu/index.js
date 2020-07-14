import React, { useEffect, useState } from "react";
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    FormControl,
    CircularProgress,
    Select
} from '@material-ui/core';

import InputLabel from "@material-ui/core/InputLabel";

import MenuItem from "@material-ui/core/MenuItem";
import {
    createFood,
    createRestaurant, createRestaurantFoods,
    fetchDistricts, fetchFoodById, fetchFoods,
    fetchRegions, fetchRestaurantById, fetchRestaurantFoodsById, fetchRestaurants, updateFood,
    updateRestaurant, updateRestaurantFoods, uploadPhotoFood,
    uploadPhotoRestaurant
} from "../../api/admin";
import {fetchCategories} from "../../api/restaurants";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
const queryString = require('query-string');



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddEditMenu = props => {

    const [foods, setFoods] = useState([]);
    const [foodId, setFoodId] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantId, setRestaurantId] = useState('');
    const [price, setPrice] = useState();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // let restaurant = localStorage.getItem('restaurant');
        let parsed = queryString.parse(props.history.location.search);
        if (parsed['menu_id'] !== undefined) {
            setIsLoading(true);
            fetchRestaurantFoodsById(parsed['menu_id'])
                .then(response => {
                    setIsLoading(false);
                    setFoodId(response.data.food.id);
                    setRestaurantId(response.data.restaurant.id);
                    setPrice(response.data.price);
                })
        }
        fetchFoods({page: 0, size: 1000000})
            .then(response => {
                setFoods(response.data.content)
            });
        fetchRestaurants({page: 0, size: 1000000})
            .then(response => {
                setRestaurants(response.data.content)
            });
    }, []);

    return (
        <Paper style={{width: '100%', padding: 20, color: '#555', marginTop: 50}}>
            <Grid container>
                <Typography variant="h5" color="primary">Добавить/Редактировать Меню</Typography>
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
                        <InputLabel id="demo-simple-select-region-label">Блюдо</InputLabel>
                        <Select
                            id="region"
                            labelId="region-label"
                            labelWidth={80}
                            value={foodId}
                            onChange={(e) => {
                                setFoodId(e.target.value);
                            }}
                        >
                            {
                                foods.map((r) => (
                                    <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4} style={{paddingLeft: 10}}>
                    <TextField
                        placeholder="Цена"
                        variant="outlined"
                        fullWidth
                        value={price}
                        onChange={(e) => {
                            setPrice(isNaN(e.target.value) ? 0 : e.target.value)
                        }}
                    />
                </Grid>
            </Grid>


            <Grid container style={{marginTop: 30}} justify="flex-end">
                <Button
                    variant="contained"
                    disabled={
                        isLoading ||
                        !price ||
                        foodId === undefined ||
                        restaurantId === undefined
                    }
                    onClick={() => {
                        let parsed = queryString.parse(props.history.location.search);
                        setIsLoading(true);
                        if (parsed['menu_id']) {
                            updateRestaurantFoods({
                                id: parsed['menu_id'],
                                foodId, restaurantId, price
                            }).then(response => {
                                setIsLoading(false);
                                props.history.goBack()
                            })
                        } else {
                            setIsLoading(true);
                            createRestaurantFoods({
                                foodId, restaurantId, price
                            }).then(response => {
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

export default withRouter(AddEditMenu);
