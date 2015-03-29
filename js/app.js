/**
 * Created by mjwunderlich on 3/27/15.
 */

$(function() {

  var States = { NONE:0, PLAYING:1, PAUSED:2 };

  // Initialization
  var
    field = new Field(100, 40),
    displayTimer = null,
    delay = 90,
    state = States.NONE,
    startbtn = $('#start'),
    pausebtn = $('#stop');

  function toggleState() {
    switch (state) {
      case States.NONE:
      case States.PAUSED:
        play();
        break;
      case States.PLAYING:
        pause();
        break;
    }
  }

  function updateUi() {
    switch (state) {
      case States.NONE:
        startbtn.text('Start');
        pausebtn.hide();
        break;

      case States.PLAYING:
        startbtn.text('Restart');
        pausebtn.fadeIn(1000).text('Pause');
        break;

      case States.PAUSED:
        startbtn.text('Restart');
        pausebtn.show().text('Resume');
        break;
    }
  }

  function restart() {
    field.setup();
    play();
  }

  function play() {
    if (state == States.NONE) {
      field.setup();
    }
    clearInterval(displayTimer);
    displayTimer = setInterval(runLoop, delay);
    state = States.PLAYING;
  }

  function pause() {
    clearInterval(displayTimer);
    displayTimer = null;
    state = States.PAUSED;
  }

  // Start running the simulation
  play();

  $('#start').unbind().click(function () {
    restart();
    updateUi();
  });

  $('#stop').unbind().click(function () {
    toggleState();
    updateUi();
  });

  // Setup Presets
  var presets = [
    {
      text: 'Black & White',
      values: Utils.shallowExtend(globals, {
        rWhich: 'r', gWhich: 'r', bWhich: 'r',
        rCoeff: 1.0, gCoeff: 1.0, bCoeff: 1.0
      })
    }, {
      text: 'Colorful',
      values: Utils.shallowExtend(globals, {
        rWhich: 'r', gWhich: 'g', bWhich: 'b',
        rCoeff: 1.0, gCoeff: 1.0, bCoeff: 1.0
      })
    }, {
      text: 'Saturated Colorful',
      values: Utils.shallowExtend(globals, {
        rWhich: 'r', gWhich: 'g', bWhich: 'b',
        rCoeff: 2.0, gCoeff: 2.0, bCoeff: 2.0
      })
    }
  ];

  // Configure fields that will appear in the editor
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
      field: 'samplingDepth',
      text: 'Sampling Depth (recursive)',
      type: 'float'
    },
  ];
  var editor = makeEditor(globals, fields);
  $('#editor-wrapper').append(editor);

  var presetEditor = makePresets(presets, globals);
  $('#editor-wrapper').prepend(presetEditor);

  function runLoop() {
    field.display(delay);
  }
});
