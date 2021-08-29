import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./views/home/Home";
import { Context } from "./context/Provider";
import { fetchHandler } from "./utils/fetchHandler";
import { API } from "./utils/API";



function App() {

  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date("2020-01-01"),
    to: new Date()
  });

  const AppContext = {
    countries: countries,
    setCountries: setCountries,
    selectedCountries: selectedCountries,
    setSelectedCountries: setSelectedCountries,
    selectedPeriod: selectedPeriod,
    setSelectedPeriod: setSelectedPeriod,
  }

  useEffect(() => {
    fetchHandler(selectedPeriod, "POST", API.GET_ALL_COUNTRY_DATA, setCountries);
  }, [selectedPeriod]);

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
