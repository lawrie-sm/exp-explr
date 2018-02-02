/*
  Container for the apps data.
  Manages and updates the member list based on pickers.
*/

import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import { Typography } from 'material-ui';
import fetchCoreDataFromAPIs from '../data/fetchCoreDataFromAPIs';
import getMembers from '../data/getMembers';
import SelectorTabs from '../components/SelectorTabs';
import SPDatePicker from '../components/SPDatePicker';
import { getPartyList, getGroupList } from '../data/subLists';
import Spinner from '../components/Spinner';

class AppContainer extends Component {
  constructor() {
    super();
    this.handleDateUpdate = this.handleDateUpdate.bind(this);
    this.state = {
      isLoading: true,
      selectedDate: undefined,
      members: undefined,
    };
  }

  componentDidMount() {
    const selectedDate = new Date();
    fetchCoreDataFromAPIs().then((coreData) => {
      const members = getMembers(selectedDate, coreData);
      this.setState({
        isLoading: false,
        selectedDate,
        members,
      });
    });
  }

  // Handles the click event on updating the date
  // (We could cache coreData, but it's pretty big
  // and we need all of it to cover all possible dates)
  handleDateUpdate(selectedDate) {
    this.setState({ isLoading: true });
    fetchCoreDataFromAPIs().then((coreData) => {
      const members = getMembers(selectedDate, coreData);
      this.setState({
        isLoading: false,
        selectedDate,
        members,
      });
    });
  }

  render() {
    if (!this.state.isLoading) {
      const partyList = getPartyList(this.state.members);
      const commList = getGroupList(this.state.members, 'committee');
      const cpgList = getGroupList(this.state.members, 'cpg');
      return (
        <div className="AppContainer">
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography type="display1" align="center">
                <span className="MainHeading">msp-data</span>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <SPDatePicker
                selectedDate={this.state.selectedDate}
                handleDateUpdate={this.handleDateUpdate}
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
    } return (
      <Spinner />
    );
  }
}

export default AppContainer;
