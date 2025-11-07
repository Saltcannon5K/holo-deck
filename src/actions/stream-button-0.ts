import streamDeck, {
    action,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import fs from "fs";
import { updateStreamButtonData } from "../utils/update-stream-button-data";

@action({ UUID: "com.saltcannon5k.holo-deck.stream-button-0" })
export class StreamButton0 extends SingletonAction<StreamSettings> {
    private buttonNumber: number = 0;
    private jsonWatcher: fs.FSWatcher | null = null;

    override async onWillAppear(
        ev: WillAppearEvent<StreamSettings>
    ): Promise<void> {
        const actionIntance = ev.action;
        updateStreamButtonData(actionIntance, this.buttonNumber);

        if (!this.jsonWatcher) {
            this.jsonWatcher = fs.watch(`./holodex-data.json`, (eventType) => {
                if (eventType === "change") {
                    setTimeout(() => {
                        updateStreamButtonData(
                            actionIntance,
                            this.buttonNumber
                        );
                    });
                }
            });
        }
    }

    override onKeyDown(ev: KeyDownEvent<StreamSettings>): void {
        const id = ev.payload.settings.id ?? null;

        if (id) {
            streamDeck.system.openUrl(`https://www.youtube.com/watch?v=${id}`);
        }
    }

    override onWillDisappear(
        ev: WillDisappearEvent<StreamSettings>
    ): Promise<void> | void {
        if (this.jsonWatcher) {
            this.jsonWatcher.close();
            this.jsonWatcher = null;
        }
    }
}

type StreamSettings = {
    id?: string;
};
