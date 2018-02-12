/*
  Individual list items withing each sublist
*/

import React from 'react';
import { Image, List } from 'semantic-ui-react';

class MemberListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imgHasErrored: false };
    this.handleError = this.handleError.bind(this);
  }

  handleError(member) {
    this.setState({ imgHasErrored: true });
  }

  render() {
    const member = this.props.memberInfo.member;
    let imgURL = 'img/members/no-portrait.jpg';
    if (!this.state.imgHasErrored) imgURL = member.imgURLs.small;
    return (
      <List.Item key={member.ID} onClick={() => this.props.openModalCallback(member.ID)}>
        <Image
          avatar
          src={imgURL}
          onError={() => this.handleError(member)}
        />
        <List.Content>
          <List.Header>{member.name}</List.Header>
          <List.Description>{this.props.memberInfo.roleTitle}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default MemberListItem;
