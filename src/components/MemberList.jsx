/*
  The variable list of MSPs
*/


import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
});

const MemberListItem = ({ member }) => (
  <ListItem button>
    <ListItemText primary={member.name} />
  </ListItem>
);

const SubList = ({ subList }) => {
  const memberItems = subList.members.map((m) =>
    <MemberListItem key={m.ID} member={m} />);
  return (
    <div className={subList.ID} subheader={<div />}>
      <List>
        <ListSubheader>{subList.name}</ListSubheader>
        {memberItems}
      </List>
    </div>
  );
};

const MemberList = ({ groupedMembers }) => {
  const subLists = groupedMembers.map((s) =>
    <SubList key={s.ID} subList={s} />);
  return (
    <div className="MemberList">
      {subLists}
    </div>
  );
};

export default withStyles(styles)(MemberList);
