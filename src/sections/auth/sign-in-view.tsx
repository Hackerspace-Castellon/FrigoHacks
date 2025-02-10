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
import { CircularProgress } from '@mui/material';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authenticated, user, signIn } = useSanctum();
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    setError('');
    setLoading(true);
    signIn( email, password, true )
      .then(() => {
        router.push('/dashboard');
      })
      .catch((err) => {
        console.error(err);
        setError(err.response.data.message || 'Unknown error, contact admin');
      })
      .finally(() => {
        setLoading(false);
      });
      
  }

  if(authenticated === true) {
    router.push('/dashboard');
  }

  const handleSignInWithGoogle = () => {
    window.location.href = `/api/auth/google`;
  }

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        placeholder="hello@email.com"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        placeholder="*********"
        InputLabelProps={{ shrink: true }}
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
        onChange={(e) => setPassword(e.target.value)}
      />

      <Typography variant="subtitle2" sx={{ color: 'error.main', mb: 1.5 }}  className='w-full text-center' >
        {error}
      </Typography>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        {loading ? <CircularProgress/> : 'Sign in'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link href="register" variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" onClick={handleSignInWithGoogle} />
        </IconButton>
      </Box>
    </>
  );
}
