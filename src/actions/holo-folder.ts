import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";
import { fetchLiveStreams } from "../holodex-api/fetch-live-streams";
import fs from "fs";

@action({ UUID: "com.saltcannon5k.holo-deck.holo-folder" })
export class HoloFolder extends SingletonAction<JsonObject> {
    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        const {
            isRefresh,
            page,
            wasPageUp,
            wasPageDown,
            streamTotal,
            isApiError,
        } = await streamDeck.settings.getGlobalSettings();

        if (isRefresh) {
            streamDeck.settings.setGlobalSettings({
                isRefresh: false,
                page: 1,
                streamTotal,
                isApiError,
            });

            return streamDeck.profiles.switchToProfile(
                ev.action.device.id,
                "holo-folder-profile"
            );
        }

        if (wasPageDown) {
            streamDeck.settings.setGlobalSettings({
                page,
                streamTotal,
            });
            streamDeck.profiles.switchToProfile(
                ev.action.device.id,
                "holo-folder-profile"
            );
            return;
        }

        if (wasPageUp) {
            streamDeck.settings.setGlobalSettings({
                page,
                streamTotal,
            });
            streamDeck.profiles.switchToProfile(
                ev.action.device.id,
                "holo-folder-profile"
            );
            return;
        }

        return ev.action.setTitle(`Holo Deck`);
    }

    override async onKeyDown(ev: KeyDownEvent<FolderSettings>): Promise<void> {
        const holodexApiKey = ev.payload.settings.holodexApiKey ?? "";

        fs.writeFileSync(
            `./holodex-api-key.json`,
            JSON.stringify({ holodexApiKey }),
            "utf-8"
        );

        await fetchLiveStreams();

        //streamDeck.settings.setGlobalSettings({ page: 1 });

        streamDeck.profiles.switchToProfile(
            ev.action.device.id,
            "holo-folder-profile"
        );
    }
}

type FolderSettings = {
    holodexApiKey?: string;
};
