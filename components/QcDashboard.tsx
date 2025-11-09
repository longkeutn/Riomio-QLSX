
import React, { useState, useEffect, useCallback } from 'react';
import { ProductionOrder, User, QcResult, QcType } from '../types';
import { api } from '../services/mockApi';
import Spinner from './shared/Spinner';
import Modal from './shared/Modal';

interface QcDashboardProps {
  user: User;
}

const QcDashboard: React.FC<QcDashboardProps> = ({ user }) => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  
  // Form state
  const [soLuongKiem, setSoLuongKiem] = useState(0);
  const [soLuongLoi, setSoLuongLoi] = useState(0);
  const [ketLuan, setKetLuan] = useState<QcResult>(QcResult.OK);
  const [ghiChuLoi, setGhiChuLoi] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await api.getOrdersForQc();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const openQcModal = (order: ProductionOrder) => {
    setSelectedOrder(order);
    setSoLuongKiem(order.soLuongTong); // Default to checking all
    setSoLuongLoi(0);
    setKetLuan(QcResult.OK);
    setGhiChuLoi('');
    setIsModalOpen(true);
  }
  
  const handleSubmitQc = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedOrder) return;
      
      await api.submitQcLog({
          maLSX: selectedOrder.maLSX,
          loaiQC: QcType.Final,
          nguoiKiemTra: user.email,
          soLuongKiem,
          soLuongLoi,
          ketLuan,
          ghiChuLoi
      });
      
      alert(`Đã lưu biên bản QC cho LSX ${selectedOrder.maLSX}`);
      setIsModalOpen(false);
      fetchData();
  }

  if (loading) return <div className="flex justify-center items-center p-8"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Phiếu chờ QC</h2>
       {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Không có lệnh sản xuất nào đang chờ QC.</h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                    <div key={order.maLSX} className="flex flex-col justify-between p-6 bg-white border-l-4 border-orange-400 rounded-lg shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{order.maLSX}</p>
                            <h3 className="mt-1 text-lg font-semibold text-gray-900">{order.maMau}</h3>
                            <p className="mt-2 text-sm text-gray-500">Số lượng: {order.soLuongTong}</p>
                            <p className="text-sm text-gray-500">Xưởng: {order.xuongGiaCong}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => openQcModal(order)}
                                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Nhập Biên bản QC
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Biên bản QC cho LSX: ${selectedOrder?.maLSX}`}>
            <form onSubmit={handleSubmitQc} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng kiểm</label>
                        <input type="number" value={soLuongKiem} onChange={e => setSoLuongKiem(Number(e.target.value))} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng lỗi</label>
                        <input type="number" value={soLuongLoi} onChange={e => setSoLuongLoi(Number(e.target.value))} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Kết luận</label>
                    <select value={ketLuan} onChange={e => setKetLuan(e.target.value as QcResult)} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm">
                        <option value={QcResult.OK}>OK</option>
                        <option value={QcResult.Fail}>Fail</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Ghi chú lỗi</label>
                    <textarea value={ghiChuLoi} onChange={e => setGhiChuLoi(e.target.value)} rows={3} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm"></textarea>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Hủy</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700">Lưu</button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default QcDashboard;
