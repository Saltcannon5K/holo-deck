import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";
import { fetchLiveStreams } from "../holodex-api/fetch-live-streams";

@action({ UUID: "com.saltcannon5k.holo-deck.refresh-button" })
export class RefreshButton extends SingletonAction<JsonObject> {
    override onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> | void {
        return ev.action.setTitle("REFRESH");
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        await fetchLiveStreams(true);

        //streamDeck.settings.setGlobalSettings({ isRefresh: true, page: 1 });

        streamDeck.profiles.switchToProfile(ev.action.device.id, undefined);
    }
}
