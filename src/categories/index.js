import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Typography, GridList, GridListTile, GridListTileBar, IconButton, withWidth, isWidthUp } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
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

    return (
        <Grid container >
            <Grid item className={classes.title} xs={12}>
                <Typography> Категории </Typography>
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
                    <GridListTile key={1} cols={1}>
                        <img src={require('../assets/img/burgers.jpg')} alt={"f1"} />
                        <GridListTileBar
                            title={"Quyuq taomlar"}
                            actionIcon={
                                <IconButton aria-label={`info about`} className={classes.icon}>
                                    <Info />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                    <GridListTile key={1} cols={1}>
                        <img src={require('../assets/img/burgers.jpg')} alt={"f1"} />
                        <GridListTileBar
                            title={"Quyuq taomlar"}
                            actionIcon={
                                <IconButton aria-label={`info about`} className={classes.icon}>
                                    <Info />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                    <GridListTile key={1} cols={(() => {
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
                            title={"Quyuq taomlar"}
                            actionIcon={
                                <IconButton aria-label={`info about`} className={classes.icon}>
                                    <Info />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                    <GridListTile key={1} cols={1}>
                        <img src={require('../assets/img/burgers.jpg')} alt={"f1"} />
                        <GridListTileBar
                            title={"Quyuq taomlar"}
                            actionIcon={
                                <IconButton aria-label={`info about`} className={classes.icon}>
                                    <Info />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                    <GridListTile key={1} cols={1}>
                        <img src={require('../assets/img/burgers.jpg')} alt={"f1"} />
                        <GridListTileBar
                            title={"Quyuq taomlar"}
                            actionIcon={
                                <IconButton aria-label={`info about`} className={classes.icon}>
                                    <Info />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                </GridList>
            </Grid>
        </Grid>
    )
};

export default withRouter(withWidth()(Menu));
