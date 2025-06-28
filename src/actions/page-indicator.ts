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
        const { page, streamTotal, isApiError } =
            await streamDeck.settings.getGlobalSettings();

        const maxPage = Math.ceil(Number(streamTotal) / 10);

        if (streamTotal)
            ev.action.setTitle(page ? `${page} of ${maxPage}` : "Page\nError");
        else if (isApiError) ev.action.setTitle("API\nError");
        else ev.action.setTitle("No\nstreams...");
    }
}
