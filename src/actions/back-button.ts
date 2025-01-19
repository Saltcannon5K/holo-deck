import streamDeck, {
    action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
} from "@elgato/streamdeck";

@action({ UUID: "com.saltcannon5k.holo-deck.back-button" })
export class BackButton extends SingletonAction<JsonObject> {
    override onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> | void {
        return ev.action.setTitle("BACK");
    }

    override onKeyDown(ev: KeyDownEvent<JsonObject>) {
        streamDeck.settings.setGlobalSettings({ page: 0 });

        streamDeck.profiles.switchToProfile(ev.action.device.id, undefined);
    }
}
