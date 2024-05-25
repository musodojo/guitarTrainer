// play a note from the global audio sprite
// uses a delay so notes can be scheduled in advance
// delay, spriteStartTime and duration are all in seconds
function playNote(delay, spriteStartTime, spriteDetune, duration) {
  var currentTime = g_audioContext.currentTime;

  var noteGain = g_audioContext.createGain();
  noteGain.connect(g_audioContext.destination);

  var noteBuffer = g_audioContext.createBufferSource();
  noteBuffer.buffer = g_guitarAudioSprite;
  noteBuffer.connect(noteGain);

  // get rid of 'stop on non-zero-crossing' click in audio
  // the 'end-ish' is less than the end because setTargetAtTime
  // only begins fading at this time
  // the values were concluded after trial and error
  noteGain.gain.value = 0.9;
  var endishTime = currentTime + delay + duration * 0.75;
  noteGain.gain.setValueAtTime(0.9, endishTime);
  noteGain.gain.setTargetAtTime(0, endishTime, duration * 0.015);

  noteBuffer.detune.value = spriteDetune;
  noteBuffer.start(currentTime + delay, spriteStartTime, duration);
}

// SELECT EXERCISE -> VIEW FRETBOARD
function viewFretboard(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  var myDiv = "<div id='myDiv' class='container centerText'>";
  var onclickText =
    'selectExercise("' +
    measureGrade +
    '","' +
    measureName +
    '","' +
    measureRootColor +
    '",' +
    measureNumber +
    ");";
  // add id='backButton' to send a click on a pause/resume event in cordova
  myDiv +=
    "<span id='backButton' class='listItem biggerFont noBorder' onclick='" +
    onclickText +
    "'>&lt;</span>";
  var exerciseStyle =
    "style='" +
    getBackgroundGradient("Ex" + measureNumber, measureRootColor) +
    "'";
  myDiv +=
    "<span class='listItem biggerFont' " +
    exerciseStyle +
    ">" +
    measureName +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/><br/>";

  myDiv +=
    "<div id='playStopFretboard' class='listItem topRightFixed' onclick='playStopFretboard(" +
    measureNumber +
    ")'>&#9654;</div>";
  myDiv +=
    "<div id='repeatsCounter' class='listItem bottomRightFixed' style='pointer-events:none'></div>";
  // need an inner fretboard div for scrolling within the outer fretboard div
  // outer fretboard's width is 100% width, innerFretboard is wider (set in css);
  myDiv +=
    "<div id='fretboard' class='fretboard' style='width:100%'><div id='innerFretboard' class='fretboard'></div></div>";

  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";

  // set play/pause button's 'name' in javascript so it can be changed in javascript
  // used to tell whether button is currently showing play or stop
  document.getElementById("playStopFretboard").name = "play";

  // check the Muso's handedness
  var whichHand;
  if (localStorage.getItem(g_currentUsername + "GtrHand") === "Right") {
    whichHand = "right";
  } else {
    whichHand = "left";
    document.getElementById("fretboard").scrollLeft = 10000; // scroll horizontally. 10000 should be bigger than fretboard width!
  }

  drawFretboard("innerFretboard", 20, whichHand);
  drawFretboardMeasureNotes("innerFretboard", 20, whichHand, measureNumber);
}

function getFretboardMeasurement(div, measurement) {
  switch (measurement) {
    case "width":
      return window.getComputedStyle(div).width.replace(/\D/g, "");
      break;
    case "height":
      return window.getComputedStyle(div).height.replace(/\D/g, "");
      break;
  }
}

function getFretboardFretMeasurement(
  measurement,
  fretboardWidth,
  fretboardHeight,
  fretNum,
  numFrets
) {
  switch (measurement) {
    case "fretWidth":
      return fretboardWidth / 200 + "px";
      break;
    case "fretNutWidth":
      return fretboardWidth / 100 + "px";
      break;
    case "fretHeight":
      return fretboardHeight * 0.83 + "px";
      break;
    case "fretBorderWidth":
      return fretboardHeight / 300 + 1 + "px";
      break;
    case "fretXPos":
      // add an offset, then scale to a percentage of available width
      return (
        ((Math.pow(2, fretNum / 12) - 1) / (Math.pow(2, numFrets / 12) - 1)) *
          fretboardWidth *
          0.891 +
        fretboardWidth * 0.05 +
        "px"
      );
      break;
    case "fretNumXPos":
      return (
        ((Math.pow(2, (numFrets - fretNum) / 12) - 1) /
          (Math.pow(2, numFrets / 12) - 1)) *
          fretboardWidth *
          0.922 +
        fretboardWidth * 0.05 +
        "px"
      );
      break;
    case "fretNumYPos":
      return fretboardHeight * 0.84 + "px";
      break;
  }
}

function getFretboardStringMeasurement(
  measurement,
  fretboardWidth,
  fretboardHeight,
  stringNum
) {
  switch (measurement) {
    case "top":
      return (stringNum * fretboardHeight) / 7.2 + fretboardHeight / 15 + "px";
      break;
    case "width":
      return fretboardWidth + "px";
      break;
    case "height":
      return (fretboardHeight * stringNum) / 350 + 1 + "px";
      break;
    case "borderWidth":
      return fretboardHeight / 300 + 1 + "px";
      break;
  }
}

// SELECT EXERCISE -> VIEW FRETBOARD -> DRAW FRETBOARD
// numFrets excludes the nut
function drawFretboard(divID, numFrets, whichHand) {
  var fretboard = document.getElementById(divID);
  fretboard.innerHTML = "";
  var fretboardWidth = getFretboardMeasurement(fretboard, "width");
  var fretboardHeight = getFretboardMeasurement(fretboard, "height");

  // an 'i' to use in multiple for loops below
  var i;

  // draw the frets
  var fret;
  for (i = 0; i <= numFrets; i++) {
    fret = document.createElement("div");
    if (i !== numFrets) {
      fret.setAttribute("class", "fret");
      fret.style.width = getFretboardFretMeasurement(
        "fretWidth",
        fretboardWidth,
        0,
        0,
        0
      );
    } else {
      fret.setAttribute("class", "fret nut");
      fret.style.width = getFretboardFretMeasurement(
        "fretNutWidth",
        fretboardWidth,
        0,
        0,
        0
      );
    }
    fret.style.height = getFretboardFretMeasurement(
      "fretHeight",
      0,
      fretboardHeight,
      0,
      0
    );
    fret.style.borderWidth = getFretboardFretMeasurement(
      "fretBorderWidth",
      0,
      fretboardHeight,
      0,
      0
    );
    fret.style[whichHand] = getFretboardFretMeasurement(
      "fretXPos",
      fretboardWidth,
      0,
      i,
      numFrets
    );
    fretboard.appendChild(fret);
  }

  // draw the fret numbers
  var fretNum;
  for (i = 0; i <= numFrets; i++) {
    if (
      i === 0 ||
      i === 3 ||
      i === 5 ||
      i === 7 ||
      i === 9 ||
      i === 12 ||
      i === 15 ||
      i === 24
    ) {
      fretNum = document.createElement("div");
      fretNum.style.position = "absolute";
      fretNum.style.top = getFretboardFretMeasurement(
        "fretNumYPos",
        0,
        fretboardHeight,
        0,
        0
      );
      fretNum.style[whichHand] = getFretboardFretMeasurement(
        "fretNumXPos",
        fretboardWidth,
        0,
        i,
        numFrets
      );
      fretNum.innerHTML = i;
      fretboard.appendChild(fretNum);
    }
  }

  // draw the strings
  var string;
  for (i = 0; i < 6; i++) {
    string = document.createElement("div");
    string.setAttribute("class", "string");
    string.style.top = getFretboardStringMeasurement(
      "top",
      fretboardWidth,
      fretboardHeight,
      i
    );
    string.style.width = getFretboardStringMeasurement(
      "width",
      fretboardWidth,
      fretboardHeight,
      i
    );
    string.style.height = getFretboardStringMeasurement(
      "height",
      fretboardWidth,
      fretboardHeight,
      i
    );
    string.style.borderWidth = getFretboardStringMeasurement(
      "borderWidth",
      fretboardWidth,
      fretboardHeight,
      i
    );
    fretboard.appendChild(string);
  }
}

function getFretboardNoteMeasurement(
  measurement,
  fretboardWidth,
  fretboardHeight,
  fretNum,
  numFrets,
  stringNum
) {
  switch (measurement) {
    case "widthHeight":
      return fretboardHeight / 10 + "px";
      break;
    case "widthHeightNoPx":
      return fretboardHeight / 10;
      break;
    case "borderWidth":
      return fretboardHeight / 85 + "px";
      break;
    case "lineHeight":
      return fretboardHeight / 12.1 + "px";
      break;
    case "fontSize":
      return fretboardHeight / 16 + "px";
      break;
    case "textShadow":
      return "-1px -1px 1px black,1px -1px 1px black,-1px -1px 1px black,1px 1px 1px black";
      break;
    case "xPos":
      return (
        ((Math.pow(2, (numFrets - fretNum) / 12) - 1) /
          (Math.pow(2, numFrets / 12) - 1)) *
          fretboardWidth *
          0.905 +
        fretboardWidth * 0.05 +
        "px"
      );
      break;
    case "top":
      return (
        (stringNum * fretboardHeight) / 7.2 +
        fretboardHeight / 15 -
        getFretboardNoteMeasurement(
          "widthHeightNoPx",
          0,
          fretboardHeight,
          0,
          0,
          0
        ) /
          2 +
        "px"
      );
      break;
  }
}

// numFrets excludes the nut
function drawFretboardMeasureNotes(divID, numFrets, whichHand, measureNumber) {
  var fretboard = document.getElementById(divID);
  var fretboardWidth = getFretboardMeasurement(fretboard, "width");
  var fretboardHeight = getFretboardMeasurement(fretboard, "height");

  // preset these vars so don't need to keep calculating them for each note
  var noteWidthHeight = getFretboardNoteMeasurement(
    "widthHeight",
    0,
    fretboardHeight,
    0,
    0,
    0
  );
  var noteBorderWidth = getFretboardNoteMeasurement(
    "borderWidth",
    0,
    fretboardHeight,
    0,
    0,
    0
  );
  var noteLineHeight = getFretboardNoteMeasurement(
    "lineHeight",
    0,
    fretboardHeight,
    0,
    0,
    0
  );
  var noteFontSize = getFretboardNoteMeasurement(
    "fontSize",
    0,
    fretboardHeight,
    0,
    0,
    0
  );
  var noteTextShadow = getFretboardNoteMeasurement(
    "textShadow",
    0,
    fretboardHeight,
    0,
    0,
    0
  );

  var myNoteArray = getNoteArray(measureNumber);
  var myArrayLength = myNoteArray.length;
  var note;

  // need 'let i=0' not 'var i=0' here because of the 'g_myPressEvent' event listener below
  for (let i = 0; i < myArrayLength; i++) {
    note = document.createElement("div");
    note.setAttribute("class", "note");
    note.style.height = noteWidthHeight;
    note.style.width = noteWidthHeight;
    note.style.borderWidth = noteBorderWidth;
    note.style.lineHeight = noteLineHeight;
    note.style.fontSize = noteFontSize;
    note.style.textShadow = noteTextShadow;
    if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
      note.style.backgroundColor = myNoteArray[i].noteColor;
    } else {
      note.style.backgroundColor = g_grayColor;
    }
    var stringNum = myNoteArray[i].stringNumber;
    var fretNum = myNoteArray[i].fretNumber;
    note.style[whichHand] = getFretboardNoteMeasurement(
      "xPos",
      fretboardWidth,
      0,
      fretNum,
      numFrets,
      stringNum
    );
    note.style.top = getFretboardNoteMeasurement(
      "top",
      0,
      fretboardHeight,
      0,
      0,
      stringNum
    );
    // click on note to play
    note.addEventListener(
      g_myPressEvent,
      function () {
        // change animation style, trigger reflow, start animation
        // this allows retrigger of border animation during a previous border animation
        this.style.animation = "none";
        void this.offsetWidth;
        this.style.animation = "whitenBorder 1s ease-in 0ms 1 normal";
        playNote(
          0,
          myNoteArray[i].spriteStartTime,
          myNoteArray[i].spriteDetune,
          1
        );
      },
      true
    );
    note.addEventListener(
      "animationend",
      function () {
        this.style.animation = "none";
      },
      true
    );

    fretboard.appendChild(note);
  }
}

// SELECT EXERCISE -> VIEW FRETBOARD -> PLAY or STOP FRETBOARD
function playStopFretboard(measureNumber) {
  var playStopButton = document.getElementById("playStopFretboard");
  if (playStopButton.name === "play") {
    playStopButton.name = "stop";
    playStopButton.innerHTML = "&#9632;";
    repeatsCounter.innerHTML = "";
    var mspb = getMeasureMSPB(measureNumber);
    var myNoteArray = getNoteArray(measureNumber);
    var myArrayLength = myNoteArray.length;
    var myNoteDivArray = document.getElementsByClassName("note");
    var i;
    for (i = 0; i < myArrayLength; i++) {
      myNoteDivArray[i].innerHTML = myNoteArray[i].fingerNumber;
    }
    var currentRepeatBeginTime = null;
    var noteNum = 0;
    var progress;
    var diff;
    var myRepeats = 1;
    var measureRepeats = getMeasureRepeats(measureNumber);
    var measureDuration =
      myNoteArray[myArrayLength - 1].noteStartTime +
      myNoteArray[myArrayLength - 1].noteDuration;
    var playIntroBeats = true;
    var updateRepeats = true;

    function step(timestamp) {
      // working in milli-seconds
      if (!currentRepeatBeginTime) {
        // add two beats of time plus a buffer of g_beginTimeDelayMS to play drum intro first
        // added a small delay before playing so that the changes to innerHTML (above) have time to complete
        // this was causing a requestAnimationFrame delay on android which cut off the start of the first note
        currentRepeatBeginTime = timestamp + 2 * mspb + g_beginTimeDelayMS;
        // playNote() requires seconds not milli-seconds
        playNote(
          g_beginTimeDelayS,
          g_audioSpriteData["drum1"].start,
          0,
          g_audioSpriteData["drum1"].duration
        ); // play first intro beat after 0.3s
      }
      progress = timestamp - currentRepeatBeginTime;

      if (playIntroBeats) {
        diff = -mspb - progress; // play 2nd intro beat at -mspb milliseconds (i.e. before 0ms)
        if (diff < g_scheduleAheadTime) {
          playIntroBeats = false;
          playNote(
            diff / 1000,
            g_audioSpriteData["drum1"].start,
            0,
            g_audioSpriteData["drum1"].duration
          );
        }
      }

      // update the repeats counter
      if (progress >= 0 && updateRepeats) {
        repeatsCounter.innerHTML = myRepeats;
        updateRepeats = false;
      }

      for (i = noteNum; i < myArrayLength; i++) {
        diff = myNoteArray[i].noteStartTime - progress;
        if (diff < g_scheduleAheadTime) {
          // playNote() requires seconds not milli-seconds
          playNote(
            diff / 1000,
            myNoteArray[i].spriteStartTime,
            myNoteArray[i].spriteDetune,
            myNoteArray[i].noteDuration / 1000
          );
          myNoteDivArray[i].style.animation =
            "whitenBorder " +
            myNoteArray[i].noteDuration +
            "ms ease-in " +
            diff +
            "ms 1 normal";
          noteNum++;
        } else {
          break;
        }
      }
      // make sure fretboard exists because user could click back to previous page
      if (document.getElementById("fretboard")) {
        if (noteNum < myArrayLength) {
          g_currentAnimationFrameRequest = window.requestAnimationFrame(step);
        } else {
          if (myRepeats < measureRepeats) {
            myRepeats++;
            updateRepeats = true;
            noteNum = 0;
            currentRepeatBeginTime += measureDuration;
            g_currentAnimationFrameRequest = window.requestAnimationFrame(step);
          } else {
            playStopButton.innerHTML = "&#9654;";
            playStopButton.name = "play";
          }
        }
      }
    }
    g_currentAnimationFrameRequest = window.requestAnimationFrame(step);
  } else {
    playStopButton.innerHTML = "&#9654;";
    playStopButton.name = "play";
    repeatsCounter.innerHTML = "";
    window.cancelAnimationFrame(g_currentAnimationFrameRequest);
  }
}

// SELECT EXERCISE -> VIEW SHEET MUSIC
function viewSheetMusic(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  var myDiv = "<div class='container centerText'>";
  var onclickText =
    'selectExercise("' +
    measureGrade +
    '","' +
    measureName +
    '","' +
    measureRootColor +
    '",' +
    measureNumber +
    ")";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='" +
    onclickText +
    "'>&lt;</span>";
  var exerciseStyle =
    "style='" +
    getBackgroundGradient("Ex" + measureNumber, measureRootColor) +
    "'";
  myDiv +=
    "<span class='listItem biggerFont' " +
    exerciseStyle +
    ">" +
    measureName +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";
  // not allowed '#' character, which means 'sharp' in music and is in some of the file names
  var fileName = measureName.replace("#", "%23");
  myDiv +=
    "<object id='sheetMusicSVG' data='./img/" +
    measureGrade +
    "/" +
    fileName +
    ".svg' style='width:40em;height:auto;' type='image/svg+xml'></object>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";

  // if 'no color' setting is enabled
  if (localStorage.getItem(g_currentUsername + "GtrColor") === "No Color") {
    var svgObject = document.getElementById("sheetMusicSVG");
    // make sure the svg has had time to load
    svgObject.addEventListener(
      "load",
      function () {
        var svgNotes = svgObject.contentDocument.getElementsByClassName("Note");
        var svgAccidentals =
          svgObject.contentDocument.getElementsByClassName("Accidental");
        for (let i = svgNotes.length - 1; i > 0; i = i - 3) {
          svgNotes[i].setAttributeNS(null, "fill", "black");
        }
        for (let i = 0; i < svgAccidentals.length; i++) {
          svgAccidentals[i].setAttributeNS(null, "fill", "black");
        }
      },
      true
    );
  }
}

// SELECT EXERCISE -> PLAY EXERCISE
function playExercise(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  var myDiv =
    "<div class='container hideOverflowY leftText' id='playExerciseDiv'>";
  var onclickText =
    'selectExercise("' +
    measureGrade +
    '","' +
    measureName +
    '","' +
    measureRootColor +
    '",' +
    measureNumber +
    ")";
  // add id='backButton' to send a click on a pause/resume event in cordova
  myDiv +=
    "<span id='backButton' class='listItem biggerFont noBorder' onclick='" +
    onclickText +
    "'>&lt;</span>";
  myDiv +=
    "<div id='repeatsCounter' class='listItem bottomRightFixed' style='z-index:10001;pointer-events:none'>1</div>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";

  var playExerciseDiv = document.getElementById("playExerciseDiv");
  var myNoteArray = getNoteArray(measureNumber);
  var myArrayLength = myNoteArray.length;

  var currentRepeatBeginTime = null;
  var noteNum = 0;
  var progress;
  var diff;
  var myNoteDivArray = document.getElementsByClassName("exerciseNote");
  var myRepeats = 1;
  var measureRepeats = getMeasureRepeats(measureNumber);
  var measureDuration =
    myNoteArray[myArrayLength - 1].noteStartTime +
    myNoteArray[myArrayLength - 1].noteDuration;
  var currentExerciseBeginTime;
  var mspb = getMeasureMSPB(measureNumber);
  var hitTimingAccuracy = 0;
  var numNotesHit = 0;
  var playBeat = true;
  var updateRepeats = true;

  // check the Muso's handedness
  var whichHand;
  if (localStorage.getItem(g_currentUsername + "GtrHand") === "Right") {
    whichHand = "right";
  } else {
    whichHand = "left";
  }

  for (let i = 0; i < myArrayLength; i++) {
    var n = document.createElement("div");
    n.className = "exerciseNote centerText";
    if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
      n.style.backgroundColor = myNoteArray[i].noteColor;
    } else {
      n.style.backgroundColor = g_grayColor;
    }
    n.style[whichHand] = myNoteArray[i].fingerNumber * 3.25 + "em";
    n.style.bottom = "100%";
    n.style.zIndex = 10000 - i;
    n.innerHTML = myNoteArray[i].noteName;
    if (myNoteArray[i].fingerNumber !== "0") {
      n.addEventListener(
        g_myPressEvent,
        function () {
          playNote(
            0,
            myNoteArray[i].spriteStartTime,
            myNoteArray[i].spriteDetune,
            myNoteArray[i].noteDuration / 1000
          );
          hitTimingAccuracy += Math.abs(
            performance.now() -
              (currentExerciseBeginTime +
                this.id * measureDuration +
                myNoteArray[i].noteStartTime +
                mspb * 2)
          );
          numNotesHit++;
          this.style.animation = "none";
        },
        true
      );
      n.addEventListener(
        "animationend",
        function () {
          this.style.animation = "none";
        },
        true
      );
    } else {
      n.addEventListener(
        "animationend",
        function () {
          playNote(
            0,
            myNoteArray[i].spriteStartTime,
            myNoteArray[i].spriteDetune,
            myNoteArray[i].noteDuration / 1000
          );
          numNotesHit++;
          this.style.animation = "none";
        },
        true
      );
    }
    playExerciseDiv.appendChild(n);
  }

  // add the finger guide boxes
  for (let i = 1; i < 5; i++) {
    var n = document.createElement("div");
    n.className = "exerciseNote centerText";
    n.style.pointerEvents = "none";
    n.style[whichHand] = i * 3.25 + "em";
    n.style.bottom = "0";
    n.innerHTML = i;
    playExerciseDiv.appendChild(n);
  }

  function step(timestamp) {
    // working in milli-seconds here
    if (!currentRepeatBeginTime) {
      // need a buffer of  g_beginTimeDelay because the first beat was getting chopped off at beginning
      currentRepeatBeginTime = timestamp + g_beginTimeDelayMS;
      currentExerciseBeginTime = timestamp + g_beginTimeDelayMS;
      // play the first beat because this isn't scheduled ahead (see 'beat' code below)
      playNote(
        g_beginTimeDelayS,
        g_audioSpriteData["drum1"].start,
        0,
        g_audioSpriteData["drum1"].duration
      );
    }
    progress = timestamp - currentRepeatBeginTime;

    // calculate whether to play the beat or not
    // this won't play the very first beat because it schedules ahead
    var exerciseProgress = timestamp - currentExerciseBeginTime;
    var t = mspb - (exerciseProgress % mspb);
    if (t < g_scheduleAheadTime) {
      if (playBeat) {
        playNote(
          t / 1000,
          g_audioSpriteData["drum1"].start,
          0,
          g_audioSpriteData["drum1"].duration
        );
        playBeat = false;
      }
    } else {
      playBeat = true;
    }

    // update the repeats counter
    if (progress >= 2 * mspb && updateRepeats) {
      repeatsCounter.innerHTML = myRepeats;
      updateRepeats = false;
    }

    for (let i = noteNum; i < myArrayLength; i++) {
      diff = myNoteArray[i].noteStartTime - progress;
      if (diff < g_scheduleAheadTime) {
        if (myNoteArray[i].fingerNumber !== "0") {
          // non-open-string notes fall to double the length of the screen
          // they should reach screen bottom in time of two beats
          myNoteDivArray[i].style.animation =
            "noteFall " + mspb * 4 + "ms linear " + diff + "ms 1 normal";
          // need zero-referenced repeat counter for hitTimingAccuracy calculation after a 'g_myPressEvent'
          myNoteDivArray[i].id = myRepeats - 1;
        } else {
          // open string notes fall half the distance
          myNoteDivArray[i].style.animation =
            "openStringNoteFall " +
            mspb * 2 +
            "ms linear " +
            diff +
            "ms 1 normal";
        }
        noteNum++;
      } else {
        break;
      }
    }

    // make sure playExerciseDiv exists because user could click back to previous page
    if (document.getElementById("playExerciseDiv")) {
      if (noteNum < myArrayLength) {
        g_currentAnimationFrameRequest = window.requestAnimationFrame(step);
      } else {
        if (myRepeats < measureRepeats) {
          myRepeats++;
          updateRepeats = true;
          noteNum = 0;
          currentRepeatBeginTime = currentRepeatBeginTime + measureDuration;
          g_currentAnimationFrameRequest = window.requestAnimationFrame(step);
        } else {
          // all measure repeats are sent out at this point
          setTimeout(function () {
            var exerciseScore,
              averageAccuracy,
              prevBestScore,
              todayNum,
              prevDayNum;

            if (numNotesHit < myArrayLength * measureRepeats) {
              var fractionNotesHit =
                numNotesHit / (myArrayLength * measureRepeats); // this is less than one
              exerciseScore = Math.round(measureRepeats * 8 * fractionNotesHit); // max of 8/10
              if (fractionNotesHit > 0) {
                averageAccuracy = Math.round(
                  hitTimingAccuracy /
                    (myArrayLength * measureRepeats * fractionNotesHit)
                ); // in ms
              } else {
                // no notes hit => terrible accuracy!??
                averageAccuracy = "--";
              }
            } else {
              averageAccuracy = Math.round(
                hitTimingAccuracy / (myArrayLength * measureRepeats)
              ); // in ms
              var accuracyBonus;
              if (averageAccuracy <= 35) {
                accuracyBonus = 2;
              } else if (averageAccuracy <= 50) {
                accuracyBonus = 1;
              } else {
                accuracyBonus = 0.5;
              }
              exerciseScore = Math.round(
                measureRepeats * 8 + accuracyBonus * measureRepeats
              );
            }

            prevBestScore = Number(
              localStorage.getItem(g_currentUsername + "GtrEx" + measureNumber)
            );
            var nextGrade = measureGrade.replace(
              /\d+/,
              Number(/\d+/.exec(measureGrade)) + 1
            );
            if (prevBestScore < exerciseScore) {
              localStorage.setItem(
                g_currentUsername + "GtrEx" + measureNumber,
                exerciseScore
              );
              var gradeScore = getGradeScore(measureGrade);
              localStorage.setItem(
                g_currentUsername + "Gtr" + measureGrade,
                gradeScore
              );
              // unused grade locking code
              // require 70% or more to unlock next grade
              // if(Number(gradeScore)>=70 && !localStorage.getItem(g_currentUsername+"Gtr"+nextGrade)){
              //     localStorage.setItem(g_currentUsername+"Gtr"+nextGrade,"0");
              // }
            }

            todayNum = Math.floor(Date.parse(new Date()) / 86400000);
            prevDayNum = Number(
              localStorage.getItem(g_currentUsername + "GtrDayNum")
            );
            if (prevDayNum) {
              var dayDiff = todayNum - prevDayNum;
              if (dayDiff != 0) {
                var newStreak =
                  Number(
                    localStorage.getItem(g_currentUsername + "GtrStreak")
                  ) + 1;
                localStorage.setItem(
                  g_currentUsername + "GtrStreak",
                  newStreak
                );
              }
            } else {
              localStorage.setItem(g_currentUsername + "GtrStreak", "1");
            }
            // set today as the day guitar was last practised
            localStorage.setItem(g_currentUsername + "GtrDayNum", todayNum);

            var resultDiv = "<div id='resultDiv' class='container centerText'>";
            var onclickText =
              'selectExercise("' +
              measureGrade +
              '","' +
              measureName +
              '","' +
              measureRootColor +
              '",' +
              measureNumber +
              ");";
            resultDiv +=
              "<span class='listItem biggerFont noBorder' onclick='" +
              onclickText +
              "'>&lt;</span>";
            var exerciseStyle =
              "style='" +
              getBackgroundGradient("Ex" + measureNumber, measureRootColor) +
              "'";
            resultDiv +=
              "<span class='listItem biggerFont' " +
              exerciseStyle +
              ">" +
              measureName +
              "</span>";
            resultDiv +=
              "<span class='listItem biggerFont hidden'>&lt;</span><br/><br/>";

            resultDiv +=
              "<span class='listItem biggerFont' style='" +
              getBackgroundGradient(exerciseScore, measureRootColor) +
              "'>" +
              exerciseScore +
              "%</span><br/>";
            if (g_currentUsername !== "Beethoven") {
              // unused grade locking code
              // if( localStorage.getItem(g_currentUsername+"Gtr"+nextGrade) && nextGrade!="Grade 6" ){
              //     resultDiv += "<span style='font-weight:bold;'>" + nextGrade + " Unlocked</span><br/>";
              // }
              resultDiv +=
                "<span class='listItem' style='" +
                getBackgroundGradient(measureGrade) +
                "'>" +
                measureGrade +
                " Score: " +
                localStorage.getItem(g_currentUsername + "Gtr" + measureGrade) +
                "%</span><br/>";
            }

            // Accuracy score between 0 and 100 (100-averageAccuracy)
            var accuracyRating;
            // above, averageAccuracy is set to "--" if no notes are hit
            if (
              averageAccuracy > 100 ||
              averageAccuracy == 0 ||
              averageAccuracy == "--"
            ) {
              accuracyRating = 0;
            } else {
              accuracyRating = 100 - averageAccuracy;
            }
            resultDiv +=
              "<span class='listItem' style='" +
              getBackgroundGradient(accuracyRating, measureRootColor) +
              "'>" +
              "Accuracy: " +
              averageAccuracy +
              " ms</span><br/>";

            resultDiv +=
              "<span class='listItem' style='" +
              getBackgroundGradient(measureRepeats * 10, measureRootColor) +
              "'>" +
              measureRepeats +
              " / 10 repeats complete</span><br/>";
            resultDiv +=
              "<span class='listItem' style='" +
              getBackgroundGradient(prevBestScore, measureRootColor) +
              "'>" +
              "Previous Best: " +
              prevBestScore +
              "%</span><br/>";

            document.getElementById("fullscreen").innerHTML =
              resultDiv + "</div>";
          }, mspb * 4);
        }
      }
    }
  }
  g_currentAnimationFrameRequest = window.requestAnimationFrame(step);
}
