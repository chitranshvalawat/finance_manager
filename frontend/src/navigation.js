import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Components/Login/index";
import Dashboard from "./Components/Dashboard/index";

export default function Navigation() {
  return (
    <div className="main-toolbar">
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}
