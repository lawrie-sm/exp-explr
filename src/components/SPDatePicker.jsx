import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class SPDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { startDate: props.selectedDate };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.props.dateUpdateCallback(date);
    this.setState({ startDate: date });
  }

  render() {
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
      />
    );
  }
}

export default (SPDatePicker);
