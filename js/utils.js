/**
 * Created by mjwunderlich on 3/27/15.
 */

(function() {

  /**
   * Determines whether the browser's console's logging is enabled or disabled
   * @type {boolean}
   */
  var use_browser_console = true;

  /**
   * Utilities
   * @type {{shallowExtend: Function, extend: Function, deepExtend: Function}}
   */
  window.Utils = {

    /**
     * Shallow extend obj1 by obj2
     *
     * @param obj1
     * @param obj2
     * @returns {{}}
     */
    shallowExtend: function (obj1, obj2) {
      var key, result = {};
      for (key in obj1) {
        result[key] = oneOrTwo(obj1[key], obj2[key]);
      }
      for (key in obj2) {
        if (obj1[key] === 'undefined') {
          result[key] = obj2[key];
        }
        return result;
      }
    },

    /**
     * Deep (recursive) extend obj1 by obj2
     *
     * @param obj1
     * @param obj2
     * @returns {{}}
     */
    deepExtend: function (obj1, obj2) {
      var key, result = {};
      for (key in obj1) {
        if (typeof obj1[key] === typeof obj2[key] === 'object') {
          result[key] = deepExtend(obj1[key], obj2[key]);
        }
        else {
          result[key] = oneOrTwo(obj1[key], obj2[key]);
        }
      }
      for (key in obj2) {
        if (obj1[key] === 'undefined') {
          result[key] = obj2[key];
        }
      }
      return result;
    }
  };

  /**
   * Returns one or two, based on discrete criteria.
   *
   * @param one
   * @param two
   * @returns {*}
   */
  function oneOrTwo(one, two) {
    var type1 = typeof one,
      type2 = typeof two;

    if (type1 === 'undefined' && type2 === 'undefined') {
      return null;
    }
    if (type1 === 'object') {
      if (type2 !== 'object') {
        return one;
      }
    }
    if (type1 === 'function') {
      if (type2 !== 'function' && type2 !== 'object') {
        return one;
      }
    }
    return two || one || null;
  }

  /**
   * Enable/Disable the Browser's own console with a dummy object
   */
  if (!use_browser_console || typeof window.console !== 'object') {
    window.console = {
      info: function() { },
      warn: function() { },
      error: function() { },
      log: function() { },
      dir: function() { }
    };
  }

})();
