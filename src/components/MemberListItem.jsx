import React from 'react';
import { ListItem, ListItemText } from 'material-ui/List';

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
}

export default (MemberListItem);
