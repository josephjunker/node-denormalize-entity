var compileSchema = require('./compileSchema'),
    makeInsert = require('./insert'),
    makeUpsert = require('./upsert'),
    makeDelete = require('./delete'),
    makeRead = require('./read');

module.exports = function makeEngine(engineParams) {

  var entitySchema = engineParams.entity,
      tableSchemas = engineParams.tables,
      reader = engineParams.reader,
      writer = engineParams.writer,
      compiledSchema = compileSchema(entitySchema, tableSchemas);

  return {
    create: makeInsert(compiledSchema, writer),
    upsert: makeUpsert(compiledSchema, writer),
    delete: makeDelete(compiledSchema, writer),
    read: makeRead(compiledSchema, reader),
  };
}

