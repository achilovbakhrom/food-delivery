import React, { useEffect, useState } from "react";
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button,
    FormControl,
    CircularProgress
} from '@material-ui/core';
import {DropzoneDialog} from 'material-ui-dropzone'
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
    createFood,
    createRestaurant,
    fetchDistricts, fetchFoodById,
    fetchRegions, fetchRestaurantById, updateFood,
    updateRestaurant, uploadPhotoFood,
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

const AddEditFood = props => {

    const [current, setCurrent] = useState({address: {}});
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState();

    const [categoryList, setCategoryList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // let restaurant = localStorage.getItem('restaurant');
        let parsed = queryString.parse(props.history.location.search);
        if (parsed['food_id'] !== undefined) {
            setIsLoading(true);
            fetchFoodById(parsed['food_id'])
                .then(response => {
                    setIsLoading(false);
                    setCurrent(response.data);
                    setCategories(response.data.categories || [])
                })
        }
        fetchCategories({page: 0, size: 100000})
            .then(response => {
                setCategoryList(response.data.content)
            })
    }, []);


    if (files) {
        let reader = new FileReader();
        reader.onload = function () {
            document.getElementById('photo').src = reader.result;
        };
        reader.readAsDataURL(files[0]);
    }

    return (
        <Paper style={{width: '100%', padding: 20, color: '#555', marginTop: 50}}>
            <Grid container>
                <Typography variant="h5" color="primary">Добавить/Редактировать Ресторан</Typography>
            </Grid>

            <Grid container style={{marginTop: 20}} alignItems="center">
                {
                    files || current.photo ? (
                        <img id="photo" src={current.photo ? current.photo.url : undefined} alt="..." width={200} height={200} style={{borderRadius: 100}}/>
                    ) : undefined
                }
                <Button
                    onClick={() => {
                        setOpen(true)
                    }}
                    style={{height: 45, marginLeft: 10}}
                >
                    Добавить фото
                </Button>
                <DropzoneDialog
                    open={open}
                    onSave={(files, e) => {
                        console.log(files)
                        setFiles(files);
                        setOpen(false);
                    }}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    maxFileSize={5000000}
                    filesLimit={1}
                    onClose={() => {
                        setOpen(false)
                    }}
                />
            </Grid>


            <Grid container style={{marginTop: 20}}>
                <Grid item xs={4}>
                    <TextField
                        placeholder="Название (En)"
                        variant="outlined"
                        fullWidth
                        value={current.name}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                name: e.target.value
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={4} style={{paddingLeft: 10}}>
                    <TextField
                        placeholder="Название (Ру)"
                        variant="outlined"
                        fullWidth
                        value={current.nameRu}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                nameRu: e.target.value
                            })
                        }}
                    />
                </Grid>

                <Grid item xs={4} style={{paddingLeft: 10}}>
                    <TextField
                        placeholder="Название (Uz)"
                        variant="outlined"
                        fullWidth
                        value={current.nameUz}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                nameUz: e.target.value
                            })
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container style={{marginTop: 20}}>


                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="categories-id">Категории</InputLabel>
                        <Select
                            labelId="mutiple-chip-categories"
                            id="mutiple-categories"
                            multiple
                            variant="outlined"
                            value={categories}
                            onChange={(e) => {
                                const { value } = e.target;
                                setCategories(value);
                                setCurrent({...current, categories: value});
                            }}
                            // input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div>
                                    {selected.map((value) => {
                                        let f = categoryList.find(c => c && c.id === value);
                                        return (
                                            <Chip key={f ? f.id : 0} label={f ? f.name : '-'} />
                                        )
                                    })}
                                </div>
                            )}
                            MenuProps={MenuProps}
                            style={{padding: 0}}
                        >
                            {categoryList.map((cat) => (
                                <MenuItem key={cat.name} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <TextField
                    placeholder='Описание'
                    fullWidth
                    multiline={true}
                    rows={4}
                    variant="outlined"
                    value={current.description}
                    onChange={(e) => {
                        setCurrent({
                            ...current,
                            description: e.target.value
                        })
                    }}
                />
            </Grid>
            <Grid container style={{marginTop: 30}} justify="flex-end">
                <Button
                    variant="contained"
                    disabled={
                        isLoading ||
                        !current.name ||
                        !current.nameRu ||
                        !current.nameUz ||
                        !current.categories ||
                        !current.categories.length
                    }
                    onClick={() => {
                        let parsed = queryString.parse(props.history.location.search);
                        setIsLoading(true);
                        if (parsed['food_id']) {
                            updateFood({...current, foodType: 'FIRST_MEAL'})
                                .then(response => {
                                    if (files) {
                                        uploadPhotoFood(response.data.id, files[0])
                                            .then(_ => {
                                                setIsLoading(false);
                                                props.history.goBack()
                                            }).catch(e => {
                                                setIsLoading(false);

                                            })
                                    } else {
                                        setIsLoading(false);
                                        props.history.goBack()
                                    }
                                })
                        } else {
                            createFood({...current, foodType: 'FIRST_MEAL'})
                                .then(response => {

                                    if (files) {
                                        uploadPhotoFood(response.data.id, files[0])
                                            .then(r => {
                                                setIsLoading(false);
                                                props.history.goBack()
                                            })
                                            .catch(e => {
                                                setIsLoading(false);
                                            })

                                    } else {
                                        setIsLoading(false);
                                        props.history.goBack()
                                    }
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

export default withRouter(AddEditFood);
