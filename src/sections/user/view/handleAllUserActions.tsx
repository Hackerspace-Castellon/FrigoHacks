import Swal from 'sweetalert2';
import axios from 'axios';
import { CONFIG } from 'src/config-global';

const tailwindInput =
  '  block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 md:h-10 ';
const tailwindLabel = 'block text-sm font-medium text-gray-900 text-left mt-2';

interface User {
    id: number;
    name: string;
    email: string;
    balance: number;
    role_id: number;
    uuid: string;
    pin_code: string;
}

const handleEditUser = (user: User, setUsers: React.Dispatch<React.SetStateAction<User[]>>): void => {
    Swal.fire({
        title: 'Edit User',
        html: `
            <label for="name" class="${tailwindLabel}">Name</label>
            <input id="name" class="${tailwindInput}" placeholder="Name" value="${user.name}">

            <label for="email" class="${tailwindLabel}">Email</label>
            <input id="email" class="${tailwindInput}" placeholder="Email" value="${user.email}">

            <label for="balance" class="${tailwindLabel}">Balance</label>
            <input type="number" id="balance" class="${tailwindInput}" placeholder="Balance" value="${user.balance}">
            
            <label for="role_id" class="${tailwindLabel}">Role</label>
            <p>
            <select id="role_id" class="${tailwindInput}" >
                <option value="1" ${user.role_id === 1 ? 'selected' : ''}>Admin</option>
                <option value="2" ${user.role_id === 2 ? 'selected' : ''}>User</option>
                </select>
            </p>

            <label for="uuid" class="${tailwindLabel}">UUID</label>
            <input id="uuid" class="${tailwindInput}" placeholder="UUID" value="${user.uuid}">

            <label for="pin_code" class="${tailwindLabel}">Pin Code</label>
            <input id="pin_code" class="${tailwindInput}" placeholder="Pin Code" value="${user.pin_code}">
            `,
        confirmButtonText: 'Update',
        focusConfirm: false,
        customClass: {
            confirmButton: 'btn btn-primary',
        },
        preConfirm: (): (string | number)[] => [
            (document.getElementById('name') as HTMLInputElement).value,
            (document.getElementById('email') as HTMLInputElement).value,
            parseFloat((document.getElementById('balance') as HTMLInputElement).value),
            parseInt((document.getElementById('role_id') as HTMLSelectElement).value, 10),
            (document.getElementById('uuid') as HTMLInputElement).value,
            (document.getElementById('pin_code') as HTMLInputElement).value.toUpperCase(),
        ],
    }).then((result) => {
        if (result.isConfirmed) {
            const [name, email, balance, role_id, uuid, pin_code] = result.value as [string, string, number, number, string, string];
            axios
                .put(`${CONFIG.appURL}/api/users/${user.id}`, {
                    name,
                    email,
                    balance,
                    role_id,
                    uuid,
                    pin_code,
                })
                .then(() =>{ 
                    Swal.fire('Updated!', 'User has been updated.', 'success')
                    setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? { ...u, name, email, balance, role_id, uuid, pin_code } : u)));
                })
                .catch((error) =>
                    Swal.fire('Error', error.response.data.message || 'Something went wrong!', 'error')
                );
        }
    });
};




const handleDeleteUser = (
  user: User,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
): void => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this user!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
    confirmButtonColor : '#d33',
    customClass: {
      cancelButton: 'btn btn-secondary',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`${CONFIG.appURL}/api/users/${user.id}`)
        .then(() => {
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        })
        .catch((error) =>
          Swal.fire('Error', error.response.data.message || 'Something went wrong!', 'error')
        );
    }
  });
};


export { handleEditUser, handleDeleteUser };
