import NavBar from "./NavBar/NavBar"
import TopBar from "./TopBar"

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      {/* Topbar */}
      <TopBar />
      {/* Navbar */}
      <NavBar/>
      </header>
  )
}

export default Header