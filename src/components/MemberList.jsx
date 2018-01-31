/*
  The variable list of MSPs
*/


import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';

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

const MemberListItem = ({ memberInfo }) => (
  <ListItem button>
    <ListItemText primary={memberInfo.member.name} secondary={memberInfo.roleTitle} />
  </ListItem>
);

// TODO: These should check to see if the props have actually
// changed rather than rerendering each time they get list values

const SubList = ({ subList }) => {
  console.log('sublist rerender')
  const memberItems = subList.memberInfos.map((mi) => {
    return (<MemberListItem key={mi.member.ID} memberInfo={mi} />)
  });
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={subList.name}>{subList.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List> {memberItems} </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const MemberList = ({ groupedMembers }) => {
  console.log('memberlist rerender')
  const subLists = groupedMembers.map((s) =>
    <SubList key={s.ID} subList={s} />);
  return (
    <div className="MemberList">
      {subLists}
    </div>
  );
};

export default withStyles(styles)(MemberList);
