import streamDeck, {
    action,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";
import { readStreamDataFromJson } from "../holodex-api/read-stream-data-from-json";

@action({ UUID: "com.saltcannon5k.holo-deck.stream-button-8" })
export class StreamButton8 extends SingletonAction<StreamSettings> {
    override async onWillAppear(
        ev: WillAppearEvent<StreamSettings>
    ): Promise<void> {
        ev.action.setSettings({ id: null });

        const streamData = await readStreamDataFromJson(8);

        const id = streamData?.id ?? null;

        if (id) {
            ev.action.setSettings({ id });
        }

        return ev.action.setImage(streamData?.processedPhoto ?? "");
    }

    override onKeyDown(ev: KeyDownEvent<StreamSettings>): void {
        const id = ev.payload.settings.id ?? null;

        if (id) {
            streamDeck.system.openUrl(`https://www.youtube.com/watch?v=${id}`);
        }
    }
}

type StreamSettings = {
    id?: string;
};
