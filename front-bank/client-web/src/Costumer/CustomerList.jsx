import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Typography, Box 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { customerService } from '../../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getAll();
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <Typography>Loading customers...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Customers</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/customers/new"
        >
          Add Customer
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    to={`/customers/${customer.id}`}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomerList;