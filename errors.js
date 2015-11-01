
var inspect = require('util');

var errors = {
  requiredKeyMissing: 'Tried to execute a statement without providing all needed keys',
  driverReturnedError: 'An error was encountered by the driver while executing the query',
  validationFailed: 'The provided entity failed validations while trying to execute the query',
  dataInconsistency: 'Inconsistent denormalized data was returned from the query'
};

function makeSingleErrorCreator(errorType) {
  return function error(context) {
    var baseMessage = errors[errorType],
        detail = makeErrorBody(context),
        fullError = baseMessage + '\n' + detail;

    return new Error(fullError);
  }
}

function makeBulkErrorCreator(errorType) {
  return function error(contexts) {
    var baseMessage = errors[errorType],
        detail = contexts.map(makeErrorBody).join('\n\n'),
        fullError = 'Multiple errors occurred:\n' + baseMessage + '\n' + detail;

    return new Error(fullError);
  }
}

function makeErrorBody(errorContext) {
    var customMessage = context.message || '',
        detail = context.data ? '\n' + 'Details:\n' + inspect(context.data, { depth: null }) : '',
        errorBody = customMessage + detail;

    return errorBody;
}

var errorCreators = Object.keys(errors)
  .map(function(errorType) { return [errorType, makeSingleErrorCreator(errorType)]; })
  .reduce(function(acc, args) {
    acc[args[0]] = args[1];
    return acc;
  }, {});

var bulkErrorCreators = Object.keys(errors)
  .map(function(errorType) { return [errorType, makeBulkErrorCreator(errorType)]; })
  .reduce(function(acc, args) {
    acc[args[0]] = args[1];
    return acc;
  }, {});

module.exports = errorCreators;
module.exports.bulk = bulkErrorCreators;
