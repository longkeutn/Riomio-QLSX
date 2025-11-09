
import React, { useState, useEffect, useCallback } from 'react';
import { Sample, SampleStatus, User, UserRole } from '../types';
import { api } from '../services/mockApi';
import { SAMPLE_STATUS_TEXT, SAMPLE_STATUS_COLOR } from '../constants';
import Spinner from './shared/Spinner';

interface SampleDevelopmentProps {
  user: User;
}

const SampleDevelopment: React.FC<SampleDevelopmentProps> = ({ user }) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSamples();
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

  const handleStatusUpdate = async (maMau: string, newStatus: SampleStatus) => {
    try {
        await api.updateSampleStatus(maMau, newStatus);
        fetchData(); // Refresh data
    } catch (err) {
        alert(`Error updating status: ${err}`);
    }
  };

  const handleCreateSample = async () => {
      const tenMau = prompt("Nhập tên mẫu mới:");
      if (tenMau) {
          await api.createSample({ tenMau, nguoiThietKe: user.email });
          fetchData();
      }
  }

  if (loading) return <div className="flex justify-center items-center p-8"><Spinner /></div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Phát triển Mẫu</h2>
        {user.vaiTro !== UserRole.Leader && (
            <button
                onClick={handleCreateSample}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                Tạo Mẫu Mới
            </button>
        )}
      </div>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Mã Mẫu</th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tên Mẫu</th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Trạng Thái</th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ngày Tạo</th>
                        <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Hành Động</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {samples.map((sample) => (
                    <tr key={sample.maMau}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{sample.maMau}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{sample.tenMau}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${SAMPLE_STATUS_COLOR[sample.trangThai]}`}>
                            {SAMPLE_STATUS_TEXT[sample.trangThai]}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{sample.ngayTao}</td>
                        <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                            {user.vaiTro !== UserRole.Leader && sample.trangThai === SampleStatus.MoiThietKe && (
                                <button onClick={() => handleStatusUpdate(sample.maMau, SampleStatus.ChoDuyetTK)} className="text-primary-600 hover:text-primary-900">Gửi duyệt TK</button>
                            )}
                             {user.vaiTro === UserRole.Leader && sample.trangThai === SampleStatus.ChoDuyetTK && (
                                <>
                                    <button onClick={() => handleStatusUpdate(sample.maMau, SampleStatus.DaDuyetTK)} className="text-green-600 hover:text-green-900">Duyệt TK</button>
                                    <button onClick={() => handleStatusUpdate(sample.maMau, SampleStatus.Huy)} className="text-red-600 hover:text-red-900">Hủy</button>
                                </>
                            )}
                            {user.vaiTro !== UserRole.Leader && sample.trangThai === SampleStatus.DaDuyetTK && (
                                <button onClick={() => handleStatusUpdate(sample.maMau, SampleStatus.ChoDuyetMau)} className="text-primary-600 hover:text-primary-900">Đã may xong mẫu</button>
                            )}
                            {user.vaiTro === UserRole.Leader && sample.trangThai === SampleStatus.ChoDuyetMau && (
                                <>
                                    <button onClick={() => handleStatusUpdate(sample.maMau, SampleStatus.MauOKI_ChoSX)} className="text-green-600 hover:text-green-900">Mẫu OK</button>
                                    <button onClick={() => handleStatusUpdate(sample.maMau, SampleStatus.Huy)} className="text-red-600 hover:text-red-900">Hủy</button>
                                </>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SampleDevelopment;
