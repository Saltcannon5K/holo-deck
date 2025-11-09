import streamDeck, { LogLevel } from "@elgato/streamdeck";
import * as dotenv from "dotenv";
import { HoloFolder } from "./actions/holo-folder";
import { BackButton } from "./actions/back-button";
import { RefreshButton } from "./actions/refresh-button";
import {
    StreamButton0,
    StreamButton1,
    StreamButton2,
    StreamButton3,
    StreamButton4,
    StreamButton5,
    StreamButton6,
    StreamButton7,
    StreamButton8,
    StreamButton9,
} from "./actions/stream-buttons";
import { PageDownButton, PageUpButton } from "./actions/pagination-buttons";
import { PageIndicator } from "./actions/page-indicator";

dotenv.config();

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
// streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the increment action.
streamDeck.actions.registerAction(new HoloFolder());
streamDeck.actions.registerAction(new BackButton());
streamDeck.actions.registerAction(new RefreshButton());
streamDeck.actions.registerAction(new PageUpButton());
streamDeck.actions.registerAction(new PageDownButton());
streamDeck.actions.registerAction(new PageIndicator());
streamDeck.actions.registerAction(new StreamButton0());
streamDeck.actions.registerAction(new StreamButton1());
streamDeck.actions.registerAction(new StreamButton2());
streamDeck.actions.registerAction(new StreamButton3());
streamDeck.actions.registerAction(new StreamButton4());
streamDeck.actions.registerAction(new StreamButton5());
streamDeck.actions.registerAction(new StreamButton6());
streamDeck.actions.registerAction(new StreamButton7());
streamDeck.actions.registerAction(new StreamButton8());
streamDeck.actions.registerAction(new StreamButton9());

// Finally, connect to the Stream Deck.
streamDeck.connect();
