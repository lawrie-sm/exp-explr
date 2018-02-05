import React from 'react';
import { Header, Modal, Transition } from 'semantic-ui-react';
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
    return (
      <Transition visible={this.props.modalIsOpen} animation='scale' duration={250}>
        <Modal open={this.props.modalIsOpen} onClose={this.onClose}>
          <MemberModalContent selectedMember={this.props.selectedMember} />
        </Modal>
      </Transition>
    );
  }
}

export default MemberModal;
