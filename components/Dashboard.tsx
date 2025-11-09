
import React, { useState, useContext } from 'react';
import { User, UserRole } from '../types';
import { ROLE_NAMES } from '../constants';
import { AuthContext } from '../App';
import SampleDevelopment from './SampleDevelopment';
import ProductionPlanning from './ProductionPlanning';
import ProductionOrders from './ProductionOrders';
import QcDashboard from './QcDashboard';
import WarehouseDashboard from './WarehouseDashboard';
import AccountingReport from './AccountingReport';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const { logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('main'); // For roles with multiple views like Leader

    const renderContent = () => {
        switch(user.vaiTro) {
            case UserRole.ThietKe:
                return <SampleDevelopment user={user} />;
            case UserRole.Leader:
                return (
                    <div>
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('main')}
                                    className={`${activeTab === 'main' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Phát triển Mẫu
                                </button>
                                <button
                                    onClick={() => setActiveTab('planning')}
                                    className={`${activeTab === 'planning' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    Kế hoạch Sản xuất
                                </button>
                            </nav>
                        </div>
                        <div className="py-6">
                            {activeTab === 'main' && <SampleDevelopment user={user} />}
                            {activeTab === 'planning' && <ProductionPlanning user={user} />}
                        </div>
                    </div>
                );
            case UserRole.QLDH:
                return <ProductionOrders user={user} />;
            case UserRole.QC:
                return <QcDashboard user={user} />;
            case UserRole.KhoNPL:
            case UserRole.KhoTP:
                 return <WarehouseDashboard user={user} />;
            case UserRole.KeToan:
                return <AccountingReport user={user} />;
            default:
                return <div className="text-center p-8">Vai trò của bạn chưa được cấu hình giao diện.</div>
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Riomio QLSX</h1>
                            <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                                {ROLE_NAMES[user.vaiTro]}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-sm text-gray-600">Xin chào, <strong>{user.tenHienThi}</strong></span>
                            <button
                                onClick={logout}
                                type="button"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
