'use strict';

const API_ROOT = 'https://data.parliament.scot/api/';

const get = (url) => {
	return new Promise((resolve, reject) => {
		fetch(url, {
				method: 'get'
			})
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				if (!data) {
					//ERR
				}
				resolve(data);
			});
	});
};

export const getInitialMSPData = () => {
	return new Promise((resolve, reject) => {
		Promise.all([
		get(API_ROOT + 'members'),
		get(API_ROOT + 'MemberElectionConstituencyStatuses'),
		get(API_ROOT + 'MemberElectionregionStatuses'),
		get(API_ROOT + 'constituencies'),
		get(API_ROOT + 'regions'),
		get(API_ROOT + 'parties'),
		get(API_ROOT + 'memberparties'),
		get(API_ROOT + 'partyroles'),
		get(API_ROOT + 'memberpartyroles'),
		get(API_ROOT + 'governmentroles'),
		get(API_ROOT + 'membergovernmentroles')
		]).then((dataArr) => {
			let returnData = {
				'basicMSPData': dataArr[0],
				'constitResults':  dataArr[1],
				'regResults': dataArr[2],
				'constituencies': dataArr[3],
				'regions': dataArr[4],
				'parties': dataArr[5],
				'partyMemberships': dataArr[6],
				'partyRoles': dataArr[7],
				'partyMemberRoles': dataArr[8],
				'govtRoles': dataArr[9],
				'govtMemberRoles': dataArr[10]
			};
			resolve(returnData);
		});
	});
};
/*

membercrosspartyroles
crosspartygrouproles
crosspartygroups
personcommitteeroles
committeeroles
committees
committeetypelinks
committeetypes
*/
export const getExpandedMSPData = () =>  {
	return new Promise((resolve, reject) => {
	Promise.all([
		get(API_ROOT + 'addresses'),
		get(API_ROOT + 'addresstypes'),
		get(API_ROOT + 'telephones'),
		get(API_ROOT + 'telephonetypes'),
		get(API_ROOT + 'emailaddresses'),
		get(API_ROOT + 'emailaddresstypes'),
		get(API_ROOT + 'websites'),
		get(API_ROOT + 'websitetypes'),
		get(API_ROOT + 'membercrosspartyroles'),
		get(API_ROOT + 'crosspartygrouproles'),
		get(API_ROOT + 'crosspartygroups'),
		get(API_ROOT + 'personcommitteeroles'),
		get(API_ROOT + 'committeeroles'),
		get(API_ROOT + 'committees'),
		get(API_ROOT + 'committeetypelinks'),
		get(API_ROOT + 'committeetypes')
		]).then((dataArr) => {
			let returnData = {
				'addresses': dataArr[0],
				'addressTypes':  dataArr[1],
				'telephones': dataArr[2],
				'telephoneTypes': dataArr[3],
				'emails': dataArr[4],
				'emailTypes': dataArr[5],
				'websites': dataArr[6],
				'websiteTypes': dataArr[7],
				'memberCPGRoles': dataArr[8],
				'cpgRoles': dataArr[9],
				'cpgs': dataArr[10],
				'memberCommitteeRoles': dataArr[11],
				'committeeRoles': dataArr[12],
				'committees': dataArr[13],
				'committeeTypeLinks': dataArr[14],
				'committeeTypes': dataArr[15],
			};
			resolve(returnData);
		});
	});
};