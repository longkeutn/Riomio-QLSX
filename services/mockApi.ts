
import {
  User, UserRole, UserStatus,
  Sample, SampleStatus,
  ProductionOrder, ProductionStatus,
  BillOfMaterial, Material, FinishedGood,
  QcLog, QcType, QcResult
} from '../types';

// --- MOCK DATABASE ---
let users: User[] = [
  { email: 'admin@riomio.com', tenHienThi: 'Admin', vaiTro: UserRole.Admin, trangThai: UserStatus.Active },
  { email: 'designer.a@riomio.com', tenHienThi: 'Thiết kế A', vaiTro: UserRole.ThietKe, trangThai: UserStatus.Active },
  { email: 'leader@riomio.com', tenHienThi: 'Leader Team', vaiTro: UserRole.Leader, trangThai: UserStatus.Active },
  { email: 'manager.a@riomio.com', tenHienThi: 'QLĐH A', vaiTro: UserRole.QLDH, trangThai: UserStatus.Active },
  { email: 'qc.quyen@riomio.com', tenHienThi: 'Ms. Quyền', vaiTro: UserRole.QC, trangThai: UserStatus.Active },
  { email: 'qc.quy@riomio.com', tenHienThi: 'Ms. Quý', vaiTro: UserRole.QC, trangThai: UserStatus.Active },
  { email: 'kho.npl@riomio.com', tenHienThi: 'Kho NPL', vaiTro: UserRole.KhoNPL, trangThai: UserStatus.Active },
  { email: 'kho.tp@riomio.com', tenHienThi: 'Kho TP', vaiTro: UserRole.KhoTP, trangThai: UserStatus.Active },
  { email: 'ketoan@riomio.com', tenHienThi: 'Kế toán', vaiTro: UserRole.KeToan, trangThai: UserStatus.Active },
];

let samples: Sample[] = [
    { maMau: 'RM001', tenMau: 'Áo Sơ mi Trắng Cổ Đức', trangThai: SampleStatus.MoiThietKe, nguoiThietKe: 'designer.a@riomio.com', ngayTao: '2023-10-01' },
    { maMau: 'RM002', tenMau: 'Quần Jean Skinny Xanh', trangThai: SampleStatus.ChoDuyetTK, nguoiThietKe: 'designer.a@riomio.com', ngayTao: '2023-10-02' },
    { maMau: 'RM003', tenMau: 'Váy Hoa Mùa Hè', trangThai: SampleStatus.DaDuyetTK, nguoiThietKe: 'designer.a@riomio.com', ngayTao: '2023-10-03' },
    { maMau: 'RM004', tenMau: 'Áo Khoác Bomber Kaki', trangThai: SampleStatus.MauOKI_ChoSX, nguoiThietKe: 'designer.a@riomio.com', ngayTao: '2023-09-25', ngayDuyetMau: '2023-09-30' },
    { maMau: 'RM005', tenMau: 'Chân Váy Chữ A', trangThai: SampleStatus.Huy, nguoiThietKe: 'designer.a@riomio.com', ngayTao: '2023-09-20' },
];

let productionOrders: ProductionOrder[] = [
    { maLSX: 'LSX2310001', maMau: 'RM004', soLuongTong: 500, ngayBatDauYeuCau: '2023-10-05', ngayGiaoHangMongMuon: '2023-11-15', QLDH_PhuTrach: 'manager.a@riomio.com', xuongGiaCong: 'Xưởng May A', trangThaiLSX: ProductionStatus.ChoQLDH_Nhan },
    { maLSX: 'LSX2310002', maMau: 'RM003', soLuongTong: 300, ngayBatDauYeuCau: '2023-10-06', ngayGiaoHangMongMuon: '2023-11-10', QLDH_PhuTrach: 'manager.a@riomio.com', xuongGiaCong: 'Xưởng May B', trangThaiLSX: ProductionStatus.DangChuanBiNPL },
    { maLSX: 'LSX2310003', maMau: 'RM004', soLuongTong: 200, ngayBatDauYeuCau: '2023-10-07', ngayGiaoHangMongMuon: '2023-11-20', QLDH_PhuTrach: 'manager.a@riomio.com', xuongGiaCong: 'Xưởng May A', trangThaiLSX: ProductionStatus.ChoQC_Final },
];

let boms: BillOfMaterial[] = [
    { maMau: 'RM004', maNPL: 'VAIKAKI01', tenNPL: 'Vải Kaki Be', donViTinh: 'mét', dinhMuc: 1.5 },
    { maMau: 'RM004', maNPL: 'KHOA02', tenNPL: 'Khóa kéo đồng', donViTinh: 'cái', dinhMuc: 1 },
];

let materials: Material[] = [
    { maNPL: 'VAIKAKI01', tenNPL: 'Vải Kaki Be', donViTinh: 'mét', tonKho: 1200 },
    { maNPL: 'KHOA02', tenNPL: 'Khóa kéo đồng', donViTinh: 'cái', tonKho: 850 },
];

let finishedGoods: FinishedGood[] = [];
let qcLogs: QcLog[] = [];


// --- MOCK API FUNCTIONS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // USER
  login: async (email: string): Promise<User | null> => {
    await delay(500);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.trangThai === UserStatus.Active);
    return user || null;
  },
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return users;
  },
  
  // SAMPLES
  getSamples: async (): Promise<Sample[]> => {
    await delay(500);
    return [...samples].sort((a,b) => b.ngayTao.localeCompare(a.ngayTao));
  },
  createSample: async (data: { tenMau: string; nguoiThietKe: string }): Promise<Sample> => {
    await delay(500);
    const newSample: Sample = {
      maMau: `RM${(samples.length + 1).toString().padStart(3, '0')}`,
      tenMau: data.tenMau,
      nguoiThietKe: data.nguoiThietKe,
      trangThai: SampleStatus.MoiThietKe,
      ngayTao: new Date().toISOString().split('T')[0],
    };
    samples.push(newSample);
    return newSample;
  },
  updateSampleStatus: async (maMau: string, trangThai: SampleStatus): Promise<Sample> => {
    await delay(400);
    const sampleIndex = samples.findIndex(s => s.maMau === maMau);
    if (sampleIndex === -1) throw new Error("Sample not found");
    samples[sampleIndex].trangThai = trangThai;
    if (trangThai === SampleStatus.MauOKI_ChoSX) {
        samples[sampleIndex].ngayDuyetMau = new Date().toISOString().split('T')[0];
    }
    return samples[sampleIndex];
  },
  
  // PRODUCTION
  getSamplesReadyForProduction: async (): Promise<Sample[]> => {
    await delay(500);
    return samples.filter(s => s.trangThai === SampleStatus.MauOKI_ChoSX);
  },
  createProductionOrder: async (data: { maMau: string, soLuong: number, ngayGiao: string, qldh: string }): Promise<ProductionOrder> => {
    await delay(600);
    const newOrder: ProductionOrder = {
        maLSX: `LSX${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${(productionOrders.length + 1).toString().padStart(3, '0')}`,
        maMau: data.maMau,
        soLuongTong: data.soLuong,
        ngayBatDauYeuCau: new Date().toISOString().split('T')[0],
        ngayGiaoHangMongMuon: data.ngayGiao,
        QLDH_PhuTrach: data.qldh,
        xuongGiaCong: 'Xưởng May A', // Placeholder
        trangThaiLSX: ProductionStatus.ChoQLDH_Nhan
    };
    productionOrders.push(newOrder);
    // TODO: Send email notification
    return newOrder;
  },
  getProductionOrders: async (): Promise<ProductionOrder[]> => {
    await delay(500);
    return [...productionOrders].sort((a,b) => b.ngayBatDauYeuCau.localeCompare(a.ngayBatDauYeuCau));
  },
  updateProductionOrderStatus: async (maLSX: string, status: ProductionStatus): Promise<ProductionOrder> => {
    await delay(400);
    const orderIndex = productionOrders.findIndex(o => o.maLSX === maLSX);
    if(orderIndex === -1) throw new Error("Production Order not found");
    productionOrders[orderIndex].trangThaiLSX = status;
    return productionOrders[orderIndex];
  },

  // MATERIALS & BOM
  getBomForSample: async (maMau: string): Promise<BillOfMaterial[]> => {
    await delay(300);
    return boms.filter(b => b.maMau === maMau);
  },
  getMaterialStock: async (maNPLs: string[]): Promise<Material[]> => {
    await delay(300);
    return materials.filter(m => maNPLs.includes(m.maNPL));
  },
  confirmMaterialDispatch: async (maLSX: string): Promise<boolean> => {
      // In a real app, this would calculate BOM needs and reduce stock
      await delay(700);
      console.log(`Materials for ${maLSX} confirmed as dispatched.`);
      return true;
  },

  // QC
  getOrdersForQc: async (): Promise<ProductionOrder[]> => {
      await delay(500);
      return productionOrders.filter(o => o.trangThaiLSX === ProductionStatus.ChoQC_Final);
  },
  submitQcLog: async (log: Omit<QcLog, 'id' | 'ngayKiemTra'>): Promise<QcLog> => {
      await delay(600);
      const newLog: QcLog = {
          ...log,
          id: `QCLOG${Date.now()}`,
          ngayKiemTra: new Date().toISOString().split('T')[0],
      };
      qcLogs.push(newLog);
      
      const newStatus = log.ketLuan === QcResult.OK ? ProductionStatus.HoanThanh_ChoNhapKho : ProductionStatus.DangSuaHangLoi;
      await api.updateProductionOrderStatus(log.maLSX, newStatus);
      
      return newLog;
  },
  
  // FINISHED GOODS
  getOrdersForStockIn: async (): Promise<ProductionOrder[]> => {
      await delay(500);
      return productionOrders.filter(o => o.trangThaiLSX === ProductionStatus.HoanThanh_ChoNhapKho);
  },
  confirmStockIn: async (data: { maLSX: string, soLuong: number, nguoiNhap: string }): Promise<FinishedGood> => {
      await delay(600);
      const order = productionOrders.find(o => o.maLSX === data.maLSX);
      if(!order) throw new Error("Order not found");

      const newFinishedGood: FinishedGood = {
          maLSX: data.maLSX,
          maMau: order.maMau,
          soLuongNhap: data.soLuong,
          ngayNhapKho: new Date().toISOString().split('T')[0],
          nguoiNhap: data.nguoiNhap
      };
      finishedGoods.push(newFinishedGood);
      await api.updateProductionOrderStatus(data.maLSX, ProductionStatus.DaNhapKho);
      // TODO: send email
      return newFinishedGood;
  },
  getFinishedGoods: async (): Promise<FinishedGood[]> => {
      await delay(500);
      return [...finishedGoods].sort((a,b) => b.ngayNhapKho.localeCompare(a.ngayNhapKho));
  }
};
