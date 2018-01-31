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

class MemberListItem extends React.PureComponent {
  render() {
    return (
      <ListItem button>
        <ListItemText
          primary={this.props.memberInfo.member.name}
          secondary={this.props.memberInfo.roleTitle} 
        />
      </ListItem>
    );
  }
};

class SubList extends React.PureComponent {
  render() {
    const memberItems = this.props.subList.memberInfos.map((mi) => {
      return (<MemberListItem key={mi.member.ID} memberInfo={mi} />)
    });
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={this.props.subList.name}>{this.props.subList.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List> {memberItems} </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

class MemberList extends React.PureComponent {
  render() {
    const subLists = this.props.groupedMembers.map((s) =>
      <SubList key={s.ID} subList={s} />);
    return (
      <div className="MemberList">
        {subLists}
      </div>
    );
  }
}

export default withStyles(styles)(MemberList);
