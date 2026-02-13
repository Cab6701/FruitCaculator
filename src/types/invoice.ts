export type InvoiceItem = {
  id: string;
  name: string;
  pricePerKg: number;
  weightKg: number;
  /**
   * Nếu có, dòng này được tạo từ preset nào
   */
  presetId?: string;
};

export type Invoice = {
  id: string;
  createdAt: string; // ISO string
  items: InvoiceItem[];
  totalAmount: number;
  /** Ghi chú tùy chọn cho hoá đơn */
  note?: string;
};

export type FruitPreset = {
  id: string;
  name: string;
  /**
   * Đơn vị: đồng/kg (ví dụ nhập 10 ở UI sẽ lưu là 10000)
   */
  pricePerKg: number;
};


