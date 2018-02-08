import React, { Fragment } from 'react';
import { Header, List, Divider, Modal, Image, Transition } from 'semantic-ui-react';
import MemberModalContent from './MemberModalContent';

// Make this a controlled modal class with
// a handleclose method with a callback to container for setting
// state to closed.
// https://react.semantic-ui.com/modules/modal#modal-example-controlled

class MemberModal extends React.Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.handleError = this.handleError.bind(this);
    this.state = { imgHasErrored: false };
  }

  onClose() {
    this.setState({ imgHasErrored: false });
    this.props.closeModalCallback();
  }

  handleError(member) {
    this.setState({ imgHasErrored: true });
  }

  render() {
    const member = this.props.selectedMember;
    if (!member) return <Modal open={this.props.modalIsOpen} onClose={this.onClose} />
    let imgURL = 'http://via.placeholder.com/150x150';
    if (!this.state.imgHasErrored) imgURL = member.imgURLs.small;
    let location = member.constituency || member.region;
    let roleTitle = '';
    if (member.govtRole) roleTitle = member.govtRole.title;
    else if (member.party.role) roleTitle = member.party.role.title;
    const commRoles = <MemberRolesList header="Committees" roles={member.committees} />;
    const cpgRoles = <MemberRolesList header="Cross-Party Groups" roles={member.cpgs} />;

    return (
      <Modal open={this.props.modalIsOpen} onClose={this.onClose}>
        <Modal.Content image>
          <Image
            wrapped
            size="small"
            src={imgURL}
            onError={() => this.handleError(member)}
          />
          <Modal.Description>
            <Header dividing>
              {member.name}
              <Header.Subheader>
                {member.party.name}, {location}
              </Header.Subheader>
              {(roleTitle) ? <Header.Subheader><b>{roleTitle}</b></Header.Subheader> : ''}
            </Header>
            {commRoles}
            {cpgRoles}
            <Divider hidden />

          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const MemberRolesList = ({header, roles}) => {
  if (!roles || roles.length == 0) return null;
  const listItems = roles.map((r) => (
    <List.Item key={r.ID}>{r.name} &#8211; {r.role}</List.Item>
  ));
  return (
    <List>
        <List.Item>
          <List.Header> {header} </List.Header>
        </List.Item>
        {listItems}
    </List>
  );
}


export default MemberModal;
