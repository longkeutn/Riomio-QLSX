
import React, { useState, useEffect, useCallback } from 'react';
import { Sample, User, UserRole } from '../types';
import { api } from '../services/mockApi';
import Spinner from './shared/Spinner';
import Modal from './shared/Modal';

interface ProductionPlanningProps {
  user: User;
}

const ProductionPlanning: React.FC<ProductionPlanningProps> = ({ user }) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [soLuong, setSoLuong] = useState(100);
  const [ngayGiao, setNgayGiao] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSamplesReadyForProduction();
      setSamples(data);
    } catch (err) {
      setError('Failed to fetch samples.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateOrderModal = (sample: Sample) => {
    setSelectedSample(sample);
    setIsModalOpen(true);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSample) {
        // In a real app, you would get this from a user list
        const qldhEmail = 'manager.a@riomio.com'; 
        await api.createProductionOrder({
            maMau: selectedSample.maMau,
            soLuong: soLuong,
            ngayGiao: ngayGiao,
            qldh: qldhEmail
        });
        setIsModalOpen(false);
        setSelectedSample(null);
        alert(`Đã tạo lệnh sản xuất cho mẫu ${selectedSample.maMau}`);
        fetchData();
    }
  }

  if (loading) return <div className="flex justify-center items-center p-8"><Spinner /></div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Kế hoạch Sản xuất: Mẫu sẵn sàng</h2>
        {samples.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Không có mẫu nào sẵn sàng để sản xuất.</h3>
                <p className="mt-1 text-sm text-gray-500">Vui lòng duyệt mẫu ở tab "Phát triển Mẫu".</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {samples.map((sample) => (
                    <div key={sample.maMau} className="flex flex-col justify-between p-6 bg-white rounded-lg shadow">
                        <div>
                            <p className="text-sm font-medium text-primary-600">{sample.maMau}</p>
                            <h3 className="mt-1 text-lg font-semibold text-gray-900">{sample.tenMau}</h3>
                            <p className="mt-2 text-sm text-gray-500">Người thiết kế: {sample.nguoiThietKe}</p>
                            <p className="text-sm text-gray-500">Ngày duyệt mẫu: {sample.ngayDuyetMau}</p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => openCreateOrderModal(sample)}
                                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Tạo Lệnh Sản Xuất
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Tạo Lệnh Sản Xuất cho ${selectedSample?.maMau}`}>
            <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Số lượng tổng</label>
                    <input
                        type="number"
                        id="quantity"
                        value={soLuong}
                        onChange={(e) => setSoLuong(parseInt(e.target.value, 10))}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Ngày giao hàng mong muốn</label>
                    <input
                        type="date"
                        id="deliveryDate"
                        value={ngayGiao}
                        onChange={(e) => setNgayGiao(e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Hủy</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700">Tạo LSX</button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default ProductionPlanning;
