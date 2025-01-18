import streamDeck from "@elgato/streamdeck";
import axios from "axios";
import { Jimp } from "jimp";

export async function processStreamerImage(imgUrl: string) {
    try {
        const response = await axios.get(imgUrl, {
            responseType: "arraybuffer",
        });

        const imgBuffer = Buffer.from(response.data);

        const image = await Jimp.read(imgBuffer);

        image.resize({ w: 72, h: 72 });

        const resizedImgBuffer = await image.getBuffer("image/jpeg");

        const base64Img = resizedImgBuffer.toString("base64");

        const dataUrl = `data:image/jpeg;base64,${base64Img}`;

        return dataUrl;
    } catch {
        streamDeck.logger.error("Issue buffering image");
    }
}
