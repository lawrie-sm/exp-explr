import React from 'react';
import { Header, Modal, Image, Transition } from 'semantic-ui-react';
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
    const title = member.party.name;
    let location = member.region;
    if (member.constituency) location = `${member.constituency}, ${member.region}`;
    return (
        <Modal open={this.props.modalIsOpen} onClose={this.onClose}>
          <Modal.Content image>
          <Image wrapped size='medium' src='http://via.placeholder.com/480x480' />
            <Modal.Description>
              <Header>{member.name}</Header>
              {member.party.name}
              {location}
            </Modal.Description>
          </Modal.Content>
        </Modal>
      
    );
  }
}

const EmptyModal = () => {

}

export default MemberModal;
