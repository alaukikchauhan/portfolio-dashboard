'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AddInvestment() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [portfolioId, setPortfolioId] = useState('');
  const [type, setType] = useState('stock');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth');
    } else {
      fetchPortfolios();
    }
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await api.get('/portfolio');
      setPortfolios(res.data);
    } catch (error) {
      alert('Error fetching portfolios');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/portfolio/add-investment', { portfolioId, type, symbol, quantity: parseFloat(quantity), purchasePrice: parseFloat(purchasePrice) });
      router.push('/dashboard');
    } catch (error) {
      alert('Error adding investment');
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Add Investment</h2>
      <div className="card p-4" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <select value={portfolioId} onChange={e => setPortfolioId(e.target.value)} className="form-select" required>
              <option value="">Select Portfolio</option>
              {portfolios.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <select value={type} onChange={e => setType(e.target.value)} className="form-select">
              <option value="stock">Stock</option>
              <option value="mutualfund">Mutual Fund</option>
            </select>
          </div>
          <div className="mb-3">
            <input type="text" placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} className="form-control" required />
          </div>
          <div className="mb-3">
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="form-control" required />
          </div>
          <div className="mb-3">
            <input type="number" placeholder="Purchase Price" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-success w-100">Add Investment</button>
        </form>
      </div>
      <button onClick={() => router.push('/dashboard')} className="btn btn-primary mt-4">Back to Dashboard</button>
    </div>
  );
}
