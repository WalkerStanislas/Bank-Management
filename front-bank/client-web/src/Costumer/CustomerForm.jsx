import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import * as Yup from 'yup';
import { customerService } from '../../services/api';

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required')
});

const CustomerForm = ({ customer, isEdit = false }) => {
  const navigate = useNavigate();
  const initialValues = customer || {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      if (isEdit) {
        await customerService.update(customer.id, values);
      } else {
        await customerService.create(values);
      }
      navigate('/customers');
    } catch (error) {
      setStatus({ error: 'Failed to save customer' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? 'Edit Customer' : 'New Customer'}
      </Typography>
      
      <Formik
        initialValues={initialValues}
        validationSchema={CustomerSchema}
        onSubmit={handleSubmit}
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
                name="name"
                label="Name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Box>
            
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>
            
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="phone"
                label="Phone"
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Box>
            
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="address"
                label="Address"
                multiline
                rows={3}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => navigate('/customers')}
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

export default CustomerForm;