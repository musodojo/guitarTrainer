function returnAboutHeading(backFunction, title) {
  return (
    "<div class='container thinnerContainer centerText'>" +
    "<span class='listItem biggerFont noBorder' onclick='" +
    backFunction +
    "'>&lt;</span>" +
    "<span class='listItem biggerFont' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "'>" +
    title +
    "</span>" +
    "<span class='listItem biggerFont hidden'>&lt;</span><br/>"
  );
}

function showAboutScreen() {
  var myDiv = returnAboutHeading("showLoginScreen()", "About");
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='aboutIntro()'>Intro</span><br/>";
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='aboutPlay()'>Play</span><br/>";
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='aboutFretboard()'>Fretboard</span><br/>";
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='aboutSheetMusic()'>Sheet Music</span><br/>";
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='aboutMultitool()'>Multitool</span><br/>";
  myDiv +=
    "<span class='listItem' style='" +
    getBackgroundGradient("MDUSERBeethoven") +
    "' onclick='aboutContact()'>Contact</span><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function aboutIntro() {
  var myDiv = returnAboutHeading("showAboutScreen()", "Intro");
  myDiv += "<br/>";
  myDiv +=
    "<span><b>Muso Dojo</b> will train you to perform guitar scales and arpeggios from grade 0 to grade 5.</span><br/><br/>";
  myDiv +=
    "<span>Create a <b>New Muso</b> and go to settings to set <b>Left-Handed</b> if required.</span><br/><br/>";
  myDiv +=
    "<span>The exercises in each grade are designed to guide you from complete beginner to grade 5 guitarist.</span><br/><br/>";
  myDiv +=
    "<span>Each exercise contains a finger-training game to <b>Play</b>, which rates your playing accuracy; an <b>Interactive Fretboard</b> display to help you visualise the exercise on the guitar; and <b>Sheet Music</b> for a complete guitar-training experience.</span><br/><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function aboutPlay() {
  var myDiv = returnAboutHeading("showAboutScreen()", "Play");
  myDiv += "<br/>";
  myDiv +=
    "<span><b>Turn Device</b> to its side and face the screen away from you.</span><br/><br/>";
  myDiv +=
    "<img src='./img/aboutPlay.jpg' alt='how to hold the device' width='60%'></img><br/><br/>";
  myDiv +=
    "<span><b>Ready Fingers</b> by hovering your fingers over the numbered finger boxes. Box <b>1</b> for your <b>index finger</b> to box <b>4</b> for your <b>little finger</b>.</span><br/><br/>";
  myDiv +=
    "<span><b>Press Play</b> to begin the finger-training game only after readying your fingers.</span><br/><br/>";
  myDiv +=
    "<span><b>Hit Notes</b> on the beat when they reach the bottom of the screen. Notes that don't fall into a numbered box are <b>open-string notes</b> and will <b>play automatically</b>.</span><br/><br/>";
  myDiv +=
    "<span><b>Get Rated</b> after all the notes have fallen. Achieve an <b>Accuracy</b> of under <b>35 milli-seconds</b> to get 100%.</span><br/><br/>";
  myDiv +=
    "<span>As a guide, complete at least half the exercises before moving to the next <b>Grade</b></span><br/><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function aboutFretboard() {
  var myDiv = returnAboutHeading("showAboutScreen()", "Fretboard");
  myDiv += "<br/>";
  myDiv +=
    "<span>The <b>Fretboard</b> display helps you to visualise each exercise on the guitar and can be used during <b>regular guitar practise</b>.</span><br/><br/>";
  myDiv +=
    "<span>The thinnest string (<b>string 1</b>) is displayed at the <b>top</b> of the display down to <b>string 6</b> at the <b>bottom</b> and fret numbers are marked underneath this.</span><br/><br/>";
  myDiv +=
    "<span><b>Press play</b> to see which fingers should play each note. Each note in the exercise is highlighted as it is played. Occasionally, a note will be played by two different fingers at different times in the exercise. The finger number will change briefly on the beat for these notes.</span><br/><br/>";
  myDiv +=
    "<span>The notes may be pressed to <b>hear</b> them play.</span><br/><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function aboutSheetMusic() {
  var myDiv = returnAboutHeading("showAboutScreen()", "Sheet Music");
  myDiv += "<br/>";
  myDiv +=
    "<span><a href='https://en.wikipedia.org/wiki/Sheet_music'>Sheet music</a> is provided for each exercise on a <a href='https://en.wikipedia.org/wiki/Clef#Other_clefs'>modified treble clef</a> and in <a href='https://en.wikipedia.org/wiki/Clef#Tablature'>tab notation.</a></span><br/><br/>";
  myDiv +=
    "<span>The exercises may be played on any <a href='https://en.wikipedia.org/wiki/Guitar'>guitar</a> using any <a href='https://en.wikipedia.org/wiki/Guitar_picking'>picking</a> technique.</span><br/><br/>";
  myDiv +=
    "<span>A minimum practise <a href='https://en.wikipedia.org/wiki/Tempo'>tempo</a> is marked at the top.</span><br/><br/>";
  myDiv +=
    "<span>Each exercise's <a href='https://en.wikipedia.org/wiki/Key_signature'>key signature</a> is marked to the right of the treble clef when necessary.</span><br/><br/>";
  myDiv +=
    "<span><a href='https://en.wikipedia.org/wiki/Fingering_(music)#String_instruments'>Finger numbers</a> are displayed to the left of each note.</span><br/><br/>";
  myDiv +=
    "<span>Where necessary, <a href='https://en.wikipedia.org/wiki/Roman_numerals#Basic_decimal_pattern'>roman numerals</a> above a note indicates the <a href='https://en.wikipedia.org/wiki/Classical_guitar#Fingering_notation'>position</a> on the fretboard for the first finger.</span><br/><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function aboutMultitool() {
  var myDiv = returnAboutHeading("showAboutScreen()", "Multitool");
  myDiv += "<br/>";
  myDiv +=
    "<span>The <b>Multitool</b> helps you visualise guitar scales and arpeggios/chords all over the guitar fretboard.</span><br/><br/>";
  myDiv +=
    "<span>The notes may be pressed to <b>hear</b> them play.</span><br/><br/>";
  myDiv +=
    "<span>A selection of common scales and arpeggios are given and <b>custom sequences</b> may be entered by selecting <b>Custom</b> at the bottom of the list.</span><br/><br/>";
  myDiv +=
    "<span>The overall look of the fretboard may be changed in the <b>Settings</b> and <b>other tunings</b> may also be seleced here.</span><br/><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}

function aboutContact() {
  var myDiv = returnAboutHeading("showAboutScreen()", "Contact");
  myDiv += "<br/>";
  myDiv +=
    "<span><b>Website</b> <a href='https://sites.google.com/view/musodojo/home' target='_blank'>Under Development</a></span><br/><br/>";
  myDiv +=
    "<span><b>Email</b> <a href='mailto:musodojomail@gmail.com' target='_blank'>musodojomail@gmail.com</a></span><br/><br/>";
  document.getElementById("fullscreen").innerHTML = myDiv + "</div>";
}
