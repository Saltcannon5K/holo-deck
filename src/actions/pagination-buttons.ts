import { action } from "@elgato/streamdeck";
import { PaginationButtonBase } from "../utils/pagination-button-base";

@action({ UUID: "com.saltcannon5k.holo-deck.page-down-button" })
export class PageDownButton extends PaginationButtonBase {}

@action({ UUID: "com.saltcannon5k.holo-deck.page-up-button" })
export class PageUpButton extends PaginationButtonBase {}
