import React, { useState, useContext, useEffect} from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./views/home/Home";
import { Context } from "./context/Provider";
import { fetchHandler } from "./utils/fetchHandler";
import { API } from "./utils/API";



function App() {

  const [countries, setCountries] = useState({});
  const AppContext = {
    countries: countries,
    setCountries: setCountries,
  }

  useEffect(() => {
    fetchHandler(null, "GET", API.GET_ALL_COUNTRY_DATA, setCountries);
  }, []);

  return (
    <>
      <Context.Provider value={AppContext}>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" exact />
          </Switch>
          <Home />
        </Router>
      </Context.Provider>
    </>
  );
}

export default App;
