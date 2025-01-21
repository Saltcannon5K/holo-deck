import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.saltcannon5k.holo-deck.page-down-button" })
export class PageDownButton extends SingletonAction<JsonObject> {
    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        const { page } = await streamDeck.settings.getGlobalSettings();

        return ev.action.setTitle(Number(page) > 1 ? "Page Down" : "---");
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        const { page, streamTotal } =
            await streamDeck.settings.getGlobalSettings();

        if (Number(page) > 1) {
            streamDeck.settings.setGlobalSettings({
                wasPageDown: true,
                page: Number(page) - 1,
                streamTotal,
            });

            streamDeck.profiles.switchToProfile(ev.action.device.id, undefined);
        }
    }
}
