import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Buttons/Button";
import './Navbar.css';
import FlagButton from "../../components/Buttons/flag/FlagButton";
import SearchBar from "../SearchBar/SearchBar";
import CustomCalendar from "../Calendar/CustomCalendar";
import { DateHandler, getLastPeriod } from "../../utils/utility";
import { CONST } from "../../utils/const";

var height = window.innerHeight;
var width = window.innerWidth;

//rfce
function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(false);

  const [value, setValue] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [fromHasChanged, setFromHasChanged] = useState(false);
  const [visible, setVisible] = useState(true);

  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date(),
    to: new Date()
  });

  function changeTo(newDate) {
    setSelectedPeriod({
      ...selectedPeriod,
      to: newDate
    })
  }

  function changeFrom(newDate) {
    setSelectedPeriod({
      ...selectedPeriod,
      from: newDate,
    })
  }

  function onChange(newDate) {
    if (fromHasChanged) {
      if (newDate > selectedPeriod.from && newDate < selectedPeriod.to) changeTo(newDate)
      else if (newDate >= selectedPeriod.to) changeTo(newDate)
      else changeFrom(newDate)
      setFromHasChanged(false);
    }
    else {
      if (newDate < selectedPeriod.to) changeFrom(newDate)
      else {
        changeFrom(selectedPeriod.to);
        changeTo(newDate);
      }
      setFromHasChanged(true);
    }
  }

  function onChangePeriod(period) {
    let from;
    switch (period) {
      case CONST.PERIOD.LAST_WEEK.VALUE:
        from = getLastPeriod(0, 0, 7);
        setFromHasChanged(true);
        changeTo(new Date());
        changeFrom(from);

        break;
      case CONST.PERIOD.LAST_MONTH.VALUE:
        from = getLastPeriod(0, 1, 0);
        changeTo(new Date());
        changeFrom(from);

        break;
      case CONST.PERIOD.LAST_YEAR.VALUE:
        from = getLastPeriod(1, 0, 0)
        changeTo(new Date());
        changeFrom(from);

        break;
      default:
        break;
    }
  }


  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleResize = () => {
    if (window.innerWidth <= 960) {
      setVisible(false);
      setButton(false);
    } else {
      setVisible(true);
      setButton(true);
    }
  };

  window.addEventListener('resize', handleResize)
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container-left">
          <div className="home-button">
            <FlagButton height={50} width={50} flagIcon={"europe"} type={CONST.FLAG_BUTTON.TYPE.HOME} />
          </div>

          <Link to="/" className="navbar-logo">
            Covid19 Visualyzer
          </Link>

          <SearchBar visible={visible} />

        </div>

        <div className="navbar-container-right">
          <div className="menu-icon" >
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-links"
              >
                Cases
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-links"
              >
                Vaccinations
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/"
                className="nav-links"
                onClick={toggleCalendar}
              >
                <i className="far fa-calendar-alt" /> {DateHandler(selectedPeriod.from, selectedPeriod.to)}
              </Link>
              {calendarVisible
                ? <div className="calendar-wrapper">
                  <CustomCalendar
                    onChange={onChange}
                    onChangePeriod={onChangePeriod}
                    value={value} />
                </div>
                : null}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Navbar;
