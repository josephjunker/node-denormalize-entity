var makeEngine = require('./');

var testData = require('./testData');

var inspect = require('util');
function show(x) { console.log(util.inspect(x, {depth: null})) }

function reader(query, tableSchema, cb) {
  var displayQuery = {
    table: tableSchema.tableName,
    keys: query.keys,
    targets: query.targets
  };

  show(displayQuery);
  cb();
}

function writer(query, tableSchema, cb) {
  var displayQuery = {
    table: tableSchema.tableName,
    keys: query.keys,
    targets: query.targets
  };

  show(displayQuery);
  cb();
}

var engine = makeEngine({
  entity: testData.entity,
  tables: testData.tables,
  reader: reader,
  writer: writer
});

engine.insert({
  id: 'SomeId',
  SocialSecurityNumber: '123',
  emailAddress: 'example@example.com',
  address: '1 First Street'
}, function() {
  console.log('done with create');             
});
