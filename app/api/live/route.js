import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

export async function POST(req) {
    
}