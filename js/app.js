/**
 * Created by mjwunderlich on 3/27/15.
 */

$(function() {

  // Initialization
  var
    field = new Field(100, 40),
    displayTimer = null,
    delay = 90;

  $('#start').unbind().click(function () {
    clearInterval(displayTimer);
    field.setup();
    displayTimer = setInterval(runLoop, delay);
  }).click();

  $('#stop').unbind().click(function () {
    clearInterval(displayTimer);
    displayTimer = null;
  });


  // Setup editor
  var fields = [
    {
      field: 'rWhich',
      text: 'R Channel <em>use: r, g, b</em>',
      type:'text' },
    {
      field: 'gWhich',
      text: 'G Channel <em>use: r, g, b</em>',
      type: 'text'
    },
    {
      field: 'bWhich',
      text: 'B Channel <em>use: r, g, b</em>',
      type: 'text'
    },

    {
      field: 'rCoeff',
      text: 'R Factor',
      type: 'float'
    },
    {
      field: 'gCoeff',
      text: 'G Factor',
      type: 'float'
    },
    {
      field: 'bCoeff',
      text: 'B Factor',
      type: 'float'
    },

    {
      field: 'siblingAttenuate1',
      text: 'Neighbor Attenuation 1',
      type: 'float'
    },

    {
      field: 'siblingAttenuate2',
      text: 'Neighbor Attenuation 2',
      type: 'float'
    }
  ];
  var editor = makeEditor(globals, fields);
  $('#editor-wrapper').append(editor);


  function runLoop() {
    field.display(delay);
  }
});
