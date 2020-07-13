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
    createRestaurant,
    fetchDistricts,
    fetchRegions, fetchRestaurantById,
    updateRestaurant,
    uploadPhotoRestaurant
} from "../../api/admin";
const queryString = require('query-string');



const AddEditRestaurant = props => {

    const [current, setCurrent] = useState({address: {}});
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState();
    const [regionList, setRegionList] = useState([]);
    const [regionId, setRegionId] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [districtId, setDistrictId] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // let restaurant = localStorage.getItem('restaurant');
        let parsed = queryString.parse(props.history.location.search);
        if (parsed['restaurant_id'] !== undefined) {
            setIsLoading(true);
            fetchRestaurantById(parsed['restaurant_id'])
                .then(response => {
                    setIsLoading(false);
                    setCurrent(response.data);
                    setRegionId(response.data.address ? response.data.address.regionId : undefined);
                    setDistrictId(response.data.address ? response.data.address.districtId : undefined);

                    if (response.data.address && response.data.address.regionId) {
                        fetchDistricts(response.data.address.regionId)
                            .then(r => {
                                setDistrictList(r.data);
                            })
                    }

                })
        }

        fetchRegions()
            .then(response => {
                setRegionList(response.data)
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
                <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-region-label">Регион</InputLabel>
                        <Select
                            id="region"
                            labelId="region-label"
                            labelWidth={80}
                            value={regionList ? regionId : ''}
                            onChange={(e) => {
                                setRegionId(e.target.value);
                                setCurrent({...current, address: {...current.address, regionId: e.target.value, districtId: undefined}})
                                setDistrictList([]);
                                fetchDistricts(e.target.value)
                                    .then(response => {
                                        setDistrictList(response.data);
                                    })
                            }}
                        >
                            {
                                regionList.map((r) => (
                                    <MenuItem value={r.id} key={r.id}>{r.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} style={{paddingLeft: 10}}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="demo-simple-select-district-label">Район</InputLabel>
                        <Select
                            id="district"
                            labelId="district-label"
                            value={districtList.length ? districtId : ''}
                            labelWidth={80}
                            onChange={(e) => {
                                setDistrictId(e.target.value);
                                setCurrent({...current, address: {...current.address, districtId: e.target.value}});
                            }}
                        >
                            {
                                districtList.map((d) => (
                                    <MenuItem value={d.id} key={d.id}>{d.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container style={{marginTop: 20}}>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Улица"
                        value={current.address.street || ''}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                address: {
                                    ...current.address, street: e.target.value
                                }
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={4} style={{paddingLeft: 10}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Дом"
                        value={current.address.house || ''}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                address: {
                                    ...current.address, house: e.target.value
                                }
                            })
                        }}
                    />
                </Grid>
                <Grid item xs={4} style={{paddingLeft: 10}}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Квартира"
                        value={current.address.apartment || ''}
                        onChange={(e) => {
                            setCurrent({
                                ...current,
                                address: {
                                    ...current.address, apartment: e.target.value
                                }
                            })
                        }}
                    />
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
                        !current.address.districtId === undefined ||
                        !current.address.regionId === undefined ||
                        !current.address.street
                    }
                    onClick={() => {
                        let parsed = queryString.parse(props.history.location.search);
                        setIsLoading(true);
                        if (parsed['restaurant_id']) {
                            updateRestaurant(current)
                                .then(response => {
                                    if (files) {
                                        uploadPhotoRestaurant(response.data.id, files[0])
                                            .then(_ => {
                                                localStorage.removeItem('restaurant');
                                                setIsLoading(false);
                                                props.history.goBack()
                                            }).catch(e => {
                                                setIsLoading(false);

                                            })
                                    } else {
                                        localStorage.removeItem('restaurant');
                                        setIsLoading(false);
                                        props.history.goBack()
                                    }


                                })
                        } else {
                            createRestaurant(current)
                                .then(response => {
                                    console.log(response)
                                    if (files) {
                                        uploadPhotoRestaurant(response.data.id, files[0])
                                            .then(r => {
                                                console.log('res', r)
                                                localStorage.removeItem('restaurant');
                                                setIsLoading(false);
                                                props.history.goBack()
                                            })
                                            .catch(e => {
                                                setIsLoading(false);
                                                console.log('error', e)
                                            })

                                    } else {
                                        localStorage.removeItem('restaurant');
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

export default withRouter(AddEditRestaurant);
