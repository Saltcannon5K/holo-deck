import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.saltcannon5k.holo-deck.page-up-button" })
export class PageUpButton extends SingletonAction<JsonObject> {
    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        const { page, streamTotal } =
            await streamDeck.settings.getGlobalSettings();

        const capacity = Number(page) * 10;

        return ev.action.setTitle(
            capacity < Number(streamTotal) ? "Page Up" : "---"
        );
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        const { page, streamTotal } =
            await streamDeck.settings.getGlobalSettings();

        const capacity = Number(page) * 10;

        if (capacity < Number(streamTotal)) {
            streamDeck.settings.setGlobalSettings({
                wasPageUp: true,
                page: Number(page) + 1,
                streamTotal,
            });

            streamDeck.profiles.switchToProfile(ev.action.device.id, undefined);
        }
    }
}
