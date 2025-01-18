import axios from "axios";

export const holodexApiConnection = axios.create({
    baseURL: "https://holodex.net/api/v2",
    headers: {
        "X-APIKEY": process.env.HOLODEX_API_KEY,
    },
});
