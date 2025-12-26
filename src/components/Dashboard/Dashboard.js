import React from 'react';
import KPICards from './KPICards';
import OperationsChart from './OperationsChart';
import BalanceCards from './BalanceCards';
import RecentTransactions from './RecentTransactions';
import QuickActions from './QuickActions';
import Breadcrumbs from '../UI/Breadcrumbs';

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Inicio', icon: 'fas fa-home' },
          { label: 'Dashboard', active: true }
        ]} 
      />

      {/* KPI Cards */}
      <KPICards />

      {/* Charts and Balances Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Operations Chart */}
        <div className="xl:col-span-2">
          <OperationsChart />
        </div>
        
        {/* Balance Cards */}
        <div className="xl:col-span-1">
          <BalanceCards />
        </div>
      </div>

      {/* Transactions and Quick Actions Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="xl:col-span-2">
          <RecentTransactions />
        </div>
        
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;