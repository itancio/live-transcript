import { DeepgramError, createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import fetch from 'cross-fetch'
import dotenv from 'dotenv'

// STEP 1: Create a Deepgram client using the API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

export async function POST(req) {
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
        })
        connection.on(LiveTranscriptionEvents.Transcript, (data) => {
            console.log(data.channel.alternatives[0].transcript);
        })
        connection.on(LiveTranscriptionEvents.Metadata, (data) => {
            console.log(data);
        })
        connection.on(LiveTranscriptionEvents.Error, (err) => {
            console.error(err);
        })

        // STEP 4: Fetch the audio stream and send it to the live transcription connection
        fetch(url)
            .then((r) => r.body)
            .then((res) => {
                connection.send(res.read());
            })
    })
}

live();