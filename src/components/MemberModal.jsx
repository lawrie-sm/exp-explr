/*
  This modal opens when a member is clicked.
  semantic-ui handles the display of opening/closing via the modalIsOpen prop
  It displays CPG and Committee info about the member in question, as well
  as a larger image. A subcomponent is used for the role listing.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Header, List, Divider, Modal, Image } from 'semantic-ui-react';

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

  handleError() {
    this.setState({ imgHasErrored: true });
  }

  render() {
    const member = this.props.selectedMember;
    if (!member) return <Modal open={this.props.modalIsOpen} onClose={this.onClose} />;
    let imgURL = 'img/members/no-portrait.jpg';
    if (!this.state.imgHasErrored) imgURL = member.imgURLs.small;
    const location = member.constituency || member.region;
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
            onError={() => this.handleError()}
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
            {(!member.committees && !member.cpgs) ? '(No Committee or CPG roles)' : ''}
            <Divider hidden />

          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const MemberRolesList = ({ header, roles }) => {
  if (!roles || roles.length === 0) return null;
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
};

MemberModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  selectedMember: PropTypes.object.isRequired,
  closeModalCallback: PropTypes.func.isRequired,
};

MemberRolesList.propTypes = {
  header: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
};

export default MemberModal;
