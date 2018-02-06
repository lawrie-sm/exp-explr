
import React from 'react';
import { Image, List } from 'semantic-ui-react';


class MemberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errored: false };
    this.handleError = this.handleError.bind(this);
  }

  handleError(member) {
    console.log(member.name);
    this.setState({ errored: true });
  }

  render() {
    const member = this.props.member;
    let imgURL = 'http://via.placeholder.com/50x50';
    if (!this.state.errored) imgURL = member.imgURLs.small;
    return (
      <List.Item key={member.ID} onClick={() => this.props.openModalCallback(member.ID)}>
        <Image
          avatar
          src={imgURL}
          onError={() => this.handleError(member)}
        />
        <List.Content>
          <List.Header>{member.name}</List.Header>
          <List.Description>{member.roleTitle}</List.Description>
        </List.Content>
      </List.Item>
    );
  }
}

export default MemberList;
