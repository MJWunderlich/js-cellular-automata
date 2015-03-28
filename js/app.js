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



  function runLoop() {
    field.display(delay);
  }
});
