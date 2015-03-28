/**
 * Created by mjwunderlich on 3/28/15.
 */

(function() {

  window.makeField = function(name, varName, scope) {
    var label = $('<label>').html(name);
    var input = $('<input type="text">').val(scope[varName]).change(function() {
      scope[varName] = $(this).val();
    });
    return $('<div>').addClass('col-full').append(label).append(input);
  };

  window.makeEditor = function(scope, varList) {
    var key, editor = $('<div>').addClass('editor');
    for (key in varList) {
      editor.append( makeField(varList[key], key, scope) );
    }
    return editor;
  };

})();
