import React, {useState, useEffect, forwardRef} from 'react';
import { withRouter } from 'react-router-dom';
import MaterialTable, { MTablePagination } from 'material-table';
import {
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider
} from '@material-ui/core';


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
import { Assignment, DriveEta } from '@material-ui/icons';
import {fetchMyOrders, fetchOrderById} from "../../api/restaurants";
import {assignDriver, changeStatus, fetchUsers} from "../../api/admin";


let status = [
    {
        "code": "NEW",
        "name": "New",
        "nameRu": "Новый",
        "nameUz": "Yangi"
    },
    {
        "code": "ACCEPT",
        "name": "Order accepted",
        "nameRu": "Заказ принят",
        "nameUz": "Buyurtma qabul qilindi"
    },
    {
        "code": "REJECT",
        "name": "Order rejected",
        "nameRu": "Заказ отклонен",
        "nameUz": "Buyurtma rad qilindi"
    },
    {
        "code": "TRANSIT",
        "name": "Order in transit",
        "nameRu": "Заказ в пути",
        "nameUz": "Buyurtma yulda"
    },
    {
        "code": "DELIVERED",
        "name": "Order delivered",
        "nameRu": "Заказ доставлен",
        "nameUz": "Buyurtma yetkazildi"
    }
];

const AdminHistory = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);

    const [client, setClient] = useState();
    const [clientDialog, setClientDialog] = useState(false);
    const [driverDialog, setDriverDialog] = useState(false);
    const [statusDialog, setStatusDialog] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [assignId, setAssignId] = useState();

    useEffect(() => {
        updateList()
        fetchUsers({page: 0, size: 10000000, role: 'DRIVER'})
            .then(response => {
                setDrivers(response.data.content);
            })
    }, [page, size]);

    const updateList = () => {
        setIsLoading(true);
        fetchMyOrders({page, size})
            .then(response => {
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
                open={statusDialog}
                onClose={() => {
                    setStatusDialog(false);
                    setAssignId(undefined);
                }}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Выберите статус"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container style={{padding: 10}}>
                            <Grid item xs={12}>
                                {status.map(s => (
                                    <List>
                                        <ListItem button onClick={() => {
                                            changeStatus(assignId, s.code)
                                                .then(_ => {
                                                    updateList();
                                                    setStatusDialog(false);
                                                    setAssignId(undefined);
                                                })
                                                .catch(e => { alert(e) })
                                        }}>
                                            <ListItemText>{s.nameRu}</ListItemText>
                                        </ListItem>
                                    </List>
                                ))}

                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Dialog
                open={driverDialog}
                onClose={() => {
                    setDriverDialog(false);
                    setAssignId(undefined);
                }}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Выберите водителя"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container style={{padding: 10}}>

                            <Grid item xs={12}>
                                {drivers && drivers.map(i => (
                                    <List>
                                        <ListItem button onClick={() => {
                                            assignDriver(assignId, i.id)
                                                .then(_ => {
                                                    updateList();
                                                    setDriverDialog(false);
                                                    setAssignId(undefined);
                                                }).catch(e => { alert(e.message) })
                                        }}>
                                            <ListItemText>{i.firstName} - {i.lastName}</ListItemText>
                                        </ListItem>
                                    </List>
                                ))}

                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <Dialog
                open={clientDialog}
                onClose={() => {
                    setClientDialog(false);
                    setClient(undefined);
                }}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Заказ клиента"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Grid container style={{padding: 10}}>
                            <Grid item xs={12}>
                                Заказ:
                            </Grid>
                            <div  style={{width: '100%', height: 1, backgroundColor: '#eee'}}/>
                            <Grid item xs={12}>
                                {client && client.items.map(i => (
                                    <List>
                                        <ListItem>
                                            <ListItemText>{i.name} - {i.quantity || 0} x {i.price}</ListItemText>
                                            <ListItemSecondaryAction>{(i.quantity || 0)*parseFloat(i.price)}</ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                ))}

                            </Grid>
                            <div  style={{width: '100%', height: 1, backgroundColor: '#eee'}}/>
                            <Grid item xs={12}>
                                Сумма: { client ? client.items.reduce((acc, i) => acc + parseFloat(i.price)*(i.quantity || 0), 0): 0 }
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setClientDialog(false);
                        setClient(undefined);
                    }} color="primary">
                        Закрыть
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
                title="Заказы"
                columns={[
                    { title: 'Заказ', field: 'order' },
                    { title: 'Клиент', field: 'clientName' },
                    { title: 'Телефон', field: 'clientPhone' },
                    { title: 'Получатель', field: 'receiver' },
                    { title: 'Телефон Получателя', field: 'receiverPhone' },
                    { title: 'Ресторан', field: 'restaurant' },
                    { title: 'Адрес', field: 'address' },
                    { title: 'Статус', field: 'status' },
                    { title: 'Водитель', field: 'driver' },
                    { title: 'Супервайзер', field: 'supervisor' }
                ]}
                isLoading={isLoading}
                data={data.map(d => ({
                    id: d.id,
                    order: `#${d.id}`,
                    clientName: d.client.name,
                    clientPhone: d.client.phone,
                    receiver: d.receiver.name,
                    receiverPhone: d.receiver.phone,
                    restaurant: d.restaurant.name,
                    address: `
                        ${d.address.region ? d.address.region.name: ""}
                        ${d.address.district ? d.address.district.name: ""}
                        ${d.address.street ? d.address.street: ""}
                        ${d.address.porch ? d.address.porch: ""}
                        ${d.address.floor ? d.address.floor: ""}
                        ${d.address.house ? d.address.house: ""}
                    `,
                    status: d.status,
                    driver: d.driver ? `${d.driver.firstName} ${d.driver.lastName}` : 'Не назначен',
                    supervisor: d.supervisor ? `${d.supervisor.firstName} ${d.supervisor.lastName}` : 'Не назначен'
                }))}
                actions={[
                    {
                        icon: () => <DriveEta />,
                        position: 'row',
                        tooltip: 'Назначить водителя',
                        onClick: (e, r) => {
                            setAssignId(r.id);
                            setDriverDialog(true);
                        }
                    },
                    {
                        icon: () => <Assignment />,
                        position: 'row',
                        tooltip: 'Сменить статус',
                        onClick: (e, r) => {
                            setAssignId(r.id);
                            setStatusDialog(true);
                        }
                    }

                ]}
                page={page}
                onChangePage={p => {setPage(p)}}
                onChangeRowsPerPage={(s) => {
                    setSize(s)
                }}
                totalCount={total}
                onRowClick={(row, data) => {
                    fetchOrderById(data.id)
                        .then(response => {
                            setClient(response.data);
                            setClientDialog(true)
                        })

                }}
                style={{width: '100%'}}
                options={{
                    pageSizeOptions: [10, 20, 40],
                    pageSize: size

                }}
            />
        </Grid>
    )
};

export default withRouter(AdminHistory);
