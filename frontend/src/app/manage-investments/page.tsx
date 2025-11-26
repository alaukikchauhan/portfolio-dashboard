'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ManageInvestments() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editCurrentPrice, setEditCurrentPrice] = useState('');

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

  const handleEdit = (investment: any, index: number) => {
    setEditingIndex(index);
    setEditQuantity(investment.quantity.toString());
    setEditCurrentPrice(investment.currentPrice.toString());
  };

  const handleUpdate = async () => {
    if (editingIndex === null || !selectedPortfolio) return;

    try {
      await api.put('/portfolio/update-investment', {
        portfolioId: selectedPortfolio._id,
        investmentIndex: editingIndex,
        quantity: parseFloat(editQuantity),
        currentPrice: parseFloat(editCurrentPrice)
      });

      setEditingIndex(null);
      setEditQuantity('');
      setEditCurrentPrice('');
      await fetchPortfolios();
      alert('Investment updated successfully!');
    } catch (error) {
      alert('Error updating investment');
    }
  };

  const handleDelete = async (investmentIndex: number) => {
    if (!selectedPortfolio) return;

    if (!confirm('Are you sure you want to delete this investment?')) return;

    try {
      await api.delete(`/portfolio/remove-investment/${selectedPortfolio._id}/${investmentIndex}`);
      await fetchPortfolios();
      alert('Investment removed successfully!');
    } catch (error) {
      alert('Error removing investment');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditQuantity('');
    setEditCurrentPrice('');
  };

  // Find selected portfolio again after fetch
  useEffect(() => {
    if (selectedPortfolio) {
      const updatedPortfolio = portfolios.find(p => p._id === selectedPortfolio._id);
      setSelectedPortfolio(updatedPortfolio);
    }
  }, [portfolios]);

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Manage Investments</h2>

          {!selectedPortfolio && (
            <div className="mb-4">
              <select
                onChange={(e) => setSelectedPortfolio(portfolios.find(p => p._id === e.target.value))}
                className="form-select"
                style={{maxWidth: '300px'}}
              >
                <option value="">Select Portfolio to Manage</option>
                {portfolios.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {selectedPortfolio && (
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    Managing: <strong>{selectedPortfolio.name}</strong>
                  </h5>
                  <div>
                    <button onClick={() => setSelectedPortfolio(null)} className="btn btn-outline-secondary btn-sm me-2">
                      Change Portfolio
                    </button>
                    <button onClick={() => router.push('/add-investment')} className="btn btn-success btn-sm">
                      + Add Investment
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Purchase Price</th>
                        <th>Current Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPortfolio.investments.map((investment: any, index: number) => (
                        <tr key={index}>
                          <td className="fw-bold">{investment.symbol}</td>
                          <td><span className="badge bg-info">{investment.type}</span></td>

                          {editingIndex === index ? (
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                              />
                            </td>
                          ) : (
                            <td>{investment.quantity}</td>
                          )}

                          <td>${investment.purchasePrice.toFixed(2)}</td>

                          {editingIndex === index ? (
                            <td>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={editCurrentPrice}
                                onChange={(e) => setEditCurrentPrice(e.target.value)}
                                step="0.01"
                              />
                            </td>
                          ) : (
                            <td>${investment.currentPrice.toFixed(2)}</td>
                          )}

                          <td>
                            {editingIndex === index ? (
                              <div className="btn-group btn-group-sm" role="group">
                                <button onClick={handleUpdate} className="btn btn-success">Save</button>
                                <button onClick={handleCancelEdit} className="btn btn-secondary">Cancel</button>
                              </div>
                            ) : (
                              <div className="btn-group btn-group-sm" role="group">
                                <button onClick={() => handleEdit(investment, index)} className="btn btn-primary">Edit</button>
                                <button onClick={() => handleDelete(index)} className="btn btn-danger">Remove</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                      {selectedPortfolio.investments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            No investments found. <a href="#" onClick={() => router.push('/add-investment')} className="text-primary">Add your first investment</a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button onClick={() => router.push('/dashboard')} className="btn btn-secondary">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
