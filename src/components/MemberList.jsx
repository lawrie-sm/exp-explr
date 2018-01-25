/*
  The variable list of MSPs
*/

import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

const MemberListItem = ({ member }) => (
  <ListItem button>
    <ListItemText primary={member.name} />
  </ListItem>
)

const MemberList = ({ members }) => {
  const memberItems = members.map((m, i) => <MemberListItem key={m.ID} member={m} />);
  return (
    <div className="MemberList">
      <List>
        {memberItems}
      </List>
    </div>
  )
};

export default MemberList;
