import { Navigate, createBrowserRouter } from "react-router-dom";

import { SalesOrderDetailPage } from "@/pages/sales-order-detail";
import { SalesOrderListPage } from "@/pages/sales-order-list";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/sales-orders" replace /> },
  { path: "/sales-orders", element: <SalesOrderListPage /> },
  { path: "/sales-orders/:id", element: <SalesOrderDetailPage /> },
]);
