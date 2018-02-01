/*
  The SubList within each memberlist
*/

import React from 'react';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
import List from 'material-ui/List';
import MemberListItem from './MemberListItem';

class MemberSubList extends React.PureComponent {
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
    );
  }
}

export default (MemberSubList);

