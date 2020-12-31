import React, { useCallback, useState } from "react";
import Signup from "./components/sign-up";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./components/register";
import AuthContext from "./utils/authContext";
const App = () => {
  const [user, setUser] = useState(null);
  const [authData, setAuthData] = useState(null);
  const login = useCallback(data => {
    if (data.authData) return setAuthData(data.authData);
    if (data.user) return setUser(data.user);
  }, []);
  const logout = useCallback(() => {}, []);
  return (
    <AuthContext.Provider value={{ user, authData, login, logout }}>
      <Router>
        <Switch>
          <Route path="/register" exact>
            <Register />
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
