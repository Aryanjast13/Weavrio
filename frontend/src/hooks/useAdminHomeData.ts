import { useEffect } from "react";
import { fetchAllOrders } from "../redux/adminOrderSlice";
import { fetchAdminProducts } from "../redux/adminProductSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export function useAdminHomeData() {
  const dispatch = useAppDispatch();
  const {
    products,
    loading: productLoading,
    error: productError,
  } = useAppSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useAppSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);
    
    
    
     return {
       products,
       productLoading,
       productError,
       orders,
       totalOrders,
       totalSales,
       ordersLoading,
       ordersError,
     };
}
