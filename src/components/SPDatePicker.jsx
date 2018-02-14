/*
  This date picker uses react-datepicker.
  Dates are limited to the term of the Scottish Parliament.
*/

import React from 'react';
import { Button } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class SPDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDate: props.selectedDate };
    this.handleChange = this.handleChange.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
  }

  handleChange(date) {
    this.props.dateUpdateCallback(date);
    this.setState({ selectedDate: date });
    this.toggleCalendar()
  }

  toggleCalendar(e) {
    e && e.preventDefault();
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    let calender = null;
    if (this.state.isOpen) {
      calender = (
        <DatePicker
          selected={this.state.selectedDate}
          minDate={moment({ year: 1999, month: 4, date: 12 })}
          maxDate={moment()}
          onChange={this.handleChange}
          withPortal
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          inline
        />
      );
    }
    return (
      <div className="DateWrapper">
        <Button
          primary
          className="example-custom-input"
          onClick={this.toggleCalendar}
        >
          {this.state.selectedDate.format("DD-MM-YYYY")}
        </Button>
        {calender}

      </div>
    );
  }
}

export default (SPDatePicker);
