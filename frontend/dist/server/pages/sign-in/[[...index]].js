const CHUNK_PUBLIC_PATH = "server/pages/sign-in/[[...index]].js";
const runtime = require("../../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/node_modules_34b5f7._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__84fff6._.js");
runtime.loadChunk("server/chunks/ssr/styles_globals_ff5908.css");
runtime.loadChunk("server/chunks/ssr/dd92d_modules_@clerk_nextjs_dist_esm_app-router_client_keyless-creator-reader_993b1a.js");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/pages/sign-in/[[...index]].tsx [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/pages/_document.tsx [ssr] (ecmascript)\", INNER_APP => \"[project]/pages/_app.tsx [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
