import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";

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
    body.classList.remove("login-page", "register-page");

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
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/add-recipe"
            element={
              <PrivateRoute>
                <AddRecipe />
              </PrivateRoute>
            }
          />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipes/:id/edit"
            element={
              <PrivateRoute>
                <EditRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <ShoppingList />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <PrivateRoute>
                <ShoppingList />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-recipe"
            element={
              <PrivateRoute>
                <AdminAddRecipe />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/edit-recipe/:id"
            element={
              <PrivateRoute>
                <AdminEditRecipe />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;