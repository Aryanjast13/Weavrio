import  { useEffect } from "react";
import {  useParams } from "react-router";
import { fetchOrderDetails } from "../redux/orderSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import type { OrderState } from "../types/order";

export function useOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // ✅ Properly typed selector
  const { orderDetails, loading, error } = useAppSelector(
    (state: { orders: OrderState }) => state.orders
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  // Helper functions
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (date: string | Date): string => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };
    
    return {
        orderDetails,loading,error,formatCurrency,formatDate
    }
}
