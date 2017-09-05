/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__view_js__ = __webpack_require__(2);





__WEBPACK_IMPORTED_MODULE_0__model_js__["b" /* getDataFromAPIs */].then((d) => {
	
	let mspMap = __WEBPACK_IMPORTED_MODULE_0__model_js__["c" /* getMSPMap */](
		d.constitResults, d.regResults, d.constits, d.regions);
		
	__WEBPACK_IMPORTED_MODULE_0__model_js__["a" /* addMSPData */](mspMap, d.basicMSPData);
	
	__WEBPACK_IMPORTED_MODULE_1__view_js__["a" /* setView */](mspMap);

});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const CURRENT_DATE = new Date();

function Area(_name, _code) {		
	this.name = _name;
	this.code = _code;
}

function MSP
(_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL) {
	this.constit = _constit;
	this.region = _region;
	this.firstName = _firstName;
	this.lastName = _lastName;
	this.DOB = _DOB;
	this.photoURL = _photoURL;
}

const getSPDateFromStr = (dateStr) => {
	let T = dateStr.indexOf('T');
	dateStr = dateStr.substring(0, T);
	dateStr = dateStr.replace(/\s+/g, '');
	let dateArr = dateStr.split('-');
	let year = dateArr[0],
	month = dateArr[1],
	day = dateArr[2];
	return new Date(year, (month - 1), day);
};

/******************************************************************/

//EXPORTS

const getDataFromAPIs = new Promise((resolve, reject) => {
	const APIroot = 'https://data.parliament.scot/api/';
	const membersAPI = APIroot + 'members';
	const constituencyElectionsAPI = APIroot + 'MemberElectionConstituencyStatuses';
	const regionalElectionsAPI = APIroot + 'MemberElectionregionStatuses';
	const regionsAPI = APIroot + 'regions';
	const constituenciesAPI = APIroot + 'constituencies';

	const get = (url) => {
		return new Promise((resolve, reject) => {
			fetch(url, {
					method: 'get'
				})
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					resolve(data);
				});
		});
	};
		
	Promise.all([
	get(membersAPI),
	get(constituencyElectionsAPI),
	get(regionalElectionsAPI),
	get(constituenciesAPI),
	get(regionsAPI)
	]).then((dataArr) => {

	let returnData = {
	'basicMSPData': dataArr[0],
	'constitResults':  dataArr[1],
	'regResults': dataArr[2],
	'constits': dataArr[3],
	'regions': dataArr[4],
	}

	resolve(returnData);
	
	});
});
/* harmony export (immutable) */ __webpack_exports__["b"] = getDataFromAPIs;


//Builds a Map of MSPs using their PersonIDs
const getMSPMap =
(constitResults, regResults, constituencies, regions) => {

	let r = new Map();
	let results;

	for (let isLoopingRegions = 0; isLoopingRegions < 2; isLoopingRegions++) {
		if (isLoopingRegions) {
			results = regResults;
		} else {
			results = constitResults;
		}

		results.forEach((electionResult) => {

			let startDate = null;
			let endDate = null;
			startDate = getSPDateFromStr(electionResult.ValidFromDate);
			if (electionResult.ValidUntilDate != null) {
				endDate = getSPDateFromStr(electionResult.ValidUntilDate);
			}

			if ((CURRENT_DATE >= startDate &&
					CURRENT_DATE <= endDate) ||
				(CURRENT_DATE >= startDate &&
					endDate == null)) {

				let newMSP = new MSP();

				if (isLoopingRegions) {

					let region = regions.find((reg) => {
						return reg.ID == electionResult.RegionID;
					});
					newMSP.region = new Area(region.Name, region.RegionCode);

				} else {

					let constit = constituencies.find((c) => {
						return c.ID == electionResult.ConstituencyID;
					});
					newMSP.constit = new Area(constit.Name, constit.ConstituencyCode);

					let region = regions.find((reg) => {
						return reg.ID == constit.RegionID;
					});
					newMSP.region = new Area(region.Name, region.RegionCode);

				}
				r.set(electionResult.PersonID, newMSP);
			}
		});
	}
	return r;
};
/* harmony export (immutable) */ __webpack_exports__["c"] = getMSPMap;


const addMSPData = (mspMap, basicMSPData) => {
console.log(mspMap);

	mspMap.forEach((val, key, map) => {

		let mspDataObj = basicMSPData.find((dataElem) => {
			return dataElem.PersonID === key;
		});

		let fullName = mspDataObj.ParliamentaryName.split(',');
		val.firstName = fullName[1];
		val.lastName = fullName[0];

		if (!mspDataObj.BirthDateIsProtected) {
			val.DOB = getSPDateFromStr(mspDataObj.BirthDate);
		}

		val.photoURL = mspDataObj.PhotoURL;

	});
};
/* harmony export (immutable) */ __webpack_exports__["a"] = addMSPData;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


const setView = (mspMap) => {
		const colsClass = 'cols';
		const cellClass = 'cols--cell';
		const txtBoxClass = 'txtbox';
		const portraitBoxClass = 'portrait-box';
		const portraitImgClass = 'portrait-img';
		const smallImgPath = '/img/portraits/';
		const main = document.getElementsByTagName('main')[0];
		
		const E = (tag, attrs = {}, text = '', ...children) => {
			const e = document.createElement(tag);
			if (attrs) {
				for (let key in attrs) {
					e.setAttribute(key, attrs[key]);
				}
			}
			if (text) {
				e.appendChild(document.createTextNode(text));
			}
			for (let i = 0; i < children.length; i++) {
				e.appendChild(children[i]);
			}
			return e;
		};

		mspMap.forEach((m) => {
			let location;
			if (m.constit) {
				location = m.constit.name + ', ' + m.region.name;
			} else {
				location = m.region.name;
			}
			
			let birthDate = '(Birth date not given)';
			if (m.DOB) {
				let d = m.DOB;
				birthDate = d.getDate() +
					'/' + (d.getMonth() + 1) +
					'/' + d.getFullYear();
			}
			
			let imgSRC = m.photoURL;
			let imgAlt = m.firstName + ' portrait';
			if (imgSRC) {
				let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
				imgID = imgID.replace(/\s+/g, '');
				imgSRC = smallImgPath + imgID + '.jpg';
			} else {
				imgSRC = '#';
			}

			let MSPComponent = E('div', {
					'class': colsClass
				}, '',
				E('div', {
						'class': cellClass
					}, '',
					E('div', {
							'class': portraitBoxClass
						}, '',
						E('img', {
							'class': portraitImgClass,
							'src': imgSRC,
							'alt': imgAlt
						})),
					E('div', {
							'class': txtBoxClass
						}, '',
						E('p', {}, m.firstName + ' ' + m.lastName),
						E('p', {}, birthDate),
						E('p', {}, location)
					)));

			main.appendChild(MSPComponent);
		});
	}
/* harmony export (immutable) */ __webpack_exports__["a"] = setView;


/***/ })
/******/ ]);