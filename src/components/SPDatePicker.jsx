import React, { Fragment, Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { TimePicker, DatePicker } from 'material-ui-pickers';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class SPDatePicker extends Component {

  state = {
    selectedDate: this.props.selectedDate
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
    this.props.handleDateUpdate(date);
  }

  render() {
    const { selectedDate } = this.state;
    // Setting the min and max dates to first election and present day
    const minDate = new Date(1999, 4, 7);
    const maxdate = new Date();
    return (
        <DatePicker
          keyboard
          clearable
          returnMoment={false}
          value={selectedDate}
          onChange={this.handleDateChange}
          animateYearScrolling={false}
          minDate={minDate}
          maxDate={maxdate}
          openToYearSelection={true}
        />
    );
  }
}

export default (SPDatePicker);