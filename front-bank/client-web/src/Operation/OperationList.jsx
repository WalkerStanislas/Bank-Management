import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Box, Chip 
} from '@mui/material';
import { accountService } from '../../services/api';

const OperationList = () => {
  const { accountId } = useParams();
  const [operations, setOperations] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountResponse, operationsResponse] = await Promise.all([
          accountService.getById(accountId),
          accountService.getOperations(accountId)
        ]);
        
        setAccount(accountResponse.data);
        setOperations(operationsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch operations');
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  if (loading) return <Typography>Loading operations...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Account Operations</Typography>
        {account && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1">
              <strong>Account Number:</strong> {account.accountNumber}
            </Typography>
            <Typography variant="body1">
              <strong>Customer:</strong> {account.customerName}
            </Typography>
            <Typography variant="body1">
              <strong>Current Balance:</strong> ${account.balance.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell>{operation.id}</TableCell>
                <TableCell>{new Date(operation.date).toLocaleString()}</TableCell>
                <TableCell>{operation.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={operation.type} 
                    color={
                      operation.type === 'CREDIT' ? 'success' : 
                      operation.type === 'DEBIT' ? 'error' : 
                      'primary'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {operation.type === 'DEBIT' ? '-' : '+'}
                  ${operation.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OperationList;