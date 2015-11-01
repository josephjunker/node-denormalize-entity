
var inspect = require('util');

var errors = {
  requiredKeyMissing: 'Tried to execute a statement without providing all needed keys'
};

function makeErrorCreator(errorType) {
  return function error(context) {
    var baseMessage = errors[errorType],
        customMessage = context.message || '',
        detail = context.data ? '\n' + 'Details:\n' + inspect(context.data, { depth: null }) : '',
        fullError = baseMessage + '\n' + customMessage + detail;

    return fullError;
  }
}

var errorCreators = Object.keys(errors)
  .map(function(errorType) { return [errorType, makeErrorCreator(errorType)]; })
  .reduce(function(acc, args) {
    acc[args[0]] = args[1];
    return acc;
  }, {});

module.exports = errorCreators;
