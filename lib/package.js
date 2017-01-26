var expect = require("truffle-expect");
var EthPM = require("ethpm");
var EthPMRegistry = require("ethpm-registry");
var Web3 = require("web3");
var async = require("async");
var dir = require("node-dir");

var Package = {
  install: function(options, callback) {
    expect.options(options, [
      "ethpm"
    ]);

    expect.options(options.ethpm, [
      "registry",
      "host"
    ]);

    var provider = options.provider;
    var web3 = new Web3(provider);
    var host = options.ethpm.host;

    if ((host instanceof EthPM.hosts.IPFS) == false) {
      host = new EthPM.hosts.IPFS(options.ethpm.host.host, options.ethpm.host.port);
    }

    web3.eth.getAccounts(function(err, accs) {
      if (err) return callback(err);

      var registry = options.ethpm.registry;

      if (typeof registry == "string") {
        registry = EthPMRegistry.use(options.ethpm.registry, accs[0], provider);
      }

      var pkg = new EthPM(options.working_directory, host, registry);

      var package_name = options.package_name;

      if (package_name) {
        // TODO: Support versions
        pkg.installDependency(package_name, "*").then(function() {
          callback();
        }).catch(callback);
      } else {
        pkg.install().then(function() {
          callback();
        }).catch(callback);
      }
    });
  },

  publish: function(options, callback) {
    expect.options(options, [
      "ethpm",
      "contracts_directory"
    ]);

    expect.options(options.ethpm, [
      "registry",
      "host"
    ]);

    var provider = options.provider;
    var web3 = new Web3(provider);
    var host = new EthPM.hosts.IPFS(options.ethpm.host.host, options.ethpm.host.port);

    web3.eth.getAccounts(function(err, accs) {
      if (err) return callback(err);

      var registry = EthPMRegistry.use(options.ethpm.registry, accs[0], provider);
      var pkg = new EthPM(options.working_directory, host, registry);

      pkg.publish().then(callback).catch(callback);
    });
  },

  digest: function(options, callback) {
    // async.parallel({
    //   contracts: provision.bind(provision, options, false),
    //   files: dir.files.bind(dir, options.contracts_directory)
    // }, function(err, results) {
    //   if (err) return callback(err);
    //
    //   results.contracts = results.contracts.map(function(contract) {
    //     return contract.contract_name;
    //   });
    //
    //   callback(null, results);
    // });
    callback(new Error("Not yet implemented"));
  }
};

module.exports = Package;
