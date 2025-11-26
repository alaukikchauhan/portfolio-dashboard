'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth');
    } else {
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (error) {
      alert('Error fetching transactions');
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Transaction History</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Symbol</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id}>
                <td>{t.type}</td>
                <td>{t.symbol}</td>
                <td>{t.quantity}</td>
                <td>${t.price}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => router.push('/dashboard')} className="btn btn-primary mt-4">Back to Dashboard</button>
    </div>
  );
}
