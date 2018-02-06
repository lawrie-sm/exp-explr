import React from 'react';
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
  }

  onClose() {
    this.props.closeModalCallback();
  }

  render() {
    const member = this.props.selectedMember;
    if (!member) return <Modal open={this.props.modalIsOpen} onClose={this.onClose} />
    console.log(member);
    let location = member.constituency || member.region;
    let roleTitle = '';
    if (member.govtRole) roleTitle = member.govtRole.title;
    else if (member.party.role) roleTitle = member.party.role.title;

    //let commRoles = member.

    return (
      <Modal open={this.props.modalIsOpen} onClose={this.onClose}>
        <Modal.Content image>
          <Image wrapped size='medium' src='http://via.placeholder.com/480x480' />
          <Modal.Description>
            <Header dividing>
              {member.name} ({member.party.abbreviation}) ({location})
            </Header>
            <List>
              {(roleTitle) ? <List.Item>{roleTitle}</List.Item> : ''}
            </List>
            <Divider hidden />

          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default MemberModal;
