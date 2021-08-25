import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Buttons/Button";
import './Navbar.css';

//rfce
function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(false);

  const handleClick = () => {
    setClick(!click);
  };

  const showButton = () => {
    //window.innerWidth < 960 ? setButton(false) : setButton(true);
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  window.addEventListener('resize', showButton)
  return (
    <>
      <nav className="navbar">
     {/*    <div className="container">

        </div>
        <div className="navbar-container-left">
          <Link to="/" className="navbar-logo">
            Covid19 Visualyzer
          </Link>
        </div> */}

        <div className="navbar-container-right">
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-links"
                onClick={() => setClick(false)}
              >
                Cases
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/vaccinations"
                className="nav-links"
                onClick={() => setClick(false)}
              >
                Vaccinations
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-links"
                onClick={() => setClick(false)}
              >
                <i class="far fa-calendar-alt" /> 10 May 2021 - 20 May 2021
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
