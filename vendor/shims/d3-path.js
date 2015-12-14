(function() {
  // console.log(require('vendor/d3-path/build/d3-path.js'));
  /* globals define, d3_path */

  function d3PathModule() {
    'use strict';

    // console.log(require('vendor/d3-path/build/d3-path.js'));

    return { 'path': d3_path.path };
  }

  define('d3-path', [], d3PathModule);

})();
