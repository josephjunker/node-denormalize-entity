
var Set = require('set-component'),
    errors = require('./errors'),
    constants = require('./constants');

function verifyDelete(compiledSchema, entity) {
  var missing = compiledSchema.requiredFieldsAreMissing(entity);
  if (missing.length) {
    return errors.requiredKeyMissing({
      message: 'Could not perform delete query.',
      data: {
        providedEntity: entity,
        missingFields: missing
      }
    });
  }
}

module.exports = function makeDelete(compiledSchema, writer) {
  return function doDelete(entity, callback) {

    var verificationError = verifyDelete(compiledSchema, entity);
    if (verificationError) return void callback(verificationError);

    var queries = compiledSchema.allTableNames
      .map(function(tableName) {

        var queryKeyObject = compiledSchema.tableKeysByTable[tableName]
          .map(function(tableKeyName){
            var entityKeyName = compiledSchema.entityFieldNameByTableFieldName[tableName][tableKeyName];
            return [keyName, entity[entityKeyName]];
          })
          .reduce(function(acc, keyValuePair) {
            acc[keyValuePair[0]] = keyValuePair[1];
            return acc;
          }, {});

        var query = {
          table: tableName,
          keys: queryKeyObject,
          type: constants.queryTypes.delete;
        };

        return query;
      });

    writer(queries, callback);
  };
};
