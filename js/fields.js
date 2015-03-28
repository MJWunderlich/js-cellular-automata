/**
 * Created by mjwunderlich on 3/28/15.
 */

(function() {

  function makeField(name, varName, scope) {
    var label = $('<label>').text(name);
    var input = $('<input type="text">').change(function() {
      scope[varName] = $(this).val();
    });
    return $('<div>').addClass('col-full').append(label).append(input);
  }

  function makeEditor(scope, varList) {
    var key, editor = $('<div>').addClass('editor');
    for (key in varList) {
      editor.append( makeField(key, key, scope) );
    }
    return editor;
  }

})();
