const recordBtn = document.querySelector(".record"),
  clearBtn = document.querySelector(".clear");
  var content= "";

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let recording = false;

function populateLanguages() {
  for(const country_code in countries){
    
    const option = document.createElement("option");
    option.value = country_code;
    option.innerHTML = countries[country_code];
    inputLanguage.appendChild(option);
  }
   
}

//populateLanguages();

function speechToText() {
  try {
    recognition = new SpeechRecognition();
    recognition.lang = selectTag[0].value;

    //recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "Listening...";

    recognition.start(); /// recognition system is started
    ////////// when ever it is recording your voice
    recognition.onresult = (event) => {
      var curr= event.resultIndex;
      const speechResult = event.results[curr][0].transcript;//transfer data that you have spoke through mic
      //detect when intrim results
      
      content +=" "+ speechResult;
      console.log(speechResult);
      fromText.value= content
      
    };

    recognition.onspeechend = () => {
      speechToText();
    };
    recognition.onerror = (event) => {
      stopRecording();
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert(
          "No microphone was found. Ensure that a microphone is installed."
        );
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false;

    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  recognition.stop();
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}



clearBtn.addEventListener("click", () => {
  content = "";
  fromText.value = "";
  toText.value= "";
});