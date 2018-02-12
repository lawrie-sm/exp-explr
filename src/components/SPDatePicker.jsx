/*
  This date picker uses react-datepicker.
  Dates are limited to the term of the Scottish Parliament.
*/

import React from 'react';
import { Header } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class SPDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDate: props.selectedDate };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.props.dateUpdateCallback(date);
    this.setState({ selectedDate: date });
  }

  render() {
    return (
      <div className="DateWrapper">
        <Header as="h4">Date:{' '}</Header>
        <DatePicker
          selected={this.state.selectedDate}
          minDate={moment({ year: 1999, month: 4, date: 12 })}
          maxDate={moment()}
          onChange={this.handleChange}
          showYearDropdown
        />
      </div>
    );
  }
}

export default (SPDatePicker);
