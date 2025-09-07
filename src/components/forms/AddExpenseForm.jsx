import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function ExpenseForm({ onSubmit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount, description, category, date });
    // reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <TextField
        label="Amount"
        type="number"
        required
        fullWidth
        margin="normal"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <TextField
        label="Description"
        required
        fullWidth
        margin="normal"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <TextField
        select
        label="Category"
        required
        fullWidth
        margin="normal"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        {categories.map(cat => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date"
          value={date}
          onChange={newDate => setDate(newDate)}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
        />
      </LocalizationProvider>
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Add Expense
      </Button>
    </Box>
  );
}
