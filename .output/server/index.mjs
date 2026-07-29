globalThis.__nitro_main__ = import.meta.url;
import "./_libs/unenv.mjs";

import { H as HookableCore } from "./_libs/hookable.mjs";
import { d as defineLazyEventHandler, H as HTTPError, a as H3Core } from "./_libs/h3.mjs";
import { c as FastResponse } from "./_libs/srvx.mjs";


import "./_libs/rou3.mjs";





function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const assets = {
  "/assets/deloittecyber-Dv5RKa3W.pdf": {
    "type": "application/pdf",
    "etag": '"1e078-CoJrjGSHa6CTNaxt2JpPZcdRILA"',
    "mtime": "2026-07-29T17:28:17.239Z",
    "size": 123e3,
    "path": "../public/assets/deloittecyber-Dv5RKa3W.pdf"
  },
  "/assets/deloittetechnology-Cae7DsEy.pdf": {
    "type": "application/pdf",
    "etag": '"1e0cf-QGQn+Uy1gGkJZIPJxCZFHq69wNM"',
    "mtime": "2026-07-29T17:28:17.239Z",
    "size": 123087,
    "path": "../public/assets/deloittetechnology-Cae7DsEy.pdf"
  },
  "/assets/deloittedata-DEIMQfyX.pdf": {
    "type": "application/pdf",
    "etag": '"1e100-YkY8oNCYyJchzQpkcrbXxAoNNtM"',
    "mtime": "2026-07-29T17:28:17.237Z",
    "size": 123136,
    "path": "../public/assets/deloittedata-DEIMQfyX.pdf"
  },
  "/assets/styles-DkQoEduf.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"17012-9G0aUnmYo6PEAUxWmTu8xnS8PHo"',
    "mtime": "2026-07-29T17:28:17.242Z",
    "size": 94226,
    "path": "../public/assets/styles-DkQoEduf.css"
  },
  "/certificates/agenticai.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.592Z",
    "size": 0,
    "path": "../public/certificates/agenticai.pdf"
  },
  "/assets/tatagenai-BGtwIYvt.pdf": {
    "type": "application/pdf",
    "etag": '"1c9f7-zQ0952TuecqsC15QS70vjNkTXN0"',
    "mtime": "2026-07-29T17:28:17.239Z",
    "size": 117239,
    "path": "../public/assets/tatagenai-BGtwIYvt.pdf"
  },
  "/certificates/aifoundation.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.592Z",
    "size": 0,
    "path": "../public/certificates/aifoundation.pdf"
  },
  "/assets/index-B88zFpn5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"55632-OmY+KwnO6j2ywaDGlPWp4uIWBAo"',
    "mtime": "2026-07-29T17:28:17.242Z",
    "size": 349746,
    "path": "../public/assets/index-B88zFpn5.js"
  },
  "/certificates/deloittecyber.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.594Z",
    "size": 0,
    "path": "../public/certificates/deloittecyber.pdf"
  },
  "/assets/microsoftaiskill-C_4RWZ6k.pdf": {
    "type": "application/pdf",
    "etag": '"27c91-8SYXVBbjWwywnCRJHkrTyfdj5Sc"',
    "mtime": "2026-07-29T17:28:17.239Z",
    "size": 162961,
    "path": "../public/assets/microsoftaiskill-C_4RWZ6k.pdf"
  },
  "/certificates/deloittedata.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.595Z",
    "size": 0,
    "path": "../public/certificates/deloittedata.pdf"
  },
  "/certificates/deloittetechnology.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.595Z",
    "size": 0,
    "path": "../public/certificates/deloittetechnology.pdf"
  },
  "/certificates/generativeai.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.596Z",
    "size": 0,
    "path": "../public/certificates/generativeai.pdf"
  },
  "/certificates/microsoftaiskill.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.597Z",
    "size": 0,
    "path": "../public/certificates/microsoftaiskill.pdf"
  },
  "/certificates/tatagenai.pdf": {
    "type": "application/pdf",
    "etag": '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"',
    "mtime": "2026-07-29T04:15:10.597Z",
    "size": 0,
    "path": "../public/certificates/tatagenai.pdf"
  },
  "/assets/agenticai-BrIUt0Z9.pdf": {
    "type": "application/pdf",
    "etag": '"8311b-thJdYIXkOAT6eVNmqEAbyWNmonU"',
    "mtime": "2026-07-29T17:28:17.242Z",
    "size": 536859,
    "path": "../public/assets/agenticai-BrIUt0Z9.pdf"
  },
  "/assets/aifoundation-DD4MoJEo.pdf": {
    "type": "application/pdf",
    "etag": '"8315b-N/D+h8FpuDLk6Gw+3MNbAoAKMd4"',
    "mtime": "2026-07-29T17:28:17.242Z",
    "size": 536923,
    "path": "../public/assets/aifoundation-DD4MoJEo.pdf"
  },
  "/assets/generativeai-BpZt_k9S.pdf": {
    "type": "application/pdf",
    "etag": '"d8022-VlvOkDwyK6KoI2s4MLfyTgW4byk"',
    "mtime": "2026-07-29T17:28:17.242Z",
    "size": 884770,
    "path": "../public/assets/generativeai-BpZt_k9S.pdf"
  },
  "/assets/index-DjZCIpB7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"9376b-hdu7ZePgqnjsFxevQs2Bu29RYTE"',
    "mtime": "2026-07-29T17:28:17.244Z",
    "size": 604011,
    "path": "../public/assets/index-DjZCIpB7.js"
  },
  "/image.png": {
    "type": "image/png",
    "etag": '"177d99-4qZEyQltUPkM5GkTvdWrZSjC0VA"',
    "mtime": "2026-07-28T15:26:58.836Z",
    "size": 1539481,
    "path": "../public/image.png"
  }
};
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key, value);
  }
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_7Eo1ar = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_7Eo1ar };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function useNitroHooks() {
  const nitroApp = useNitroApp();
  const hooks = nitroApp.hooks;
  if (hooks) {
    return hooks;
  }
  return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function createHandler(hooks) {
  const nitroApp = useNitroApp();
  const nitroHooks = useNitroHooks();
  return {
    async fetch(request, env, context) {
      globalThis.__env__ = env;
      augmentReq(request, {
        env,
        context
      });
      const ctxExt = {};
      const url = new URL(request.url);
      if (hooks.fetch) {
        const res = await hooks.fetch(request, env, context, url, ctxExt);
        if (res) {
          return res;
        }
      }
      return await nitroApp.fetch(request);
    },
    scheduled(controller, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
        controller,
        env,
        context
      }) || Promise.resolve());
    },
    email(message, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:email", {
        message,
        event: message,
        env,
        context
      }) || Promise.resolve());
    },
    queue(batch, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
        batch,
        event: batch,
        env,
        context
      }) || Promise.resolve());
    },
    tail(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
        traces,
        env,
        context
      }) || Promise.resolve());
    },
    trace(traces, env, context) {
      globalThis.__env__ = env;
      context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
        traces,
        env,
        context
      }) || Promise.resolve());
    }
  };
}
function augmentReq(cfReq, ctx) {
  const req = cfReq;
  req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
  req.runtime ??= { name: "cloudflare" };
  req.runtime.cloudflare = {
    ...req.runtime.cloudflare,
    ...ctx
  };
  req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
const cloudflareModule = createHandler({ fetch(cfRequest, env, context, url) {
  if (env.ASSETS && isPublicAssetURL(url.pathname)) {
    return env.ASSETS.fetch(cfRequest);
  }
} });
export {
  cloudflareModule as default
};
