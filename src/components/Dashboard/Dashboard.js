import apiFetch from '../../utils/api';
import React, { useState, useEffect } from 'react';
import KPICards from './KPICards';
import OperationsChart from './OperationsChart';
import BalanceCards from './BalanceCards';
import RecentTransactions from './RecentTransactions';
import Breadcrumbs from '../UI/Breadcrumbs';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('http://localhost:5001/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs 
        items={[
          { label: 'Inicio', icon: 'fas fa-home' },
          { label: 'Dashboard', active: true }
        ]} 
      />

      <KPICards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <OperationsChart />
        </div>
        <div className="xl:col-span-1">
          <BalanceCards stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-3">
          <RecentTransactions stats={stats} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;