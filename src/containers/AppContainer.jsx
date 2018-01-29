/*
  Container for the apps data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import MemberList from '../components/MemberList';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';
import { getPartyList, getCommList } from '../data/subLists';

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
      console.log(this.state);
    });
  }

  render() {
    let r = 'Loading...';
    if (this.state.selectedDate && this.state.members) {

      // Do some type picker check...
      let groupedMembers = getPartyList(this.state.members);
      r = (
        <div className="AppContainer">
          <MemberList groupedMembers={groupedMembers} />
        </div>
      );
    }
    return (r);
  }
}

export default AppContainer;
