'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import api from '@/lib/api';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

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

  const createPortfolio = async () => {
    if (!newPortfolioName.trim()) {
      alert('Please enter a portfolio name');
      return;
    }
    try {
      await api.post('/portfolio/create', { name: newPortfolioName });
      setNewPortfolioName('');
      setShowCreateForm(false);
      await fetchPortfolios();
      alert('Portfolio created successfully!');
    } catch (error) {
      alert('Error creating portfolio');
    }
  };

  const randomInteger = (max: number) => {
    return Math.floor(Math.random() * (max + 1));
  }

  const data = selectedPortfolio ? {
    labels: selectedPortfolio.investments.map((inv: any) => `${inv.type}: ${inv.symbol}`),
    datasets: [{
      label: 'Quantity',
      data: selectedPortfolio.investments.map((inv: any) => inv.quantity),
      backgroundColor: selectedPortfolio.investments.map((inv: any) => `rgb(${randomInteger(255)}, ${randomInteger(255)}, ${randomInteger(255)})`),
      // borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
    }],
  } : null;

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Portfolio Dashboard</h2>
          <div className="mb-4 d-flex gap-3 align-items-center">
            <select onChange={(e) => setSelectedPortfolio(portfolios.find(p => p._id === e.target.value))} className="form-select" style={{maxWidth: '300px'}}>
              <option value="">Select Portfolio</option>
              {portfolios.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-outline-secondary">
              {showCreateForm ? 'Cancel' : '+ Create Portfolio'}
            </button>
          </div>

          {showCreateForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Create New Portfolio</h5>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter portfolio name"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                  />
                  <button onClick={createPortfolio} className="btn btn-success">Create</button>
                </div>
              </div>
            </div>
          )}
          {selectedPortfolio && data && (
            <div className='container'>
              <div className='row gap-2'>
                <div className="col card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Portfolio Chart</h5>
                    <Doughnut data={data} />
                  </div>
                </div>

                <div className="col card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Portfolio Assets</h5>
                      <button onClick={() => router.push('/manage-investments')} className="btn btn-outline-primary btn-sm">
                        Manage Investments
                      </button>
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
                            <th>Total Value</th>
                            <th>Gain/Loss</th>
                            <th>Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPortfolio.investments.map((investment: any, index: number) => {
                            const totalPurchaseValue = investment.quantity * investment.purchasePrice;
                            const totalCurrentValue = investment.quantity * investment.currentPrice;
                            const gainLoss = totalCurrentValue - totalPurchaseValue;
                            const performance = totalPurchaseValue > 0 ? ((gainLoss / totalPurchaseValue) * 100).toFixed(2) : '0.00';

                            return (
                              <tr key={index}>
                                <td className="fw-bold">{investment.symbol}</td>
                                <td><span className={(investment.type=="mutualfund") ? "badge bg-info": "badge bg-success"}>{investment.type}</span></td>
                                <td>{investment.quantity}</td>
                                <td>${investment.purchasePrice.toFixed(2)}</td>
                                <td>${investment.currentPrice.toFixed(2)}</td>
                                <td className="fw-bold">${totalCurrentValue.toFixed(2)}</td>
                                <td className={gainLoss >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                                  ${gainLoss.toFixed(2)}
                                </td>
                                <td className={gainLoss >= 0 ? "text-success" : "text-danger"}>
                                  {performance}%
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="table-dark">
                            <td colSpan={5} className="fw-bold">Total Portfolio Value</td>
                            <td className="fw-bold">
                              ${selectedPortfolio.investments.reduce((total: number, inv: any) =>
                                total + (inv.quantity * inv.currentPrice), 0).toFixed(2)}
                            </td>
                            <td className="fw-bold">
                              ${selectedPortfolio.investments.reduce((total: number, inv: any) =>
                                total + (inv.quantity * inv.currentPrice - inv.quantity * inv.purchasePrice), 0).toFixed(2)}
                            </td>
                            <td className="fw-bold">
                              {(() => {
                                const totalPurchase = selectedPortfolio.investments.reduce((total: number, inv: any) =>
                                  total + (inv.quantity * inv.purchasePrice), 0);
                                const totalCurrent = selectedPortfolio.investments.reduce((total: number, inv: any) =>
                                  total + (inv.quantity * inv.currentPrice), 0);
                                const totalGain = totalCurrent - totalPurchase;
                                return totalPurchase > 0 ? ((totalGain / totalPurchase) * 100).toFixed(2) + '%' : '0.00%';
                              })()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="d-flex gap-2 mt-4">
            <button onClick={() => router.push('/transactions')} className="btn btn-primary">Transaction History</button>
            <button onClick={() => router.push('/add-investment')} className="btn btn-success">Add Investment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
