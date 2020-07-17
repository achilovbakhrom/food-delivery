import React, { useEffect, useState } from "react";
import {withRouter} from 'react-router-dom';
import {
    Grid,
    Paper,
    TextField,
    Typography,
    Button
} from '@material-ui/core';
import {DropzoneDialog} from 'material-ui-dropzone'
import {
    createCategory, fetchCategoryById, updateCategory, uploadPhotoCategory
} from "../../api/admin";
const queryString = require('query-string');



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const AddEditCategory = props => {

    const [current, setCurrent] = useState({address: {}});
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState();

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // let restaurant = localStorage.getItem('restaurant');
        let parsed = queryString.parse(props.history.location.search);
        if (parsed['category_id'] !== undefined) {
            setIsLoading(true);
            fetchCategoryById(parsed['category_id'])
                .then(response => {
                    setIsLoading(false);
                    setCurrent(response.data);
                })
        }

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

            <Grid container style={{marginTop: 30}} justify="flex-end">
                <Button
                    variant="contained"
                    disabled={
                        isLoading ||
                        !current.name ||
                        !current.nameRu ||
                        !current.nameUz
                    }
                    onClick={() => {
                        let parsed = queryString.parse(props.history.location.search);
                        setIsLoading(true);
                        if (parsed['category_id']) {
                            updateCategory({...current})
                                .then(response => {
                                    if (files) {
                                        uploadPhotoCategory(response.data.id, files[0])
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
                            createCategory({...current, code: "test"})
                                .then(response => {

                                    if (files) {
                                        uploadPhotoCategory(response.data.id, files[0])
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

export default withRouter(AddEditCategory);
