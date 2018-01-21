export function Area(_name, _code) {
  this.name = _name;
  this.code = _code;
}

export function Party(_name, _abbreviation) {
  this.name = _name;
  this.abbreviation = _abbreviation;
}

export function Role(_name, _rank, _altText) {
  this.name = _name;
  this.rank = _rank;
  this.altText = _altText;
}

export function Address(_type, _street, _postCode, _region, _town) {
  this.type = _type;
  this.street = _street;
  this.postCode = _postCode;
  this.region = _region;
  this.town = _town;
}

export function Contact(_type, _value) {
  this.type = _type;
  this.value = _value;
}

export function MSP(_ID, _constit, _region, _firstName, _lastName, _DOB, _photoURL, _party) {
  this.constit = _constit;
  this.region = _region;
  this.firstName = _firstName;
  this.lastName = _lastName;
  this.DOB = _DOB;
  this.photoURL = _photoURL;
  this.party = _party;
  this.partyRoles = [];
  this.govtRoles = [];
  this.committeeRoles = [];
  this.cpgRoles = [];
  this.addresses = [];
  this.emails = [];
  this.telephones = [];
  this.websites = [];
}
