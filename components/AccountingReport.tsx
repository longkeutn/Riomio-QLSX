
import React, { useState, useEffect, useCallback } from 'react';
import { FinishedGood, User } from '../types';
import { api } from '../services/mockApi';
import Spinner from './shared/Spinner';

interface AccountingReportProps {
  user: User;
}

const AccountingReport: React.FC<AccountingReportProps> = ({ user }) => {
  const [goods, setGoods] = useState<FinishedGood[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await api.getFinishedGoods();
    setGoods(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="flex justify-center items-center p-8"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Báo cáo Nhập kho Thành phẩm</h2>
      {goods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Chưa có dữ liệu nhập kho.</h3>
        </div>
      ) : (
         <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ngày Nhập</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã LSX</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã Mẫu</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Số Lượng Nhập</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Người Nhập</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {goods.map(item => (
                  <tr key={item.maLSX + item.ngayNhapKho}>
                    <td className="px-6 py-4 text-gray-500">{item.ngayNhapKho}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.maLSX}</td>
                    <td className="px-6 py-4 text-gray-500">{item.maMau}</td>
                    <td className="px-6 py-4 text-gray-500">{item.soLuongNhap}</td>
                    <td className="px-6 py-4 text-gray-500">{item.nguoiNhap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default AccountingReport;
