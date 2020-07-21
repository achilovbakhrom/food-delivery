import React, {useState, useEffect, forwardRef} from 'react';
import { withRouter } from 'react-router-dom';
import MaterialTable, { MTableToolbar } from 'material-table';
import {
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputLabel
} from '@material-ui/core';
import {deleteFood, deleteUser, fetchFoods, fetchUsers, fetchUsersStatuses} from "../../api/admin";

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
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import UpdateUserModal from "../../update-user-modal";
import { useStore } from "effector-react";
import { $store as $updateUserStore } from "../../update-user-modal/model/stores";

const useStyles = makeStyles(() => ({}));

const AdminUsers = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [deleteId, setDeleteId] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [userStatuses, setUserStatuses] = useState([]);
    const [filterProps, setFilterProps] = useState({});

    const { $updateUser } = useStore($updateUserStore);

    const [updateUserModalProps, setUpdateUserModalProps] = useState({
        visible: false,
        userId: null
    });

    useEffect(() => {
        getUserStatuses();
    }, []);

    useEffect(() => {
        updateList({ ...filterProps, size });
    }, [filterProps, size]);

    useEffect(() => {
        if ($updateUser.success) {
            updateList({ ...filterProps, size });
        }
    }, [$updateUser.success]);

    const getUserStatuses = () => {
        setIsLoading(true);
        fetchUsersStatuses()
            .then(response => {
                setUserStatuses(response.data);
            })
    };

    const updateList = (filterProps) => {
        setIsLoading(true);
        fetchUsers(filterProps)
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

    const onFilterChange = (prop, value, resetPage = false) => {
        const data = { ...filterProps, [prop]: value,  };
        if (resetPage) {
            delete data.page;
        }
        setFilterProps(data);
    };

    const onUpdateUserClick = (userId) => {
        setUpdateUserModalProps({
            visible: true,
            userId
        });
    };

    const classes = useStyles();

    const renderFilter = () => {
      return (
          <div className="filter-block">
            <div className="filter-item">
                <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <InputLabel id="language">Роль</InputLabel>
                    <Select
                        variant="outlined"
                        value={filterProps.role}
                        fullWidth
                        labelWidth={70}
                        onChange={(e) => onFilterChange("role", e.target.value, true)}
                    >
                        <MenuItem value={undefined} key={null}>Все</MenuItem>
                        {userStatuses.map((d) => (
                            <MenuItem value={d.code} key={d.code}>{d.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
          </div>
      );
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
                        Вы действиетльно хотите удалить пользователя?
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
                            deleteUser(deleteId)
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
                title="Пользователи"
                columns={[
                    { title: 'Имя', field: 'lastName' },
                    { title: 'Фамилия', field: 'firstName' },
                    { title: 'Телефон', field: 'phone' },
                    { title: 'Роль', field: 'role' }
                ]}
                isLoading={isLoading}
                data={data}
                actions={[
                    {
                        icon: () => <AddBox />,
                        position: 'toolbar',
                        tooltip: 'Добавить',
                        onClick: (e, r) => {
                            props.history.push('/admin/user-add-edit');
                        }
                    },
                    {
                        icon: () => <Edit />,
                        position: 'row',
                        tooltip: 'Редактировать',
                        onClick: (e, r) => {
                            console.log("Редактировать", e, r);
                            // localStorage.setItem('restaurant', JSON.stringify(r));
                            // props.history.push(`/admin/user-add-edit?user_id=${r.id}`);
                            onUpdateUserClick(r.id);
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
                page={filterProps.page || 0}
                onChangePage={p => onFilterChange("page", p)}
                onChangeRowsPerPage={(s) => {
                    setSize(s)
                }}
                totalCount={total}

                style={{width: '100%'}}
                options={{
                    pageSizeOptions: [10, 20, 40],
                    pageSize: size

                }}
                components={{
                    Toolbar: props => (
                        <div>
                            <MTableToolbar {...props} />
                            <div>{renderFilter()}</div>
                        </div>
                    ),
                }}
            />
            <UpdateUserModal modalProps={updateUserModalProps} setModalProps={setUpdateUserModalProps} />
        </Grid>
    )
};

export default withRouter(AdminUsers);
