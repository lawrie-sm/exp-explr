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
    this.setState({ selectedDate: date });
    this.props.updateCallback(date);
  }

  render() {
    const { selectedDate } = this.state;
    return (
      <Fragment>
        <div className="picker">
          <DatePicker
            keyboard
            clearable
            value={selectedDate}
            onChange={this.handleDateChange}
            animateYearScrolling={false}
          />
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SPDatePicker);