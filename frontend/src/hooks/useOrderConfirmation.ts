import { useEffect } from "react";
import { useNavigate } from "react-router";
import { clearCart } from "../redux/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import type { CheckoutState } from "../types/checkout";


export function useOrderConfirmation() {
    const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { checkout } = useAppSelector((state:{checkout:CheckoutState}) => state.checkout);

  //clear the cart when the order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);
  
  

  const calculateEstimatedDelivery = (createdAt:string ) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); //add 10 days to the order date
    return orderDate.toLocaleDateString();
  };
    
    return {
        calculateEstimatedDelivery,checkout
    }
}