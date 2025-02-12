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
import { useSanctum } from 'react-sanctum';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { format } from '@formkit/tempo';

import { DashboardContent } from 'src/layouts/dashboard';
import { Scrollbar } from 'src/components/scrollbar';
import { CONFIG } from 'src/config-global';

export function UserView() {
  interface Product {
    id: number;
    name: string;
  }

  interface Purchase {
    id: number;
    type: string;
    quantity: number;
    amount: string;
    created_at: string;
    product: Product;
  }

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { authenticated, user } = useSanctum(); // refreshUser to update user after balance change

  useEffect(() => {
    axios
      .get(`${CONFIG.appURL}/api/user/transactions`)
      .then((response) => {
        setPurchases(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => setPurchases([]));
  }, []);

  const handleBalanceChange = (type: 'add' | 'remove') => {
    Swal.fire({
      title: `How much do you want to ${type === 'add' ? 'add' : 'withdraw'}?`,
      html: `
        <input type="number" id="swal-input" class="swal2-input" value="1" min="0.01" step="0.01">
        <div style="margin-top: 10px;">
          <button id="btn-1" class="swal2-confirm swal2-styled">1€</button>
          <button id="btn-2" class="swal2-confirm swal2-styled">2€</button>
          <button id="btn-5" class="swal2-confirm swal2-styled">5€</button>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: type === 'add' ? 'Add' : 'Withdraw',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const input = document.getElementById('swal-input') as HTMLInputElement;
        document.getElementById('btn-1')?.addEventListener('click', () => { input.value = '1'; });
        document.getElementById('btn-2')?.addEventListener('click', () => { input.value = '2'; });
        document.getElementById('btn-5')?.addEventListener('click', () => { input.value = '5'; });
      },
      preConfirm: () => {
        const inputValue = (document.getElementById('swal-input') as HTMLInputElement)?.value;
        const amount = parseFloat(inputValue);
        if (!amount || amount <= 0) {
          Swal.showValidationMessage('Please enter a valid amount');
          return false;
        }
        return amount;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const amount = result.value;
        axios
          .put(`${CONFIG.appURL}/api/user/${type === 'add' ? 'add-balance' : 'remove-balance'}`, {
            amount,
          })
          .then((res) => {
            Swal.fire(
              'Success',
              `Balance ${type === 'add' ? 'added' : 'withdrawn'} successfully`,
              'success'
            ).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            Swal.fire('Error', error.response.data.message || 'Unable to process request', 'error');
          });
      }
    });
  };

  return (
    <DashboardContent>
      <Box alignItems="center" mb={5}>
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            sx={{ bgcolor: 'background.neutral' }}
            style={{ width: 150, height: 'auto' }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4tE9xDuwT9TJZHjjtvPZ9BVrdZMrSQLfwEw&s"
          />
        </Box>

        {authenticated && (
          <Typography variant="h4" align="center" flexGrow={1}>
            Welcome, {user?.name} 👋
          </Typography>
        )}
      </Box>

      <Card sx={{ p: 3, mb: 5 }}>
        {authenticated && (
          <>
            <Typography variant="h6">
              Balance: {parseFloat(user?.balance).toFixed(2)} &euro;
            </Typography>
          </>
        )}

        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleBalanceChange('add')}
          >
            Add money
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleBalanceChange('remove')}
          >
            Withdraw money
          </Button>
        </Box>
      </Card>

      <Card>
        <Typography variant="h6" sx={{ p: 3 }}>
          Purchase History
        </Typography>
        <Scrollbar>
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.product.name}</TableCell>
                      <TableCell>${parseFloat(purchase.amount).toFixed(2)}</TableCell>
                      <TableCell>{format(purchase.created_at, {date:'medium', time:'short'})}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No purchases recorded
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
