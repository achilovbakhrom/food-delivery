import React, {useState, useEffect, forwardRef} from 'react';
import { withRouter } from 'react-router-dom';
import MaterialTable, { MTablePagination } from 'material-table';
import {
    Grid,
    CircularProgress,
    IconProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import {deleteRestaurant, deleteRestaurantFoodsById, fetchRestaurantFoods, fetchRestaurants} from "../../api/admin";

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


const AdminMenu = props => {

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
        fetchRestaurantFoods({page, size})
            .then(response => {
                console.log(response.data)
                setIsLoading(false);
                setData(response.data.content);
                setTotal(response.data.totalElements);
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
                        Вы действиетльно хотите удалить Меню?
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
                            deleteRestaurantFoodsById(deleteId)
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
                title="Меню"
                columns={[
                    { title: 'Блюдо', field: 'food' },
                    { title: 'Ресторан', field: 'restaurant' },
                    { title: 'Цена', field: 'price' },
                ]}
                isLoading={isLoading}
                data={data.map(m => ({
                    food: m.food.name,
                    restaurant: m.restaurant.name,
                    price: m.price,
                    id: m.id
                }))}
                actions={[
                    {
                        icon: () => <AddBox />,
                        position: 'toolbar',
                        tooltip: 'Добавить',
                        onClick: (e, r) => {
                            props.history.push('/admin/menu-add-edit');
                        }
                    },
                    {
                        icon: () => <Edit />,
                        position: 'row',
                        tooltip: 'Редактировать',
                        onClick: (e, r) => {
                            // localStorage.setItem('restaurant', JSON.stringify(r));
                            props.history.push(`/admin/menu-add-edit?menu_id=${r.id}`);
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
                    pageSizeOptions: [10, 20, 40, 80],
                    pageSize: size
                }}
            />
        </Grid>
    )
};

export default withRouter(AdminMenu);
