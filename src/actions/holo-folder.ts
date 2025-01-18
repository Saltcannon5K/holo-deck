import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";
import { fetchLiveStreams } from "../holodex-api/fetch-live-streams";

@action({ UUID: "com.saltcannon5k.holo-deck.holo-folder" })
export class HoloFolder extends SingletonAction<JsonObject> {
    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        const { isRefresh } = await streamDeck.settings.getGlobalSettings();

        if (isRefresh) {
            streamDeck.settings.setGlobalSettings({ isRefresh: false });

            streamDeck.profiles.switchToProfile(
                ev.action.device.id,
                "holo-folder-profile"
            );
        }

        streamDeck.settings.setGlobalSettings({ isRefresh: false });

        return ev.action.setTitle(`Holo Deck`);
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        await fetchLiveStreams();

        streamDeck.profiles.switchToProfile(
            ev.action.device.id,
            "holo-folder-profile"
        );
    }
}
