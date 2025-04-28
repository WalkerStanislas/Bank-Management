import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent,
  List, ListItem, ListItemText, Divider
} from '@mui/material';
import { 
  AccountBalance as AccountIcon,
  Person as CustomerIcon,
  SwapHoriz as TransferIcon
} from '@mui/icons-material';
import { customerService, accountService } from '../services/api';
import Layout from '../components/Layout/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalBalance: 0
  });
  const [recentOperations, setRecentOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // These endpoints would need to be implemented in your backend
        const [customersRes, accountsRes, operationsRes] = await Promise.all([
          customerService.getAll(),
          accountService.getAll(0, 5), // Get first page with 5 accounts
          axios.get('http://localhost:8080/api/operations/recent') // This endpoint needs to be added to your API
        ]);

        setStats({
          totalCustomers: customersRes.data.length || 0,
          totalAccounts: accountsRes.data.totalElements || 0,
          totalBalance: accountsRes.data.content.reduce((sum, account) => sum + account.balance, 0)
        });
        
        setRecentOperations(operationsRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Typography>Loading dashboard data...</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <CustomerIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Total Customers</Typography>
              <Typography variant="h4">{stats.totalCustomers}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <AccountIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Total Accounts</Typography>
              <Typography variant="h4">{stats.totalAccounts}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <TransferIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Total Balance</Typography>
              <Typography variant="h4">${stats.totalBalance.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Operations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Operations
              </Typography>
              
              <List>
                {recentOperations.length > 0 ? (
                  recentOperations.map((operation, index) => (
                    <React.Fragment key={operation.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${operation.type}: $${operation.amount.toFixed(2)}`}
                          secondary={`${operation.description} - ${new Date(operation.date).toLocaleString()}`}
                        />
                      </ListItem>
                      {index < recentOperations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent operations" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;