/*
  Container for the apps data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';
import SelectorTabs from '../components/SelectorTabs';
import SPDatePicker from '../components/SPDatePicker';
import { getPartyList, getGroupList } from '../data/subLists';

class AppContainer extends Component {
  constructor() {
    super();
    this.updateDate = this.updateDate.bind(this);
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

  updateDate(selectedDate) {
    console.log('Updating date');
    const coreData = this.state.coreData;
    const members = getMembers(selectedDate, coreData);
    this.setState({
      selectedDate,
      coreData,
      members,
    });
  }

  render() {
    let r = 'Loading...';
    if (this.state.selectedDate && this.state.members) {
      console.log(this.state);
      const partyList = getPartyList(this.state.members);
      const commList = getGroupList(this.state.members, 'committee');
      const cpgList = getGroupList(this.state.members, 'cpg');
      r = (
        <div className="AppContainer">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <SPDatePicker
                selectedDate={this.state.selectedDate}
                updateDate={this.updateDate}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectorTabs
                partyList={partyList}
                commList={commList}
                cpgList={cpgList}
              />
            </Grid>
          </Grid>
        </div>
      );
    }
    return (r);
  }
}

export default AppContainer;
