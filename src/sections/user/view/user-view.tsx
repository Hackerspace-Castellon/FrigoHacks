import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import { useSanctum } from 'react-sanctum';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';

export function UserView() {
  interface Purchase {
    id: number;
    item: string;
    price: number;
    date: string;
  }

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { authenticated, user } = useSanctum(); // Llama al hook dentro del componente funcional

  const handleAddBalance = () => {};

  const handleWithdrawBalance = () => {};

  useEffect(() => {
    axios
      .get('/api/user/transactions')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPurchases(response.data);
        } else {
          setPurchases([]);
        }
      })
      .catch(() => setPurchases([]));
  }, []);

  return (
    <DashboardContent>
      <Box alignItems="center" mb={5}>
        {/* avatar */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            sx={{ bgcolor: 'background.neutral' }}
            style={{ width: 150, height: 'auto' }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4tE9xDuwT9TJZHjjtvPZ9BVrdZMrSQLfwEw&s"
          />
        </Box>

        {authenticated && (
          <Typography variant="h4" align="center" flexGrow={1}>
            Welcome, this is your dashboard {user?.name} 👋
          </Typography>
        )}
      </Box>

      <Card sx={{ p: 3, mb: 5 }}>
        {authenticated && (
          <>
            <Typography variant="h6">
              Balance: {parseFloat(user?.balance).toFixed(2)} &euro;{' '}
            </Typography>
          </>
        )}

        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" color="success" onClick={handleAddBalance}>
            Add money
          </Button>
          <Button variant="contained" color="error" onClick={handleWithdrawBalance}>
            Remove money
          </Button>
        </Box>
      </Card>

      <Card>
        <Typography variant="h6" sx={{ p: 3 }}>
          Historial de Compras
        </Typography>
        <Scrollbar>
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.item}</TableCell>
                      <TableCell>${purchase.price.toFixed(2)}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No hay compras registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </DashboardContent>
  );
}
