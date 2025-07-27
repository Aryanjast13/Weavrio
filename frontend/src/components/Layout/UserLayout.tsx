import { Outlet } from "react-router"
import Footer from "../Common/Footer/Footer"
import Header from "../Common/Header/Header"

const UserLayout  = () => {
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