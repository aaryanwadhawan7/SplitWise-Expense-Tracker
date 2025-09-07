import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Validation schema
const schema = yup.object().shape({
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  description: yup.string().min(3, 'Too short').required('Description is required'),
  category: yup.string().required('Category is required'),
  date: yup.date().required('Date is required'),
});

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];

export default function ExpenseFormHook({ onSubmit, defaultValues }) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}
        noValidate
      >
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              margin="normal"
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Category"
              fullWidth
              margin="normal"
              error={!!errors.category}
              helperText={errors.category?.message}
              disabled={isSubmitting}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Date"
              value={field.value}
              onChange={field.onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!errors.date}
                  helperText={errors.date?.message}
                  disabled={isSubmitting}
                />
              )}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
