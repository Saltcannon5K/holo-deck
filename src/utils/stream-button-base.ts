import streamDeck, {
    Action,
    JsonObject,
    SingletonAction,
    WillAppearEvent,
    KeyDownEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import { getIndexFromUUID } from "./index-mapper";
import { DataEvents } from "./events-bus";
import { readStreamDataFromJson } from "../holodex-api/read-stream-data-from-json";

type StreamSettings = {
    id?: string;
};

interface ActionWithMethods<T> extends Action<JsonObject> {
    setImage: (image?: string) => Promise<void>;
    setTitle: (title?: string) => Promise<void>;
}

export class StreamButtonBase extends SingletonAction<StreamSettings> {
    protected onDataRefresh?: any;

    override async onWillAppear(
        ev: WillAppearEvent<StreamSettings>
    ): Promise<void> {
        const actionInstance = ev.action;
        const buttonIndex = getIndexFromUUID(actionInstance.manifestId);

        this.updateStreamButtonData(actionInstance, buttonIndex);

        this.onDataRefresh = () => {
            this.updateStreamButtonData(actionInstance, buttonIndex);
        };

        DataEvents.on("dataRefresh", () => {
            this.onDataRefresh();
            streamDeck.logger.info(
                `dataRefresh event triggered: Button ${buttonIndex}`
            );
        });
    }

    override onKeyDown(ev: KeyDownEvent<StreamSettings>): Promise<void> | void {
        const id = ev.payload.settings.id ?? null;

        if (id) {
            streamDeck.system.openUrl(`https://www.youtube.com/watch?v=${id}`);
        }
    }

    override onWillDisappear(
        ev: WillDisappearEvent<StreamSettings>
    ): Promise<void> | void {
        if (this.onDataRefresh) {
            DataEvents.off("dataRefresh", this.onDataRefresh);
            this.onDataRefresh = undefined;
        }
    }

    async updateStreamButtonData(
        actionInstance: Action<JsonObject>,
        buttonIndex: number
    ): Promise<void> {
        const instance = actionInstance as ActionWithMethods<JsonObject>;

        try {
            const { page } = await streamDeck.settings.getGlobalSettings();
            const jsonIndex = buttonIndex + (Number(page) - 1) * 10;
            const streamData = await readStreamDataFromJson(jsonIndex);
            const id = streamData?.id ?? null;

            instance.setSettings({ id: id ?? null });
            instance.setImage(streamData?.processedPhoto ?? "");
            instance.setTitle("");
        } catch (error) {
            streamDeck.logger.error(
                `CATCH ALL ERROR - StreamButton${buttonIndex}: ${error}`
            );
            instance.showAlert();
        }
    }
}
