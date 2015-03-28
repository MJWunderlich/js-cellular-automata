/**
 * Created by mjwunderlich on 3/27/15.
 */

$(function() {

  // Initialization
  var
    field = new Field(80, 50),
    displayTimer = null,
    delay = 100;

  $('#start').unbind().click(function () {
    clearInterval(displayTimer);
    field.setup();
    displayTimer = setInterval(runLoop, delay);
  });

  $('#stop').unbind().click(function () {
    clearInterval(displayTimer);
    displayTimer = null;
  });


  // Setup editor
  var fields = {
    rWhich: 'R Channel <em>use: r, g, b</em>',
    gWhich: 'G Channel <em>use: r, g, b</em>',
    bWhich: 'B Channel <em>use: r, g, b</em>',

    rCoeff: 'R Factor',
    gCoeff: 'G Factor',
    bCoeff: 'B Factor'
  };
  var editor = makeEditor(globals, fields);
  $('#editor-wrapper').append(editor);


  function runLoop() {
    field.display(delay);
  }
});
