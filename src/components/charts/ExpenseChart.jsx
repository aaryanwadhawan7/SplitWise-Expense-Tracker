import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart.js components
Chart.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ expenses }) {
  // Calculate total for each category
  const totals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  // Prepare data for ChartJS Pie
  const data = {
    labels: Object.keys(totals),
    datasets: [{
      data: Object.values(totals),
      backgroundColor: ['#3b82f6','#ef4444','#f59e0b','#10b981','#6366f1'],
      borderWidth: 1,
    }],
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Expenses by Category</h2>
      <Pie data={data} />
    </div>
  );
}
