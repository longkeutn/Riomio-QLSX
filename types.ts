
export enum UserRole {
  Admin = 'Admin',
  ThietKe = 'ThietKe',
  Leader = 'Leader',
  QLDH = 'QLDH',
  QC = 'QC',
  KhoNPL = 'KhoNPL',
  KhoTP = 'KhoTP',
  KeToan = 'KeToan',
}

export enum UserStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export interface User {
  email: string;
  tenHienThi: string;
  vaiTro: UserRole;
  trangThai: UserStatus;
}

export enum SampleStatus {
    MoiThietKe = '1_MoiThietKe',
    ChoDuyetTK = '2_ChoDuyetTK',
    DaDuyetTK = '3_DaDuyetTK',
    DangMayMau = '4_DangMayMau',
    ChoDuyetMau = '5_ChoDuyetMau',
    MauOKI_ChoSX = '6_MauOKI_ChoSX',
    Huy = '7_Huy',
}

export interface Sample {
  maMau: string;
  tenMau: string;
  trangThai: SampleStatus;
  nguoiThietKe: string; // email
  ngayTao: string;
  ngayDuyetMau?: string;
  ghiChu?: string;
}

export enum ProductionStatus {
    ChoQLDH_Nhan = '1_ChoQLDH_Nhan',
    DangChuanBiNPL = '2_DangChuanBiNPL',
    DangCat = '3_DangCat',
    DangInTheu = '4_DangInTheu',
    DangMay = '5_DangMay',
    ChoQC_Final = '6_ChoQC_Final',
    DangSuaHangLoi = '7_DangSuaHangLoi',
    HoanThanh_ChoNhapKho = '8_HoanThanh_ChoNhapKho',
    DaNhapKho = '9_DaNhapKho',
}

export interface ProductionOrder {
  maLSX: string;
  maMau: string;
  soLuongTong: number;
  ngayBatDauYeuCau: string;
  ngayGiaoHangMongMuon: string;
  QLDH_PhuTrach: string; // email
  xuongGiaCong: string;
  trangThaiLSX: ProductionStatus;
}

export interface BillOfMaterial {
    maMau: string;
    maNPL: string;
    tenNPL: string;
    donViTinh: string;
    dinhMuc: number;
    ghiChu?: string;
}

export interface Material {
    maNPL: string;
    tenNPL: string;
    donViTinh: string;
    tonKho: number;
}

export interface FinishedGood {
    maLSX: string;
    maMau: string;
    soLuongNhap: number;
    ngayNhapKho: string;
    nguoiNhap: string; // email
    ghiChu?: string;
}

export enum QcType {
    Inline = 'Inline',
    Final = 'Final',
}

export enum QcResult {
    OK = 'OK',
    Fail = 'Fail',
}

export interface QcLog {
    id: string;
    maLSX: string;
    loaiQC: QcType;
    ngayKiemTra: string;
    nguoiKiemTra: string; // email
    soLuongKiem: number;
    soLuongLoi: number;
    ketLuan: QcResult;
    ghiChuLoi?: string;
}
