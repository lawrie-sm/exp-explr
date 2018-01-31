/*
  Container for the apps data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';
import SelectorTabs from '../components/SelectorTabs';
import { getPartyList, getGroupList } from '../data/subLists';

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
    let r = 'Loading...';
    if (this.state.selectedDate && this.state.members) {
      const partyList = getPartyList(this.state.members);
      const commList = getGroupList(this.state.members, 'committee');
      const cpgList = getGroupList(this.state.members, 'cpg');
      r = (
        <div className="AppContainer">
          <SelectorTabs
            partyList={partyList}
            commList={commList}
            cpgList={cpgList}
          />
        </div>
      );
    }
    return (r);
  }
}

export default AppContainer;
