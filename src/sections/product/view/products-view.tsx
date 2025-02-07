import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Box, Grid, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { handleAddProduct, handleBuyProduct, handleEditProduct } from './handleProductsActions';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { CONFIG } from 'src/config-global';
import { useSanctum } from 'react-sanctum';
import { useRouter } from 'src/routes/hooks';

interface User {
  role_id: number;
  // Add other user properties if needed
}

export function ProductsView() {
  const [products, setProducts] = useState([]);
  const { authenticated, user } = useSanctum(); // Llama al hook dentro del componente funcional
  const router = useRouter();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get(`${CONFIG.appURL}/api/products`)
      .then((response) => {
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => setProducts([]));
  };



  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Productos</Typography>
        <Button
          variant="contained"
          color="primary"
          id="addButton"
          onClick={() => { window.location.href = `${CONFIG.appURL}/api/products/print`; }}
        >
          Print product list
        </Button>
        <Button
          variant="contained"
          color="primary"
          id="addButton"
          onClick={() => handleAddProduct(fetchProducts)}
        >
          Add product
        </Button>
      </Box>

      {products.length === 0 ? (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No hay productos disponibles
        </Typography>
      ) : (
        <Grid container spacing={3} rowGap={3} columnGap={3} className="!ml-4">
          {products.map((product) => (
            <Grid key={product.id} xs={5} sm={5} md={3}>
              <Card
                onClick={() =>
                  user?.role_id === 0 ? handleBuyProduct(product.id, fetchProducts) : ''
                }
                style={{ cursor: 'pointer' }}
              >
                <CardMedia
                  component="img"
                  className="w-[100px] h-[100px] md:w-[300px] md:h-[300px]"
                  image={`${CONFIG.appURL}/images/${product.image}`}
                  alt={product.name}
                  onClick={() =>
                    user?.role_id === 1 ? handleBuyProduct(product.id, fetchProducts) : ''
                  }
                  style={{ cursor: 'pointer' }}
                />
                <CardContent className={product.in_fridge > 0 ? 'bg-green-50' : 'bg-red-50'}>
                  <Typography variant="h6">
                    {product.name} &nbsp;
                    {product.in_fridge > 0 ? (
                      <CheckIcon style={{ color: 'green' }} />
                    ) : (
                      <CancelIcon style={{ color: 'red' }} />
                    )}
                  </Typography>
                  <Typography color="text.secondary">{product.price}€</Typography>
                  <Typography variant="body2">
                    <div className="grid grid-cols-2">
                      <p>En nevera: {product.in_fridge}</p>
                      <p>Total: {product.quantity}</p>
                    </div>
                  </Typography>

                  {user?.role_id === 1 && (
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      zIndex={1}
                      onClick={() => handleEditProduct(product, fetchProducts)}
                      sx={{ mt: 1 }}
                    >
                      Edit
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardContent>
  );
}
