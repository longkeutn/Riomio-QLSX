
import React, { useState, useEffect, useCallback } from 'react';
import { ProductionOrder, ProductionStatus, User, BillOfMaterial, Material } from '../types';
import { api } from '../services/mockApi';
import { PRODUCTION_STATUS_TEXT, PRODUCTION_STATUS_COLOR } from '../constants';
import Spinner from './shared/Spinner';
import Modal from './shared/Modal';

interface ProductionOrdersProps {
  user: User;
}

const ProductionOrders: React.FC<ProductionOrdersProps> = ({ user }) => {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [bom, setBom] = useState<BillOfMaterial[]>([]);
  const [stock, setStock] = useState<Material[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await api.getProductionOrders();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (maLSX: string, status: ProductionStatus) => {
    await api.updateProductionOrderStatus(maLSX, status);
    fetchData();
  };
  
  const viewDetails = async (order: ProductionOrder) => {
      setSelectedOrder(order);
      setDetailModalOpen(true);
      const bomData = await api.getBomForSample(order.maMau);
      setBom(bomData);
      const materialCodes = bomData.map(b => b.maNPL);
      const stockData = await api.getMaterialStock(materialCodes);
      setStock(stockData);
  }
  
  const handleRequestMaterials = (maLSX: string) => {
      // In a real app this would trigger an email.
      alert(`Đã gửi yêu cầu xuất kho NPL cho LSX: ${maLSX}`);
      handleStatusUpdate(maLSX, ProductionStatus.DangChuanBiNPL);
      setDetailModalOpen(false);
  }

  if (loading) return <div className="flex justify-center items-center p-8"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard Lệnh Sản Xuất</h2>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã LSX</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã Mẫu</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Số Lượng</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ngày Giao Hàng</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Trạng Thái</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.maLSX}>
                <td className="px-6 py-4 font-medium text-gray-900">{order.maLSX}</td>
                <td className="px-6 py-4 text-gray-500">{order.maMau}</td>
                <td className="px-6 py-4 text-gray-500">{order.soLuongTong}</td>
                <td className="px-6 py-4 text-gray-500">{order.ngayGiaoHangMongMuon}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${PRODUCTION_STATUS_COLOR[order.trangThaiLSX]}`}>
                    {PRODUCTION_STATUS_TEXT[order.trangThaiLSX]}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2 text-sm font-medium">
                  <button onClick={() => viewDetails(order)} className="text-indigo-600 hover:text-indigo-900">Chi tiết</button>
                   {order.trangThaiLSX === ProductionStatus.ChoQLDH_Nhan && (
                        <button onClick={() => handleStatusUpdate(order.maLSX, ProductionStatus.DangChuanBiNPL)} className="text-green-600 hover:text-green-900">Nhận LSX</button>
                    )}
                   {order.trangThaiLSX === ProductionStatus.DangMay && (
                        <button onClick={() => handleStatusUpdate(order.maLSX, ProductionStatus.ChoQC_Final)} className="text-orange-600 hover:text-orange-900">Yêu cầu QC</button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} title={`Chi tiết LSX: ${selectedOrder?.maLSX}`}>
          {selectedOrder && (
              <div className="space-y-4">
                  <div>
                      <h4 className="font-medium text-gray-800">Thông tin NPL cần thiết</h4>
                      <ul className="mt-2 border border-gray-200 divide-y divide-gray-200 rounded-md">
                          {bom.map(item => {
                              const required = item.dinhMuc * selectedOrder.soLuongTong;
                              const currentStock = stock.find(s => s.maNPL === item.maNPL)?.tonKho ?? 0;
                              const isSufficient = currentStock >= required;
                              return (
                                  <li key={item.maNPL} className="flex items-center justify-between p-3">
                                      <div>
                                          <p className="font-medium text-gray-700">{item.tenNPL} ({item.maNPL})</p>
                                          <p className="text-sm text-gray-500">Cần: {required} {item.donViTinh} - Tồn kho: {currentStock} {item.donViTinh}</p>
                                      </div>
                                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${isSufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {isSufficient ? 'Đủ' : 'Thiếu'}
                                      </span>
                                  </li>
                              );
                          })}
                      </ul>
                  </div>
                   {selectedOrder.trangThaiLSX === ProductionStatus.DangChuanBiNPL && (
                     <button onClick={() => handleRequestMaterials(selectedOrder.maLSX)} className="w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700">Yêu cầu xuất kho NPL</button>
                   )}
                   <div className="pt-2">
                     <label className="block text-sm font-medium text-gray-700">Cập nhật tiến độ</label>
                      <select 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={selectedOrder.trangThaiLSX}
                        onChange={(e) => handleStatusUpdate(selectedOrder.maLSX, e.target.value as ProductionStatus)}
                      >
                        {Object.values(ProductionStatus).map(status => (
                            <option key={status} value={status}>{PRODUCTION_STATUS_TEXT[status]}</option>
                        ))}
                      </select>
                   </div>
              </div>
          )}
      </Modal>
    </div>
  );
};

export default ProductionOrders;
