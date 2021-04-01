function showMultitool() {
  var myDiv = "<div class='container centerText' id='multitoolDiv'>";
  myDiv += "<span id='backButton' class='listItem biggerFont noBorder' onclick='listGrades()'>&lt;</span>";

  // root note select
  var mtRootNote = localStorage.getItem(g_currentUsername + "GtrMtRootNote");
  if (!mtRootNote) {
    mtRootNote = "C";
    localStorage.setItem(g_currentUsername + "GtrMtRootNote", "C");
  }
  if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
    myDiv += "<select id='rootNoteSelect' style='background-color:" + g_noteColors[g_noteNames[mtRootNote]] + ";' class='listItem biggerFont' onchange='setMtRootNote(this.value)'>";
  } else {
    myDiv += "<select id='rootNoteSelect' class='listItem biggerFont' onchange='setMtRootNote(this.value)'>";
  }
  myDiv += "<option selected='selected' style='display:none;' disabled='disabled'>Root</option>";
  for (var key in g_noteNames) {
    myDiv += "<option>" + key + "</option>";
  }
  myDiv += "</select>";

  myDiv += "<select id='noteSequenceSelect' class='listItem biggerFont' onchange='setMtNoteSequence(this.value)'>";
  myDiv += "<option selected='selected' style='display:none;' disabled='disabled'>Sequence</option>";
  for (var key in g_noteSequences) {
    myDiv += "<option>" + key + "</option>";
  }
  myDiv += "</select>";

  // settings
  myDiv += "<span class='listItem biggestFont noBorder' onclick='multitoolSettings()'>&#9881;</span><br/>";

  // root note, sequence, and open strings info
  myDiv += "<span class='listItem biggerFont noBorder'><span id='rootNoteText'>" + mtRootNote + "</span><span> </span><span id='noteSequenceText'>" + getMtNoteSequence() + "</span><span id='tuningText'>, " + getMtOpenStrings() + "</span></span><br/>";

  // need an inner fretboard div for scrolling within the outer fretboard div
  // outer fretboard's width is 100% width, innerFretboard is wider (set in css);
  var mtFretboardHeight = getMtFretboardHeight();
  mtFretboardHeight += 20; // setting 20em the baseline multitool fretboard height

  var mtFretboardWidth = getMtFretboardWidth();
  mtFretboardWidth += 80; // setting 80em the baseline multitool fretboard width
  myDiv += "<div id='fretboard' class='fretboard' style='height:" + mtFretboardHeight + "em;width:100%'><div id='innerFretboard' class='fretboard' style='height:" + mtFretboardHeight + "em;width:" + mtFretboardWidth + "em'></div></div>";

  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";

  // check the Muso's handedness
  var whichHand = localStorage.getItem(g_currentUsername + "GtrHand").toLowerCase();
  if (whichHand === "left") {
    document.getElementById('fretboard').scrollLeft = 10000; // scroll horizontally. 10000 should be bigger than fretboard width!
  }

  drawFretboard("innerFretboard", 24, whichHand);
  drawFretboardMtNotes("innerFretboard", 24, whichHand);

}

function setMtRootNote(note) {
  localStorage.setItem(g_currentUsername + "GtrMtRootNote", note);
  document.getElementById('rootNoteText').innerHTML = note;
  if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
    document.getElementById('rootNoteSelect').style.backgroundColor = g_noteColors[g_noteNames[localStorage.getItem(g_currentUsername + "GtrMtRootNote")]];
  }
  var whichHand = localStorage.getItem(g_currentUsername + "GtrHand").toLowerCase();
  drawFretboard("innerFretboard", 24, whichHand);
  drawFretboardMtNotes("innerFretboard", 24, whichHand);
}

function setMtNoteSequence(sequence) {
  localStorage.setItem(g_currentUsername + "GtrMtNoteSequence", sequence);
  document.getElementById('noteSequenceText').innerHTML = sequence;
  var whichHand = localStorage.getItem(g_currentUsername + "GtrHand").toLowerCase();
  if (sequence === "Custom") {
    var myDiv = "<div class='container centerText'>";
    myDiv += "<span id='backButton' class='listItem biggerFont noBorder' onclick='finishCustomMtNoteSequence()'>&lt;</span>";
    // pass MDUSERBeethoven as username ("keyText") so it fills the headings with color
    var exerciseStyle = "style='" + getBackgroundGradient("MDUSERBeethoven") + "'";
    myDiv += "<span class='listItem biggerFont' " + exerciseStyle + ">" + "Sequence" + "</span>";
    // center it better
    myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";

    for (let i = 0; i < 12; i++) {
      var labelText;
      switch (i) {
        case 0:
          labelText = "Root/P1/P8";
          break;
        case 1:
          labelText = "b2/m2/b9/m9";
          break;
        case 2:
          labelText = "2/M2/9/M9";
          break;
        case 3:
          labelText = "b3/m3/#9/b10/m10";
          break;
        case 4:
          labelText = "3/M3/10/M10";
          break;
        case 5:
          labelText = "4/P4/11/P11";
          break;
        case 6:
          labelText = "#4/b5/#11/b12";
          break;
        case 7:
          labelText = "5/P5/P12";
          break;
        case 8:
          labelText = "b6/m6/b13/m13";
          break;
        case 9:
          labelText = "6/M6/M13";
          break;
        case 10:
          labelText = "b7/m7/m14";
          break;
        case 11:
          labelText = "7/M7/M14";
          break;
      }
      myDiv += "<label style='width:10em;' id='sequenceLabel" + i + "' class='listItem biggerFont'>" + labelText + " ";
      myDiv += "<input class='biggerFont' id='sequence" + i + "' type='checkbox' value='" + i + "' />";
      myDiv += "</label><br/>";
    }

    document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
  } else {
    drawFretboard("innerFretboard", 24, whichHand);
    drawFretboardMtNotes("innerFretboard", 24, whichHand);
  }
}

function finishCustomMtNoteSequence() {
  var customSequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (var i = 0; i < 12; i++) {
    if (document.getElementById("sequence" + i).checked === true) {
      customSequence[i] = 1;
    }
  }
  localStorage.setItem(g_currentUsername + "GtrMtCustomNoteSequence", customSequence);
  showMultitool();
}

function getMtNoteSequence() {
  var mtNoteSequence = localStorage.getItem(g_currentUsername + "GtrMtNoteSequence");
  if (mtNoteSequence) {
    if (mtNoteSequence === "Custom") {
      g_noteSequences.Custom = localStorage.getItem(g_currentUsername + "GtrMtCustomNoteSequence").split(",").map(Number);
    }
  } else {
    mtNoteSequence = "Ionian/Major";
  }
  return mtNoteSequence;
}

function multitoolSettings() {
  var myDiv = "<div class='container centerText'>";
  myDiv += "<span id='backButton' class='listItem biggerFont noBorder' onclick='showMultitool()'>&lt;</span>";
  // pass MDUSERBeethoven as username ("keyText") so it fills the headings with color
  var exerciseStyle = "style='" + getBackgroundGradient("MDUSERBeethoven") + "'";
  myDiv += "<span class='listItem biggerFont' " + exerciseStyle + ">" + "Settings" + "</span>";
  // center it better
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";

  // open string tuning select
  var openStrings = getMtOpenStrings();
  myDiv += "<label class='biggerFont boldFont' id='openStringsSelectLabel'>Open Strings <span id='openStringsSelectLabelSpan' class='listItem noBorder'>" + openStrings + "</span></label><br/>";
  myDiv += "<select id='openStringsSelect' class='listItem biggerFont' onchange='setMtOpenStrings(this.value)'>";
  myDiv += "<option selected='selected' style='display:none;' disabled='disabled'>Open Strings</option>";
  for (var key in g_openStringsTunings) {
    myDiv += "<option>" + key + "</option>";
  }
  myDiv += "</select><br/><br/>";

  // fretboard height
  var fretboardHeight = getMtFretboardHeight();
  myDiv += "<label class='biggerFont boldFont' id='fretboardHeightLabel'>Fretboard Height <span id='fretboardHeightLabelSpan' class='listItem noBorder'>" + fretboardHeight + "</span></label><br/>";
  myDiv += "<input id='fretboardHeightSlider' type='range' class='listItem noBorder' style='width:70%;' orient='horizontal' min='-12' max='12' value='" + fretboardHeight + "' oninput='setMtFretboardHeight(this.value)' /><br/>";

  // fretboard width
  var fretboardWidth = getMtFretboardWidth();
  myDiv += "<label class='biggerFont boldFont' id='fretboardWidthLabel'>Fretboard Width <span id='fretboardWidthLabelSpan' class='listItem noBorder'>" + fretboardWidth + "</span></label><br/>";
  myDiv += "<input id='fretboardWidthSlider' type='range' class='listItem noBorder' style='width:70%;' orient='horizontal' min='-30' max='30' value='" + fretboardWidth + "' oninput='setMtFretboardWidth(this.value)' /><br/>";

  // note width, height
  var noteWidthHeight = getMtNoteWidthHeight();
  myDiv += "<label class='biggerFont boldFont' id='noteWidthHeightLabel'>Note Size <span id='noteWidthHeightLabelSpan' class='listItem noBorder'>" + noteWidthHeight + "</span></label><br/>";
  myDiv += "<input id='noteWidthHeightSlider' type='range' class='listItem noBorder' style='width:70%;' orient='horizontal' min='-5' max='50' value='" + noteWidthHeight + "' oninput='setMtNoteWidthHeight(this.value)' /><br/>";

  // note duration
  var noteDuration = getMtNoteDuration();
  myDiv += "<label class='biggerFont boldFont' id='noteDurationLabel'>Note Duration <span id='noteDurationLabelSpan' class='listItem noBorder'>" + noteDuration + "</span></label><br/>";
  myDiv += "<input id='noteDurationSlider' type='range' class='listItem noBorder' style='width:70%;' orient='horizontal' step='0.1' min='0.1' max='2' value='" + noteDuration + "' oninput='setMtNoteDuration(this.value)' /><br/>";

  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}


function getMtFretboardHeight() {
  var mtFretboardHeight = Number(localStorage.getItem(g_currentUsername + "GtrMtFretboardHeight"));
  if (!mtFretboardHeight) {
    mtFretboardHeight = 0;
  }
  return mtFretboardHeight;
}

function setMtFretboardHeight(height) {
  document.getElementById("fretboardHeightLabelSpan").innerHTML = height;
  localStorage.setItem(g_currentUsername + "GtrMtFretboardHeight", height);
}

function getMtFretboardWidth() {
  var mtFretboardWidth = Number(localStorage.getItem(g_currentUsername + "GtrMtFretboardWidth"));
  if (!mtFretboardWidth) {
    mtFretboardWidth = 0;
  }
  return mtFretboardWidth;
}

function setMtFretboardWidth(width) {
  document.getElementById("fretboardWidthLabelSpan").innerHTML = width;
  localStorage.setItem(g_currentUsername + "GtrMtFretboardWidth", width);
}

function getMtNoteWidthHeight() {
  var mtNoteWidthHeight = Number(localStorage.getItem(g_currentUsername + "GtrMtNoteWidthHeight"));
  if (!mtNoteWidthHeight) {
    mtNoteWidthHeight = 0;
  }
  return mtNoteWidthHeight;
}

function setMtNoteWidthHeight(widthHeight) {
  document.getElementById("noteWidthHeightLabelSpan").innerHTML = widthHeight;
  localStorage.setItem(g_currentUsername + "GtrMtNoteWidthHeight", widthHeight);
}

function getMtNoteDuration() {
  var mtNoteDuration = Number(localStorage.getItem(g_currentUsername + "GtrMtNoteDuration"));
  if (!mtNoteDuration) {
    mtNoteDuration = 1;
  }
  return mtNoteDuration;
}

function setMtNoteDuration(duration) {
  document.getElementById("noteDurationLabelSpan").innerHTML = duration;
  localStorage.setItem(g_currentUsername + "GtrMtNoteDuration", duration);
}

function getMtOpenStrings() {
  var mtOpenStrings = localStorage.getItem(g_currentUsername + "GtrMtOpenStrings");
  if (mtOpenStrings) {
    if (mtOpenStrings === "Custom") {
      // need to map strings to numbers
      g_openStringsTunings.Custom = localStorage.getItem(g_currentUsername + "GtrMtCustomOpenStrings").split(",").map(Number);
    }
  } else {
    mtOpenStrings = "EADGBE";
  }
  return mtOpenStrings;
}

function setMtOpenStrings(openStrings) {
  localStorage.setItem(g_currentUsername + "GtrMtOpenStrings", openStrings);
  document.getElementById("openStringsSelectLabelSpan").innerHTML = openStrings;
  if (openStrings === "Custom") {
    var myDiv = "<div class='container centerText'>";
    myDiv += "<span id='backButton' class='listItem biggerFont noBorder' onclick='finishCustomMtOpenStrings()'>&lt;</span>";
    // pass MDUSERBeethoven as username ("keyText") so it fills the headings with color
    var exerciseStyle = "style='" + getBackgroundGradient("MDUSERBeethoven") + "'";
    myDiv += "<span class='listItem biggerFont' " + exerciseStyle + ">" + "Open Strings" + "</span>";
    // center it better
    myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/><br/>";

    myDiv += "<span class='biggerFont boldFont'>Set the MIDI note number for each string</span><br/>";
    myDiv += "<span class='biggerFont'>C2 = 36 (lowest)</span><br/>";
    myDiv += "<span class='biggerFont'>E4 = 64 (highest)</span><br/>";
    var stringArray;
    if (localStorage.getItem(g_currentUsername + "GtrMtCustomOpenStrings")) {
      stringArray = localStorage.getItem(g_currentUsername + "GtrMtCustomOpenStrings").split(",");
    } else {
      stringArray = g_openStringsTunings.Custom;
    }
    for (let i = 0; i < 6; i++) {
      myDiv += "<label id='stringLabel" + i + "' onchange='updateMtOpenStringColor(" + i + ")' class='listItem biggerFont'>" + (i + 1) + " ";
      myDiv += "<input style='width:4em;' class='biggerFont' id='string" + i + "' type='number' min='36' max='64' step='1' value='" + stringArray[i] + "' />";
      myDiv += "</label><br/>";
    }

    document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
    // finish by coloring the boxes correctly
    for (let i = 0; i < 6; i++) {
      updateMtOpenStringColor(i);
    }
  }
}

function updateMtOpenStringColor(stringNum) {
  if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
    var stringLabel = document.getElementById("stringLabel" + stringNum);
    var string = document.getElementById("string" + stringNum);
    stringLabel.style.backgroundColor = g_noteColors[string.value % 12];
  }
}

function finishCustomMtOpenStrings() {
  var customOpenStrings = [0, 0, 0, 0, 0, 0];
  for (var i = 0; i < 6; i++) {
    var midiNum = Number(document.getElementById("string" + i).value);
    if (midiNum < 36) {
      midiNum = 36;
    }
    if (midiNum > 64) {
      midiNum = 64;
    }
    customOpenStrings[i] = midiNum;
  }
  localStorage.setItem(g_currentUsername + "GtrMtCustomOpenStrings", customOpenStrings);
  showMultitool();
}

function drawFretboardMtNotes(divID, numFrets, whichHand) {
  var fretboard = document.getElementById(divID);
  var fretboardWidth = getFretboardMeasurement(fretboard, "width");
  var fretboardHeight = getFretboardMeasurement(fretboard, "height");

  var rootNote = localStorage.getItem(g_currentUsername + "GtrMtRootNote");
  var noteSequence = getMtNoteSequence();
  var openStringsTuning = getMtOpenStrings();

  // preset these vars so don't need to keep calculating them for each note
  var mtNoteWidthHeight = getMtNoteWidthHeight();
  var mtNoteDuration = getMtNoteDuration();

  var noteWidthHeight = getFretboardNoteMeasurement("widthHeightNoPx", 0, fretboardHeight, 0, 0, 0) + mtNoteWidthHeight + "px";
  var noteBorderWidth = getFretboardNoteMeasurement("borderWidth", 0, fretboardHeight, 0, 0, 0);
  var noteLineHeight = getFretboardNoteMeasurement("lineHeight", 0, fretboardHeight, 0, 0, 0);
  var noteFontSize = getFretboardNoteMeasurement("fontSize", 0, fretboardHeight, 0, 0, 0);
  var noteTextShadow = getFretboardNoteMeasurement("textShadow", 0, fretboardHeight, 0, 0, 0);

  var note;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j <= numFrets; j++) {
      var currentMidiNote = (g_openStringsTunings[openStringsTuning][i] + j);
      var currentNoteInScale = g_noteSequences[noteSequence][(currentMidiNote - g_noteNames[rootNote]) % 12];
      if (currentNoteInScale) {
        note = document.createElement("div");
        note.setAttribute("class", "note");
        note.style.height = noteWidthHeight;
        note.style.width = noteWidthHeight;
        note.style.borderWidth = noteBorderWidth;
        note.style.lineHeight = noteLineHeight;
        note.style.fontSize = noteFontSize;
        note.style.textShadow = noteTextShadow;
        if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
          note.style.backgroundColor = g_noteColors[currentMidiNote % 12];
        } else {
          note.style.backgroundColor = g_grayColor;
        }
        var stringNum = i;
        var fretNum = j;
        note.style[whichHand] = getFretboardNoteMeasurement("xPos", fretboardWidth, 0, fretNum, numFrets, stringNum);
        note.style.top = getFretboardNoteMeasurement("top", 0, fretboardHeight, 0, 0, stringNum);
        // click on note to play
        note.addEventListener(g_myPressEvent,
          function() {
            // change animation style, trigger reflow, start animation
            // this allows retrigger of border animation during a previous border animation
            this.style.animation = "none";
            void this.offsetWidth;
            this.style.animation = "whitenBorder " + mtNoteDuration + "s ease-in 0ms 1 normal";
            playNote(0, g_audioSpriteData[(g_openStringsTunings[openStringsTuning][i] + j)].start, g_audioSpriteData[(g_openStringsTunings[openStringsTuning][i] + j)].detune, mtNoteDuration);
          }, true);
        fretboard.appendChild(note);
      }
    }
  }
}
