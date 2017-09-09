export function Area(_name, _code) {		
	this.name = _name;
	this.code = _code;
}

export function Party(_name, _abbreviation) {
	this.name = _name;
	this.abbreviation = _abbreviation;
}

export function Address(_type, _street, _postCode, _region, _town) {
	this.type = _type;
	this.street = _street;
	this.postCode = _postCode;
	this.region = _region;
	this.town = _town;
}

export function Email(_type, _address) {
	this.type = _type;
	this.address = _address;
}

export function Telephone(_type, _number) {
	this.type = _type;
	this.number = _number;
}

export function Website(_type, _url) {
	this.type = _type;
	this.url = _url;
}

export function MSP
(_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL, _party) {
	this.constit = _constit;
	this.region = _region;
	this.firstName = _firstName;
	this.lastName = _lastName;
	this.DOB = _DOB;
	this.photoURL = _photoURL;
	this.party = _party;
	this.partyRoles = [];
	this.govtRoles = [];
	this.addresses = [];
	this.emailAddresses = [];
	this.telephones = [];
	this.websites = [];
}