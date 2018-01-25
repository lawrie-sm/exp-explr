/*
  Container for the apps data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import MemberList from '../components/MemberList';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';

class AppContainer extends Component {
  constructor() {
    super();
    this.state = {
      selectedDate: undefined,
      coreData: undefined,
      members: undefined,
    };
  }

  componentDidMount() {
    const selectedDate = new Date();
    fetchCoreDataFromAPIs().then((coreData) => {
      const members = getMembers(selectedDate, coreData);
      this.setState({
        selectedDate,
        coreData,
        members,
      });
    });
  }

  render() {
    if (this.state.selectedDate && this.state.members) {
      return (
        <div className="AppContainer">
          <MemberList members={this.state.members} />
        </div>
      );
    } else {
      return 'Loading...';
    }

  }
}

export default AppContainer;
