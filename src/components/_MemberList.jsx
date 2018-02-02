/*
  The variable list of MSPs
*/

import React from 'react';
import { withStyles } from 'material-ui/styles';
import MemberSubList from './MemberSubList';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
});

class MemberList extends React.PureComponent {
  render() {
    const subLists = this.props.groupedMembers.map((s) =>
      <MemberSubList key={s.ID} subList={s} />);
    return (
      <div className="MemberList">
        {subLists}
      </div>
    );
  }
}

export default withStyles(styles)(MemberList);
