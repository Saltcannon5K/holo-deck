import streamDeck, { Action, JsonObject } from "@elgato/streamdeck";
import { readStreamDataFromJson } from "../holodex-api/read-stream-data-from-json";

interface ActionWithImage<T> extends Action<JsonObject> {
    setImage: (image?: string, options?: any) => Promise<void>;
}

export async function updateStreamButtonData(
    actionInstance: Action<JsonObject>,
    buttonNumber: number
): Promise<void> {
    const { page } = await streamDeck.settings.getGlobalSettings();
    const instance = actionInstance as ActionWithImage<JsonObject>;
    const index = 0 + (Number(page) - 1) * 10;

    try {
        const streamData = await readStreamDataFromJson(index);
        const id = streamData?.id ?? null;

        instance.setSettings({ id: id ?? null });
        instance.setImage(streamData?.processedPhoto ?? "");
    } catch (error) {
        streamDeck.logger.error(
            `CATCH ALL ERROR - StreamButton${buttonNumber}: ${error}`
        );
        instance.showAlert();
    }
}
