import { useState } from "react";

function VoiceRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  const startRecording = () => {
    setRecording(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setRecording(false);
    };
  };

  const stopRecording = () => {
    recognition.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={startRecording}>🎙 Start Recording</button>
      <button onClick={stopRecording}>⏹ Stop</button>
    </div>
  );
}

export default VoiceRecorder;