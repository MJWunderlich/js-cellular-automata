/**
 * Created by mjwunderlich on 3/28/15.
 */

(function() {

  window.makeField = function(opts, scope) {
    var label = $('<label>').html(opts.text);
    var input = $('<input type="text">').val(scope[opts.field]).change(function() {
      if (opts.type !== 'text')
        scope[opts.field] = parseFloat($(this).val());
      else
        scope[opts.field] = $(this).val();
    });
    return $('<div>').addClass('col-full').append(label).append(input);
  };

  window.makeEditor = function(scope, varList) {
    var i, key, editor = $('<div>').addClass('editor');
    for (i=0; i<varList.length; ++i) {
      editor.append(makeField(varList[i], scope));
    }
    return editor;
  };

  window.makePresets = function(presets, scope) {
    var i, key, preset, option, select = $('<select>').attr('id', 'presets');
    select.append($('<option>'));
    for (i=0; i<presets.length; ++i) {
      preset = presets[i];
      option = $('<option>').text(preset.text).val(preset.text);
      option[0].preset = preset;
      select.append(option);
    }

    select.change(function() {
      // Apply the preset
      option = $('option:selected', select)[0];
      preset = option.preset.values;
      for (key in preset) {
        scope[key] = preset[key];
      }
      console.dir(scope);
    });

    return select;
  }

})();
