import papa from "papaparse";
import React, { useContext, useEffect, useState } from 'react';
import { features } from "../../../views/vaccinations/Europe.geo.json"
import { CONST } from "../../../utils/const";
import { Context } from '../../../context/Provider';

class LoadCountryTask {

    setState = null;

    load = (setState) => {
        this.setState = setState;
    }

    processCovidData = (covidCountries) => {

        for (let i = 0; i < features.length; i++) {
          const country = features[i];
          //console.log(country);
          const covidCountry = covidCountries.find(
            (covidCountry) => country.properties.admin === covidCountry.CONST.EUROPE.NAME
          );
    
          //country.properties.confirmed = 0;
          //country.properties.confirmedText = 0;
    
          /*if (covidCountry != null) {
            let confirmed = Number(covidCountry.Confirmed);
            country.properties.confirmed = confirmed;
            country.properties.confirmedText = confirmed;
          }*/
          //this.#setCountryColor(country);
        }
    
        this.setState(features);
      };
    


}

export default LoadCountryTask;