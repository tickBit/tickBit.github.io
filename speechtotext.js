const voice = document.getElementsByClassName("activate")[0];
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recorder = new SpeechRecognition();


function computerVoice(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 0.75;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    let element = document.getElementById("voice2text");
    element.textContent = speech.text;
    let el = document.getElementById("pactivate");
    el.textContent = "Activate voice again";
    document.getElementsByClassName("activate")[0].style.animationPlayState = "running";
}

recorder.onresult = (event) => {
  const resultIndex = event.resultIndex;
  const transcript = event.results[resultIndex][0].transcript;
  computerVoice(transcript);
};

recorder.onstart = () => {
  document.getElementsByClassName("activate")[0].style.animationPlayState = "paused";
 
};

voice.addEventListener('click', () =>{
  recorder.start();
});

voice.addEventListener('click', () =>{
  try {
  recorder.start();
  let el = document.getElementById("pactivate");
  el.textContent = "Sano jotain / Say something"
  } catch (e) {
    console.log("virhe");
  }
});