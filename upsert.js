
var Set = require('set-component'),
    errors = require('./errors'),
    constants = require('./constants');

function makeUpsertQueryForTable(entity, compiledSchema, tableName) {
  var queryKeyObject = compiledSchema.tableKeysByTable[tableName]
    .map(function(tableKeyName) {
      var entityKeyName = compiledSchema.entityKeysByTableKey[tableName][tableKeyName];
      return [keyName, entity[entityKeyName]];
    })
    .reduce(function(acc, keyValuePair) {
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});

  var queryFieldObject = compiledSchema.tableNonKeyFieldsByTable[tableName]
    .reduce(function(acc, fieldName) {
      if (entity.hasOwnProperty(fieldName)) acc[fieldName] = entity[fieldName];
      return acc;
    }, {});

  var query = {
    table: tableName,
    keys: queryKeyObject,
    fields: queryFieldObject
  };

  return query;
}

function verifyUpsert(compiledSchema, entity, queryType) {
  var missing = compiledSchema.requiredFieldsAreMissing(entity);
  if (missing.length) {
    return errors.requiredKeyMissing({
      message: 'Could not perform ' + queryType + ' query.',
      data: {
        providedEntity: entity,
        missingFields: missing
      }
    });
  }
}

module.exports = function makeUpsert(compiledSchema, writer, queryType) {
  queryType = queryType || constants.queryTypes.upsert;

  return function upsert(entity, callback) {

    var verificationError = verifyUpsert(compiledSchema, entity, queryType);
    if (verificationError) return void callback(verificationError);

    var tablesToUpdate = Object.keys(entity)
    .map(function(key) {
      return compiledSchema.tablesContainingEntityField[key];
    })
    .reduce(function(acc, tableNames) {
      return acc.union(tableNames);
    }, new Set())
    .values();

    var queries = tablesToUpdate.map(makeUpsertQueryForTable.bind(entity, compiledSchema)); 

    queries.forEach(function(query) {
      query.type = queryType;
    });

    writer(queries, callback);
  };
};



