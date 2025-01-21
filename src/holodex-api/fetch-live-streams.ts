import streamDeck from "@elgato/streamdeck";
import { holodexApiConnection } from "./holodex-api-connection";
import axios from "axios";
import fs from "fs";

export async function fetchLiveStreams(isRefresh = false): Promise<void> {
    try {
        const response = await holodexApiConnection.get(
            "/live?status=live&org=Hololive&order=desc"
        );

        const data = response.data;

        const holoFilteredData = data.filter((stream: any) => {
            return (
                stream["channel"]["org"] === "Hololive" &&
                stream["topic_id"] !== "membersonly"
            );
        });

        streamDeck.settings.setGlobalSettings({
            streamTotal: holoFilteredData.length,
            page: 1,
            isRefresh,
        });

        fs.writeFileSync(
            `./holodex-data.json`,
            JSON.stringify(holoFilteredData, null, 4),
            "utf-8"
        );

        streamDeck.logger.info("Data written to json");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            streamDeck.logger.error(error.message);
        }
    }
}
