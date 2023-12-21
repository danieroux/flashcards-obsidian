import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

const DEV_PLUGIN_LOCATION =
  "docs/test-vault/.obsidian/plugins/flashcards-obsidian/";

const PRODUCTION_PLUGIN_CONFIG = {
  input: "main.ts",
  output: {
    dir: "dist",
    sourcemap: "inline",
    sourcemapExcludeSources: true,
    format: "cjs",
    exports: "default",
  },
  external: ["obsidian"],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    copy({
      targets: [
        {
          src: "manifest.json",
          dest: "dist",
        },
      ],
    }),
  ],
};

const DEV_PLUGIN_CONFIG = {
  input: "main.ts",
  output: {
    dir: DEV_PLUGIN_LOCATION,
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
  },
  external: ["obsidian"],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    copy({
      targets: [
        {
          src: "manifest.json",
          dest: DEV_PLUGIN_LOCATION,
        },
      ],
    }),
  ],
};

let configs = [];

if (process.env.BUILD === "dev") {
  configs.push(DEV_PLUGIN_CONFIG);
} else if (process.env.BUILD === "production") {
  configs.push(PRODUCTION_PLUGIN_CONFIG);
} else {
  configs.push(DEV_PLUGIN_CONFIG);
}

export default configs;
