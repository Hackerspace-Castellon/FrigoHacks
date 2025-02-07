import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { CONFIG } from 'src/config-global';
import { handleDeleteUser, handleEditUser } from './handleAllUserActions';


export function AllUserView() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get(`${CONFIG.appURL}/api/users`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
      })
      .catch(() => {
        setUsers([]);
        setFilteredUsers([]);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(filterName.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [filterName, users]);

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? -1 : 1;
      if (a[field] > b[field]) return isAsc ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sortedUsers);
  };


  

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          All Users
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>

      <Card>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search user..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </Box>

        <Scrollbar>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {['name', 'email', 'balance', 'role', 'uuid', 'Pin Code'].map((field) => (
                    <TableCell
                      key={field}
                      onClick={() => handleSort(field)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.balance}€</TableCell>
                      <TableCell>{user.role_id === 1 ? 'Admin' : 'User'}</TableCell>
                      <TableCell>{user.uuid}</TableCell>
                      <TableCell>{user.pin_code}</TableCell>
                      <TableCell>
                        <Button size="small" color="primary" onClick={() => handleEditUser(user, setUsers)}>
                          Editar
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDeleteUser(user, setUsers)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredUsers.length === 0 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </DashboardContent>
  );
}
