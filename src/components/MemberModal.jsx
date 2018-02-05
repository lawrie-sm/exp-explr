import React from 'react';
import { Header, Modal } from 'semantic-ui-react';


// Make this a controlled modal class with
// a handleclose method with a callback to container for setting
// state to closed.
// https://react.semantic-ui.com/modules/modal#modal-example-controlled

const MemberModal = ({ modalIsOpen, content }) => (
  <Modal open={modalIsOpen}>
    <Modal.Content>
      <Modal.Header>Header</Modal.Header>
      <Modal.Description>
        {content}
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default MemberModal;
