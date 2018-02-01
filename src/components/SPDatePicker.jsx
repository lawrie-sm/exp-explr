import React, { Fragment, Component } from 'react';
import { Typography } from 'material-ui';
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
    console.log(this.props);
    this.setState({ selectedDate: date });
    this.props.updateDate(date);
  }

  render() {
    const { selectedDate } = this.state;
    // Setting the min and max dates to first election and present day
    const minDate = new Date(1999, 4, 7);
    const maxdate = new Date();
    return (
      <div className="SPDatePicker">
        <Typography type="button">
          Date
        </Typography>
        <DatePicker
          keyboard
          clearable
          value={selectedDate}
          onChange={this.handleDateChange}
          animateYearScrolling={false}
          minDate={minDate}
          maxDate={maxdate}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SPDatePicker);