import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import purple from 'material-ui/colors/purple';

const styles = theme => ({
  progress: {
    margin: `100px auto`
  },
});

function Spinner(props) {
  const { classes } = props;
  return (
    <div>
      <CircularProgress
        className={classes.progress}
        style={{ color: purple[500] }}
        thickness={5}
        size={75}
      />
    </div>
  );
}

export default withStyles(styles)(Spinner);