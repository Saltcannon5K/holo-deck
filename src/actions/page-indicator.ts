import streamDeck, {
    action,
    JsonObject,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.saltcannon5k.holo-deck.page-indicator" })
export class PageIndicator extends SingletonAction<JsonObject> {
    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        const { page } = await streamDeck.settings.getGlobalSettings();

        return ev.action.setTitle(page?.toString() ?? "");
    }
}
