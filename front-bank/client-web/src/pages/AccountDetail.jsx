import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, Box, Paper, Grid, Button, Card, 
  CardContent, List, ListItem, ListItemText, Divider
} from '@mui/material';
import { accountService } from '../services/api';

const AccountDetail = () => {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const [accountResponse, operationsResponse] = await Promise.all([
          accountService.getById(accountId),
          accountService.getOperations(accountId)
        ]);
        
        setAccount(accountResponse.data);
        setOperations(operationsResponse.data.slice(0, 5)); // Afficher seulement les 5 dernières opérations
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch account details');
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  if (loading) return <Typography>Loading account details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!account) return <Typography>Account not found</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Account Details</Typography>
        <Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to={`/accounts/${accountId}/operations`}
            sx={{ mr: 1 }}
          >
            All Operations
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to={`/accounts/${accountId}/operations/new`}
          >
            New Operation
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Account Information</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Account ID:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{account.id}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Account Number:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{account.accountNumber}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Customer:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  <Link to={`/customers/${account.customerId}`}>
                    {account.customerName}
                  </Link>
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Balance:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>${account.balance.toFixed(2)}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Creation Date:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{new Date(account.creationDate).toLocaleDateString()}</Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="subtitle2">Status:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{account.status}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Recent Operations</Typography>
                <Button 
                  size="small" 
                  component={Link} 
                  to={`/accounts/${accountId}/operations`}
                >
                  View All
                </Button>
              </Box>
              
              <List>
                {operations.length > 0 ? (
                  operations.map((operation, index) => (
                    <React.Fragment key={operation.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${operation.type}: $${operation.amount.toFixed(2)}`}
                          secondary={`${operation.description} - ${new Date(operation.date).toLocaleString()}`}
                        />
                      </ListItem>
                      {index < operations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No operations found" />
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

export default AccountDetail;