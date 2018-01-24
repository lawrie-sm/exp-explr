/*
  Container for the member data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import MemberList from '../components/MemberList';
import getMembers from '../data/getMembers';

class AppContainer extends Component {
  constructor() {
    super();
    this.state = {
      selectedDate: undefined,
      members: undefined,
    };
  }

  componentDidMount() {
    const selectedDate = new Date();
    getMembers(selectedDate).then((members) => {
      this.setState({
        members,
        selectedDate,
      });
    });
  }

  render() {
    return (
      <div className="AppContainer">
        <MemberList members={this.state.members} />
      </div>
    );
  }
}

export default AppContainer;
