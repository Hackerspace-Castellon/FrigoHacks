import Swal from 'sweetalert2';
import axios from 'axios';
import { CONFIG } from 'src/config-global';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  in_fridge: number;
}

interface FetchProducts {
  (): void;
}

const tailwindInput =
  '  block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 md:h-10 ';
const tailwindLabel = 'block text-sm font-medium text-gray-900 text-left mt-2';
  const axiosHeaders = { headers: { 'content-type': 'multipart/form-data' } };

interface AddProductFormValues {
  name: string;
  price: number;
  quantity: number;
  in_fridge: number;
  image: File | null;
}

const handleAddProduct = async (fetchProducts: FetchProducts) => {
  const { value } = await Swal.fire({
    title: 'Add product',
    html: `
        <label for="name" class="${tailwindLabel}">Name</label>
        <input id="name" class="${tailwindInput}" placeholder="Name">

        <label for="price" class="${tailwindLabel}">Price</label>
        <input id="price" type="number" class="${tailwindInput}" placeholder="Price">

        <label for="quantity" class="${tailwindLabel}">Stock</label>
        <input id="quantity" type="number" class="${tailwindInput}" placeholder="Stock">

        <label for="in_fridge" class="${tailwindLabel}">In Fridge</label>
        <input id="in_fridge" type="number" class="${tailwindInput}" placeholder="In Fridge">

        
        <label for="image" class="${tailwindLabel}">Image (Max. 2MB)</label>
        <input id="image" type="file" class="${tailwindInput}" placeholder="Image">
      `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Agregar',
    preConfirm: (): AddProductFormValues => {
      return {
        name: (document.getElementById('name') as HTMLInputElement)?.value,
        price: parseFloat((document.getElementById('price') as HTMLInputElement)?.value),
        quantity: parseInt((document.getElementById('quantity') as HTMLInputElement)?.value, 10),
        in_fridge: parseInt((document.getElementById('in_fridge') as HTMLInputElement)?.value, 10),
        image: (document.getElementById('image') as HTMLInputElement)?.files?.[0] ?? null,
      };
    },
  });

  if (value) {
    // check if image size is less than 2MB

    if (value.image && value.image.size > 2 * 1024 * 1024) {
      return Swal.fire('Error', 'Image size must be less than 2MB', 'error');
    }
    axios
      .post(`${CONFIG.appURL}/api/products`, value, axiosHeaders)
      .then(() => {
        Swal.fire('Éxito', 'Product added successfully', 'success');
        fetchProducts(); // Recargar productos
      })
      .catch((error) => Swal.fire('Error', error.data.response.message ? 'Unable to add product' : error.message, 'error'));
  }
};


interface BuyProductParams {
  productId: number;
  fetchProducts: FetchProducts;
}

const handleBuyProduct = ({ productId, fetchProducts }: BuyProductParams) => {
  Swal.fire({
    title: '¿Quieres comprar este producto?',
    text: 'Se descontará de tu saldo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, comprar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .post(`${CONFIG.appURL}/api/user/buy`, { product_id: productId })
        .then(() => {
          Swal.fire('Bought!', 'The product has been bought.', 'success');
          fetchProducts(); // Recargar productos
        })
        .catch((error) =>
          Swal.fire(
            'Error',
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Unable to buy product',
            'error'
          )
        );
    }
  });
};



const handleEditProduct = (product: Product, fetchProducts: FetchProducts) => {
  Swal.fire({
    title: 'Edit product',
    html: `
        <label for="name" class="${tailwindLabel}">Name</label>
        <input id="name" class="${tailwindInput}" placeholder="Name" value="${product.name}">

        <label for="price" class="${tailwindLabel}">Price</label>
        <input id="price" type="number" class="${tailwindInput}" placeholder="Price" value="${product.price}">

        <label for="quantity" class="${tailwindLabel}">Stock</label>
        <input id="quantity" type="number" class="${tailwindInput}" placeholder="Stock" value="${product.quantity}">

        <label for="in_fridge" class="${tailwindLabel}">In Fridge</label>
        <input id="in_fridge" type="number" class="${tailwindInput}" placeholder="In Fridge" value="${product.in_fridge}">
      
        <label for="image" class="${tailwindLabel}">Image (Max. 2MB)</label>
        <input id="image" type="file" class="${tailwindInput}" placeholder="Image">
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Editar',
    preConfirm: () => {
      return {
        name: (document.getElementById('name') as HTMLInputElement)?.value,
        price: parseFloat((document.getElementById('price') as HTMLInputElement)?.value),
        quantity: parseInt((document.getElementById('quantity') as HTMLInputElement)?.value, 10),
        in_fridge: parseInt((document.getElementById('in_fridge') as HTMLInputElement)?.value, 10),
        image: (document.getElementById('image') as HTMLInputElement)?.files?.[0] ?? null,
      };
    },
  }).then((result) => {
    if (result.value) {
      console.log(result.value);
      axios
        .post(`${CONFIG.appURL}/api/products/update/${product.id}`, result.value, axiosHeaders)
        .then(() => {
          fetchProducts(); // Recargar productos
          Swal.fire('Success', 'Product edited successfully', 'success');
        })
        .catch((error) => Swal.fire('Error', error.data.response.message ? 'Unable to edit product' : error.message, 'error'));
    }
  });
};

export { handleAddProduct, handleBuyProduct, handleEditProduct };
