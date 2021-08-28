import React, { useState } from "react";
import './CustomCalendar.css';
import Calendar from 'react-calendar'
import { Button } from "../Buttons/Button";
import { CONST } from "../../utils/const";

const CustomCalendar = (props) => {

    const value = props.value;
    const onChange = props.onChange;
    const onChangePeriod = props.onChangePeriod;
    const style = props.style;
    //TODO: week/month/year selector



    return (
        <div>
            <div id="outer">
                <div className="inner">
                    <Button
                        children={CONST.PERIOD.LAST_WEEK.LABEL}
                        onClick={() => onChangePeriod(CONST.PERIOD.LAST_WEEK.VALUE)}
                        type="button"
                    >
                    </Button>
                </div>
                <div className="inner">
                    <Button
                        children={CONST.PERIOD.LAST_MONTH.LABEL}
                        onClick={() => onChangePeriod(CONST.PERIOD.LAST_MONTH.VALUE)}
                        type="button">

                    </Button>
                </div>
                <div className="inner">
                    <Button
                        children={CONST.PERIOD.LAST_YEAR.LABEL}
                        onClick={() => onChangePeriod(CONST.PERIOD.LAST_YEAR.VALUE)}
                        type="button">

                    </Button>
                </div>
            </div>
            <Calendar
                onChange={onChange}
                value={value}
                style={style}
                maxDate={new Date()}
                minDate={new Date("2020-01-01")} />

        </div >

    );
}

export default CustomCalendar;