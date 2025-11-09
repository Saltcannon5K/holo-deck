import streamDeck, {
    action,
    Action,
    JsonObject,
    SingletonAction,
    WillAppearEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import { DataEvents } from "../utils/events-bus";

interface ActionWithTitle<T> extends Action<JsonObject> {
    setTitle: (title?: string, options?: any) => Promise<void>;
}

@action({ UUID: "com.saltcannon5k.holo-deck.page-indicator" })
export class PageIndicator extends SingletonAction<JsonObject> {
    private onDataRefresh?: any;

    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        this.setPageIndicator(ev.action);

        this.onDataRefresh = () => {
            this.setPageIndicator(ev.action);
        };

        DataEvents.on("dataRefresh", () => {
            this.onDataRefresh();
        });
    }

    private async setPageIndicator(actionInstance: Action<JsonObject>) {
        const { page, streamTotal, isApiError } =
            await streamDeck.settings.getGlobalSettings();

        const instance = actionInstance as ActionWithTitle<JsonObject>;

        const maxPage = Math.ceil(Number(streamTotal) / 10);

        if (streamTotal)
            instance.setTitle(page ? `${page} of ${maxPage}` : "Page\nError");
        else if (isApiError) instance.setTitle("API\nError");
        else instance.setTitle("No\nstreams...");
    }

    override onWillDisappear(
        ev: WillDisappearEvent<JsonObject>
    ): Promise<void> | void {
        if (this.onDataRefresh) {
            DataEvents.off("dataRefresh", this.onDataRefresh);
            this.onDataRefresh = undefined;
        }
    }
}
