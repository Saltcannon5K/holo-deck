import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import * as dotenv from "dotenv";
import path from "node:path";
import url from "node:url";

dotenv.config();

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "com.saltcannon5k.holo-deck.sdPlugin";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: "src/plugin.ts",
    output: {
        file: `${sdPlugin}/bin/plugin.js`,
        sourcemap: isWatching,
        sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
            return url.pathToFileURL(
                path.resolve(path.dirname(sourcemapPath), relativeSourcePath)
            ).href;
        },
    },
    plugins: [
        {
            name: "watch-externals",
            buildStart: function () {
                this.addWatchFile(`${sdPlugin}/manifest.json`);
            },
        },
        json(),
        replace({
            "process.env.HOLODEX_API_KEY": JSON.stringify(
                process.env.HOLODEX_API_KEY
            ),
            preventAssignment: true,
        }),
        typescript({
            mapRoot: isWatching ? "./" : undefined,
        }),
        nodeResolve({
            browser: false,
            exportConditions: ["node"],
            preferBuiltins: true,
        }),
        commonjs(),
        !isWatching && terser(),
        {
            name: "emit-module-package-file",
            generateBundle() {
                this.emitFile({
                    fileName: "package.json",
                    source: `{ "type": "module" }`,
                    type: "asset",
                });
            },
        },
    ],
};

export default config;
