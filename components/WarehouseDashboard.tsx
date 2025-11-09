
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, ProductionOrder } from '../types';
import { api } from '../services/mockApi';
import Spinner from './shared/Spinner';
import Modal from './shared/Modal';

// KhoNPL View
const NplWarehouseView: React.FC<{ user: User }> = ({ user }) => {
    // This is a placeholder as the prompt only specifies "see requests" and "confirm dispatch"
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Kho Nguyên Phụ Liệu</h2>
            <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Yêu cầu xuất kho</h3>
                <p className="mt-1 text-sm text-gray-500">Chức năng này đang được phát triển. Yêu cầu xuất kho sẽ hiện ở đây.</p>
                {/* In a real app, you'd list requests and have a confirm button */}
                 <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-400 border border-transparent rounded-md shadow-sm cursor-not-allowed">Xác nhận xuất kho</button>
            </div>
        </div>
    );
};

// KhoTP View
const FinishedGoodsWarehouseView: React.FC<{ user: User }> = ({ user }) => {
    const [orders, setOrders] = useState<ProductionOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
    const [soLuongNhap, setSoLuongNhap] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.getOrdersForStockIn();
        setOrders(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openStockInModal = (order: ProductionOrder) => {
        setSelectedOrder(order);
        setSoLuongNhap(order.soLuongTong); // Default to full quantity
        setIsModalOpen(true);
    }
    
    const handleStockIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedOrder) return;
        
        await api.confirmStockIn({
            maLSX: selectedOrder.maLSX,
            soLuong: soLuongNhap,
            nguoiNhap: user.email
        });
        
        alert(`Đã xác nhận nhập kho cho LSX ${selectedOrder.maLSX}`);
        setIsModalOpen(false);
        fetchData();
    }
    
    if (loading) return <div className="flex justify-center items-center p-8"><Spinner /></div>;
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Kho Thành Phẩm</h2>
            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900">Không có LSX nào đang chờ nhập kho.</h3>
                </div>
            ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã LSX</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã Mẫu</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Số Lượng</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Hành Động</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order.maLSX}>
                            <td className="px-6 py-4 font-medium text-gray-900">{order.maLSX}</td>
                            <td className="px-6 py-4 text-gray-500">{order.maMau}</td>
                            <td className="px-6 py-4 text-gray-500">{order.soLuongTong}</td>
                            <td className="px-6 py-4 text-sm font-medium">
                                <button onClick={() => openStockInModal(order)} className="text-green-600 hover:text-green-900">Xác nhận nhập kho</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Xác nhận nhập kho LSX: ${selectedOrder?.maLSX}`}>
                <form onSubmit={handleStockIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng thực nhận</label>
                        <input type="number" value={soLuongNhap} onChange={e => setSoLuongNhap(Number(e.target.value))} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                    </div>
                     <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Hủy</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700">Xác nhận</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};


interface WarehouseDashboardProps {
  user: User;
}

const WarehouseDashboard: React.FC<WarehouseDashboardProps> = ({ user }) => {
    if (user.vaiTro === UserRole.KhoNPL) {
        return <NplWarehouseView user={user} />;
    }
    if (user.vaiTro === UserRole.KhoTP) {
        return <FinishedGoodsWarehouseView user={user} />;
    }
    return <div>Vai trò kho không hợp lệ.</div>
};

export default WarehouseDashboard;
