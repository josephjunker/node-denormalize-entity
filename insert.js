var constants = require('./constants');
    makeDelete = require('./delete'),
    makeUpsert = require('./upsert');

module.exports = function makeInsert(compiledSchema, writer) {
  var doDelete = makeDelete(compiledSchema, writer),
      upsert = makeUpsert(compiledSchema, writer, constants.queryTypes.insert);

  return function insert(entity, callback) {
    doDelete(entity, function(err) {
      if (err) return void callback(err);

      upsert(entity, callback);
    });
  };
};



