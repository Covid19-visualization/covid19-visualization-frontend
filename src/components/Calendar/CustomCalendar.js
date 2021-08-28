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

    const buttonList = [CONST.PERIOD.LAST_WEEK, CONST.PERIOD.LAST_MONTH, CONST.PERIOD.LAST_YEAR];


    return (
        <div>
            <div id="outer">
                {buttonList.map((item) => {
                    return <div className="inner">
                        <Button
                            children={item.LABEL}
                            onClick={() => onChangePeriod(item.VALUE)}
                            type="button"
                        >
                        </Button>
                    </div>
                })}

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