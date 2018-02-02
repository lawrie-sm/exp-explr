/*
  Container for the apps data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';
import { getPartyList, getGroupList } from '../data/subLists';
import Spinner from '../components/Spinner';
import SelectorTabs from '../components/SelectorTabs';

class AppContainer extends Component {
  constructor() {
    super();
    this.handleDateUpdate = this.handleDateUpdate.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    const selectedDate = new Date();
    fetchCoreDataFromAPIs().then((coreData) => {
      this.setData(selectedDate, coreData);
    });
  }

  setData(selectedDate, coreData) {
    const members = getMembers(selectedDate, coreData);
    const partyData = { title: 'Party', data: getPartyList(members) };
    const committeeData = { title: 'Committee', data: getGroupList(members, 'committee') };
    const cpgData = { title: 'CPG', data: getGroupList(members, 'cpg') };
    this.setState({
      isLoading: false,
      selectedDate,
      partyData,
      committeeData,
      cpgData,
    });
  }

  // Handles the click event on updating the date
  // (We could cache coreData, but it's pretty big
  // and we need all of it to cover all possible dates)
  handleDateUpdate(selectedDate) {
    this.setState({ isLoading: true });
    fetchCoreDataFromAPIs().then((coreData) => {
      this.setData(selectedDate, coreData);
    });
  }
  render() {
    if (!this.state.isLoading) {
      console.log(this.state);
      return (
        <div className="AppContainer">
          <SelectorTabs />
        </div>
      );
    } return (
      <Spinner />
    );
  }
}

export default AppContainer;
