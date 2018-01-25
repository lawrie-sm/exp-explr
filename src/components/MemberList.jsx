/*
  The variable list of MSPs
*/


import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
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
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={subList.ID}>{subList.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <List>
          {memberItems}
        </List>
      </ExpansionPanelDetails>
    </ExpansionPanel>
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
