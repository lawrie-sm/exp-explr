import React, { Fragment } from 'react';
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
    this.setState({ startDate: date });
  }

  // Data is available from 1999-05-12

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
