
import { SampleStatus, ProductionStatus, UserRole, QcResult } from './types';

export const ROLE_NAMES: { [key in UserRole]: string } = {
  [UserRole.Admin]: 'Quản trị viên',
  [UserRole.ThietKe]: 'Thiết kế',
  [UserRole.Leader]: 'Leader',
  [UserRole.QLDH]: 'Quản lý Đơn hàng',
  [UserRole.QC]: 'Kiểm soát Chất lượng',
  [UserRole.KhoNPL]: 'Kho Nguyên phụ liệu',
  [UserRole.KhoTP]: 'Kho Thành phẩm',
  [UserRole.KeToan]: 'Kế toán',
};

export const SAMPLE_STATUS_TEXT: { [key in SampleStatus]: string } = {
  [SampleStatus.MoiThietKe]: 'Mới Thiết kế',
  [SampleStatus.ChoDuyetTK]: 'Chờ Duyệt Thiết kế',
  [SampleStatus.DaDuyetTK]: 'Đã Duyệt Thiết kế',
  [SampleStatus.DangMayMau]: 'Đang May Mẫu',
  [SampleStatus.ChoDuyetMau]: 'Chờ Duyệt Mẫu',
  [SampleStatus.MauOKI_ChoSX]: 'Mẫu OK - Chờ Sản xuất',
  [SampleStatus.Huy]: 'Hủy',
};

export const SAMPLE_STATUS_COLOR: { [key in SampleStatus]: string } = {
    [SampleStatus.MoiThietKe]: 'bg-blue-100 text-blue-800',
    [SampleStatus.ChoDuyetTK]: 'bg-yellow-100 text-yellow-800',
    [SampleStatus.DaDuyetTK]: 'bg-green-100 text-green-800',
    [SampleStatus.DangMayMau]: 'bg-indigo-100 text-indigo-800',
    [SampleStatus.ChoDuyetMau]: 'bg-yellow-100 text-yellow-800',
    [SampleStatus.MauOKI_ChoSX]: 'bg-teal-100 text-teal-800',
    [SampleStatus.Huy]: 'bg-red-100 text-red-800',
};

export const PRODUCTION_STATUS_TEXT: { [key in ProductionStatus]: string } = {
  [ProductionStatus.ChoQLDH_Nhan]: 'Chờ QLĐH Nhận',
  [ProductionStatus.DangChuanBiNPL]: 'Đang Chuẩn bị NPL',
  [ProductionStatus.DangCat]: 'Đang Cắt',
  [ProductionStatus.DangInTheu]: 'Đang In/Thêu',
  [ProductionStatus.DangMay]: 'Đang May',
  [ProductionStatus.ChoQC_Final]: 'Chờ QC Final',
  [ProductionStatus.DangSuaHangLoi]: 'Đang Sửa Hàng Lỗi',
  [ProductionStatus.HoanThanh_ChoNhapKho]: 'Hoàn Thành - Chờ Nhập Kho',
  [ProductionStatus.DaNhapKho]: 'Đã Nhập Kho',
};

export const PRODUCTION_STATUS_COLOR: { [key in ProductionStatus]: string } = {
    [ProductionStatus.ChoQLDH_Nhan]: 'bg-gray-100 text-gray-800',
    [ProductionStatus.DangChuanBiNPL]: 'bg-yellow-100 text-yellow-800',
    [ProductionStatus.DangCat]: 'bg-indigo-100 text-indigo-800',
    [ProductionStatus.DangInTheu]: 'bg-purple-100 text-purple-800',
    [ProductionStatus.DangMay]: 'bg-blue-100 text-blue-800',
    [ProductionStatus.ChoQC_Final]: 'bg-orange-100 text-orange-800',
    [ProductionStatus.DangSuaHangLoi]: 'bg-red-100 text-red-800',
    [ProductionStatus.HoanThanh_ChoNhapKho]: 'bg-teal-100 text-teal-800',
    [ProductionStatus.DaNhapKho]: 'bg-green-100 text-green-800',
};

export const QC_RESULT_TEXT: { [key in QcResult]: string } = {
    [QcResult.OK]: 'Đạt',
    [QcResult.Fail]: 'Không Đạt'
};

export const QC_RESULT_COLOR: { [key in QcResult]: string } = {
    [QcResult.OK]: 'bg-green-100 text-green-800',
    [QcResult.Fail]: 'bg-red-100 text-red-800'
};
