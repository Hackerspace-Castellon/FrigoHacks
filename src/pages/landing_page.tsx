import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import {
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { SimpleLayout } from 'src/layouts/simple';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";


export default function Page() {
  return (
    <>
      <Helmet>
        <title>{`Frigohacks - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="Frigohacks te ayuda a organizar los productos de tu frigorífico y realizar compras fácilmente desde la comodidad de tu hogar."
        />
      </Helmet>

      <SimpleLayout content={{ compact: false }}>
        {/* Header */}
        {/* <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Frigohacks</Typography>
          <Box>
            <Button color="inherit">Iniciar Sesión</Button>
            <Button variant="contained" color="primary" sx={{ ml: 2 }}>
              Registrarse
            </Button>
          </Box>
        </Toolbar>
      </AppBar> */}

        {/* Hero Section */}
        <Box
          sx={{
            height: '80vh',
            // width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // backgroundColor: '#f5f5f5',
            backgroundImage: 'url(/hero.jpg)',
          }}
        >
          <Typography variant="h2" gutterBottom>
            Manage your fridge like a pro
          </Typography>
          <Typography variant="h6" maxWidth="600px">
            Frigohacks helps you organize your fridge and make purchases easily for your group or
            asoociation (or more).
          </Typography>
          <Box mt={3}>
            <Button variant="contained" color="secondary" size="large" href='/login' >
              Start Now
            </Button>
          </Box>
        </Box>

        {/* Cómo Funciona */}
        <Container sx={{ py: 6 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            How does it work?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item md={4} sm={6} xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <KitchenIcon fontSize="large" />
                  <Typography variant="h6" gutterBottom>
                    Keep Track of Your Products
                  </Typography>
                  <Typography>
                    Use the app or web interface to check what is in the fridge and more
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ShoppingCartIcon fontSize="large" />
                  <Typography variant="h6" gutterBottom>
                    Buy easily
                  </Typography>
                  <Typography>
                    Buy using the app or the nfc and pinpad reader next to the fridge.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ThumbUpIcon fontSize="large" />
                  <Typography variant="h6" gutterBottom>
                    Save time
                  </Typography>
                  <Typography>
                    Buy faster, and dont loose time later making manual contability{' '}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Testimonios */}
        <Box sx={{ backgroundColor: '#f5f5f5', py: 6 }}>
          <Container>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Developers
            </Typography>
            <Grid container spacing={4}>
              <Grid item md={4} sm={6} xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">
                    Made for HackerSpace Castellon and other HackerSpaces
                  </Typography>
                  <Typography variant="body1">
                    This project was made to help  the community of hackerspaces over the world. <br />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href="https://hackcs.org/"
                    >
                      Visit HackCs website
                    </Button>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Teo Dev</Typography>
                  <Typography variant="body1">
                    Teo is member of HackerSpace Castellon, who made this project possible. <br />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href="https://teodin.com"
                    >
                      Visit Teo's website
                    </Button>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6">Si</Typography>
                  <Typography variant="body1">
                    Means yes in Spain.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, textAlign: 'center', backgroundColor: '#222', color: 'white' }}>
          <Typography variant="body1">
            © {new Date().getFullYear()} Frigohacks. Made for HackerSpace Castellon, Spain. Developed by <a href="https://teodin.com" className='underline text-blue-400 ' >TeoDev</a>
          </Typography>
        </Box>
      </SimpleLayout>
    </>
  );
}
