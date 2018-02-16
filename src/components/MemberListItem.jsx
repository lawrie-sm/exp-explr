/*
  Individual list items withing each sublist.
  Includes the members name, avatar and context-specific description.
  The click handler returns the member's ID for the modal.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Image, List } from 'semantic-ui-react';

class MemberListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imgHasErrored: false };
    this.handleError = this.handleError.bind(this);
  }

  handleError() {
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
          onError={() => this.handleError()}
        />
        <List.Content>
          <List.Header>{member.name}</List.Header>
          <List.Description>{this.props.memberInfo.roleTitle}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

MemberListItem.propTypes = {
  memberInfo: PropTypes.object.isRequired,
  openModalCallback: PropTypes.func.isRequired,
};

export default MemberListItem;
