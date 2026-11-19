export type SalesOrderStatus = "DRAFT" | "COMPLETED" | "CLOSED";
export type SalesOrderType = "CMT" | "FULL_PACKAGE";

/** comment-test API 의 수주 행 — geulim 목록 응답에서 시연에 쓰는 열만 */
export interface SalesOrder {
  id: string;
  status: SalesOrderStatus;
  season: string;
  year: number;
  teamName: string | null;
  buyerName: string;
  brandName: string;
  styleNumber: string;
  styleCode: string | null;
  styleDescription: string | null;
  designer: string | null;
  gender: string | null;
  category: string | null;
  remark: string | null;
  currency: string;
  unit: string;
  orderType: SalesOrderType | null;
  orderQty: number;
  prodQty: number;
  orderAmount: number;
  prodAmount: number;
  deliveryDate: string | null;
  sewingFactoryName: string | null;
  sewingFactoryCountry: string | null;
  sampleType: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SoSize {
  id: string;
  salesOrderId: string;
  sizeName: string;
  isBasic: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderDetail extends SalesOrder {
  sizes: SoSize[];
}

export interface SalesOrdersResponse {
  salesOrders: SalesOrder[];
  currentPage: number;
  totalCount: number;
  totalPage: number;
  totalBuyerQuantity: number;
  totalOrderQuantity: number;
  totalProdQuantity: number;
  totalOrderAmount: number;
  totalProdAmount: number;
  draftCount: number;
}

/** 목록 조회 파라미터 — 값이 비면 보내지 않는다 */
export interface SalesOrdersQuery {
  status?: SalesOrderStatus;
  search?: string;
  styleNumber?: string;
  buyerName?: string;
  brandName?: string;
  styleDescription?: string;
  sewingFactoryName?: string;
  sewingFactoryCountry?: string;
  season?: string;
  teamName?: string;
  gender?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  page?: number;
  take?: number;
}
