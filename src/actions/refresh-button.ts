import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import { fetchLiveStreams } from "../holodex-api/fetch-live-streams";

@action({ UUID: "com.saltcannon5k.holo-deck.refresh-button" })
export class RefreshButton extends SingletonAction<JsonObject> {
    private timer: NodeJS.Timeout | null = null;

    override onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> | void {
        this.timer = setInterval(async () => {
            streamDeck.logger.info("Interval refresh triggered");
            await fetchLiveStreams();
        }, 5 * 60 * 1000); // 5 minute(s)

        return ev.action.setTitle("REFRESH");
    }

    override onWillDisappear(
        ev: WillDisappearEvent<JsonObject>
    ): Promise<void> | void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        await fetchLiveStreams(true);
    }
}
