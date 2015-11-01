var Set = require('set-component'),
    async = require('async'),
    errors = require('./errors'),
    compileSchema = require('./compileSchema');



function makeUpsert(compiledSchema, writer) {}
function makeDelete(compiledSchema, writer) {}
function makeRead(compiledSchema, reader) {}


module.exports = function makeEngine(engineParams) {

  var entitySchema = engineParams.entity,
      tableSchemas = engineParams.tables,
      reader = engineParams.reader,
      writer = engineParams.writer,
      compiledSchema = compileSchema(entitySchema, tableSchemas);

  return {
    create: makeInsert(compiledSchema, writer),
    upsert: makeUpsert(compiledSchema, writer),
    delete: makeDelet(compiledSchema, writer),
    read: makeRead(compiledSchema, reader),
  };
}

