import axios from "axios";
import fs from "fs";

const uiSettings = fs.readFileSync(`./ui-settings.json`, "utf-8");
const { holodexApiKey } = JSON.parse(uiSettings);

export const holodexApiConnection = axios.create({
    baseURL: "https://holodex.net/api/v2",
    headers: {
        "X-APIKEY": holodexApiKey,
    },
});
