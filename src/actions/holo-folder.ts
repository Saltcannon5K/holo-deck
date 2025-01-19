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
        const { isRefresh, page, wasPageUp, wasPageDown } =
            await streamDeck.settings.getGlobalSettings();

        if (isRefresh) {
            streamDeck.settings.setGlobalSettings({
                isRefresh: false,
                page: 1,
            });

            return streamDeck.profiles.switchToProfile(
                ev.action.device.id,
                "holo-folder-profile"
            );
        }

        if (wasPageDown) {
            streamDeck.settings.setGlobalSettings({
                page,
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
            });
            streamDeck.profiles.switchToProfile(
                ev.action.device.id,
                "holo-folder-profile"
            );
            return;
        }

        streamDeck.settings.setGlobalSettings({ page: 1 });

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
