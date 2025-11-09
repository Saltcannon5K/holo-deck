import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";
import { fetchLiveStreams } from "../holodex-api/fetch-live-streams";
import fs from "fs";
import { DataEvents } from "../utils/events-bus";

type FolderSettings = {
    holodexApiKey?: string;
    nimiMode?: boolean;
    baseSearch?: string;
};

@action({ UUID: "com.saltcannon5k.holo-deck.holo-folder" })
export class HoloFolder extends SingletonAction<JsonObject> {
    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        DataEvents.removeAllListeners("dataRefresh");

        return ev.action.setTitle(`Holo Deck`);
    }

    override async onKeyDown(ev: KeyDownEvent<FolderSettings>): Promise<void> {
        const holodexApiKey = ev.payload.settings.holodexApiKey ?? "";
        const nimiMode = ev.payload.settings.nimiMode ?? false;
        const baseSearch = ev.payload.settings.baseSearch ?? "all";

        fs.writeFileSync(
            `./ui-settings.json`,
            JSON.stringify({ holodexApiKey, nimiMode, baseSearch }),
            "utf-8"
        );

        await fetchLiveStreams(true);

        streamDeck.profiles.switchToProfile(
            ev.action.device.id,
            "holo-folder-profile"
        );
    }
}
