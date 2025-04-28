import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { 
  TextField, Button, Box, Typography, Paper, 
  Tabs, Tab, MenuItem
} from '@mui/material';
import * as Yup from 'yup';
import { operationService, accountService } from '../../services/api';

const operationSchema = Yup.object().shape({
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
  description: Yup.string()
    .required('Description is required'),
  destinationAccount: Yup.string()
    .when('operationType', {
      is: 'transfer',
      then: () => Yup.string().required('Destination account is required')
    })
});

const OperationForm = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [operationType, setOperationType] = useState('debit');
  const [accounts, setAccounts] = useState([]);

  React.useEffect(() => {
    // Fetch accounts for transfer operation
    if (operationType === 'transfer') {
      const fetchAccounts = async () => {
        try {
          const response = await accountService.getAll(0, 100);
          setAccounts(response.data.content.filter(acc => acc.id.toString() !== accountId));
        } catch (error) {
          console.error('Failed to fetch accounts', error);
        }
      };
      fetchAccounts();
    }
  }, [operationType, accountId]);

  const handleTabChange = (event, newValue) => {
    setOperationType(newValue);
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      switch (operationType) {
        case 'debit':
          await operationService.debit(
            accountId, 
            values.amount, 
            values.description
          );
          break;
        case 'credit':
          await operationService.credit(
            accountId, 
            values.amount, 
            values.description
          );
          break;
        case 'transfer':
          await operationService.transfer(
            accountId,
            values.destinationAccount,
            values.amount
          );
          break;
        default:
          throw new Error('Invalid operation type');
      }
      
      navigate(`/accounts/${accountId}/operations`);
    } catch (error) {
      setStatus({ error: 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        New Operation
      </Typography>
      
      <Tabs value={operationType} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab value="debit" label="Debit" />
        <Tab value="credit" label="Credit" />
        <Tab value="transfer" label="Transfer" />
      </Tabs>
      
      <Formik
        initialValues={{
          amount: '',
          description: '',
          destinationAccount: ''
        }}
        validationSchema={operationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, status }) => (
          <Form>
            {status && status.error && (
              <Typography color="error" mb={2}>{status.error}</Typography>
            )}
            
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="amount"
                label="Amount"
                type="number"
                error={touched.amount && Boolean(errors.amount)}
                helperText={touched.amount && errors.amount}
              />
            </Box>
            
            {operationType !== 'transfer' && (
              <Box mb={2}>
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  label="Description"
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Box>
            )}
            
            {operationType === 'transfer' && (
              <Box mb={2}>
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="destinationAccount"
                  label="Destination Account"
                  error={touched.destinationAccount && Boolean(errors.destinationAccount)}
                  helperText={touched.destinationAccount && errors.destinationAccount}
                >
                  {accounts.map(account => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.accountNumber} - {account.customerName}
                    </MenuItem>
                  ))}
                </Field>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit'}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate(`/accounts/${accountId}/operations`)}
              >
                Cancel
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default OperationForm;