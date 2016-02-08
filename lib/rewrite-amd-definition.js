/* jshint node: true */
'use strict';

var recast = require("recast");
var types = recast.types;
var namedTypes = types.namedTypes;
var b = recast.types.builders;

function buildExportDefaultDefinition(packageName, deps, node) {
  return b.expressionStatement(
    b.callExpression(
      b.identifier('define'), [
        b.literal(packageName),
        b.arrayExpression(deps.map(function(name) { return b.literal(name); })),
        node
      ]
    )
  );
}

function getDependenciesForDefine(node) {
  if (namedTypes.CallExpression.check(node)) {
    return node.arguments[0].elements.map(function(e) { return e.value; });
  }else{
    return [];
  }
}

function isAMDFunctionBody(node) {
  return namedTypes.FunctionExpression.check(node) &&
    node.id === null &&
    namedTypes.Identifier.check(node.params[0]) &&
    node.params[0].name === 'exports';
}

module.exports = function rewriteAMDFunction(code, packageName){
  var ast = recast.parse(code);

  var amdDependencies, amdFunctionBody;

  types.visit(ast, {
    visitCallExpression: function(path) {
      if (path.node.callee.name === 'define') {
        amdDependencies = getDependenciesForDefine(path.node);
      }
      this.traverse(path);
    },

    visitFunctionExpression: function(path) {
      if(isAMDFunctionBody(path.node)){
        amdFunctionBody = path.node;
      }
      this.traverse(path);
    }
  });

  ast = buildExportDefaultDefinition(packageName, amdDependencies, amdFunctionBody);

  return recast.print(ast).code;
};
