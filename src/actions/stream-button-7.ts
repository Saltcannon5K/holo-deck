import streamDeck, {
    action,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";
import { readStreamDataFromJson } from "../holodex-api/read-stream-data-from-json";

@action({ UUID: "com.saltcannon5k.holo-deck.stream-button-7" })
export class StreamButton7 extends SingletonAction<StreamSettings> {
    override async onWillAppear(
        ev: WillAppearEvent<StreamSettings>
    ): Promise<void> {
        const { page } = await streamDeck.settings.getGlobalSettings();

        const index = 7 + (Number(page) - 1) * 10;

        const streamData = await readStreamDataFromJson(index);

        const id = streamData?.id ?? null;

        ev.action.setSettings({ id: id ?? null });

        ev.action.setTitle(id ? "" : index.toString());

        ev.action.setImage(streamData?.processedPhoto ?? "");
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
