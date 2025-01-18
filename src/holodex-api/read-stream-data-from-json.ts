import streamDeck from "@elgato/streamdeck";
import fs from "fs";
import { processStreamerImage } from "./process-streamer-image";

export async function readStreamDataFromJson(pos: number) {
    try {
        const streamData = fs.readFileSync(`./holodex-data.json`, "utf-8");

        const parsedStreamData = JSON.parse(streamData);

        const {
            id,
            channel: { photo },
        } = parsedStreamData[pos];

        const processedPhoto = await processStreamerImage(photo);

        return { processedPhoto, id };
    } catch {
        streamDeck.logger.error("Issue reading stream data from json");
    }
}
