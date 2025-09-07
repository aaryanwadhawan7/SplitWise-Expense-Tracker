import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function ExpenseFormHook({ onSubmit, defaultValues }) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ maxWidth: 400, margin: 'auto' }}>
        <Controller
          name="amount"
          control={control}
          rules={{ required: 'Amount is required', min: { value: 0.01, message: 'Positive amount required' }}}
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
          rules={{ required: 'Description is required' }}
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
          rules={{ required: 'Category is required' }}
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
              SelectProps={{ native: true }}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
            </TextField>
          )}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: 'Date is required' }}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Date"
              value={field.value || null}
              onChange={field.onChange}
              // Disable the new accessible DOM structure (avoid the error)
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: !!errors.date,
                  helperText: errors.date?.message,
                  disabled: isSubmitting,
                  inputProps: {
                    'aria-label': 'date',
                  },
                },
              }}
            />
          )}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: 20,
            padding: 12,
            width: '100%',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 6,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
    </LocalizationProvider>
  );
}
