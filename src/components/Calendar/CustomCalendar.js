import React, { useState } from "react";
import './CustomCalendar.css';
import Calendar from 'react-calendar'

const CustomCalendar = (props) => {

    const value = props.value;
    const onChange = props.onChange;
    const style = props.style;
    //TODO: week/month/year selector
    return (
        <div>    
            <p style={{ borderLeft: "6px solid #1C1B1B", borderRight: "6px solid #1C1B1B"}}>last week | last month | last year</p>
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