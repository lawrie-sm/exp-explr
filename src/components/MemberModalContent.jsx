import { React, Fragment } from 'react';
import { Header, Modal, Transition } from 'semantic-ui-react';

const MemberModalContent = ({ selectedMember }) => {
  if (!selectedMember) return null;
  return (
    <div>
      <Modal.Header>{selectedMember.name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {selectedMember.region}
        </Modal.Description>
      </Modal.Content>
    </div>
  );
}

export default MemberModalContent;
