
var Set = require('set-component'),
    isPlainObject = require('lodash.isplainobject'),
    errors = require('./errors'),
    constants = require('./constants');

// this takes tableResults from (tableFieldName -> fieldValue) -> (entityFieldName -> fieldValue)
function tableResultToPartialEntityResult(tableName, tableResults, compiledSchema) {
  return Object.keys(tableResults)
    .map(function(tableFieldName) {
      var entityFieldName = compiledSchema.entityFieldNameByTableFieldName[tableName][tableFieldName],
          tableFieldValue = tableResults[tableFieldName];

      return [entityFieldName, tableFieldValue];
    })
    .reduce(function (acc, keyValuePair) {
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

// This function checks whether two results are semantically equivalent
// It returns an error if they are not
function unify(x, y, isSetAsArray) {
  var areEqual;

  if (isPlainObject(x) && isPlainObject(y)) {
    var xKeys = Object.keys(x).sort(),
        yKeys = Object.keys(y).sort(),
        keysAreEqual = unify(xKeys, yKeys),
        objectsAreUnequal = !keysAreEqual || xKeys.reduce(function (acc, key) {
          return acc || unify(x[key], y[key]);
        }, false);
    areEqual = !objectsAreUnequal;

  } else if (isSetAsArray) {
    x = Array.isArray(x) ? x : [];
    y = Array.isArray(y) ? y : [];

    areEqual = x.length === y.length
      && reduce(function(acc, current, index){
        var error = unify(x[index], y[index], false);
        acc = acc && !error;
      }, true);
    ;
  } else {
    areEqual = x === y;
  }

  return areEqual ? null : return errors.dataInconsistency({
    data: {
      firstItem: x,
      secondItem: y
    }
  });
}

// This function merges read results together
// It returns { success: <obj> } if it succeeds
// It returns { error: <Error> } if the objects specify
// incompatible values for the same fields
// The argument 'unorderedFields' from 'compiledSchema' is a list of keys
// specifying fields whose order is not semantically relevant:
// i.e. fields whose values are arrays which can be sorted before the merge
function merge(objects, compiledSchema) {
  var foo = Object.keys(objects)
    .map(function (tableName) {
      return tableResultToPartialEntityResult(tableName, objects[tableName], compiledSchema);
    })
    .reduce(function (acc, partialResult) {

      var insertionsAndErrors = Object.keys(partialResult)
        .map(function(entityFieldName) {
          if (acc.unset.indexOf(entityFieldName) !== -1) {
            var isUnordered = compiledSchema.unorderedFields.indexOf(entityFieldName) !== -1;
                existingValue = acc.value[entityFieldName],
                newValue = partialResult[entityFieldName],
                error = unify(existingValue, newValue, isUnordered);
            return error ? { error: error } : null;
          }
        
        })
        .filter(Boolean)
        .reduce(function (acc, errorOrSuccess) {
          if (errorOrSuccess.error) {
            acc.errors.push[errorOrSuccess.error];
          } else {
            acc.successes.push[errorOrSuccess.success];
          }
        }, { errors: [], successes: [] });

    }, { errors: [], value: {}, unset: compiledSchema.allEntityFieldNames.slice() });
}


module.exports = function makeRead(compiledSchema, reader) {

  return function read(entity, callback) {

    // TODO: this is the last bit


    reader(queries, function(err, results) {
      if (err) return void callback(err);

      // results must be <Map> tableName -> tableFieldName -> fieldValue

      var merged = merge(results, compiledSchema);
      if (merged.error) return void callback(merged.error);
      callback(null, merged.success);
    });
  };

};
