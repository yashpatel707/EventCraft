import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getDashboardLink = () => {
    switch (role) {
      case "admin":
        return "/admin";
      case "employee":
        return "/employee";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        EventCraft
      </Link>

      <div className="flex items-center space-x-4">
        {/* COMMON LINKS */}
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/contact" className="hover:text-gray-300">
          Contact
        </Link>

        {token ? (
          <>
            <Link to={getDashboardLink()} className="hover:text-gray-300">
              Dashboard
            </Link>

            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
