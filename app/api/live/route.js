import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk'
import fetch from 'cross-fetch'
import dotenv from 'dotenv'


const setupDeepgram = (ws) => {
  const connection = deepgram.listen.live({
    model: "nova-2",
    language: "en-US",
    smart_format: true,
  });

  if (keepAlive) clearInterval(keepAlive);
  keepAlive = setInterval(() => {
    console.log('deepgram: keepalive');
    deepgram.keepAlive();
  }, 10 * 1000);
}

export default function Live() {
  // URL for the realtime streaming audio you would like to transcribe
  const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

  dotenv.config()

  // STEP 1: Create a Deepgram client using the API key
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  

  const live = async () => {
    // STEP 2: Create a live transcription connection
    const connection = deepgram.listen.live({
      model: "nova-2",
      language: "en-US",
      smart_format: true,
    });

    // STEP 3: Listen for events from the live transcription connection
    connection.on(LiveTranscriptionEvents.Open, () => {
      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("Connection closed.");
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        console.log(data.channel.alternatives[0].transcript);
      });

      connection.on(LiveTranscriptionEvents.Metadata, (data) => {
        console.log(data);
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
      });

      // STEP 4: Fetch the audio stream and send it to the live transcription connection
      fetch(url)
        .then((r) => r.body)
        .then((res) => {
          res.on("readable", () => {
            connection.send(res.read());
          });
        });
    });
  };

  return (
  <>
  { live()}
  </>
  )
}
