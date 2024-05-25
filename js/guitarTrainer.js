function init() {
  /* listen for 'deviceready' event to handle pause and resume events
     this relies on cordova.js (included in ../guitarTrainer.html */
  document.addEventListener("deviceready", onDeviceReady, false);
  // loading screen
  document.getElementById("fullscreen").innerHTML =
    "<div class='loading'></div>";
  var g_xmlFileLoaded = false;
  var g_guitarAudioSpriteLoaded = false;
  var requestXMLFile = new XMLHttpRequest();
  requestXMLFile.open("GET", "./xml/grades.musicxml", true);
  requestXMLFile.onload = function () {
    g_xmlFile = requestXMLFile.responseXML;
    g_xmlFileLoaded = true;
    if (g_guitarAudioSpriteLoaded) {
      showLoginScreen();
    }
  };
  requestXMLFile.send();
  // g_guitarAudioSprite
  var requestGuitarSprite = new XMLHttpRequest();
  requestGuitarSprite.open("GET", "./audio/audioSprite.ogg", true);
  requestGuitarSprite.responseType = "arraybuffer";
  requestGuitarSprite.onload = function () {
    g_audioContext.decodeAudioData(
      requestGuitarSprite.response,
      function (buffer) {
        g_guitarAudioSprite = buffer;
        g_guitarAudioSpriteLoaded = true;
        if (g_xmlFileLoaded) {
          showLoginScreen();
        }
      }
    );
  };
  requestGuitarSprite.send();
}

// some cordova event handlers
function onDeviceReady() {
  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);
}

function onPause() {
  window.cancelAnimationFrame(g_currentAnimationFrameRequest);
}

function onResume() {
  if (
    document.getElementById("playExerciseDiv") ||
    document.getElementById("playStopFretboard")
  ) {
    document.getElementById("backButton").click();
  }
}

// a "note" object constructor
function Note(
  stringNumber,
  fretNumber,
  noteColor,
  noteStartTime,
  noteDuration,
  noteName,
  fingerNumber,
  spriteStartTime,
  spriteDetune
) {
  this.stringNumber = stringNumber;
  this.fretNumber = fretNumber;
  this.noteColor = noteColor;
  this.noteStartTime = noteStartTime;
  this.noteDuration = noteDuration;
  this.noteName = noteName;
  this.fingerNumber = fingerNumber;
  this.spriteStartTime = spriteStartTime;
  this.spriteDetune = spriteDetune;
}

// global event name based on mouse or touchpad
if ("ontouchstart" in document.body) {
  var g_myPressEvent = "touchstart";
} else {
  var g_myPressEvent = "mousedown";
}

// check for web audio support
try {
  var g_audioContext = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  alert("Feature unavailable: Web Audio API");
}

// check for local storage support
try {
  localStorage.setItem("test", "test");
  localStorage.removeItem("test");
} catch (e) {
  alert("Feature unavailable: Local Storage");
}

// global scheduleAheadTime in milli-seconds
var g_scheduleAheadTime = 75;

// global delay before starting the beat in milli-seconds and seconds
var g_beginTimeDelayMS = 300;
var g_beginTimeDelayS = g_beginTimeDelayMS / 1000;

// the global current username
var g_currentUsername;

// the global "gray" color
var g_grayColor = "#BBBBBB";

// a global xml file containing all the grade/exercise info
var g_xmlFile;

// a global variable for the guitar audio sprite
var g_guitarAudioSprite;

// a global variable which will hopefully speed up metronome function calculations
var g_metronomeBPM;

// this audio sprite represents the notes E2=MIDI#40 to C6=MIDI#84 ** Update: now C2=#38 to E6=#88
// MIDI#44=G#2;MIDI#53=F3;MIDI#62=D4;MIDI#71=B4;MIDI#80=G#5;
const g_audioSpriteData = {
  36: {
    start: 0,
    detune: -800,
  },
  37: {
    start: 0,
    detune: -700,
  },
  38: {
    start: 0,
    detune: -600,
  },
  39: {
    start: 0,
    detune: -500,
  },
  40: {
    start: 0,
    detune: -400,
  },
  41: {
    start: 0,
    detune: -300,
  },
  42: {
    start: 0,
    detune: -200,
  },
  43: {
    start: 0,
    detune: -100,
  },
  44: {
    start: 0,
    detune: 0,
  },
  45: {
    start: 0,
    detune: 100,
  },
  46: {
    start: 0,
    detune: 200,
  },
  47: {
    start: 0,
    detune: 300,
  },
  48: {
    start: 0,
    detune: 400,
  },
  49: {
    start: 2,
    detune: -400,
  },
  50: {
    start: 2,
    detune: -300,
  },
  51: {
    start: 2,
    detune: -200,
  },
  52: {
    start: 2,
    detune: -100,
  },
  53: {
    start: 2,
    detune: 0,
  },
  54: {
    start: 2,
    detune: 100,
  },
  55: {
    start: 2,
    detune: 200,
  },
  56: {
    start: 2,
    detune: 300,
  },
  57: {
    start: 2,
    detune: 400,
  },
  58: {
    start: 4,
    detune: -400,
  },
  59: {
    start: 4,
    detune: -300,
  },
  60: {
    start: 4,
    detune: -200,
  },
  61: {
    start: 4,
    detune: -100,
  },
  62: {
    start: 4,
    detune: 0,
  },
  63: {
    start: 4,
    detune: 100,
  },
  64: {
    start: 4,
    detune: 200,
  },
  65: {
    start: 4,
    detune: 300,
  },
  66: {
    start: 4,
    detune: 400,
  },
  67: {
    start: 6,
    detune: -400,
  },
  68: {
    start: 6,
    detune: -300,
  },
  69: {
    start: 6,
    detune: -200,
  },
  70: {
    start: 6,
    detune: -100,
  },
  71: {
    start: 6,
    detune: 0,
  },
  72: {
    start: 6,
    detune: 100,
  },
  73: {
    start: 6,
    detune: 200,
  },
  74: {
    start: 6,
    detune: 300,
  },
  75: {
    start: 6,
    detune: 400,
  },
  76: {
    start: 8,
    detune: -400,
  },
  77: {
    start: 8,
    detune: -300,
  },
  78: {
    start: 8,
    detune: -200,
  },
  79: {
    start: 8,
    detune: -100,
  },
  80: {
    start: 8,
    detune: 0,
  },
  81: {
    start: 8,
    detune: 100,
  },
  82: {
    start: 8,
    detune: 200,
  },
  83: {
    start: 8,
    detune: 300,
  },
  84: {
    start: 8,
    detune: 400,
  },
  85: {
    start: 8,
    detune: 500,
  },
  86: {
    start: 8,
    detune: 600,
  },
  87: {
    start: 8,
    detune: 700,
  },
  88: {
    start: 8,
    detune: 800,
  },
  drum1: {
    start: 10,
    duration: 0.12,
  },
};

var g_currentAnimationFrameRequest;

var g_noteNames = {
  C: 0,
  "C#/Db": 1,
  D: 2,
  "D#/Eb": 3,
  E: 4,
  F: 5,
  "F#/Gb": 6,
  G: 7,
  "G#/Ab": 8,
  A: 9,
  "A#/Bb": 10,
  B: 11,
};
var g_noteColors = {
  0: "#ED2929",
  1: "#9F000F",
  2: "#78C7C7",
  3: "#00008B",
  4: "#FF9933",
  5: "#EBEB19",
  6: "#286704",
  7: "#99CC33",
  8: "#660099",
  9: "#CC00FF",
  10: "#BF6A1F",
  11: "#FF9EE6",
};
var g_noteSequences = {
  "Ionian/Major": [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  Dorian: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  Phrygian: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  Lydian: [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  Mixolydian: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
  "Aeolian/Minor": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  Locrian: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  Root: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Root + 5th": [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  "Major Pentatonic": [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  "Minor Pentatonic": [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  Blues: [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0],
  "Harmonic Minor": [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
  "Melodic Minor Ascending": [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  "Whole Tone": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  "Whole Half Diminished": [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  "Half Whole Diminished": [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0],
  Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  "M/Major": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  "M6/Major 6th": [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  "7/Dominant 7th": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  "9/Dominant 9th": [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  "M7/Major 7th": [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  "M9/Major 9th": [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  "add9/Major add 9": [1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  "m/Minor": [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  "m6/Minor (maj)6th": [1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
  "m7/Minor 7th": [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  "m9/Minor 9th": [1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  Custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};
// from string 0 to 5 (i.e. 1 to 6) for array order
const g_openStringsTunings = {
  EADGBE: [64, 59, 55, 50, 45, 40], // Standard
  DADGBE: [64, 59, 55, 50, 45, 38], // Drop D
  DADGBD: [62, 59, 55, 50, 45, 38], // Double Drop D
  EbAbDbGbBbEb: [63, 58, 54, 49, 44, 39], // Half Step Down
  DGCFAD: [62, 57, 53, 48, 43, 38], // Whole Step Down
  DADGAD: [62, 57, 55, 50, 45, 38], // DADGAD
  DGDGBD: [62, 59, 55, 50, 43, 38], // Open G
  DGDGBbD: [62, 58, 55, 50, 43, 38], // Open G minor
  "DADF#AD": [62, 57, 54, 50, 45, 38], // Open D
  DADFAD: [62, 57, 53, 50, 45, 38], // Open D minor
  Custom: [64, 59, 55, 50, 45, 40],
};
