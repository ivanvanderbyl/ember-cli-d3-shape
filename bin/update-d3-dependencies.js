/* jshint node: true */
'use strict';

let packageDependencies = require('../package.json').dependencies;
let semver = require('semver');
let RegClient = require('npm-registry-client');
let RSVP = require('rsvp');
let npm = require('ember-cli/lib/utilities/npm');

let packages = Object.keys(packageDependencies)
  .filter((packageName) => /^d3\-/.test(packageName))
  .map((packageName) => ({ name: packageName, version: packageDependencies[packageName] }));

let client = new RegClient();

let npmOptions = {
  loglevel: 'error',
  color: 'always',
  // by default, do install peoples optional deps
  'optional': true,
  'save': true,
  'save-exact': true
};

let updates = [];
let updatePromises = [];

packages.forEach((pkg) => {
  let uri = `https://registry.npmjs.org/${pkg.name}`;
  let params = { timeout: 1000 };

  updatePromises.push(new RSVP.Promise(function(resolve, reject) {
    client.get(uri, params, function(error, data, raw, res) {
      if (!error) {
        let newVersions = Object.keys(data.versions).filter((version) => semver.gtr(version, pkg.version));
        let updateVersion = newVersions.splice(-1);
        if (newVersions.length > 0) {
          console.log(`Udpate ${pkg.name} ${pkg.version} => ${updateVersion}`);
          updates.push({ name: pkg.name, oldVersion: pkg.version, newVersion: updateVersion });

          npm('install', [`${pkg.name}@${updateVersion}`], npmOptions)
            .then(resolve, reject);
        } else {
          // console.log(`${pkg.name} UP TO DATE`);
        }
      } else {
        reject(error);
      }
    });
  }));
});

RSVP.all(updatePromises).then((updates) => {
  console.log('DONE');
  console.log(updates);
}).catch((err) => {
  console.log('FAILED');
  console.error(err);
});

// console.log(updates);
