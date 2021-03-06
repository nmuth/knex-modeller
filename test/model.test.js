/**
 * Test the Model class generator.
 */

var expect = require('chai').should(),
  env = require('./env');

describe('the Model generator', function() {
  before(env.setup);
  after(env.teardown);

  it('is a function', function() {
    // require but don't call
    var generator = require('../lib/model.js');

    generator.should.be.a('function');
  });

  it('returns a Model constructor', function() {
    // require and call
    var Model = env.getGenerator();

    Model.should.be.a('function');

    var model = new Model('table', {});

    model.should.be.a('function');
  });
});

describe('the Model class', function() {
  before(env.setup);
  after(env.teardown);

  describe('constructor', function() {
    it('throws an error without a table name and configuration object', function() {
      var Model = env.getGenerator();

      // call with no args
      Model.bind(null).should.throw(TypeError);

      // call with one arg of incorrect type
      Model.bind(null, 123).should.throw(TypeError);

      // call with one arg of incorrect length
      Model.bind(null, '').should.throw(TypeError);

      // call with no second arg
      Model.bind(null, 'table').should.throw(TypeError);

      // call with second arg of incorrect type
      Model.bind(null, 'table', 123).should.throw(TypeError);

      // call with correct types
      Model.bind(null, 'table', {}).should.not.throw();
    });
  });

  describe('.isValid()', function() {
    it('is a static method', function() {
      var TestModel = env.getTestModelClass();

      TestModel.isValid.should.be.a('function');
    });

    it('returns false with no arguments', function() {
      var TestModel = env.getTestModelClass();

      TestModel.isValid().should.equal(false);
    });

    it('returns true if the object fits the model', function() {
      var TestModel = env.getTestModelClass({
        name: {
          type: 'string'
        }
      });

      var obj = {
        name: 'obj'
      };

      TestModel.isValid(obj).should.equal(true);
    });

    it('returns false if the object does not fit the model', function() {
      var TestModel = env.getTestModelClass({
        name: {
          type: 'string'
        }
      });

      var missingProps = {
        notName: 'notName'
      }, wrongType = {
        name: 123
      };

      TestModel.isValid(missingProps).should.equal(false);
      TestModel.isValid(wrongType).should.equal(false);
    });
  });

  describe('.get()', function() {
    it('is a static method', function() {
      var TestModel = env.getTestModelClass();

      TestModel.get.should.be.a('function');
    });

    it('requires no arguments by default', function() {
      var TestModel = env.getTestModelClass();

      TestModel.get.should.not.throw();
    });

    it('requires any arguments to be objects', function() {
      var TestModel = env.getTestModelClass();

      TestModel.get.bind(null, 'string').should.throw(TypeError);
      TestModel.get.bind(null, {}).should.not.throw();
      TestModel.get.bind(null, {}, 'string').should.throw(TypeError);
      TestModel.get.bind(null, {}, {}).should.not.throw();
    });

    it('produces a `select` query', function(done) {
      var TestModel = env.getTestModelClass();

      env.tracker.once('query', function(query) {
        query.method.should.equal('select');

        done();
      });

      TestModel.get();
    });
  });

  describe('.getOne()', function() {
    it('is a static method', function() {
      var TestModel = env.getTestModelClass();

      TestModel.getOne.should.be.a('function');
    });

    it('requires no arguments by default', function() {
      var TestModel = env.getTestModelClass();

      TestModel.getOne.should.not.throw();
    });

    it('requires any argument to be an object', function() {
      var TestModel = env.getTestModelClass();

      TestModel.getOne.bind(null, 'string').should.throw(TypeError);
      TestModel.getOne.bind(null, {}).should.not.throw();
    });

    it('produces a `select` query', function(done) {
      var TestModel = env.getTestModelClass();

      env.tracker.once('query', function(query) {
        query.method.should.equal('select');

        done();
      });

      TestModel.getOne();
    });
  });

  describe('.deleteWhere()', function() {
    it('is a static method', function() {
      var TestModel = env.getTestModelClass();

      TestModel.deleteWhere.should.be.a('function');
    });

    it('throws an error if its first argument is not an object', function() {
      var TestModel = env.getTestModelClass();

      TestModel.deleteWhere.should.throw(TypeError);
      TestModel.deleteWhere.bind(null, 'string').should.throw(TypeError);
    });

    it('produces a `delete` query', function(done) {
      var TestModel = env.getTestModelClass();

      env.tracker.once('query', function(query) {
        query.method.should.equal('del');

        done();
      });

      TestModel.deleteWhere({
        foo: 'bar'
      });
    });
  });
});
