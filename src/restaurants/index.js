import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Typography, GridList, GridListTile, GridListTileBar, IconButton, withWidth, isWidthUp } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

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

const Restaurants = props => {

    const classes = useStyles();

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

    return (
        <Grid container >
            <Grid item className={classes.title} xs={12}>
                <div> Рестораны </div>
            </Grid>
            <Grid item>
                <GridList spacing={15} cellHeight={200} cols={getGridListCols()}>
                    {
                        new Array(20).fill(0).map((item, index) => (
                            <ListItem key={index} cols={1} style={{pointer: 'cursor'}} onClick={() => {
                                props.history.push('/app/menu')
                            }}>
                                <ListItemIcon>
                                    <img src={require("../assets/img/burgers.jpg")} alt="burger" width={250} height={200} style={{borderBottomLeftRadius: 10, borderTopLeftRadius: 10}} />
                                </ListItemIcon>
                                <div style={{height: '100%', backgroundColor: 'white', flexGrow: 1, borderTopRightRadius: 10, borderBottomRightRadius: 10, padding: 20}}>
                                    <Typography variant='inherit' style={{color: '#555', fontSize: 20}}><strong>Название: </strong> Ресторан {index}</Typography> <br />
                                    <Typography variant='inherit' style={{color: '#555', fontSize: 20}}><strong>Адрес: </strong>Адрес {index}</Typography> <br />
                                </div>
                            </ListItem>
                        ))
                    }
                </GridList>
            </Grid>
        </Grid>
    )
};

export default withRouter(withWidth()(Restaurants));
