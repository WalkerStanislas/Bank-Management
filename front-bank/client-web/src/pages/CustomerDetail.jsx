import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, Box, Paper, Grid, Card, CardContent, 
  Button, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { customerService, accountService } from '../services/api';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerResponse = await customerService.getById(customerId);
        setCustomer(customerResponse.data);
        
        // Endpoint à ajouter à votre API
        const accountsResponse = await axios.get(`http://localhost:8080/api/customers/${customerId}/accounts`);
        setAccounts(accountsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer details');
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  if (loading) return <Typography>Loading customer details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!customer) return <Typography>Customer not found</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Customer Details</Typography>
        <Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to={`/customers/${customerId}/edit`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/accounts/new"
            state={{ customerId }}
          >
            Create Account
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2">ID:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{customer.id}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Name:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{customer.name}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Email:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{customer.email}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Phone:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{customer.phone}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Address:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{customer.address}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Accounts
              </Typography>
              
              <List>
                {accounts.length > 0 ? (
                  accounts.map((account, index) => (
                    <React.Fragment key={account.id}>
                      <ListItem 
                        button 
                        component={Link} 
                        to={`/accounts/${account.id}`}
                      >
                        <ListItemText
                          primary={account.accountNumber}
                          secondary={`Balance: $${account.balance.toFixed(2)}`}
                        />
                      </ListItem>
                      {index < accounts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No accounts found" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default CustomerDetail;