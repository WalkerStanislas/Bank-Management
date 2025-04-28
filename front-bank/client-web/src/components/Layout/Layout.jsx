import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Layout;