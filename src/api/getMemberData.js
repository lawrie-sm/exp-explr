/*
Makes API calls to the Scottish Parliament
*/

// This is the basic URL for all Parliamentary API calls
const SP_API_ROOT = 'https://data.parliament.scot/api/';

// Hardcoded list of API endpoints
// See https://data.parliament.scot/#/api-list
const SP_API_ENDPOINTS = [
  'members',
  'MemberElectionConstituencyStatuses',
  'MemberElectionregionStatuses',
  'constituencies',
  'regions',
  'parties',
  'memberparties',
  'partyroles',
  'memberpartyroles',
  'governmentroles',
  'membergovernmentroles',
  'addresses',
  'addresstypes',
  'telephones',
  'telephonetypes',
  'emailaddresses',
  'emailaddresstypes',
  'websites',
  'websitetypes',
  'membercrosspartyroles',
  'crosspartygrouproles',
  'crosspartygroups',
  'personcommitteeroles',
  'committeeroles',
  'committees',
  'committeetypelinks',
  'committeetypes',
];

// Returns a promise for calling the API using fetch
function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'get' })
      .then((response) => response.json())
      .then((data) => resolve(data))
  });
}

// Main function for returning the data
function getMemberData() {
  return new Promise((resolve, reject) => {
    let promiseList = SP_API_ENDPOINTS.map((endpoint) => {
      return get(`${SP_API_ROOT}${endpoint}`);
    });

    Promise.all(promiseList).then((dataArr) => {
      let returnData = {};
      SP_API_ENDPOINTS.forEach((endpoint, i) => {
        returnData[endpoint] = dataArr[i];
      });
      resolve(returnData);
    });
  });
}

export default getMemberData;
