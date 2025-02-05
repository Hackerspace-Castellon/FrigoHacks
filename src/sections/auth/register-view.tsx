import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { useSanctum }  from 'react-sanctum';
import { Iconify } from 'src/components/iconify';
import axios from 'axios';
import { CONFIG } from 'src/config-global';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
// ----------------------------------------------------------------------

export function RegisterView() {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        uuid: ''
    });


  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    setDisabled(true);
    try{
        const response = await axios.post(`${CONFIG.appURL}/register`, userData);
        if(response.status === 201){
            setPage(2);
        }else{
            setError(response.data.message);
        }
    }catch(err){
        setError(err.response.data.message);
    }finally{
        setDisabled(false);
    }
  }

  const readUUID = async () => {
    try{
        const response = await axios.get(`${CONFIG.appURL}/api/rfid/getCard`);
        if(response.status === 200){
            setUserData({...userData, uuid: response.data.uuid});
        }
    }catch(err){
        setError(err.response.data.message);
    }
  }

  const handleSignInWithGoogle = () => {
    window.location.href = `/api/auth/google`;
  }

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      {/* NAME */}
      <TextField
        fullWidth
        name="name"
        label="Name"
        placeholder="John"
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />

      {/* EMAIL */}
      <TextField
        fullWidth
        name="email"
        label="Email address"
        placeholder="hello@email.com"
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />

      {/* PASSWORD */}
      <TextField
        fullWidth
        name="password"
        label="Password"
        placeholder="*********"
        InputLabelProps={{ shrink: true }}
        disabled={disabled}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />

      <TextField
        fullWidth
        name="password_confirmation"
        label="Confirm Password"
        placeholder="*********"
        InputLabelProps={{ shrink: true }}
        disabled={disabled}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        onChange={(e) => setUserData({ ...userData, password_confirmation: e.target.value })}
      />

      <Box display="flex" className="w-full" >
        <TextField
          fullWidth
          name="uuid"
          label="UUID"
          placeholder="*********"
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
          sx={{ mb: 3 }}
          value={userData.uuid}
          onChange={(e) => setUserData({ ...userData, uuid: e.target.value })}
        />

        <LoadingButton
          size="small"
          className='w-2/4 h-14'
          type="button"
          disabled={disabled}
          color="inherit"
          variant="contained"
          onClick={readUUID}
        >
          Read RFID
        </LoadingButton>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ color: 'error.main', mb: 1.5 }}
        className="w-full text-center"
      >
        {error}
      </Typography>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        disabled={disabled}
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Register
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Register</Typography>
      </Box>

      {page === 2 ? (
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Success</Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            You have successfully registered. Please check your email to verify your account.
          </Typography>
          <Link
            href="#"
            onClick={() => router.push('/login')}
            variant="subtitle2"
            sx={{ textAlign: 'center' }}
          >
            Login
          </Link>
        </Box>
      ) : (
        renderForm
      )}

      

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit" disabled={disabled}>
          <Iconify icon="logos:google-icon" onClick={handleSignInWithGoogle} />
        </IconButton>
      </Box>
    </>
  );
}
