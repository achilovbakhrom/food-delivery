import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Typography, GridList, GridListTile, GridListTileBar, IconButton, withWidth, isWidthUp, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {green} from "@material-ui/core/colors";

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

const Menu = props => {

    const classes = useStyles();

    const getGridListCols = () => {
        if (isWidthUp('md', props.width)) {
            return 2;
        }
        if (isWidthUp('xs', props.width)) {
            return 1;
        }
        return 1;
    };

    let borderColor = '#fff3';

    return (
        <Grid container >
            <Grid item className={classes.title} xs={12}>
                <div> Меню </div>
            </Grid>
            <Grid item>
                <GridList spacing={15} cellHeight={200} cols={getGridListCols()}>
                    {
                        new Array(20).fill(0).map((item, index) => (
                            <ListItem key={index} cols={1} >
                                <ListItemIcon>
                                    <img
                                        src={require("../assets/img/burgers.jpg")}
                                        alt="burger"
                                        width={250}
                                        height={200}
                                        style={{
                                            borderBottomLeftRadius: 10,
                                            borderTopLeftRadius: 10,
                                            borderLeftColor: borderColor,
                                            borderLeftWidth: 1,
                                            borderLeftStyle: "solid",
                                            borderTopColor: borderColor,
                                            borderTopWidth: 1,
                                            borderTopStyle: "solid",
                                            borderBottomColor: borderColor,
                                            borderBottomWidth: 1,
                                            borderBottomStyle: "solid"
                                        }} />
                                </ListItemIcon>
                                <div style={{
                                    height: '100%',
                                    backgroundColor: '#0007',
                                    flexGrow: 1,
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10,
                                    padding: 20,
                                    display: 'flex',
                                    flexFlow: 'row',
                                    borderRightColor: borderColor,
                                    borderRightWidth: 1,
                                    borderRightStyle: "solid",
                                    borderTopColor: borderColor,
                                    borderTopWidth: 1,
                                    borderTopStyle: "solid",
                                    borderBottomColor: borderColor,
                                    borderBottomWidth: 1,
                                    borderBottomStyle: "solid"

                                }}>
                                    <div style={{flexGrow: 1}}>
                                        <Typography variant='inherit' style={{color: 'white', fontSize: 20}}><strong>ОШ</strong></Typography> <br />
                                        <Typography variant='inherit' style={{fontSize: 24, color: green.A700, marginTop: 30}}><strong>35 000 сум</strong></Typography> <br />
                                    </div>
                                    <div style={{display: 'flex', flexFlow: 'column', width: 50, alignItems: 'center'}}>
                                        <Button variant='outlined' color="primary" style={{fontSize: 25}}> + </Button>
                                        <div style={{flexGrow: 1, display: 'flex', alignItems: 'center', fontSize: 25, fontWeight: 'bold'}}>0</div>
                                        <Button variant='outlined' color="secondary" style={{fontSize: 25}}> - </Button>
                                    </div>
                                </div>
                            </ListItem>
                        ))
                    }
                </GridList>
            </Grid>
        </Grid>
    )
};

export default withRouter(withWidth()(Menu));
