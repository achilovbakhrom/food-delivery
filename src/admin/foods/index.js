import React, {useState, useEffect, forwardRef} from 'react';
import { withRouter } from 'react-router-dom';
import MaterialTable, { MTablePagination } from 'material-table';
import {
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import {deleteFood, fetchFoods } from "../../api/admin";

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Button from "@material-ui/core/Button";


const AdminFoods = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [deleteId, setDeleteId] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        localStorage.removeItem('restaurant');
        updateList()
    }, [page, size]);



    const updateList = () => {
        setIsLoading(true);
        fetchFoods({page, size})
            .then(response => {
                setIsLoading(false);
                setData(response.data.content);
                setTotal(response.data.numberOfElements);
            })
            .catch(e => {
                setIsLoading(false);
                alert(e);
            })
    };

    return (
        <Grid container style={{marginTop: 50}}>
            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeleteId(undefined);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Осторожно!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Вы действиетльно хотите удалить блюдо?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setDeleteOpen(false);
                        setDeleteId(undefined);
                    }} color="primary">
                        Нет
                    </Button>
                    <Button onClick={() => {
                        if (deleteId !== undefined) {
                            setDeleteOpen(false);
                            deleteFood(deleteId)
                                .then(response => {
                                    updateList()
                                })
                        }
                    }} color="primary" autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
            <MaterialTable
                icons={{
                    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} onClick={() => { console.log('tes')}}/>),
                    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
                    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
                    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
                    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
                    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
                    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
                    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
                    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
                    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
                    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
                    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
                    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
                    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
                    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
                    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
                    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
                }}
                title="Блюда"
                columns={[
                    { title: 'Название блюда', field: 'name' },
                    { title: 'Цена', field: 'price' },
                ]}
                isLoading={isLoading}
                data={data}
                actions={[
                    {
                        icon: () => <AddBox />,
                        position: 'toolbar',
                        tooltip: 'Добавить',
                        onClick: (e, r) => {
                            props.history.push('/admin/food-add-edit');
                        }
                    },
                    {
                        icon: () => <Edit />,
                        position: 'row',
                        tooltip: 'Редактировать',
                        onClick: (e, r) => {
                            // localStorage.setItem('restaurant', JSON.stringify(r));
                            props.history.push(`/admin/food-add-edit?food_id=${r.id}`);
                        }
                    },
                    {
                        icon: () => <DeleteOutline />,
                        position: 'row',
                        tooltip: 'Удалить',
                        onClick: (e, r) => {
                            setDeleteId(r.id);
                            setDeleteOpen(true);
                        }
                    }

                ]}
                page={page}
                onChangePage={p => {setPage(p)}}
                onChangeRowsPerPage={(s) => {
                    setSize(s)
                }}
                totalCount={total}

                style={{width: '100%'}}
                options={{
                    pageSizeOptions: [10, 20, 40],
                    pageSize: 10

                }}
            />
        </Grid>
    )
};

export default withRouter(AdminFoods);
