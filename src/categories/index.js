import React, { useEffect, useState } from "react";
import { withRouter } from 'react-router-dom';
import {
    Grid,
    Typography,
    GridList,
    GridListTile,
    GridListTileBar,
    IconButton,
    withWidth,
    isWidthUp,
    CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
import {fetchCategories} from "../api/restaurants";
import {withTranslation} from "react-i18next";

const queryString = require('query-string');

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: '80px',
        fontSize: '18px',
        color: 'white'
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

const Menu = props => {

    const classes = useStyles();

    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getGridListCols = () => {
        // if (isWidthUp('lg', props.width)) {
        //     return 3;
        // }

        if (isWidthUp('md', props.width)) {
            return 2;
        }

        if (isWidthUp('xs', props.width)) {
            return 2;
        }

        return 2;
    };

    useEffect(() => {
        setIsLoading(true)
        fetchCategories({page: 0, size: 100})
            .then(response => {
                setIsLoading(false)
                setCategoryList(response.data.content);
            })
    }, []);

    return (
        <Grid container >
            <Grid item className={classes.title} xs={12}>
                <Typography> {props.t('categories.categories')} </Typography>
            </Grid>
            <Grid item>
                <GridList spacing={15} cellHeight={300} cols={(() => {
                    if (isWidthUp('md', props.width)) {
                        return 4;
                    }
                    if (isWidthUp('xs', props.width)) {
                        return 2;
                    }
                    return 1;
                })()}>
                    {
                        categoryList.map((cat, index) => {
                            if (index%3 === 0) {
                                return (
                                    <GridListTile
                                        onClick={() => {
                                            const parsed = queryString.parse(props.location.search);
                                            props.history.push(`/app/menu?restaurantId=${parsed['restaurantId']}&categoryId=${cat.id}`);
                                        }}
                                        key={1} cols={(() => {
                                        if (isWidthUp('md', props.width)) {
                                            return 1;
                                        }

                                        if (isWidthUp('xs', props.width)) {
                                            return 2;
                                        }

                                        return 1;
                                    })()}>
                                        <img src={require('../assets/img/burgers.jpg')} alt={"f1"} />
                                        <GridListTileBar
                                            title={cat.name}
                                            actionIcon={
                                                <IconButton aria-label={`info about`} className={classes.icon}>
                                                    <Info />
                                                </IconButton>
                                            }
                                        />
                                    </GridListTile>
                                )
                            } else {
                                return (
                                    <GridListTile
                                        onClick={() => {
                                            const parsed = queryString.parse(props.location.search);
                                            props.history.push(`/app/menu?restaurantId=${parsed['restaurantId']}&categoryId=${cat.id}`);
                                        }}
                                        key={1}
                                        cols={1}>
                                        <img src={require('../assets/img/burgers.jpg')} alt={"f1"} />
                                        <GridListTileBar
                                            title={cat.name}
                                            actionIcon={
                                                <IconButton aria-label={`info about`} className={classes.icon}>
                                                    <Info />
                                                </IconButton>
                                            }
                                        />
                                    </GridListTile>
                                )
                            }

                        })
                    }
                </GridList>
            </Grid>
            <Grid container justify="center">
                {isLoading ? (
                    <CircularProgress variant="indeterminate" />
                ) : undefined }
            </Grid>
        </Grid>
    )
};

export default withRouter(withTranslation()(withWidth()(Menu)));
