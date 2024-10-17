import { useEffect, useState, useRef } from "react";

// Callback function to get the result
const blobToBase64 = (blob, apiRequest) => {
  const reader = new FileReader();
  reader.onload = function () {
    const base64data = reader?.result?.split(",")[1];
    apiRequest(base64data);
  };
  reader.readAsDataURL(blob);
};

export const useRecordVoice = () => {
  // State to hold the media recorder instance
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [text, setText] = useState("");

  // State to track whether recording is currently in progress
  const [recording, setRecording] = useState(false);

  // Ref to store audio chunks during recording
  const chunks = useRef([]);

  // Function to start the recording
  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      console.log("Recording started...");
      setRecording(true);
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop(); 
      console.log("Recording stopped...");
      setRecording(false);
    }
  };

  const getText = async (base64data) => {
    try {
      const response = await fetch(`/api/live`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: base64data }),
      });

      if (!response.ok) {
        throw new Error("Error transcribing audio");
      }

      const {text} = await response.json();
      setText(text)

    }
    catch (error) {
      console.log("Error in retrieving text. ", error)
    }
  }

  // Function to initialize the media recorder with the provided stream
  const initialMediaRecorder = (stream) => {
    const mediaRecorder = new MediaRecorder(stream);

    // Event handler when recording starts
    mediaRecorder.onstart = () => {
      chunks.current = []; // Resetting chunks array
    };

    // Event handler when data becomes available during recording
    mediaRecorder.ondataavailable = (event) => {
      chunks.current.push(event.data); // Storing data chunks
    };

    // Event handler when recording stops
    mediaRecorder.onstop = () => {
      // Creating a blob from accumulated audio chunks with WAV format
      const audioBlob = new Blob(chunks.current, { type: "audio/mp3" });
      blobToBase64(audioBlob, getText);
      console.log('audioBlob', audioBlob)

      // You can do something with the audioBlob, like sending it to a server or processing it further
      // If you plan to further process the audio or send it to a server, you can create a function to handle this 
      // and call it within the onstop event. This function could use fetch to upload the audioBlob or use other methods 
      // for processing.
    };

    setMediaRecorder(mediaRecorder);
  };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true })
  //       .then(initialMediaRecorder)
  //       .catch((error) => {
  //         console.error("Microphone access denied:", error);
  //       });
  //   }
    
  //   return () => {
  //     if (mediaRecorder) {
  //       mediaRecorder.stream.getTracks().forEach(track => track.stop());
  //     }
  //   };
  // }, [mediaRecorder]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder);
    }
  }, []);

  return { text, recording, startRecording, stopRecording };
};