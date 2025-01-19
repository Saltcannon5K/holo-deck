import streamDeck, { LogLevel } from "@elgato/streamdeck";
import * as dotenv from "dotenv";
import { HoloFolder } from "./actions/holo-folder";
import { BackButton } from "./actions/back-button";
import { RefreshButton } from "./actions/refresh-button";
import { StreamButton0 } from "./actions/stream-button-0";
import { StreamButton1 } from "./actions/stream-button-1";
import { StreamButton2 } from "./actions/stream-button-2";
import { StreamButton3 } from "./actions/stream-button-3";
import { StreamButton4 } from "./actions/stream-button-4";
import { StreamButton5 } from "./actions/stream-button-5";
import { StreamButton6 } from "./actions/stream-button-6";
import { StreamButton7 } from "./actions/stream-button-7";
import { StreamButton8 } from "./actions/stream-button-8";
import { StreamButton9 } from "./actions/stream-button-9";
import { StreamButton10 } from "./actions/stream-button-10";
import { StreamButton11 } from "./actions/stream-button-11";
import { StreamButton12 } from "./actions/stream-button-12";
import { PageUpButton } from "./actions/page-up-button";
import { PageDownButton } from "./actions/page-down-button";
import { PageIndicator } from "./actions/page-indicator";

dotenv.config();

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

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
streamDeck.actions.registerAction(new StreamButton10());
streamDeck.actions.registerAction(new StreamButton11());
streamDeck.actions.registerAction(new StreamButton12());

// Finally, connect to the Stream Deck.
streamDeck.connect();
