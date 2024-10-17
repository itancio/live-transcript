'use client'

import { useRecordVoice } from "./hooks/useRecordVoice";
import { Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';


export default function Home() {
  const { text, startRecording, stopRecording } = useRecordVoice();
  console.log(text);

  return (
    <>
    {/* // Button for starting and stopping voice recording */}
    <Button
      onMouseDown={startRecording}    // Start recording when mouse is pressed
      onMouseUp={stopRecording}        // Stop recording when mouse is released
      onTouchStart={startRecording}    // Start recording when touch begins on a touch device
      onTouchEnd={stopRecording}        // Stop recording when touch ends on a touch device
      className="border-none bg-transparent w-10"
    >
      {/* Microphone icon component */}
      <MicIcon />
    </Button>
    </>
  );
};