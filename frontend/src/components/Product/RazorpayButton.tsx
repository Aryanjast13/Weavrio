
import React from "react";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayButtonProps {
  amount: number;
  orderData: any;
  customerInfo: {
    name: string;
    email: string;
    contact: string;
  };
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  orderData,
  customerInfo,
  onSuccess,
  onError,
}) => {
  const handlePayment = () => {
    const options: RazorpayOptions = {
      key: orderData.key_id,
      amount: amount,
      currency: "INR",
      name: "Your Store Name",
      description: "Purchase from Your Store",
      order_id: orderData.order.id,
      handler: function (response: any) {
        // Payment successful
        console.log("Payment successful:", response);
        onSuccess(response);
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.contact,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      console.error("Payment failed:", response.error);
      onError(response.error);
    });

    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Pay ₹{(amount / 100).toFixed(2)}
    </button>
  );
};

export default RazorpayButton;
