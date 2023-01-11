import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { ThemeProvider } from "styled-components";
import ProtectedRoute from "./app/ProtectedRoute";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./firebase/firebase";
import { darkTheme, ligthTheme } from "./app/theme";

const App = () => {
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  const navigate = useNavigate();

  const [currentUser] = useAuthState(auth);

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme === "light" ? ligthTheme : darkTheme}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login toggleTheme={toggleTheme} />} />
        <Route path="/signup" element={<Signup toggleTheme={toggleTheme} />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
