import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  TextField, Button, Box, Typography, Paper, MenuItem
} from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';
import { customerService } from '../services/api';

const AccountSchema = Yup.object().shape({
  customerId: Yup.string().required('Customer is required'),
  initialBalance: Yup.number()
    .min(0, 'Initial balance must be positive or zero')
    .required('Initial balance is required')
});

const AccountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Récupérer customerId s'il est passé via state (depuis la page CustomerDetail)
  const initialCustomerId = location.state?.customerId || '';

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getAll();
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch customers', error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Endpoint à ajouter à votre API
      await axios.post('http://localhost:8080/api/accounts', {
        customerId: values.customerId,
        initialBalance: parseFloat(values.initialBalance)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      navigate('/accounts');
    } catch (error) {
      setStatus({ error: 'Failed to create account' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Create New Account
      </Typography>
      
      <Formik
        initialValues={{
          customerId: initialCustomerId,
          initialBalance: '0'
        }}
        validationSchema={AccountSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <Form>
            {status && status.error && (
              <Typography color="error" mb={2}>{status.error}</Typography>
            )}
            
            <Box mb={3}>
              <Field
                as={TextField}
                select
                fullWidth
                name="customerId"
                label="Customer"
                error={touched.customerId && Boolean(errors.customerId)}
                helperText={touched.customerId && errors.customerId}
              >
                {customers.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </MenuItem>
                ))}
              </Field>
            </Box>
            
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="initialBalance"
                label="Initial Balance"
                type="number"
                error={touched.initialBalance && Boolean(errors.initialBalance)}
                helperText={touched.initialBalance && errors.initialBalance}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate('/accounts')}
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

export default AccountForm;