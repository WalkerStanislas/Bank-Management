import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Typography, Box, Pagination 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { accountService } from '../../services/api';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountService.getAll(page, size);
        setAccounts(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch accounts');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1); // API is 0-based, Pagination is 1-based
  };

  if (loading) return <Typography>Loading accounts...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Accounts</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/accounts/new"
        >
          Create Account
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Account Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.customerName}</TableCell>
                <TableCell>${account.balance.toFixed(2)}</TableCell>
                <TableCell>{new Date(account.creationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      component={Link} 
                      to={`/accounts/${account.id}`}
                    >
                      Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="secondary"
                      component={Link} 
                      to={`/accounts/${account.id}/operations`}
                    >
                      Operations
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination 
          count={totalPages} 
          page={page + 1} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
    </>
  );
};

export default AccountList;