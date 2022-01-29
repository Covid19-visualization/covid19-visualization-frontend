/* eslint-disable no-unused-vars, no-loop-func, no-redeclare, eqeqeq, react-hooks/exhaustive-deps, array-callback-return */
import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./views/home/Home";
import { Context } from "./context/Provider";
import { fetchHandler } from "./utils/fetchHandler";
import { API } from "./utils/API";



function App() {

  const [isCasesVisualization, setIsCasesVisualization] = useState(false)
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCountriesData, setSelectedCountriesData] = useState({vaccinations: [], cases: []});
  const [europeData, setEuropeData] = useState({vaccinations: [], cases: []});
  const [selectedCountriesDataByName, setSelectedCountriesDataByName] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const isClicked = useState(false);

  
  const [newAccess, setNewAccess] = useState(true);

  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date("2021-06-01"),
    to: new Date()
  });

  const AppContext = {
    countries: countries,
    setCountries: setCountries,
    selectedCountries: selectedCountries,
    setSelectedCountries: setSelectedCountries,
    selectedCountriesData: selectedCountriesData,
    setSelectedCountriesData: setSelectedCountriesData,
    europeData: europeData,
    setEuropeData: setEuropeData,
    selectedPeriod: selectedPeriod,
    setSelectedPeriod: setSelectedPeriod,
    isCasesVisualization: isCasesVisualization,
    setIsCasesVisualization: setIsCasesVisualization,
    selectedCountriesDataByName: selectedCountriesDataByName,
    setSelectedCountriesDataByName: setSelectedCountriesDataByName,
    selectedCountry: selectedCountry,
    setSelectedCountry: setSelectedCountry,
    isClicked: isClicked
  }


  useEffect(() => {
    //newAccess ? fetchHandler({}, API.METHOD.POST, API.UPDATE_DATA, getCountries) : getCountries();
    getCountries()
  }, [selectedPeriod]);

  function getCountries() {
    fetchHandler(selectedPeriod, API.METHOD.POST, API.GET_ALL_COUNTRY_DATA, setCountries);
    setNewAccess(false);
  }
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
