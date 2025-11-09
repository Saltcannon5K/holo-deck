import streamDeck, {
    Action,
    JsonObject,
    KeyDownEvent,
    SingletonAction,
    WillAppearEvent,
    WillDisappearEvent,
} from "@elgato/streamdeck";
import { DataEvents } from "./events-bus";

interface ActionWithTitle<T> extends Action<JsonObject> {
    setTitle: (title?: string, options?: any) => Promise<void>;
}

export class PaginationButtonBase extends SingletonAction<JsonObject> {
    protected onDataRefresh?: any;
    protected paginationDirection: string | null = null;
    protected capacity: number | null = null;

    override async onWillAppear(
        ev: WillAppearEvent<JsonObject>
    ): Promise<void> {
        this.updatePageButtonData(ev.action);

        this.onDataRefresh = () => {
            this.updatePageButtonData(ev.action);
        };

        DataEvents.on("dataRefresh", () => {
            this.onDataRefresh();
        });
    }

    override onWillDisappear(
        ev: WillDisappearEvent<JsonObject>
    ): Promise<void> | void {
        if (this.onDataRefresh) {
            DataEvents.off("dataRefresh", this.onDataRefresh);
            this.onDataRefresh = undefined;
        }
    }

    override async onKeyDown(ev: KeyDownEvent<JsonObject>): Promise<void> {
        const { page, streamTotal } =
            await streamDeck.settings.getGlobalSettings();

        if (this.paginationDirection === "down") {
            if (Number(page) > 1) {
                streamDeck.settings.setGlobalSettings({
                    page: Number(page) - 1,
                    streamTotal,
                });

                DataEvents.emit("dataRefresh");
            }
        } else if (this.paginationDirection === "up") {
            if (this.capacity && this.capacity < Number(streamTotal)) {
                streamDeck.settings.setGlobalSettings({
                    page: Number(page) + 1,
                    streamTotal,
                });

                DataEvents.emit("dataRefresh");
            }
        }
    }

    protected async updatePageButtonData(actionInstance: Action<JsonObject>) {
        const { page, streamTotal } =
            await streamDeck.settings.getGlobalSettings();
        const instance = actionInstance as ActionWithTitle<JsonObject>;

        const uuidParts = instance.manifestId.split(".");
        const key = uuidParts[uuidParts.length - 1];

        if (key === "page-down-button") {
            this.paginationDirection = "down";
            return instance.setTitle(Number(page) > 1 ? "Page Down" : "---");
        } else if (key === "page-up-button") {
            this.paginationDirection = "up";
            this.capacity = Number(page) * 10;
            return instance.setTitle(
                this.capacity < Number(streamTotal) ? "Page Up" : "---"
            );
        }
    }
}
