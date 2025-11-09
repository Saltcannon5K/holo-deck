import streamDeck from "@elgato/streamdeck";
import { holodexApiConnection } from "./holodex-api-connection";
import axios from "axios";
import fs from "fs";
import { DataEvents } from "../utils/events-bus";

export async function fetchLiveStreams(
    manualRefresh: boolean = false
): Promise<void> {
    try {
        const { page } = await streamDeck.settings.getGlobalSettings();

        const uiSettings = fs.readFileSync(`./ui-settings.json`, "utf-8");
        const { nimiMode, baseSearch } = JSON.parse(uiSettings);

        const response = await holodexApiConnection.get(
            "/live?status=live,upcoming&max_upcoming_hours=1&org=Hololive&order=desc"
        );

        const data = response.data;

        // filter out members only and third party colabs
        let holoFilteredData = data.filter((stream: any) => {
            return (
                stream["channel"]["org"] === "Hololive" &&
                stream["topic_id"] !== "membersonly"
            );
        });

        // filter based on the Base Search radio component for holo-folder
        if (baseSearch === "holostarsOnly") {
            holoFilteredData = holoFilteredData.filter((stream: any) => {
                return stream["channel"]["suborg"]
                    .toLowerCase()
                    .includes("holostars");
            });
        } else if (baseSearch === "hololiveOnly") {
            holoFilteredData = holoFilteredData.filter((stream: any) => {
                return !stream["channel"]["suborg"]
                    .toLowerCase()
                    .includes("holostars");
            });
        }

        if (nimiMode) {
            const nimiResponse = await holodexApiConnection.get(
                "/live?status=live,upcoming&max_upcoming_hours=1&channel_id=UCIfAvpeIWGHb0duCkMkmm2Q" // browseId
            );

            const nimiData = nimiResponse.data;

            holoFilteredData = holoFilteredData
                .concat(nimiData)
                .sort((a: any, b: any) => {
                    a["available_at"] < b["available_at"];
                });
        }

        streamDeck.settings.setGlobalSettings({
            streamTotal: holoFilteredData.length,
            page: manualRefresh ? 1 : page,
        });

        fs.writeFileSync(
            `./holodex-data.json`,
            JSON.stringify(holoFilteredData, null, 4),
            "utf-8"
        );

        streamDeck.logger.info("Data written to json");

        DataEvents.emit("dataRefresh");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            streamDeck.logger.error(`AXIOS ERROR: ${error.message}`);
        } else {
            streamDeck.logger.error(`CATCH ALL ERROR: ${error}`);
        }

        fs.writeFileSync(`./holodex-data.json`, JSON.stringify([{}]), "utf-8");

        streamDeck.settings.setGlobalSettings({
            isApiError: true,
            page: 1,
            streamTotal: 0,
        });
    }
}
