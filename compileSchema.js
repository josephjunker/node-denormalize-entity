var Set = require('set-component');

function verifyParams(entitySchemas, tableSchemas) {
  // TODO: ensure that schemas are valid
}

// returns <Map> entityKey -> [tableName]
function makeTablesContainingEntityField(entitySchema, tableSchemas) {
  var entityFields = Object.keys(entitySchema.fields);

  return entityFields.reduce(function(acc, targetEntityField) {
    var tableNames = tableSchemas
      .map(function getTableNamesOrNulls(tableSchema) {

        var referencingKeys = Object.keys(tableSchema.fields)
          .filter(function fieldReferencesDesiredKey(tableFieldName) {
            return tableSchema[tableFieldName] === targetEntityField;
          });

        return referencingKeys.length ? tableSchema.tableName : null;
      })
      .filter(function(x) { return x !== null });

    acc[targetEntityField] = tableNames;
    return acc;
  }, {});
}

// returns <Map> tableName -> [tableKey]
function makeTableKeysForTable(entitySchema, tableSchemas) {
  return tableSchemas
    .map(function(tableSchema) {
      return [tableSchema.name, tableSchema.keys];
    })
    .reduce(function(acc, keyValuePair) {
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

// returns <Map> tableName -> tableKey -> entityKey
function makeEntityKeysFromTableKeys(entitySchema, tableSchemas) {
  return tableSchemas
    .map(function(tableSchema) {
      return [tableSchema.tableName, tableSchema.fields];
    })
    .reduce(function(acc, keyValuePair) {
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

// returns <Map> tableName -> [tableFieldName]
function makeTableNonKeyFieldsByTable(entitySchema, tableSchemas) {
  return tableSchemas
    .map(function(tableSchema){

    })
    .reduce(function(acc, keyValuePair){
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

module.exports = function compileSchema(entitySchema, tableSchemas) {
  verifyParams(entitySchema, tableSchemas);

  var compiledSchema = {};

  compiledSchema.tablesContainingEntityField = makeTablesContainingEntityField(entitySchema, tableSchemas);
  compiledSchema.tableKeysForTable = makeTableKeysForTable(entitySchema, tableSchemas);
  compiledSchema.entityKeysFromTableKeys = makeEntityKeysFromTableKeys(entitySchema, tableSchemas);
  compiledSchema.tableNonKeyFieldsByTable = makeTableNonKeyFieldsByTable(entitySchema, tableSchemas);

  return compiledSchema;
}
