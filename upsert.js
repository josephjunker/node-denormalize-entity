
var Set = require('set-component'),
    async = require('async'),
    makeDeleter = require('./delete');

function makeUpsertQueryForTable(entity, compiledSchema, tableName) {
  var queryKeyObject = compiledSchema.tableKeysForTable
    .map(function(tableKeyName) {
      var entityKeyName = compiledSchema.entityKeysFromTableKeys[tableName][tableKeyName];
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

module.exports = function makeUpsert(compiledSchema, writer, queryType) {
  queryType = queryType || constants.queryTypes.upsert;

  return function upsert(entity, callback) {
    if (err) return void callback(err);

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



