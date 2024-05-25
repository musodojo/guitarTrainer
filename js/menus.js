function showLoginScreen() {
  g_currentUsername = "";
  var myDiv = "<div class='container centerText'>";
  myDiv += "<img src='img/heading.png' style='height:4em;'></img><br/>";
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (/^MDUSER/.test(key)) {
      var username = localStorage.getItem(key);
      myDiv +=
        "<span class='listItem' style='" +
        getBackgroundGradient(key) +
        "' onclick='selectUser(this.innerHTML)'>" +
        username +
        "</span><br/>";
    }
  }
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("TenPercent") +
    "' onclick='showNewUserScreen()'>New Muso</span><br/>";
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='showAboutScreen()'>About</span>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function selectUser(username) {
  g_currentUsername = username;
  listGrades();
}

function showNewUserScreen() {
  var myDiv = "<div class='container centerText'>";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='showLoginScreen()'>&lt;</span>";
  myDiv +=
    "<input id='username' class='listItem centerText' style='line-height:2em;' type='text' maxlength='20' />";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";
  myDiv +=
    "<p id='notification'>set username</p><button id='ok' class='listItem centerText' style='line-height:2em;' type='button' onclick='createNewUser()'>OK</button>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
  document.getElementById("username").focus();
  document.getElementById("username").addEventListener(
    "keypress",
    function (event) {
      if (event.key === "Enter") {
        document.getElementById("ok").click();
      }
    },
    false
  );
}

function createNewUser() {
  var input = document.getElementById("username").value;
  if (input === "") {
    document.getElementById("notification").innerHTML =
      "username cannot be blank";
    return false;
  }

  var newUsername = "MDUSER" + input;
  var pattern = new RegExp("^" + newUsername + "$", "i");

  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (pattern.test(key)) {
      document.getElementById("notification").innerHTML =
        "username " + input + " already exists";
      return false;
    }
  }
  localStorage.setItem(newUsername, input);
  localStorage.setItem(input + "Gtr" + "Grade 0", "0");
  localStorage.setItem(input + "GtrHand", "Right");
  localStorage.setItem(input + "GtrColor", "Color");
  g_currentUsername = input;
  listGrades();
}

function showDeleteUserScreen() {
  var myDiv = "<div class='container centerText'>";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='userSettings()'>&lt;</span>";
  myDiv +=
    "<span class='listItem biggerFont' style='" +
    getBackgroundGradient("MDUSER" + g_currentUsername) +
    "'>Delete " +
    g_currentUsername +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";
  myDiv +=
    "<p>Warning! This will delete ALL data associated with the username " +
    g_currentUsername +
    "</p>";
  myDiv +=
    "<span class='listItem' style='background:green' onclick='removeUserData()'>Yes</span><br/>";
  myDiv +=
    "<span class='listItem' style='background:red' onclick='userSettings()'>No</span>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function removeUserData() {
  var mduserPattern = new RegExp("^MDUSER" + g_currentUsername + "$");
  var guitarPattern = new RegExp("^" + g_currentUsername + "Gtr");
  var removeKeys = new Array();
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    // can't just remove items here because localStorage.length changes
    if (mduserPattern.test(key) || guitarPattern.test(key)) {
      removeKeys.push(key);
    }
  }
  for (var j = 0; j < removeKeys.length; j++) {
    localStorage.removeItem(removeKeys[j]);
  }
  showLoginScreen();
}

function removeBeethovenData() {
  var pattern = new RegExp("^Beethoven");
  var removeKeys = new Array();
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    // can't just remove items here because localStorage.length changes
    if (pattern.test(key)) {
      removeKeys.push(key);
    }
  }
  for (var j = 0; j < removeKeys.length; j++) {
    localStorage.removeItem(removeKeys[j]);
  }
}

function listGrades() {
  var myDiv = "<div class='container centerText'>";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='showLoginScreen()'>&lt;</span>";
  myDiv +=
    "<span class='listItem biggerFont' style='" +
    getBackgroundGradient("MDUSER" + g_currentUsername) +
    "'>" +
    g_currentUsername +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";

  var measures = g_xmlFile.getElementsByTagName("measure");
  var lastMeasureGrade;
  for (var i = 0; i < measures.length; i++) {
    var measureGrade = getMeasureGrade(measures[i]);
    if (i !== 0) {
      lastMeasureGrade = getMeasureGrade(measures[i - 1]);
    }
    if (lastMeasureGrade !== measureGrade) {
      // commented section here is to lock grades before completing last one
      // I think I prefer opening all the grades up from start
      // if(localStorage.getItem(g_currentUsername+"Gtr"+measureGrade) || g_currentUsername==="Beethoven"){
      //     var gradeStyle = "class='listItem' style='" + getBackgroundGradient(measureGrade) + "' onclick='listExercises(this.innerHTML)'";
      // }
      // else{
      //     var gradeStyle = "class='listItem lineThrough' style='" + getBackgroundGradient(measureGrade) + "'";
      // }
      var gradeStyle =
        "class='listItem' style='" +
        getBackgroundGradient(measureGrade) +
        "' onclick='listExercises(this.innerHTML)'";
      myDiv += "<span " + gradeStyle + ">" + measureGrade + "</span><br/>";
    }
  }
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='showMultitool()'>Multitool</span><br/>";
  myDiv +=
    "<div class='listItem topRightFixed' onclick='userSettings()'>&#9881;</div>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function userSettings() {
  var myDiv = "<div class='container centerText'>";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='listGrades()'>&lt;</span>";
  myDiv +=
    "<span class='listItem biggerFont' style='" +
    getBackgroundGradient("MDUSER" + g_currentUsername) +
    "'>" +
    g_currentUsername +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";

  var guitarStreak = localStorage.getItem(g_currentUsername + "GtrStreak");
  if (guitarStreak) {
    todayNum = Math.floor(Date.parse(new Date()) / 86400000);
    prevDayNum = Number(localStorage.getItem(g_currentUsername + "GtrDayNum"));
    var styleText;
    if (todayNum === prevDayNum) {
      styleText =
        getBackgroundGradient("MDUSERBeethoven") +
        ";line-height:3em;padding:0.5em";
    } else {
      styleText = "line-height:3em;padding:0.5em";
    }
    var dayText;
    if (Number(guitarStreak) === 1) {
      dayText = "day";
    } else {
      dayText = "days";
    }
    myDiv +=
      "<span class='listItem' style='" +
      styleText +
      "'>" +
      guitarStreak +
      " " +
      dayText +
      "</span><br/>";
  }

  myDiv +=
    "<span class='listItem' id='switchHands' onclick='switchHands()' style='" +
    getBackgroundGradient("MDUSER" + g_currentUsername) +
    "'>" +
    localStorage.getItem(g_currentUsername + "GtrHand") +
    "-Handed</span><br/>";
  myDiv +=
    "<span class='listItem' id='switchColor' onclick='switchColor()' style='" +
    getBackgroundGradient("MDUSER" + g_currentUsername) +
    "'>" +
    localStorage.getItem(g_currentUsername + "GtrColor") +
    "</span><br/>";
  myDiv +=
    "<span class='listItem' onclick='showDeleteUserScreen()' style='" +
    getBackgroundGradient("MDUSER" + g_currentUsername) +
    "'>Delete Muso</span>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function switchHands() {
  if (localStorage.getItem(g_currentUsername + "GtrHand") === "Right") {
    document.getElementById("switchHands").innerHTML = "Left-Handed";
    localStorage.setItem(g_currentUsername + "GtrHand", "Left");
  } else {
    document.getElementById("switchHands").innerHTML = "Right-Handed";
    localStorage.setItem(g_currentUsername + "GtrHand", "Right");
  }
}

function switchColor() {
  if (localStorage.getItem(g_currentUsername + "GtrColor") === "Color") {
    localStorage.setItem(g_currentUsername + "GtrColor", "No Color");
  } else {
    localStorage.setItem(g_currentUsername + "GtrColor", "Color");
  }
  userSettings(); // reload with new color scheme
}

function listExercises(grade) {
  var myDiv = "<div class='container centerText'>";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='listGrades()'>&lt;</span>";
  var gradeStyle =
    "class='listItem biggerFont' style='" + getBackgroundGradient(grade) + "'";
  myDiv += "<span " + gradeStyle + ">" + grade + "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";

  var measures = g_xmlFile.getElementsByTagName("measure");
  for (var i = 0; i < measures.length; i++) {
    var measureGrade = getMeasureGrade(measures[i]);
    if (measureGrade === grade) {
      var measureRootColor = getMeasureRootColor(measures[i]);
      var measureName = getMeasureName(measures[i]);
      var exerciseStyle =
        "style='" + getBackgroundGradient("Ex" + i, measureRootColor) + "'";
      var onclickText =
        'selectExercise("' +
        measureGrade +
        '","' +
        measureName +
        '","' +
        measureRootColor +
        '",' +
        i +
        ")";
      myDiv +=
        "<span onclick='" +
        onclickText +
        "' class='listItem' " +
        exerciseStyle +
        ">" +
        measureName +
        "</span><br/>";
    }
  }

  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function selectExercise(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  var myDiv = "<div class='container centerText'>";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='listExercises(\"" +
    measureGrade +
    "\")'>&lt;</span>";
  var exerciseStyle =
    "style='" +
    getBackgroundGradient("Ex" + measureNumber, measureRootColor) +
    "'";
  var unlockedStyle =
    "style='" + getBackgroundGradient("100", measureRootColor) + "'";
  myDiv +=
    "<span class='listItem biggerFont' " +
    exerciseStyle +
    ">" +
    measureName +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/>";

  var onclickText =
    '("' +
    measureGrade +
    '","' +
    measureName +
    '","' +
    measureRootColor +
    '",' +
    measureNumber +
    ")";
  myDiv +=
    "<span class='listItem playButton' " +
    unlockedStyle +
    " onclick='playExercise" +
    onclickText +
    "'>&#9654;</span><br/>";
  myDiv +=
    "<span class='listItem' " +
    unlockedStyle +
    " onclick='viewFretboard" +
    onclickText +
    "'>Fretboard</span><br/>";
  myDiv +=
    "<span class='listItem' " +
    unlockedStyle +
    " onclick='viewSheetMusic" +
    onclickText +
    "'>Sheet Music</span>";
  myDiv +=
    "<div class='listItem topRightFixed' onclick='exerciseSettings" +
    onclickText +
    "'>&#9881;</div>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

// SELECT EXERCISE -> EXERCISE SETTINGS
function exerciseSettings(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  var myDiv = "<div id='myDiv' class='container centerText'>";
  var onclickText =
    'updateSettings("' +
    measureGrade +
    '","' +
    measureName +
    '","' +
    measureRootColor +
    '",' +
    measureNumber +
    ");";
  myDiv +=
    "<span class='listItem biggerFont noBorder' onclick='" +
    onclickText +
    "'>&lt;</span>";
  // pass MDUSERBeethoven as username ("keyText") so it fills the headings with color
  var exerciseStyle =
    "style='" +
    getBackgroundGradient("MDUSERBeethoven", measureRootColor) +
    "'";
  myDiv +=
    "<span class='listItem biggerFont' " +
    exerciseStyle +
    ">" +
    "Settings" +
    "</span>";
  myDiv += "<span class='listItem biggerFont hidden'>&lt;</span><br/><br/>";

  var exerciseTempo = getMeasureTempo(measureNumber);
  var exerciseRepeats = getMeasureRepeats(measureNumber);

  myDiv += "<span class='biggerFont boldFont'>Tempo</span>";
  myDiv +=
    "<span id='bpmText' class='listItem biggerFont noBorder'>" +
    exerciseTempo +
    "</span>";
  myDiv +=
    "<button class='listItem' style='line-height:1em;' onclick='resetTempoSetting(" +
    measureNumber +
    ")'>Reset</button><br/>";
  myDiv +=
    "<input id='bpmSlider' type='range' class='listItem noBorder' style='width:70%;' orient='horizontal' min='60' max='200' value='" +
    exerciseTempo +
    "' oninput='bpmText.innerHTML=this.value' /><br/>";

  myDiv += "<span class='biggerFont boldFont'>Repeats</span>";
  myDiv +=
    "<span id='repeatsText' class='listItem biggerFont noBorder'>" +
    exerciseRepeats +
    "</span><br/>";
  myDiv +=
    "<input id='repeatsSlider' type='range' class='listItem noBorder' style='width:70%;' orient='horizontal' min='1' max='10' value='" +
    exerciseRepeats +
    "' oninput='repeatsText.innerHTML=this.value' /><br/>";

  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

// SELECT EXERCISE -> EXERCISE SETTINGS -> UPDATE SETTINGS AND GO BACK TO SELECT EXERCISE
function updateSettings(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  localStorage.setItem(
    g_currentUsername + "GtrEx" + measureNumber + "Tem",
    document.getElementById("bpmSlider").value
  );
  localStorage.setItem(
    g_currentUsername + "GtrEx" + measureNumber + "Rep",
    document.getElementById("repeatsSlider").value
  );
  selectExercise(measureGrade, measureName, measureRootColor, measureNumber);
}

// SELECT EXERCISE -> EXERCISE SETTINGS -> RESET TEMPO SETTING
function resetTempoSetting(measureNumber) {
  var originalTempo = getMeasureOriginalTempo(measureNumber);
  document.getElementById("bpmSlider").value = originalTempo;
  document.getElementById("bpmText").innerHTML = originalTempo;
}

// Maybe a useless function?
// could be used for template for certificate images (e.g. userName passed grade 0)
function generateTitleScreen(
  measureGrade,
  measureName,
  measureRootColor,
  measureNumber
) {
  var canvas = document.createElement("canvas");
  var width = 1280;
  var height = 720;

  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext("2d");
  context.textBaseline = "middle";

  context.fillStyle = measureRootColor;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "white";
  context.strokeStyle = "black";
  var font1 = "80px ChopinScript";
  var font2 = "45px 'Gang of Three'";

  var text1 = measureName.substr(0, measureName.indexOf(" ")) + " ";
  var text2 = " " + measureName.substr(measureName.indexOf(" ") + 1);

  context.font = font1;
  var font1Width = context.measureText(text1).width;

  context.font = font2;
  var font2Width = context.measureText(text2).width;

  var totalFontWidth = font1Width + font2Width;
  var x1 = width / 2 - totalFontWidth / 2;
  var x2 = width / 2 - totalFontWidth / 2 + font1Width;

  context.shadowColor = "#000000";
  context.shadowBlur = 10;

  context.font = font1;
  context.fillText(text1, x1, height / 2);
  context.strokeText(text1, x1, height / 2);

  context.font = font2;
  context.fillText(text2, x2, height / 2);
  context.strokeText(text2, x2, height / 2);

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
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
  document.getElementById("myDiv").appendChild(canvas);
}
