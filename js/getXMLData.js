// measure is a "measure" node from the music xml file
// the "measure grade" text is in "bold" font-weight
function getMeasureGrade(measure) {
  var wordsTags = measure.getElementsByTagName("words");
  for (var i = 0; i < wordsTags.length; i++) {
    if (wordsTags[i].hasAttribute("font-weight") && wordsTags[i].getAttribute("font-weight") === "bold") {
      return wordsTags[i].childNodes[0].nodeValue.match(/[^:]*/).toString();
    }
  }
}

// measure is a "measure" node from the music xml file
// the "measure name" text is in "normal" font-weight
function getMeasureName(measure) {
  var wordsTags = measure.getElementsByTagName("words");
  for (var i = 0; i < wordsTags.length; i++) {
    if (wordsTags[i].hasAttribute("font-weight") && wordsTags[i].getAttribute("font-weight") === "normal") {
      return wordsTags[i].childNodes[0].nodeValue.match(/[^:]*/).toString();
    }
  }
}

// measure is a "measure" node from the music xml file
function getMeasureNumber(measure) {
  return measure.getAttribute("number");
}

// measure is a "measure" node from the music xml file
function getMeasureRootColor(measure) {
  return measure.getElementsByTagName("notehead")[0].getAttribute("color");
}

function getDivisions() {
  return g_xmlFile.getElementsByTagName("divisions")[0].firstChild.nodeValue;
}

// get the original tempo of a measure in beats-per-minute
function getMeasureOriginalTempo(measureNumber) {
  var soundElements = g_xmlFile.getElementsByTagName("sound");
  var tempo = Math.round(soundElements[measureNumber].getAttribute("tempo"));
  return tempo;
}

// get the locally set tempo of a measure in beats-per-minute
// if it doesn't exist, get the original tempo
function getMeasureTempo(measureNumber) {
  var exerciseTempo;
  var localTempo = localStorage.getItem(g_currentUsername + "GtrEx" + measureNumber + "Tem");
  if (localTempo) {
    exerciseTempo = localTempo;
  } else {
    exerciseTempo = getMeasureOriginalTempo(measureNumber);
  }
  return exerciseTempo;
}

// get the locally set 'repeats' setting of a measure
// if it doesn't exist, return 10
function getMeasureRepeats(measureNumber) {
  var exerciseRepeats;
  var localRepeats = localStorage.getItem(g_currentUsername + "GtrEx" + measureNumber + "Rep");
  if (localRepeats) {
    exerciseRepeats = localRepeats;
  } else {
    exerciseRepeats = "10";
  }
  return exerciseRepeats;
}

// get value of milli-second-per-duration for a measure (i.e. duration=1 in milli-seconds)
function getMeasureMSPD(measureNumber) {
  var tempo = getMeasureTempo(measureNumber);
  var divisions = getDivisions();
  var mspd = 60000 / (tempo * divisions);
  return mspd;
}

// get value of milli-second-per-beat for a measure in milli-seconds
function getMeasureMSPB(measureNumber) {
  var tempo = getMeasureTempo(measureNumber);
  var mspb = 60000 / tempo;
  return mspb;
}

// measure is a "measure" node from the music xml file
function getNoteDuration(measure, noteNumber) {
  var durations = measure.getElementsByTagName("duration");
  var noteDuration = durations[noteNumber].childNodes[0].nodeValue;
  return noteDuration;
}

function getNoteArray(measureNumber) {
  var measures = g_xmlFile.getElementsByTagName("measure"),
    measureNotes = measures[measureNumber].getElementsByTagName("note");
  // measureLength is double the number of notes (treble clef note list and tabs note list)
  var measureLength = measureNotes.length;
  var noteArray = [];
  var stringNumber, fretNumber, noteColor, myNote, noteStartTime = 0,
    noteDuration, noteName, fingerNumber, spriteStartTime, spriteDetune;
  var i, j;
  var step, alter, octave, midiNumber;
  var mspd = getMeasureMSPD(measureNumber);

  for (i = measureLength / 2; i < measureLength; i++) {
    // get zero referenced counter
    j = i - (measureLength / 2);
    // take away one from stringNumber to have strings numbered zero to five
    stringNumber = measureNotes[i].getElementsByTagName("string")[0].childNodes[0].nodeValue - 1;
    fretNumber = measureNotes[i].getElementsByTagName("fret")[0].childNodes[0].nodeValue;
    fingerNumber = measureNotes[i].getElementsByTagName("fingering")[0].childNodes[0].nodeValue;
    noteColor = measureNotes[j].getElementsByTagName("notehead")[0].getAttribute("color");
    // noteDuration is in milli-seconds
    noteDuration = getNoteDuration(measures[measureNumber], j) * mspd;
    // step is the name of the note without the sharps, flats or octave number (e.g. "C", or "D", etc.)
    step = measureNotes[i].getElementsByTagName("step")[0].childNodes[0].nodeValue;
    // noteName will store the name of the note with sharps or flats, but without octave number
    noteName = step;
    if (measureNotes[i].getElementsByTagName("alter")[0]) {
      alter = Number(measureNotes[i].getElementsByTagName("alter")[0].childNodes[0].nodeValue);
      var symbol = "#";
      if (alter < 0) {
        symbol = "b";
      }
      for (var k = 0; k < Math.abs(alter); k++) {
        noteName += symbol;
      }
    } else {
      alter = 0;
    }
    octave = Number(measureNotes[i].getElementsByTagName("octave")[0].childNodes[0].nodeValue);
    // a simple formula to convert note name and octave and alter to a MIDI number
    midiNumber = (octave + 1) * 12 + g_noteNames[step] + alter;
    // g_audioSpriteData stores info about the notes using MIDI note numbers to reference them
    spriteStartTime = g_audioSpriteData[midiNumber].start;
    spriteDetune = g_audioSpriteData[midiNumber].detune;

    // if this is part of a chord, go back in time a bit
    // all chords should have same time values for all notes in the chord
    if (measureNotes[i].getElementsByTagName("chord")[0]) {
      noteStartTime -= noteDuration;
    }

    // now we have all the data to create the custom note using the note object constructor defined above
    myNote = new Note(stringNumber, fretNumber, noteColor, noteStartTime, noteDuration, noteName, fingerNumber, spriteStartTime, spriteDetune);

    noteStartTime += noteDuration;
    noteArray.push(myNote);
  }

  return noteArray;
}

// gets the number of grades from the global variable 'g_xmlFile'
function getNumberOfGrades() {
  var measures = g_xmlFile.getElementsByTagName("measure");
  var lastMeasureGrade;
  var totalGrades = 0;

  for (var i = 0; i < measures.length; i++) {
    var measureGrade = getMeasureGrade(measures[i]);
    if (i !== 0) {
      lastMeasureGrade = getMeasureGrade(measures[i - 1]);
    }
    if (lastMeasureGrade !== measureGrade) {
      totalGrades++
    }
  }
  return totalGrades;
}
// adds up the exercise scores in a specific grade (e.g. "Grade 0") and divides
// by the number of exercises
function getGradeScore(grade) {
  var measures = g_xmlFile.getElementsByTagName("measure"),
    measureGrade, gradeScore = 0;
  for (let i = 0; i < measures.length; i++) {
    measureGrade = getMeasureGrade(measures[i]);
    if (measureGrade === grade) {
      gradeScore += Number(localStorage.getItem(g_currentUsername + "GtrEx" + i));
    }
  }
  gradeScore /= getNumberOfExercises(grade);
  return Math.round(gradeScore);
}
// gets the number of exercises in a specific grade (e.g. "Grade 0")
function getNumberOfExercises(grade) {
  var measures = g_xmlFile.getElementsByTagName("measure"),
    measureGrade, numberOfExercises = 0;
  for (let i = 0; i < measures.length; i++) {
    measureGrade = getMeasureGrade(measures[i]);
    if (measureGrade === grade) {
      numberOfExercises++;
    }
  }
  return numberOfExercises;
}

function getBackgroundGradient(keyText, color) {
  // if color is not passed we have a username or a grade - multicolor
  // if it is passed we have an exercise - specific color
  var gradientColor;

  // if user setting is 'color' OR if no one is logged in, use color
  if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color" || g_currentUsername === "") {
    if (!color) {
      // these colors should be same as in the xml file, but in order of
      // red orange yellow green blue indigo violet
      gradientColor = "#ED2929,#FF9933,#EBEB19,#99CC33,#78C7C7,#00008B,#CC00FF,#ED2929";
    } else {
      gradientColor = color;
    }
  } else {
    // gray option
    gradientColor = g_grayColor;
  }

  var percent;

  if (keyText === "MinusTenPercent") {
    percent = -10;
  } else if (keyText === "TenPercent") {
    percent = 10;
  } else if (/^\d+$/.test(keyText)) {
    percent = Number(keyText);
  }
  // if Beethoven logged in, everything is complete
  else if (g_currentUsername === "Beethoven") {
    percent = 100;
  }
  // this is for when Beethoven isn't logged in yet
  else if (keyText === "MDUSERBeethoven") {
    percent = 100;
  }
  // if keyText contains 'MDUSER' count up the completed grades
  // note 'g_currentUsername' is not useful at this point
  else if (/^MDUSER/.test(keyText)) {
    var userGradePattern = new RegExp("^" + localStorage.getItem(keyText) + "Gtr" + "Grade");
    // the pattern will detect grades that are complete and the incomplete current grade
    // start at -1 to account for "current grade" detection
    var completedGrades = -1;
    for (var i = 0; i < localStorage.length; i++) {
      if (userGradePattern.test(localStorage.key(i))) {
        completedGrades++;
      }
    }
    percent = completedGrades * 100 / getNumberOfGrades();
  }
  // if grade or exercise, check local storage
  else if (/^Grade/.test(keyText) || /^Ex/.test(keyText)) {
    if (localStorage.getItem(g_currentUsername + "Gtr" + keyText)) {
      percent = localStorage.getItem(g_currentUsername + "Gtr" + keyText);
    } else {
      percent = 0;
    }
  } else {
    console.log("Error selecting background");
  }


  var string;
  if (percent < 90) {
    var plus10 = Number(percent) + 10;
    string = "background:linear-gradient(to right," + gradientColor + " " + percent + "%,white " + plus10 + "%);"
  } else {
    string = "background:linear-gradient(to right," + gradientColor + " " + percent + "%,white 100%);";
  }
  return string;
}
