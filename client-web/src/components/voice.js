"use client";
import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function Dictaphone({ setText }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  console.log(listening);

  useEffect(() => {
    if (listening !== true) {
      setText(transcript);
      resetTranscript();
    }
  }, [listening]);
  if (!browserSupportsSpeechRecognition) {
    return <div>{`Browser doesn't support speech recognition.`}</div>;
  }

  return (
    <div>
      <p className="bg-black text-white">{transcript}</p>
      <p>Microphone {listening ? "on" : "off"}</p>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={SpeechRecognition.startListening}
          className="bg-b text-white bg-black  py-2 px-2 rounded-md z-[100]"
        >
          Start
        </button>
        {/* <button
          onClick={SpeechRecognition.stopListening}
          className="bg-red-500 text-white py-2 px-2 rounded-md"
        >
          Stop
        </button> */}
        {/* <button onClick={resetTranscript}>Reset</button> */}
      </div>
    </div>
  );
}
export default Dictaphone;
