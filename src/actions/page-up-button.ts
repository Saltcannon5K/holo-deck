import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.saltcannon5k.holo-deck.page-up-button" })
export class PageUpButton extends SingletonAction<JsonObject> {
    override onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> | void {
        return ev.action.setTitle("Page Up");
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        const { page } = await streamDeck.settings.getGlobalSettings();

        streamDeck.settings.setGlobalSettings({ page: Number(page) + 1 });

        streamDeck.profiles.switchToProfile(ev.action.device.id, undefined);
    }
}
