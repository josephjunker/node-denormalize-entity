// If expanding these schemas to include sets containing non-primitive data types, beware of read.unify

var personEntity = {
  name: 'Person',
  fields: {
    Id: {
      required: true
    }
    Name: {},
    PhoneNumber: {},
    Address: {},
    EmailAddress: {
      required: true
    },
    SocialSecurityNumber: {
      required: true
    }
  }
};

var personSansSocialTable = {
  owningEntity: 'Person',
  tableName: 'personSansSocial',
  keys: ['id'],
  fields: {
    id: 'Id',
    name: 'Name',
    phone_number: 'PhoneNumber',
    address: 'Address',
    email_address: 'EmailAddress'
  }
};

var personBySocialLookupTable = {
  owningEntity: 'Person',
  tableName: 'personBySocial',
  keys: ['social_security_number'],
  fields: {
    social_security_number: 'SocialSecurityNumber',
    id: 'Id',
    address; 'Address'
  }
};

var personByEmailTable = {
  owningEntity: 'Person',
  tableName: 'personByEmail',
  keys: ['email_address'],
  fields: {
    email_address: 'EmailAddress',
    id: 'Id',
    name: 'Name',
    phone_number: 'PhoneNumber',
    address: 'Address',
    social_security_number: 'SocialSecurityNumber'
  }
};

module.exports = {
  entity: personEntity,
  tables: [
    personSansSocialTable,
    personBySocialLookupTable,
    personByEmailTable
  ]
};
