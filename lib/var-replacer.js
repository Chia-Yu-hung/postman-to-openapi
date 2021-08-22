const Mustache = require('mustache')

/**
 * Rewrite escapedValue() function to not delete undefined variables
 */
Mustache.Writer.prototype.escapedValue = function escapedValue (token, context, config) {
  const value = context.lookup(token[1]) || `{{${token[1]}}}`
  return String(value)
}

function replacePostmanVariables (collectionString, additionalVars = {}, global = []) {
  const postmanJson = JSON.parse(collectionString)
  const { variable = [] } = postmanJson
  global = globalVariableFilter(global)
  // it could have same key in array -> need find some way to deal with that.
  const mergedVariable = [...variable, ...global]
  console.log(mergedVariable)
  const formatVars = mergedVariable.reduce((obj, { key, value }) => {
    obj[key] = value
    return obj
  }, {})
  // Merge collection vars with additional vars
  const context = { ...formatVars, ...additionalVars }
  return Mustache.render(collectionString, context)
}

function globalVariableFilter (global) {
  return global.map((item) => {
    if (item.enabled) {
      delete item.enabled
      return item
    }
    return null
  })
}

module.exports = replacePostmanVariables
