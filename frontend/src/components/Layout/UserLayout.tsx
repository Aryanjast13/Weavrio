import { useEffect } from "react";
import { Outlet } from "react-router";
import { fetchCart } from "../../redux/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import Footer from "../Common/Footer/Footer";
import Header from "../Common/Header/Header";

const UserLayout = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const userId = user ? user?._id : undefined;
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart({ userId }));
    }
 },[])
  return (
    <>
      {/* Header */}
      <Header />
      {/* MainContent */}
      <main>
        <Outlet/>
      </main>
      {/* Footer */}
      <Footer/>
      </>
  )
}

export default UserLayout