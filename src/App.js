import React, { useCallback, useState, useEffect } from "react";
import Signup from "./components/sign-up";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./components/register";
import Profile from "./components/profile";
import AuthContext from "./utils/authContext";

const App = () => {
  const [user, setUser] = useState(null);
  const [authData, setAuthData] = useState(null);
  const login = useCallback(data => {
    if (data.authData) return setAuthData(data.authData);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      return setUser(data.user);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthData(null);
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUser(user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authData, login, logout }}>
      <Router>
        <Switch>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/" exact>
            <Signup />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
