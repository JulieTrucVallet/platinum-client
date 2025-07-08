import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";

// Pages
import AddRecipe from "./pages/AddRecipe";
import AdminAddRecipe from "./pages/AdminAddRecipe";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEditRecipe from "./pages/AdminEditRecipe";
import EditRecipe from "./pages/EditRecipe";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile.jsx";
import RecipeDetails from "./pages/RecipeDetails";
import Register from "./pages/Register";
import ShoppingList from "./pages/ShoppingList";

function App() {
  const location = useLocation();

  useEffect(() => {
    const body = document.body;

    // Reset all custom page classes
    body.classList.remove("login-page", "register-page");

    // Add specific class depending on current route
    if (location.pathname === "/login") {
      body.classList.add("login-page");
    } else if (location.pathname === "/register") {
      body.classList.add("register-page");
    }
  }, [location]);

  const hideNavRoutes = ["/login", "/register"];

  return (
    <>
      {!hideNavRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<ShoppingList />} />
        <Route path="/courses/:id" element={<ShoppingList />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-recipe" element={<AdminAddRecipe />} />
        <Route path="/admin/edit-recipe/:id" element={<AdminEditRecipe />} />
      </Routes>
    </>
  );
}

export default App;