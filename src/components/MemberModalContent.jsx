import React from 'react';
import { Header, Modal, Transition } from 'semantic-ui-react';

const MemberModalContent = ({ selectedMember }) => {
  if (!selectedMember) return null;
  return (
    <Modal.Content>
      <Modal.Header>{selectedMember.name}</Modal.Header>
      <Modal.Description>
        {selectedMember.region}
      </Modal.Description>
    </Modal.Content>
  );
}

export default MemberModalContent;
