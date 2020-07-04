import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Paper, List, ListItem, CircularProgress, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: 60,
        marginLeft: 20,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    content: {
        padding: 20,
        marginTop: 10,
        color: '#555',
        backgroundColor: 'white',
        width: '100%',
        flex: 1
    },
    footer: {
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center'
    }
}));

const Address = props => {

    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnd, setIsEnd] = useState(false);

    return (
        <Grid container>
            <Grid className={classes.title} xs={12}> Адреса </Grid>
            <Grid container>
                <Paper className={classes.content}>
                    <Grid item xs={12}>
                        <List>
                            { new Array(20).fill(0).map((i, index) => (
                                <ListItem button key={index} onClick={() => {
                                    props.history.push('/app/restaurants')
                                }}>
                                    Chilonzor {index+1}
                                </ListItem>
                            )) }
                        </List>
                    </Grid>
                    { isEnd ? undefined : (
                        <Grid item xs={12} className={classes.footer}>
                            {isLoading ? (
                                <CircularProgress variant="indeterminate" />
                            ) : (
                                <Button variant="contained" fullWidth> Показать еще</Button>
                            )}
                        </Grid>
                    )}
                </Paper>
            </Grid>
        </Grid>
    )
};

export default withRouter(Address);
