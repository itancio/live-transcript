import {createClient, LiveTranscriptionEvents} from '@deepgram/sdk'
import 'cross-fetch'
import dotenv from 'dotenv'

dotenv.config()

// URL for the realtime streaming audio you would like to transcribe
const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

// STEP 1: Create a Deepgram client using the API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export default function Home() {
  // STEP 2: Create a live transcription connection
  const connection = deepgram.listen.live({
    model: "nova-2",
    language: "en-US",
    smart_format: true,
  });


  return (
  <>
  </>
  );
}
