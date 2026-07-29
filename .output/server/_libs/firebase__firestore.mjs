import { g as getApp, _ as _getProvider, a as _isFirebaseServerApp, b as _registerComponent, r as registerVersion, S as SDK_VERSION } from "./firebase__app.mjs";
import { a as Component } from "./firebase__component.mjs";


import { a as getModularInstance, F as FirebaseError, c as getDefaultEmulatorHostnameAndPort, e as isCloudWorkstation, p as pingServer, d as deepEqual, f as createMockUserToken, h as isSafari, j as getUA } from "./firebase__util.mjs";
import { I as Integer, g as getStatEventTarget, E as Event, X as XhrIo, a as EventType, b as ErrorCode, W as WebChannel, c as createWebChannelTransport, S as Stat } from "./firebase__webchannel-wrapper.mjs";
import { L as Logger, a as LogLevel } from "./firebase__logger.mjs";
import { R as RE2JS } from "./re2js.mjs";
class User {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return null != this.uid;
  }
  /**
   * Returns a key representing this user, suitable for inclusion in a
   * dictionary.
   */
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
}
User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
let v = "12.15.0";
function __PRIVATE_setSDKVersion(e) {
  v = e;
}
const S = new Logger("@firebase/firestore");
function __PRIVATE_getLogLevel() {
  return S.logLevel;
}
function __PRIVATE_logDebug(e, ...t) {
  if (S.logLevel <= LogLevel.DEBUG) {
    const n = t.map(__PRIVATE_argToString);
    S.debug(`Firestore (${v}): ${e}`, ...n);
  }
}
function __PRIVATE_logError(e, ...t) {
  if (S.logLevel <= LogLevel.ERROR) {
    const n = t.map(__PRIVATE_argToString);
    S.error(`Firestore (${v}): ${e}`, ...n);
  }
}
function __PRIVATE_logWarn(e, ...t) {
  if (S.logLevel <= LogLevel.WARN) {
    const n = t.map(__PRIVATE_argToString);
    S.warn(`Firestore (${v}): ${e}`, ...n);
  }
}
function __PRIVATE_argToString(e) {
  if ("string" == typeof e) return e;
  try {
    return (function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    })(e);
  } catch (t) {
    return e;
  }
}
function fail(e, t, n) {
  let r = "Unexpected state";
  "string" == typeof t ? r = t : n = t, __PRIVATE__fail(e, r, n);
}
function __PRIVATE__fail(e, t, n) {
  let r = `FIRESTORE (${v}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
  if (void 0 !== n) try {
    r += " CONTEXT: " + JSON.stringify(n);
  } catch (e2) {
    r += " CONTEXT: " + n;
  }
  throw __PRIVATE_logError(r), new Error(r);
}
function __PRIVATE_hardAssert(e, t, n, r) {
  let i = "Unexpected state";
  "string" == typeof n ? i = n : r = n, e || __PRIVATE__fail(t, i, r);
}
function __PRIVATE_debugCast(e, t) {
  return e;
}
const D = {
  // Causes are copied from:
  // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
  /** Not an error; returned on success. */
  OK: "ok",
  /** The operation was cancelled (typically by the caller). */
  CANCELLED: "cancelled",
  /** Unknown error or an error from a different error domain. */
  UNKNOWN: "unknown",
  /**
   * Client specified an invalid argument. Note that this differs from
   * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
   * problematic regardless of the state of the system (e.g., a malformed file
   * name).
   */
  INVALID_ARGUMENT: "invalid-argument",
  /**
   * Deadline expired before operation could complete. For operations that
   * change the state of the system, this error may be returned even if the
   * operation has completed successfully. For example, a successful response
   * from a server could have been delayed long enough for the deadline to
   * expire.
   */
  DEADLINE_EXCEEDED: "deadline-exceeded",
  /** Some requested entity (e.g., file or directory) was not found. */
  NOT_FOUND: "not-found",
  /**
   * Some entity that we attempted to create (e.g., file or directory) already
   * exists.
   */
  ALREADY_EXISTS: "already-exists",
  /**
   * The caller does not have permission to execute the specified operation.
   * PERMISSION_DENIED must not be used for rejections caused by exhausting
   * some resource (use RESOURCE_EXHAUSTED instead for those errors).
   * PERMISSION_DENIED must not be used if the caller cannot be identified
   * (use UNAUTHENTICATED instead for those errors).
   */
  PERMISSION_DENIED: "permission-denied",
  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  UNAUTHENTICATED: "unauthenticated",
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
   * entire file system is out of space.
   */
  RESOURCE_EXHAUSTED: "resource-exhausted",
  /**
   * Operation was rejected because the system is not in a state required for
   * the operation's execution. For example, directory to be deleted may be
   * non-empty, an rmdir operation is applied to a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *  (a) Use UNAVAILABLE if the client can retry just the failing call.
   *  (b) Use ABORTED if the client should retry at a higher-level
   *      (e.g., restarting a read-modify-write sequence).
   *  (c) Use FAILED_PRECONDITION if the client should not retry until
   *      the system state has been explicitly fixed. E.g., if an "rmdir"
   *      fails because the directory is non-empty, FAILED_PRECONDITION
   *      should be returned since the client should not retry unless
   *      they have first fixed up the directory by deleting files from it.
   *  (d) Use FAILED_PRECONDITION if the client performs conditional
   *      REST Get/Update/Delete on a resource and the resource on the
   *      server does not match the condition. E.g., conflicting
   *      read-modify-write on the same resource.
   */
  FAILED_PRECONDITION: "failed-precondition",
  /**
   * The operation was aborted, typically due to a concurrency issue like
   * sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  ABORTED: "aborted",
  /**
   * Operation was attempted past the valid range. E.g., seeking or reading
   * past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
   * if the system state changes. For example, a 32-bit file system will
   * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
   * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
   * an offset past the current file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
   * when it applies so that callers who are iterating through a space can
   * easily look for an OUT_OF_RANGE error to detect when they are done.
   */
  OUT_OF_RANGE: "out-of-range",
  /** Operation is not implemented or not supported/enabled in this service. */
  UNIMPLEMENTED: "unimplemented",
  /**
   * Internal errors. Means some invariants expected by underlying System has
   * been broken. If you see one of these errors, Something is very broken.
   */
  INTERNAL: "internal",
  /**
   * The service is currently unavailable. This is a most likely a transient
   * condition and may be corrected by retrying with a backoff.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  UNAVAILABLE: "unavailable",
  /** Unrecoverable data loss or corruption. */
  DATA_LOSS: "data-loss"
};
class FirestoreError extends FirebaseError {
  /** @hideconstructor */
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, // HACK: We write a toString property directly because Error is not a real
    // class and so inheritance does not work correctly. We could alternatively
    // do the same "back-door inheritance" trick that FirebaseError does.
    this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
}
class __PRIVATE_Deferred {
  constructor() {
    this.promise = new Promise(((e, t) => {
      this.resolve = e, this.reject = t;
    }));
  }
}
class __PRIVATE_OAuthToken {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
  }
}
class __PRIVATE_EmptyAuthCredentialsProvider {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable((() => t(User.UNAUTHENTICATED)));
  }
  shutdown() {
  }
}
class __PRIVATE_EmulatorAuthCredentialsProvider {
  constructor(e) {
    this.token = e, /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t) {
    this.changeListener = t, // Fire with initial user.
    e.enqueueRetryable((() => t(this.token.user)));
  }
  shutdown() {
    this.changeListener = null;
  }
}
class __PRIVATE_FirebaseAuthCredentialsProvider {
  constructor(e) {
    this.t = e, /** Tracks the current User. */
    this.currentUser = User.UNAUTHENTICATED, /**
     * Counter used to detect if the token changed while a getToken request was
     * outstanding.
     */
    this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t) {
    __PRIVATE_hardAssert(void 0 === this.o, 42304);
    let n = this.i;
    const __PRIVATE_guardedChangeListener = (e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve();
    let r = new __PRIVATE_Deferred();
    this.o = () => {
      this.i++, this.currentUser = this.u(), r.resolve(), r = new __PRIVATE_Deferred(), e.enqueueRetryable((() => __PRIVATE_guardedChangeListener(this.currentUser)));
    };
    const __PRIVATE_awaitNextToken = () => {
      const t2 = r;
      e.enqueueRetryable((async () => {
        await t2.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
      }));
    }, __PRIVATE_registerAuth = (e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.o && (this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken());
    };
    this.t.onInit(((e2) => __PRIVATE_registerAuth(e2))), // Our users can initialize Auth right after Firestore, so we give it
    // a chance to register itself with the component framework before we
    // determine whether to start up in unauthenticated mode.
    setTimeout((() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (
          // If auth is still not available, proceed with `null` user
          (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r.resolve(), r = new __PRIVATE_Deferred())
        );
      }
    }), 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then(((t2) => (
      // Cancel the request since the token changed while the request was
      // outstanding so the response is potentially for a previous user (which
      // user, we can't be sure).
      this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert("string" == typeof t2.accessToken, 31837, {
        l: t2
      }), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null
    ))) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
  }
  // Auth.getUid() can return null even with a user logged in. It is because
  // getUid() is synchronous, but the auth code populating Uid is asynchronous.
  // This method should only be called in the AuthTokenListener callback
  // to guarantee to get the actual user.
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(null === e || "string" == typeof e, 2055, {
      h: e
    }), new User(e);
  }
}
class __PRIVATE_FirstPartyToken {
  constructor(e, t, n) {
    this.T = e, this.P = t, this.R = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.I = /* @__PURE__ */ new Map();
  }
  /**
   * Gets an authorization token, using a provided factory function, or return
   * null.
   */
  A() {
    return this.R ? this.R() : null;
  }
  get headers() {
    this.I.set("X-Goog-AuthUser", this.T);
    const e = this.A();
    return e && this.I.set("Authorization", e), this.P && this.I.set("X-Goog-Iam-Authorization-Token", this.P), this.I;
  }
}
class __PRIVATE_FirstPartyAuthCredentialsProvider {
  constructor(e, t, n) {
    this.T = e, this.P = t, this.R = n;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.T, this.P, this.R));
  }
  start(e, t) {
    e.enqueueRetryable((() => t(User.FIRST_PARTY)));
  }
  shutdown() {
  }
  invalidateToken() {
  }
}
class AppCheckToken {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
}
class __PRIVATE_FirebaseAppCheckTokenProvider {
  constructor(t, n) {
    this.V = n, this.forceRefresh = false, this.appCheck = null, this.m = null, this.p = null, _isFirebaseServerApp(t) && t.settings.appCheckToken && (this.p = t.settings.appCheckToken);
  }
  start(e, t) {
    __PRIVATE_hardAssert(void 0 === this.o, 3512);
    const onTokenChanged = (e2) => {
      null != e2.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n = e2.token !== this.m;
      return this.m = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
    };
    this.o = (t2) => {
      e.enqueueRetryable((() => onTokenChanged(t2)));
    };
    const __PRIVATE_registerAppCheck = (e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.o && this.appCheck.addTokenListener(this.o);
    };
    this.V.onInit(((e2) => __PRIVATE_registerAppCheck(e2))), // Our users can initialize AppCheck after Firestore, so we give it
    // a chance to register itself with the component framework.
    setTimeout((() => {
      if (!this.appCheck) {
        const e2 = this.V.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : (
          // If AppCheck is still not available, proceed without it.
          __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
        );
      }
    }), 0);
  }
  getToken() {
    if (this.p) return Promise.resolve(new AppCheckToken(this.p));
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then(((e2) => e2 ? (__PRIVATE_hardAssert("string" == typeof e2.token, 44558, {
      tokenResult: e2
    }), this.m = e2.token, new AppCheckToken(e2.token)) : null)) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
  }
}
function __PRIVATE_randomBytes(e) {
  const t = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto)
  ), n = new Uint8Array(e);
  if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
  else
    for (let t2 = 0; t2 < e; t2++) n[t2] = Math.floor(256 * Math.random());
  return n;
}
class __PRIVATE_AutoId {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(256 / 62);
    let n = "";
    for (; n.length < 20; ) {
      const r = __PRIVATE_randomBytes(40);
      for (let i = 0; i < r.length; ++i)
        n.length < 20 && r[i] < t && (n += e.charAt(r[i] % 62));
    }
    return n;
  }
}
function __PRIVATE_primitiveComparator(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function __PRIVATE_compareUtf8Strings(e, t) {
  const n = Math.min(e.length, t.length);
  for (let r = 0; r < n; r++) {
    const n2 = e.charAt(r), i = t.charAt(r);
    if (n2 !== i) return __PRIVATE_isSurrogate(n2) === __PRIVATE_isSurrogate(i) ? __PRIVATE_primitiveComparator(n2, i) : __PRIVATE_isSurrogate(n2) ? 1 : -1;
  }
  return __PRIVATE_primitiveComparator(e.length, t.length);
}
const x = 55296, C = 57343;
function __PRIVATE_isSurrogate(e) {
  const t = e.charCodeAt(0);
  return t >= x && t <= C;
}
function __PRIVATE_arrayEquals(e, t, n) {
  return e.length === t.length && e.every(((e2, r) => n(e2, t[r])));
}
const F = "__name__";
class BasePath {
  constructor(e, t, n) {
    void 0 === t ? t = 0 : t > e.length && fail(637, {
      offset: t,
      range: e.length
    }), void 0 === n ? n = e.length - t : n > e.length - t && fail(1746, {
      length: n,
      range: e.length - t
    }), this.segments = e, this.offset = t, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return 0 === BasePath.comparator(this, e);
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof BasePath ? e.forEach(((e2) => {
      t.push(e2);
    })) : t.push(e), this.construct(t);
  }
  /** The index of one past the last segment of the path. */
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return 0 === this.length;
  }
  isPrefixOf(e) {
    if (e.length < this.length) return false;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length) return false;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
    return true;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  /**
   * Compare 2 paths segment by segment, prioritizing numeric IDs
   * (e.g., "__id123__") in numeric ascending order, followed by string
   * segments in lexicographical order.
   */
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r = 0; r < n; r++) {
      const n2 = BasePath.compareSegments(e.get(r), t.get(r));
      if (0 !== n2) return n2;
    }
    return __PRIVATE_primitiveComparator(e.length, t.length);
  }
  static compareSegments(e, t) {
    const n = BasePath.isNumericId(e), r = BasePath.isNumericId(t);
    return n && !r ? -1 : !n && r ? 1 : n && r ? BasePath.extractNumericId(e).compare(BasePath.extractNumericId(t)) : __PRIVATE_compareUtf8Strings(e, t);
  }
  // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
  static isNumericId(e) {
    return e.startsWith("__id") && e.endsWith("__");
  }
  static extractNumericId(e) {
    return Integer.fromString(e.substring(4, e.length - 2));
  }
}
class ResourcePath extends BasePath {
  construct(e, t, n) {
    return new ResourcePath(e, t, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  toStringWithLeadingSlash() {
    return `/${this.canonicalString()}`;
  }
  /**
   * Returns a string representation of this path
   * where each path segment has been encoded with
   * `encodeURIComponent`.
   */
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  /**
   * Creates a resource path from the given slash-delimited string. If multiple
   * arguments are provided, all components are combined. Leading and trailing
   * slashes from all components are ignored.
   */
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf("//") >= 0) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      t.push(...n.split("/").filter(((e2) => e2.length > 0)));
    }
    return new ResourcePath(t);
  }
  static emptyPath() {
    return new ResourcePath([]);
  }
}
const O = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class FieldPath$1 extends BasePath {
  construct(e, t, n) {
    return new FieldPath$1(e, t, n);
  }
  /**
   * Returns true if the string could be used as a segment in a field path
   * without escaping.
   */
  static isValidIdentifier(e) {
    return O.test(e);
  }
  canonicalString() {
    return this.toArray().map(((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e))).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns true if this field references the key of a document.
   */
  isKeyField() {
    return 1 === this.length && this.get(0) === F;
  }
  /**
   * The field designating the key of a document.
   */
  static keyField() {
    return new FieldPath$1([F]);
  }
  /**
   * Parses a field string from the given server-formatted string.
   *
   * - Splitting the empty string is not allowed (for now at least).
   * - Empty segments within the string (e.g. if there are two consecutive
   *   separators) are not allowed.
   *
   * TODO(b/37244157): we should make this more strict. Right now, it allows
   * non-identifier path components, even if they aren't escaped.
   */
  static fromServerFormat(e) {
    const t = [];
    let n = "", r = 0;
    const __PRIVATE_addCurrentSegment = () => {
      if (0 === n.length) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(n), n = "";
    };
    let i = false;
    for (; r < e.length; ) {
      const t2 = e[r];
      if ("\\" === t2) {
        if (r + 1 === e.length) throw new FirestoreError(D.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const t3 = e[r + 1];
        if ("\\" !== t3 && "." !== t3 && "`" !== t3) throw new FirestoreError(D.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        n += t3, r += 2;
      } else "`" === t2 ? (i = !i, r++) : "." !== t2 || i ? (n += t2, r++) : (__PRIVATE_addCurrentSegment(), r++);
    }
    if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(D.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new FieldPath$1(t);
  }
  static emptyPath() {
    return new FieldPath$1([]);
  }
}
class DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  /** Returns true if the document is in the specified collectionId. */
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  /** Returns the collection group (i.e. the name of the parent collection) for this key. */
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  /** Returns the fully qualified path to the parent collection. */
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return ResourcePath.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  /**
   * Creates and returns a new document key with the given segments.
   *
   * @param segments - The segments of the path to the document
   * @returns A new instance of DocumentKey
   */
  static fromSegments(e) {
    return new DocumentKey(new ResourcePath(e.slice()));
  }
}
function __PRIVATE_validateNonEmptyArgument(e, t, n) {
  if (!n) throw new FirestoreError(D.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}
function __PRIVATE_validateIsNotUsedTogether(e, t, n, r) {
  if (true === t && true === r) throw new FirestoreError(D.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
}
function __PRIVATE_validateDocumentPath(e) {
  if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}
function __PRIVATE_validateCollectionPath(e) {
  if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}
function __PRIVATE_isPlainObject(e) {
  return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
}
function __PRIVATE_valueDescription(e) {
  if (void 0 === e) return "undefined";
  if (null === e) return "null";
  if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if ("number" == typeof e || "boolean" == typeof e) return "" + e;
  if ("object" == typeof e) {
    if (e instanceof Array) return "an array";
    {
      const t = (
        /** try to get the constructor name for an object. */
        (function __PRIVATE_tryGetCustomObjectType(e2) {
          if (e2.constructor) return e2.constructor.name;
          return null;
        })(e)
      );
      return t ? `a custom ${t} object` : "an object";
    }
  }
  return "function" == typeof e ? "a function" : fail(12329, {
    type: typeof e
  });
}
function __PRIVATE_cast(e, t) {
  if ("_delegate" in e && // Unwrap Compat types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e = e._delegate), !(e instanceof t)) {
    if (t.name === e.constructor.name) throw new FirestoreError(D.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = __PRIVATE_valueDescription(e);
      throw new FirestoreError(D.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
}
function property(e, t) {
  const n = {
    typeString: e
  };
  return t && (n.value = t), n;
}
function __PRIVATE_validateJSON(e, t) {
  if (!__PRIVATE_isPlainObject(e)) throw new FirestoreError(D.INVALID_ARGUMENT, "JSON must be an object");
  let n;
  for (const r in t) if (t[r]) {
    const i = t[r].typeString, s = "value" in t[r] ? {
      value: t[r].value
    } : void 0;
    if (!(r in e)) {
      n = `JSON missing required field: '${r}'`;
      break;
    }
    const _ = e[r];
    if (i && typeof _ !== i) {
      n = `JSON field '${r}' must be a ${i}.`;
      break;
    }
    if (void 0 !== s && _ !== s.value) {
      n = `Expected '${r}' field to equal '${s.value}'`;
      break;
    }
  }
  if (n) throw new FirestoreError(D.INVALID_ARGUMENT, n);
  return true;
}
const M = -62135596800, N = 1e6;
class Timestamp {
  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @returns a new timestamp representing the current date.
   */
  static now() {
    return Timestamp.fromMillis(Date.now());
  }
  /**
   * Creates a new timestamp from the given date.
   *
   * @param date - The date to initialize the `Timestamp` from.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     date.
   */
  static fromDate(e) {
    return Timestamp.fromMillis(e.getTime());
  }
  /**
   * Creates a new timestamp from the given number of milliseconds.
   *
   * @param milliseconds - Number of milliseconds since Unix epoch
   *     1970-01-01T00:00:00Z.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     number of milliseconds.
   */
  static fromMillis(e) {
    const t = Math.floor(e / 1e3), n = Math.floor((e - 1e3 * t) * N);
    return new Timestamp(t, n);
  }
  /**
   * Creates a new timestamp.
   *
   * @param seconds - The number of seconds of UTC time since Unix epoch
   *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   *     9999-12-31T23:59:59Z inclusive.
   * @param nanoseconds - The non-negative fractions of a second at nanosecond
   *     resolution. Negative second values with fractions must still have
   *     non-negative nanoseconds values that count forward in time. Must be
   *     from 0 to 999,999,999 inclusive.
   */
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < M) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  /**
   * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
   * causes a loss of precision since `Date` objects only support millisecond
   * precision.
   *
   * @returns JavaScript `Date` object representing the same point in time as
   *     this `Timestamp`, with millisecond precision.
   */
  toDate() {
    return new Date(this.toMillis());
  }
  /**
   * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
   * epoch). This operation causes a loss of precision.
   *
   * @returns The point in time corresponding to this timestamp, represented as
   *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
   */
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / N;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
  }
  /**
   * Returns true if this `Timestamp` is equal to the provided one.
   *
   * @param other - The `Timestamp` to compare against.
   * @returns true if this `Timestamp` is equal to the provided one.
   */
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  /** Returns a textual representation of this `Timestamp`. */
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  /**
   * Returns a JSON-serializable representation of this `Timestamp`.
   */
  toJSON() {
    return {
      type: Timestamp._jsonSchemaVersion,
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  /**
   * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, Timestamp._jsonSchema)) return new Timestamp(e.seconds, e.nanoseconds);
  }
  /**
   * Converts this object to a primitive string, which allows `Timestamp` objects
   * to be compared using the `>`, `<=`, `>=` and `>` operators.
   */
  valueOf() {
    const e = this.seconds - M;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
}
Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
  type: property("string", Timestamp._jsonSchemaVersion),
  seconds: property("number"),
  nanoseconds: property("number")
};
class SnapshotVersion {
  static fromTimestamp(e) {
    return new SnapshotVersion(e);
  }
  static min() {
    return new SnapshotVersion(new Timestamp(0, 0));
  }
  static max() {
    return new SnapshotVersion(new Timestamp(253402300799, 999999999));
  }
  constructor(e) {
    this.timestamp = e;
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  /** Returns a number representation of the version for use in spec tests. */
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
}
const L = -1;
function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t) {
  const n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(1e9 === r ? new Timestamp(n + 1, 0) : new Timestamp(n, r));
  return new IndexOffset(i, DocumentKey.empty(), t);
}
function __PRIVATE_newIndexOffsetFromDocument(e) {
  return new IndexOffset(e.readTime, e.key, L);
}
class IndexOffset {
  constructor(e, t, n) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = n;
  }
  /** Returns an offset that sorts before all regular offsets. */
  static min() {
    return new IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), L);
  }
  /** Returns an offset that sorts after all regular offsets. */
  static max() {
    return new IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), L);
  }
}
function __PRIVATE_indexOffsetComparator(e, t) {
  let n = e.readTime.compareTo(t.readTime);
  return 0 !== n ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), 0 !== n ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
}
const B = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
class PersistenceTransaction {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach(((e) => e()));
  }
}
async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
  if (e.code !== D.FAILED_PRECONDITION || e.message !== B) throw e;
  __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
}
class PersistencePromise {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
    this.result = void 0, this.error = void 0, this.isDone = false, // Set to true when .then() or .catch() are called and prevents additional
    // chaining.
    this.callbackAttached = false, e(((e2) => {
      this.isDone = true, this.result = e2, this.nextCallback && // value should be defined unless T is Void, but we can't express
      // that in the type system.
      this.nextCallback(e2);
    }), ((e2) => {
      this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
    }));
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t) {
    return this.callbackAttached && fail(59440), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new PersistencePromise(((n, r) => {
      this.nextCallback = (t2) => {
        this.wrapSuccess(e, t2).next(n, r);
      }, this.catchCallback = (e2) => {
        this.wrapFailure(t, e2).next(n, r);
      };
    }));
  }
  toPromise() {
    return new Promise(((e, t) => {
      this.next(e, t);
    }));
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof PersistencePromise ? t : PersistencePromise.resolve(t);
    } catch (e2) {
      return PersistencePromise.reject(e2);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction((() => e(t))) : PersistencePromise.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction((() => e(t))) : PersistencePromise.reject(t);
  }
  static resolve(e) {
    return new PersistencePromise(((t, n) => {
      t(e);
    }));
  }
  static reject(e) {
    return new PersistencePromise(((t, n) => {
      n(e);
    }));
  }
  static waitFor(e) {
    return new PersistencePromise(((t, n) => {
      let r = 0, i = 0, s = false;
      e.forEach(((e2) => {
        ++r, e2.next((() => {
          ++i, s && i === r && t();
        }), ((e3) => n(e3)));
      })), s = true, i === r && t();
    }));
  }
  /**
   * Given an array of predicate functions that asynchronously evaluate to a
   * boolean, implements a short-circuiting `or` between the results. Predicates
   * will be evaluated until one of them returns `true`, then stop. The final
   * result will be whether any of them returned `true`.
   */
  static or(e) {
    let t = PersistencePromise.resolve(false);
    for (const n of e) t = t.next(((e2) => e2 ? PersistencePromise.resolve(e2) : n()));
    return t;
  }
  static forEach(e, t) {
    const n = [];
    return e.forEach(((e2, r) => {
      n.push(t.call(this, e2, r));
    })), this.waitFor(n);
  }
  /**
   * Concurrently map all array elements through asynchronous function.
   */
  static mapArray(e, t) {
    return new PersistencePromise(((n, r) => {
      const i = e.length, s = new Array(i);
      let _ = 0;
      for (let o = 0; o < i; o++) {
        const a = o;
        t(e[a]).next(((e2) => {
          s[a] = e2, ++_, _ === i && n(s);
        }), ((e2) => r(e2)));
      }
    }));
  }
  /**
   * An alternative to recursive PersistencePromise calls, that avoids
   * potential memory problems from unbounded chains of promises.
   *
   * The `action` will be called repeatedly while `condition` is true.
   */
  static doWhile(e, t) {
    return new PersistencePromise(((n, r) => {
      const process = () => {
        true === e() ? t().next((() => {
          process();
        }), r) : n();
      };
      process();
    }));
  }
}
function __PRIVATE_getAndroidVersion(e) {
  const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(n);
}
function __PRIVATE_isIndexedDbTransactionError(e) {
  return "IndexedDbTransactionError" === e.name;
}
class __PRIVATE_ListenSequence {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this.ae(e2), this.ue = (e2) => t.writeSequenceNumber(e2));
  }
  ae(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.ue && this.ue(e), e;
  }
}
__PRIVATE_ListenSequence.ce = -1;
const $ = -1;
function __PRIVATE_isNullOrUndefined(e) {
  return null == e;
}
function __PRIVATE_isNegativeZero(e) {
  return 0 === e && 1 / e == -1 / 0;
}
function isSafeInteger(e) {
  return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
}
function __PRIVATE_isString$1(e) {
  return "string" == typeof e;
}
const K = "";
function __PRIVATE_encodeResourcePath(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), t = __PRIVATE_encodeSegment(e.get(n), t);
  return __PRIVATE_encodeSeparator(t);
}
function __PRIVATE_encodeSegment(e, t) {
  let n = t;
  const r = e.length;
  for (let t2 = 0; t2 < r; t2++) {
    const r2 = e.charAt(t2);
    switch (r2) {
      case "\0":
        n += "";
        break;
      case K:
        n += "";
        break;
      default:
        n += r2;
    }
  }
  return n;
}
function __PRIVATE_encodeSeparator(e) {
  return e + K + "";
}
class SortedMap {
  constructor(e, t) {
    this.comparator = e, this.root = t || LLRBNode.EMPTY;
  }
  // Returns a copy of the map, with the specified key/value added or replaced.
  insert(e, t) {
    return new SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns a copy of the map, with the specified key removed.
  remove(e) {
    return new SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns the value of the node with the given key, or null.
  get(e) {
    let t = this.root;
    for (; !t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (0 === n) return t.value;
      n < 0 ? t = t.left : n > 0 && (t = t.right);
    }
    return null;
  }
  // Returns the index of the element in this sorted map, or -1 if it doesn't
  // exist.
  indexOf(e) {
    let t = 0, n = this.root;
    for (; !n.isEmpty(); ) {
      const r = this.comparator(e, n.key);
      if (0 === r) return t + n.left.size;
      r < 0 ? n = n.left : (
        // Count all nodes left of the node plus the node itself
        (t += n.left.size + 1, n = n.right)
      );
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  // Returns the total number of nodes in the map.
  get size() {
    return this.root.size;
  }
  // Returns the minimum key in the map.
  minKey() {
    return this.root.minKey();
  }
  // Returns the maximum key in the map.
  maxKey() {
    return this.root.maxKey();
  }
  // Traverses the map in key order and calls the specified action function
  // for each key/value pair. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal(((t, n) => (e(t, n), false)));
  }
  toString() {
    const e = [];
    return this.inorderTraversal(((t, n) => (e.push(`${t}:${n}`), false))), `{${e.join(", ")}}`;
  }
  // Traverses the map in reverse key order and calls the specified action
  // function for each key/value pair. If action returns true, traversal is
  // aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  // Returns an iterator over the SortedMap.
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
}
class SortedMapIterator {
  constructor(e, t, n, r) {
    this.isReverse = r, this.nodeStack = [];
    let i = 1;
    for (; !e.isEmpty(); ) if (i = t ? n(e.key, t) : 1, // flip the comparison if we're going in reverse
    t && r && (i *= -1), i < 0)
      e = this.isReverse ? e.left : e.right;
    else {
      if (0 === i) {
        this.nodeStack.push(e);
        break;
      }
      this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
    }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right;
    else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (0 === this.nodeStack.length) return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
}
class LLRBNode {
  constructor(e, t, n, r, i) {
    this.key = e, this.value = t, this.color = null != n ? n : LLRBNode.RED, this.left = null != r ? r : LLRBNode.EMPTY, this.right = null != i ? i : LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  // Returns a copy of the current node, optionally replacing pieces of it.
  copy(e, t, n, r, i) {
    return new LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r ? r : this.left, null != i ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  // Traverses the tree in key order and calls the specified action function
  // for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  // Traverses the tree in reverse key order and calls the specified action
  // function for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  // Returns the minimum node in the tree.
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  // Returns the maximum key in the tree.
  minKey() {
    return this.min().key;
  }
  // Returns the maximum key in the tree.
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  // Returns new tree, with the key/value added.
  insert(e, t, n) {
    let r = this;
    const i = n(e, r.key);
    return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : 0 === i ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), r.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty()) return LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  // Returns new tree, with the specified item removed.
  remove(e, t) {
    let n, r = this;
    if (t(e, r.key) < 0) r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), r = r.copy(null, null, null, r.left.remove(e, t), null);
    else {
      if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 0 === t(e, r.key)) {
        if (r.right.isEmpty()) return LLRBNode.EMPTY;
        n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
      }
      r = r.copy(null, null, null, null, r.right.remove(e, t));
    }
    return r.fixUp();
  }
  isRed() {
    return this.color;
  }
  // Returns new tree after performing any needed rotations.
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  // For testing.
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  // In a balanced RB tree, the black-depth (number of black nodes) from root to
  // leaves is equal on both sides.  This function verifies that or asserts.
  check() {
    if (this.isRed() && this.left.isRed()) throw fail(43730, {
      key: this.key,
      value: this.value
    });
    if (this.right.isRed()) throw fail(14113, {
      key: this.key,
      value: this.value
    });
    const e = this.left.check();
    if (e !== this.right.check()) throw fail(27949);
    return e + (this.isRed() ? 0 : 1);
  }
}
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
class LLRBEmptyNode {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail(57766);
  }
  get value() {
    throw fail(16141);
  }
  get color() {
    throw fail(16727);
  }
  get left() {
    throw fail(29726);
  }
  get right() {
    throw fail(36894);
  }
  // Returns a copy of the current node.
  copy(e, t, n, r, i) {
    return this;
  }
  // Returns a copy of the tree, with the specified key/value added.
  insert(e, t, n) {
    return new LLRBNode(e, t);
  }
  // Returns a copy of the tree, with the specified key removed.
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  // For testing.
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
}();
class SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return null !== this.data.get(e);
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  /** Iterates elements in order defined by "comparator" */
  forEach(e) {
    this.data.inorderTraversal(((t, n) => (e(t), false)));
  }
  /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (; n.hasNext(); ) {
      const r = n.getNext();
      if (this.comparator(r.key, e[1]) >= 0) return;
      t(r.key);
    }
  }
  /**
   * Iterates over `elem`s such that: start &lt;= elem until false is returned.
   */
  forEachWhile(e, t) {
    let n;
    for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext(); ) {
      if (!e(n.getNext().key)) return;
    }
  }
  /** Finds the least element greater than or equal to `elem`. */
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  /** Inserts or updates an element */
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  /** Deletes an element */
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach(((e2) => {
      t = t.add(e2);
    })), t;
  }
  isEqual(e) {
    if (!(e instanceof SortedSet)) return false;
    if (this.size !== e.size) return false;
    const t = this.data.getIterator(), n = e.data.getIterator();
    for (; t.hasNext(); ) {
      const e2 = t.getNext().key, r = n.getNext().key;
      if (0 !== this.comparator(e2, r)) return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach(((t) => {
      e.push(t);
    })), e;
  }
  toString() {
    const e = [];
    return this.forEach(((t) => e.push(t))), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new SortedSet(this.comparator);
    return t.data = e, t;
  }
}
class SortedSetIterator {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
}
class FieldMask {
  constructor(e) {
    this.fields = e, // TODO(dimond): validation of FieldMask
    // Sort the field mask to support `FieldMask.isEqual()` and assert below.
    e.sort(FieldPath$1.comparator);
  }
  static empty() {
    return new FieldMask([]);
  }
  /**
   * Returns a new FieldMask object that is the result of adding all the given
   * fields paths to this field mask.
   */
  unionWith(e) {
    let t = new SortedSet(FieldPath$1.comparator);
    for (const e2 of this.fields) t = t.add(e2);
    for (const n of e) t = t.add(n);
    return new FieldMask(t.toArray());
  }
  /**
   * Verifies that `fieldPath` is included by at least one field in this field
   * mask.
   *
   * This is an O(n) operation, where `n` is the size of the field mask.
   */
  covers(e) {
    for (const t of this.fields) if (t.isPrefixOf(e)) return true;
    return false;
  }
  isEqual(e) {
    return __PRIVATE_arrayEquals(this.fields, e.fields, ((e2, t) => e2.isEqual(t)));
  }
}
function __PRIVATE_objectSize(e) {
  let t = 0;
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
function forEach(e, t) {
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}
function __PRIVATE_mapToArray(e, t) {
  const n = [];
  for (const r in e) Object.prototype.hasOwnProperty.call(e, r) && n.push(t(e[r], r, e));
  return n;
}
function isEmpty(e) {
  for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return false;
  return true;
}
class __PRIVATE_Base64DecodeError extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
}
class ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = (function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw "undefined" != typeof DOMException && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    })(e);
    return new ByteString(t);
  }
  static fromUint8Array(e) {
    const t = (
      /**
      * Helper function to convert an Uint8array to a binary string.
      */
      (function __PRIVATE_binaryStringFromUint8Array(e2) {
        let t2 = "";
        for (let n = 0; n < e2.length; ++n) t2 += String.fromCharCode(e2[n]);
        return t2;
      })(e)
    );
    return new ByteString(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: void 0,
        done: true
      }
    };
  }
  toBase64() {
    return (function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    })(this.binaryString);
  }
  toUint8Array() {
    return (function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t = new Uint8Array(e.length);
      for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
      return t;
    })(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
}
ByteString.EMPTY_BYTE_STRING = new ByteString("");
const et = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function __PRIVATE_normalizeTimestamp(e) {
  if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
    let t = 0;
    const n = et.exec(e);
    if (__PRIVATE_hardAssert(!!n, 46558, {
      timestamp: e
    }), n[1]) {
      let e2 = n[1];
      e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
    }
    const r = new Date(e);
    return {
      seconds: Math.floor(r.getTime() / 1e3),
      nanos: t
    };
  }
  return {
    seconds: __PRIVATE_normalizeNumber(e.seconds),
    nanos: __PRIVATE_normalizeNumber(e.nanos)
  };
}
function __PRIVATE_normalizeNumber(e) {
  return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}
function __PRIVATE_normalizeByteString(e) {
  return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
}
const tt = "server_timestamp", nt = "__type__", rt = "__previous_value__", it = "__local_write_time__";
function __PRIVATE_isServerTimestamp(e) {
  const t = (e?.mapValue?.fields || {})[nt]?.stringValue;
  return t === tt;
}
function __PRIVATE_getPreviousValue(e) {
  const t = e.mapValue.fields[rt];
  return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
}
function __PRIVATE_getLocalWriteTime(e) {
  const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields[it].timestampValue);
  return new Timestamp(t.seconds, t.nanos);
}
class DatabaseInfo {
  /**
   * Constructs a DatabaseInfo using the provided host, databaseId and
   * persistenceKey.
   *
   * @param databaseId - The database to use.
   * @param appId - The Firebase App Id.
   * @param persistenceKey - A unique identifier for this Firestore's local
   * storage (used in conjunction with the databaseId).
   * @param host - The Firestore backend host to connect to.
   * @param ssl - Whether to use SSL when connecting.
   * @param forceLongPolling - Whether to use the forceLongPolling option
   * when using WebChannel as the network transport.
   * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
   * option when using WebChannel as the network transport.
   * @param longPollingOptions - Options that configure long-polling.
   * @param useFetchStreams - Whether to use the Fetch API instead of
   * XMLHTTPRequest
   */
  constructor(e, t, n, r, i, s, _, o, a, u, c) {
    this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = _, this.longPollingOptions = o, this.useFetchStreams = a, this.isUsingEmulator = u, this.apiKey = c;
  }
}
const st = "(default)";
class DatabaseId {
  constructor(e, t) {
    this.projectId = e, this.database = t || st;
  }
  static empty() {
    return new DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return this.database === st;
  }
  isEqual(e) {
    return e instanceof DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
}
function __PRIVATE_databaseIdFromApp(e, t) {
  if (!Object.prototype.hasOwnProperty.apply(e.options, ["projectId"])) throw new FirestoreError(D.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
  return new DatabaseId(e.options.projectId, t);
}
const _t = "__type__", ot = "__max__", at = {
  mapValue: {}
}, ut = "__vector__", ct = "value", lt = {
  nullValue: "NULL_VALUE"
}, Et = {
  booleanValue: true
}, ht = {
  booleanValue: false
};
function __PRIVATE_typeOrder(e) {
  return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : __PRIVATE_isVectorValue(e) ? 10 : 11 : fail(28295, {
    value: e
  });
}
function __PRIVATE_valueEquals$1(e, t, n) {
  if (e === t) return true;
  const r = __PRIVATE_typeOrder(e);
  if (r !== __PRIVATE_typeOrder(t)) return false;
  switch (r) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return e.booleanValue === t.booleanValue;
    case 4:
      return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
    case 3:
      return (function __PRIVATE_timestampEquals(e2, t2) {
        if ("string" == typeof e2.timestampValue && "string" == typeof t2.timestampValue && e2.timestampValue.length === t2.timestampValue.length)
          return e2.timestampValue === t2.timestampValue;
        const n2 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r2 = __PRIVATE_normalizeTimestamp(t2.timestampValue);
        return n2.seconds === r2.seconds && n2.nanos === r2.nanos;
      })(e, t);
    case 5:
      return e.stringValue === t.stringValue;
    case 6:
      return (function __PRIVATE_blobEquals(e2, t2) {
        return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t2.bytesValue));
      })(e, t);
    case 7:
      return e.referenceValue === t.referenceValue;
    case 8:
      return (function __PRIVATE_geoPointEquals(e2, t2) {
        return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
      })(e, t);
    case 2:
      return (function __PRIVATE_numberEquals(e2, t2, n2) {
        if ("integerValue" in e2 && "integerValue" in t2) return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t2.integerValue);
        let r2, i;
        if ("doubleValue" in e2 && "doubleValue" in t2) r2 = __PRIVATE_normalizeNumber(e2.doubleValue), i = __PRIVATE_normalizeNumber(t2.doubleValue);
        else {
          if (!n2?.Ee) return false;
          r2 = __PRIVATE_normalizeNumber(e2.integerValue ?? e2.doubleValue), i = __PRIVATE_normalizeNumber(t2.integerValue ?? t2.doubleValue);
        }
        if (r2 === i) return !!n2?.he || __PRIVATE_isNegativeZero(r2) === __PRIVATE_isNegativeZero(i);
        return !!(void 0 === n2 || n2.Te) && (isNaN(r2) && isNaN(i));
      })(e, t, n);
    case 9:
      return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], ((e2, t2) => __PRIVATE_valueEquals$1(e2, t2, n)));
    case 10:
    case 11:
      return (function __PRIVATE_objectEquals(e2, t2, n2) {
        const r2 = e2.mapValue.fields || {}, i = t2.mapValue.fields || {};
        if (__PRIVATE_objectSize(r2) !== __PRIVATE_objectSize(i)) return false;
        for (const e3 in r2) if (r2.hasOwnProperty(e3) && (void 0 === i[e3] || !__PRIVATE_valueEquals$1(r2[e3], i[e3], n2))) return false;
        return true;
      })(e, t, n);
    default:
      return fail(52216, {
        left: e
      });
  }
}
function __PRIVATE_arrayValueContains(e, t) {
  return void 0 !== (e.values || []).find(((e2) => __PRIVATE_valueEquals$1(e2, t)));
}
function __PRIVATE_valueCompare(e, t) {
  if (e === t) return 0;
  const n = __PRIVATE_typeOrder(e), r = __PRIVATE_typeOrder(t);
  if (n !== r) return __PRIVATE_primitiveComparator(n, r);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
    case 2:
      return (function __PRIVATE_compareNumbers(e2, t2) {
        const n2 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t2.integerValue || t2.doubleValue);
        return n2 < r2 ? -1 : n2 > r2 ? 1 : n2 === r2 ? 0 : (
          // one or both are NaN.
          isNaN(n2) ? isNaN(r2) ? 0 : -1 : 1
        );
      })(e, t);
    case 3:
      return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
    case 4:
      return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
    case 5:
      return __PRIVATE_compareUtf8Strings(e.stringValue, t.stringValue);
    case 6:
      return (function __PRIVATE_compareBlobs(e2, t2) {
        const n2 = __PRIVATE_normalizeByteString(e2), r2 = __PRIVATE_normalizeByteString(t2);
        return n2.compareTo(r2);
      })(e.bytesValue, t.bytesValue);
    case 7:
      return (function __PRIVATE_compareReferences(e2, t2) {
        const n2 = e2.split("/"), r2 = t2.split("/");
        for (let e3 = 0; e3 < n2.length && e3 < r2.length; e3++) {
          const t3 = __PRIVATE_primitiveComparator(n2[e3], r2[e3]);
          if (0 !== t3) return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r2.length);
      })(e.referenceValue, t.referenceValue);
    case 8:
      return (function __PRIVATE_compareGeoPoints(e2, t2) {
        const n2 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
        if (0 !== n2) return n2;
        return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
      })(e.geoPointValue, t.geoPointValue);
    case 9:
      return __PRIVATE_compareArrays(e.arrayValue, t.arrayValue);
    case 10:
      return (function __PRIVATE_compareVectors(e2, t2) {
        const n2 = e2.fields || {}, r2 = t2.fields || {}, i = n2[ct]?.arrayValue, s = r2[ct]?.arrayValue, _ = __PRIVATE_primitiveComparator(i?.values?.length || 0, s?.values?.length || 0);
        if (0 !== _) return _;
        return __PRIVATE_compareArrays(i, s);
      })(e.mapValue, t.mapValue);
    case 11:
      return (function __PRIVATE_compareMaps(e2, t2) {
        if (e2 === at.mapValue && t2 === at.mapValue) return 0;
        if (e2 === at.mapValue) return 1;
        if (t2 === at.mapValue) return -1;
        const n2 = e2.fields || {}, r2 = Object.keys(n2), i = t2.fields || {}, s = Object.keys(i);
        r2.sort(), s.sort();
        for (let e3 = 0; e3 < r2.length && e3 < s.length; ++e3) {
          const t3 = __PRIVATE_compareUtf8Strings(r2[e3], s[e3]);
          if (0 !== t3) return t3;
          const _ = __PRIVATE_valueCompare(n2[r2[e3]], i[s[e3]]);
          if (0 !== _) return _;
        }
        return __PRIVATE_primitiveComparator(r2.length, s.length);
      })(e.mapValue, t.mapValue);
    default:
      throw fail(23264, {
        Pe: n
      });
  }
}
function __PRIVATE_compareTimestamps(e, t) {
  if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
  const n = __PRIVATE_normalizeTimestamp(e), r = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r.seconds);
  return 0 !== i ? i : __PRIVATE_primitiveComparator(n.nanos, r.nanos);
}
function __PRIVATE_compareArrays(e, t) {
  const n = e.values || [], r = t.values || [];
  for (let e2 = 0; e2 < n.length && e2 < r.length; ++e2) {
    const t2 = __PRIVATE_valueCompare(n[e2], r[e2]);
    if (void 0 !== t2 && 0 !== t2) return t2;
  }
  return __PRIVATE_primitiveComparator(n.length, r.length);
}
function canonicalId(e) {
  return __PRIVATE_canonifyValue(e);
}
function __PRIVATE_canonifyValue(e) {
  return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? (function __PRIVATE_canonifyTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return `time(${t.seconds},${t.nanos})`;
  })(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? (function __PRIVATE_canonifyByteString(e2) {
    return __PRIVATE_normalizeByteString(e2).toBase64();
  })(e.bytesValue) : "referenceValue" in e ? (function __PRIVATE_canonifyReference(e2) {
    return DocumentKey.fromName(e2).toString();
  })(e.referenceValue) : "geoPointValue" in e ? (function __PRIVATE_canonifyGeoPoint(e2) {
    return `geo(${e2.latitude},${e2.longitude})`;
  })(e.geoPointValue) : "arrayValue" in e ? (function __PRIVATE_canonifyArray(e2) {
    let t = "[", n = true;
    for (const r of e2.values || []) n ? n = false : t += ",", t += __PRIVATE_canonifyValue(r);
    return t + "]";
  })(e.arrayValue) : "mapValue" in e ? (function __PRIVATE_canonifyMap(e2) {
    const t = Object.keys(e2.fields || {}).sort();
    let n = "{", r = true;
    for (const i of t) r ? r = false : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
    return n + "}";
  })(e.mapValue) : fail(61005, {
    value: e
  });
}
function __PRIVATE_estimateByteSize(e) {
  switch (__PRIVATE_typeOrder(e)) {
    case 0:
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
    case 8:
      return 16;
    case 4:
      const t = __PRIVATE_getPreviousValue(e);
      return t ? 16 + __PRIVATE_estimateByteSize(t) : 16;
    case 5:
      return 2 * e.stringValue.length;
    case 6:
      return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();
    case 7:
      return e.referenceValue.length;
    case 9:
      return (function __PRIVATE_estimateArrayByteSize(e2) {
        return (e2.values || []).reduce(((e3, t2) => e3 + __PRIVATE_estimateByteSize(t2)), 0);
      })(e.arrayValue);
    case 10:
    case 11:
      return (function __PRIVATE_estimateMapByteSize(e2) {
        let t2 = 0;
        return forEach(e2.fields, ((e3, n) => {
          t2 += e3.length + __PRIVATE_estimateByteSize(n);
        })), t2;
      })(e.mapValue);
    default:
      throw fail(13486, {
        value: e
      });
  }
}
function isInteger(e) {
  return !!e && "integerValue" in e;
}
function __PRIVATE_isDouble(e) {
  return !!e && "doubleValue" in e;
}
function __PRIVATE_isNumber(e) {
  return isInteger(e) || __PRIVATE_isDouble(e);
}
function isArray(e) {
  return !!e && "arrayValue" in e;
}
function __PRIVATE_isNullValue(e) {
  return !!e && "nullValue" in e;
}
function __PRIVATE_isNanValue(e) {
  return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}
function __PRIVATE_isMapValue(e) {
  return !!e && "mapValue" in e;
}
function __PRIVATE_isVectorValue(e) {
  const t = (e?.mapValue?.fields || {})[_t]?.stringValue;
  return t === ut;
}
function __PRIVATE_getVectorValue(e) {
  return (e?.mapValue?.fields || {})[ct]?.arrayValue;
}
function __PRIVATE_deepClone(e) {
  if (e.geoPointValue) return {
    geoPointValue: {
      ...e.geoPointValue
    }
  };
  if (e.timestampValue && "object" == typeof e.timestampValue) return {
    timestampValue: {
      ...e.timestampValue
    }
  };
  if (e.mapValue) {
    const t = {
      mapValue: {
        fields: {}
      }
    };
    return forEach(e.mapValue.fields, ((e2, n) => t.mapValue.fields[e2] = __PRIVATE_deepClone(n))), t;
  }
  if (e.arrayValue) {
    const t = {
      arrayValue: {
        values: []
      }
    };
    for (let n = 0; n < (e.arrayValue.values || []).length; ++n) t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
    return t;
  }
  return {
    ...e
  };
}
function __PRIVATE_isMaxValue(e) {
  return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === ot;
}
class ObjectValue {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new ObjectValue({
      mapValue: {}
    });
  }
  /**
   * Returns the value at the given path or null.
   *
   * @param path - the path to search
   * @returns The value at the path or null if the path is not set.
   */
  field(e) {
    if (e.isEmpty()) return this.value;
    {
      let t = this.value;
      for (let n = 0; n < e.length - 1; ++n) if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t)) return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  /**
   * Sets the field to the provided value.
   *
   * @param path - The field path to set.
   * @param value - The value to set.
   */
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
  }
  /**
   * Sets the provided fields to the provided values.
   *
   * @param data - A map of fields to values (or null for deletes).
   */
  setAll(e) {
    let t = FieldPath$1.emptyPath(), n = {}, r = [];
    e.forEach(((e2, i2) => {
      if (!t.isImmediateParentOf(i2)) {
        const e3 = this.getFieldsMap(t);
        this.applyChanges(e3, n, r), n = {}, r = [], t = i2.popLast();
      }
      e2 ? n[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r.push(i2.lastSegment());
    }));
    const i = this.getFieldsMap(t);
    this.applyChanges(i, n, r);
  }
  /**
   * Removes the field at the specified path. If there is no field at the
   * specified path, nothing is changed.
   *
   * @param path - The field path to remove.
   */
  delete(e) {
    const t = this.field(e.popLast());
    __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return __PRIVATE_valueEquals$1(this.value, e.value);
  }
  /**
   * Returns the map that contains the leaf element of `path`. If the parent
   * entry does not yet exist, or if it is not a map, a new map will be created.
   */
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let n = 0; n < e.length; ++n) {
      let r = t.mapValue.fields[e.get(n)];
      __PRIVATE_isMapValue(r) && r.mapValue.fields || (r = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(n)] = r), t = r;
    }
    return t.mapValue.fields;
  }
  /**
   * Modifies `fieldsMap` by adding, replacing or deleting the specified
   * entries.
   */
  applyChanges(e, t, n) {
    forEach(t, ((t2, n2) => e[t2] = n2));
    for (const t2 of n) delete e[t2];
  }
  clone() {
    return new ObjectValue(__PRIVATE_deepClone(this.value));
  }
}
function __PRIVATE_extractFieldMask(e) {
  const t = [];
  return forEach(e.fields, ((e2, n) => {
    const r = new FieldPath$1([e2]);
    if (__PRIVATE_isMapValue(n)) {
      const e3 = __PRIVATE_extractFieldMask(n.mapValue).fields;
      if (0 === e3.length)
        t.push(r);
      else
        for (const n2 of e3) t.push(r.child(n2));
    } else
      t.push(r);
  })), new FieldMask(t);
}
function __PRIVATE_toDouble(e, t) {
  if (e.useProto3Json) {
    if (isNaN(t)) return {
      doubleValue: "NaN"
    };
    if (t === 1 / 0) return {
      doubleValue: "Infinity"
    };
    if (t === -1 / 0) return {
      doubleValue: "-Infinity"
    };
  }
  return {
    doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
  };
}
function __PRIVATE_toInteger(e) {
  return {
    integerValue: "" + e
  };
}
function toNumber(e, t, n) {
  return Number.isInteger(t) && n?.preferIntegers || isSafeInteger(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
}
class TransformOperation {
  constructor() {
    this._ = void 0;
  }
}
function __PRIVATE_applyTransformOperationToLocalView(e, t, n) {
  return e instanceof __PRIVATE_ServerTimestampTransform ? (function serverTimestamp$1(e2, t2) {
    const n2 = {
      fields: {
        [nt]: {
          stringValue: tt
        },
        [it]: {
          timestampValue: {
            seconds: e2.seconds,
            nanos: e2.nanoseconds
          }
        }
      }
    };
    return t2 && __PRIVATE_isServerTimestamp(t2) && (t2 = __PRIVATE_getPreviousValue(t2)), t2 && (n2.fields[rt] = t2), {
      mapValue: n2
    };
  })(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : e instanceof __PRIVATE_NumericIncrementTransformOperation ? (function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t2) {
    const n2 = __PRIVATE_computeTransformOperationBaseValue(e2, t2), r = asNumber(n2) + asNumber(e2.Re);
    return isInteger(n2) && isInteger(e2.Re) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e2.serializer, r);
  })(e, t) : e instanceof __PRIVATE_NumericMinimumTransformOperation ? (function __PRIVATE_applyNumericMinimumTransformOperationToLocalView(e2, t2) {
    return __PRIVATE_applyNumericTransformOperationToLocalView(e2, t2, Math.min);
  })(e, t) : e instanceof __PRIVATE_NumericMaximumTransformOperation ? (function __PRIVATE_applyNumericMaximumTransformOperationToLocalView(e2, t2) {
    return __PRIVATE_applyNumericTransformOperationToLocalView(e2, t2, Math.max);
  })(e, t) : void 0;
}
function __PRIVATE_applyTransformOperationToRemoteDocument(e, t, n) {
  return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
}
function __PRIVATE_computeTransformOperationBaseValue(e, t) {
  return e instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_isNumber(t) ? t : {
    integerValue: 0
  } : null;
}
class __PRIVATE_ServerTimestampTransform extends TransformOperation {
}
class __PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}
function __PRIVATE_applyArrayUnionTransformOperation(e, t) {
  const n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements) n.some(((e2) => __PRIVATE_valueEquals$1(e2, t2))) || n.push(t2);
  return {
    arrayValue: {
      values: n
    }
  };
}
class __PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
}
function __PRIVATE_applyArrayRemoveTransformOperation(e, t) {
  let n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements) n = n.filter(((e2) => !__PRIVATE_valueEquals$1(e2, t2)));
  return {
    arrayValue: {
      values: n
    }
  };
}
class __PRIVATE_NumericTransformOperation extends TransformOperation {
  constructor(e, t) {
    super(), this.serializer = e, this.Re = t;
  }
}
class __PRIVATE_NumericIncrementTransformOperation extends __PRIVATE_NumericTransformOperation {
}
class __PRIVATE_NumericMinimumTransformOperation extends __PRIVATE_NumericTransformOperation {
}
class __PRIVATE_NumericMaximumTransformOperation extends __PRIVATE_NumericTransformOperation {
}
function __PRIVATE_applyNumericTransformOperationToLocalView(e, t, n) {
  if (!__PRIVATE_isNumber(t)) return e.Re;
  const r = n(asNumber(t), asNumber(e.Re));
  return isInteger(t) && isInteger(e.Re) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e.serializer, r);
}
function asNumber(e) {
  return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
}
function __PRIVATE_coercedFieldValuesArray(e) {
  return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
function __PRIVATE_fieldTransformEquals(e, t) {
  return e.field.isEqual(t.field) && (function __PRIVATE_transformOperationEquals(e2, t2) {
    return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t2 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t2 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t2.elements, __PRIVATE_valueEquals$1) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t2 instanceof __PRIVATE_NumericIncrementTransformOperation || e2 instanceof __PRIVATE_NumericMinimumTransformOperation && t2 instanceof __PRIVATE_NumericMinimumTransformOperation || e2 instanceof __PRIVATE_NumericMaximumTransformOperation && t2 instanceof __PRIVATE_NumericMaximumTransformOperation ? __PRIVATE_valueEquals$1(e2.Re, t2.Re) : e2 instanceof __PRIVATE_ServerTimestampTransform && t2 instanceof __PRIVATE_ServerTimestampTransform;
  })(e.transform, t.transform);
}
class MutationResult {
  constructor(e, t) {
    this.version = e, this.transformResults = t;
  }
}
class Precondition {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  /** Creates a new empty Precondition. */
  static none() {
    return new Precondition();
  }
  /** Creates a new Precondition with an exists flag. */
  static exists(e) {
    return new Precondition(void 0, e);
  }
  /** Creates a new Precondition based on a version a document exists at. */
  static updateTime(e) {
    return new Precondition(e);
  }
  /** Returns whether this Precondition is empty. */
  get isNone() {
    return void 0 === this.updateTime && void 0 === this.exists;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
}
function __PRIVATE_preconditionIsValidForDocument(e, t) {
  return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
}
class Mutation {
}
function __PRIVATE_calculateOverlayMutation(e, t) {
  if (!e.hasLocalMutations || t && 0 === t.fields.length) return null;
  if (null === t) return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
  {
    const n = e.data, r = ObjectValue.empty();
    let i = new SortedSet(FieldPath$1.comparator);
    for (let e2 of t.fields) if (!i.has(e2)) {
      let t2 = n.field(e2);
      null === t2 && e2.length > 1 && (e2 = e2.popLast(), t2 = n.field(e2)), null === t2 ? r.delete(e2) : r.set(e2, t2), i = i.add(e2);
    }
    return new __PRIVATE_PatchMutation(e.key, r, new FieldMask(i.toArray()), Precondition.none());
  }
}
function __PRIVATE_mutationApplyToRemoteDocument(e, t, n) {
  e instanceof __PRIVATE_SetMutation ? (function __PRIVATE_setMutationApplyToRemoteDocument(e2, t2, n2) {
    const r = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults);
    r.setAll(i), t2.convertToFoundDocument(n2.version, r).setHasCommittedMutations();
  })(e, t, n) : e instanceof __PRIVATE_PatchMutation ? (function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t2, n2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return void t2.convertToUnknownDocument(n2.version);
    const r = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults), i = t2.data;
    i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r), t2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
  })(e, t, n) : (function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t2, n2) {
    t2.convertToNoDocument(n2.version).setHasCommittedMutations();
  })(0, t, n);
}
function __PRIVATE_mutationApplyToLocalView(e, t, n, r) {
  return e instanceof __PRIVATE_SetMutation ? (function __PRIVATE_setMutationApplyToLocalView(e2, t2, n2, r2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2);
    return i.setAll(s), t2.convertToFoundDocument(t2.version, i).setHasLocalMutations(), null;
  })(e, t, n, r) : e instanceof __PRIVATE_PatchMutation ? (function __PRIVATE_patchMutationApplyToLocalView(e2, t2, n2, r2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2)) return n2;
    const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2), s = t2.data;
    if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t2.convertToFoundDocument(t2.version, s).setHasLocalMutations(), null === n2) return null;
    return n2.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map(((e3) => e3.field)));
  })(e, t, n, r) : (function __PRIVATE_deleteMutationApplyToLocalView(e2, t2, n2) {
    if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2)) return t2.convertToNoDocument(t2.version).setHasLocalMutations(), null;
    return n2;
  })(e, t, n);
}
function __PRIVATE_mutationExtractBaseValue(e, t) {
  let n = null;
  for (const r of e.fieldTransforms) {
    const e2 = t.data.field(r.field), i = __PRIVATE_computeTransformOperationBaseValue(r.transform, e2 || null);
    null != i && (null === n && (n = ObjectValue.empty()), n.set(r.field, i));
  }
  return n || null;
}
function __PRIVATE_mutationEquals(e, t) {
  return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!(function __PRIVATE_fieldTransformsAreEqual(e2, t2) {
    return void 0 === e2 && void 0 === t2 || !(!e2 || !t2) && __PRIVATE_arrayEquals(e2, t2, ((e3, t3) => __PRIVATE_fieldTransformEquals(e3, t3)));
  })(e.fieldTransforms, t.fieldTransforms) && (0 === e.type ? e.value.isEqual(t.value) : 1 !== e.type || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
}
class __PRIVATE_SetMutation extends Mutation {
  constructor(e, t, n, r = []) {
    super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
}
class __PRIVATE_PatchMutation extends Mutation {
  constructor(e, t, n, r, i = []) {
    super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
}
function __PRIVATE_getPatch(e) {
  const t = /* @__PURE__ */ new Map();
  return e.fieldMask.fields.forEach(((n) => {
    if (!n.isEmpty()) {
      const r = e.data.field(n);
      t.set(n, r);
    }
  })), t;
}
function __PRIVATE_serverTransformResults(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  __PRIVATE_hardAssert(e.length === n.length, 32656, {
    Ie: n.length,
    Ae: e.length
  });
  for (let i = 0; i < n.length; i++) {
    const s = e[i], _ = s.transform, o = t.data.field(s.field);
    r.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(_, o, n[i]));
  }
  return r;
}
function __PRIVATE_localTransformResults(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const i of e) {
    const e2 = i.transform, s = n.data.field(i.field);
    r.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t));
  }
  return r;
}
class __PRIVATE_DeleteMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class __PRIVATE_VerifyMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
}
class Bound {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
}
function __PRIVATE_boundCompareToDocument(e, t, n) {
  let r = 0;
  for (let i = 0; i < e.position.length; i++) {
    const s = t[i], _ = e.position[i];
    if (s.field.isKeyField()) r = DocumentKey.comparator(DocumentKey.fromName(_.referenceValue), n.key);
    else {
      r = __PRIVATE_valueCompare(_, n.data.field(s.field));
    }
    if ("desc" === s.dir && (r *= -1), 0 !== r) break;
  }
  return r;
}
function __PRIVATE_boundEquals(e, t) {
  if (null === e) return null === t;
  if (null === t) return false;
  if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return false;
  for (let n = 0; n < e.position.length; n++) {
    if (!__PRIVATE_valueEquals$1(e.position[n], t.position[n])) return false;
  }
  return true;
}
class Filter {
}
class FieldFilter extends Filter {
  constructor(e, t, n) {
    super(), this.field = e, this.op = t, this.value = n;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t, n) {
    return e.isKeyField() ? "in" === t || "not-in" === t ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : "array-contains" === t ? new __PRIVATE_ArrayContainsFilter(e, n) : "in" === t ? new __PRIVATE_InFilter(e, n) : "not-in" === t ? new __PRIVATE_NotInFilter(e, n) : "array-contains-any" === t ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new FieldFilter(e, t, n);
  }
  static createKeyFieldInFilter(e, t, n) {
    return "in" === t ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return "!=" === this.op ? null !== t && void 0 === t.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return 0 === e;
      case "!=":
        return 0 !== e;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return fail(47266, {
          operator: this.op
        });
    }
  }
  isInequality() {
    return [
      "<",
      "<=",
      ">",
      ">=",
      "!=",
      "not-in"
      /* Operator.NOT_IN */
    ].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
}
class CompositeFilter extends Filter {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.Ve = null;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t) {
    return new CompositeFilter(e, t);
  }
  matches(e) {
    return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find(((t) => !t.matches(e))) : void 0 !== this.filters.find(((t) => t.matches(e)));
  }
  getFlattenedFilters() {
    return null !== this.Ve || (this.Ve = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), this.Ve;
  }
  // Returns a mutable copy of `this.filters`
  getFilters() {
    return Object.assign([], this.filters);
  }
}
function __PRIVATE_compositeFilterIsConjunction(e) {
  return "and" === e.op;
}
function __PRIVATE_compositeFilterIsFlatConjunction(e) {
  return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
}
function __PRIVATE_compositeFilterIsFlat(e) {
  for (const t of e.filters) if (t instanceof CompositeFilter) return false;
  return true;
}
function __PRIVATE_canonifyFilter(e) {
  if (e instanceof FieldFilter)
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
  if (__PRIVATE_compositeFilterIsFlatConjunction(e))
    return e.filters.map(((e2) => __PRIVATE_canonifyFilter(e2))).join(",");
  {
    const t = e.filters.map(((e2) => __PRIVATE_canonifyFilter(e2))).join(",");
    return `${e.op}(${t})`;
  }
}
function __PRIVATE_filterEquals(e, t) {
  return e instanceof FieldFilter ? (function __PRIVATE_fieldFilterEquals(e2, t2) {
    return t2 instanceof FieldFilter && e2.op === t2.op && e2.field.isEqual(t2.field) && __PRIVATE_valueEquals$1(e2.value, t2.value);
  })(e, t) : e instanceof CompositeFilter ? (function __PRIVATE_compositeFilterEquals(e2, t2) {
    if (t2 instanceof CompositeFilter && e2.op === t2.op && e2.filters.length === t2.filters.length) {
      return e2.filters.reduce(((e3, n, r) => e3 && __PRIVATE_filterEquals(n, t2.filters[r])), true);
    }
    return false;
  })(e, t) : void fail(19439);
}
function __PRIVATE_stringifyFilter(e) {
  return e instanceof FieldFilter ? (function __PRIVATE_stringifyFieldFilter(e2) {
    return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
  })(e) : e instanceof CompositeFilter ? (function __PRIVATE_stringifyCompositeFilter(e2) {
    return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
  })(e) : "Filter";
}
class __PRIVATE_KeyFieldFilter extends FieldFilter {
  constructor(e, t, n) {
    super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
  }
  matches(e) {
    const t = DocumentKey.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
}
class __PRIVATE_KeyFieldInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
  }
  matches(e) {
    return this.keys.some(((t) => t.isEqual(e.key)));
  }
}
class __PRIVATE_KeyFieldNotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
  }
  matches(e) {
    return !this.keys.some(((t) => t.isEqual(e.key)));
  }
}
function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
  return (t.arrayValue?.values || []).map(((e2) => DocumentKey.fromName(e2.referenceValue)));
}
class __PRIVATE_ArrayContainsFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
  }
}
class __PRIVATE_InFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
}
class __PRIVATE_NotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    })) return false;
    const t = e.data.field(this.field);
    return null !== t && void 0 === t.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
}
class __PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some(((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2)));
  }
}
class OrderBy {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
}
function __PRIVATE_orderByEquals(e, t) {
  return e.dir === t.dir && e.field.isEqual(t.field);
}
class MutableDocument {
  constructor(e, t, n, r, i, s, _) {
    this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, this.data = s, this.documentState = _;
  }
  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */
  static newInvalidDocument(e) {
    return new MutableDocument(
      e,
      0,
      /* version */
      SnapshotVersion.min(),
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist with the given data at the
   * given version.
   */
  static newFoundDocument(e, t, n, r) {
    return new MutableDocument(
      e,
      1,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      n,
      r,
      0
      /* DocumentState.SYNCED */
    );
  }
  /** Creates a new document that is known to not exist at the given version. */
  static newNoDocument(e, t) {
    return new MutableDocument(
      e,
      2,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist at the given version but
   * whose data is not known (e.g. a document that was updated without a known
   * base document).
   */
  static newUnknownDocument(e, t) {
    return new MutableDocument(
      e,
      3,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      2
      /* DocumentState.HAS_COMMITTED_MUTATIONS */
    );
  }
  /**
   * Changes the document type to indicate that it exists and that its version
   * and data are known.
   */
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it doesn't exist at the given
   * version.
   */
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it exists at a given version but
   * that its data is not known (e.g. a document that was updated without a known
   * base document).
   */
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = SnapshotVersion.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return 1 === this.documentState;
  }
  get hasCommittedMutations() {
    return 2 === this.documentState;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return 0 !== this.documentType;
  }
  isFoundDocument() {
    return 1 === this.documentType;
  }
  isNoDocument() {
    return 2 === this.documentType;
  }
  isUnknownDocument() {
    return 3 === this.documentType;
  }
  isEqual(e) {
    return e instanceof MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
}
class __PRIVATE_TargetImpl {
  constructor(e, t = null, n = [], r = [], i = null, s = null, _ = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, this.startAt = s, this.endAt = _, this.de = null;
  }
}
function __PRIVATE_newTarget(e, t = null, n = [], r = [], i = null, s = null, _ = null) {
  return new __PRIVATE_TargetImpl(e, t, n, r, i, s, _);
}
function __PRIVATE_canonifyTarget(e) {
  const t = __PRIVATE_debugCast(e);
  if (null === t.de) {
    let e2 = t.path.canonicalString();
    null !== t.collectionGroup && (e2 += "|cg:" + t.collectionGroup), e2 += "|f:", e2 += t.filters.map(((e3) => __PRIVATE_canonifyFilter(e3))).join(","), e2 += "|ob:", e2 += t.orderBy.map(((e3) => (function __PRIVATE_canonifyOrderBy(e4) {
      return e4.field.canonicalString() + e4.dir;
    })(e3))).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e2 += "|l:", e2 += t.limit), t.startAt && (e2 += "|lb:", e2 += t.startAt.inclusive ? "b:" : "a:", e2 += t.startAt.position.map(((e3) => canonicalId(e3))).join(",")), t.endAt && (e2 += "|ub:", e2 += t.endAt.inclusive ? "a:" : "b:", e2 += t.endAt.position.map(((e3) => canonicalId(e3))).join(",")), t.de = e2;
  }
  return t.de;
}
function __PRIVATE_targetEquals(e, t) {
  if (e.limit !== t.limit) return false;
  if (e.orderBy.length !== t.orderBy.length) return false;
  for (let n = 0; n < e.orderBy.length; n++) if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n])) return false;
  if (e.filters.length !== t.filters.length) return false;
  for (let n = 0; n < e.filters.length; n++) if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n])) return false;
  return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
}
function __PRIVATE_targetIsPipelineTarget(e) {
  return !!e.isCorePipeline;
}
class __PRIVATE_QueryImpl {
  /**
   * Initializes a Query with a path and optional additional query constraints.
   * Path must currently be empty if this is a collection group query.
   */
  constructor(e, t = null, n = [], r = [], i = null, s = "F", _ = null, o = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, this.limit = i, this.limitType = s, this.startAt = _, this.endAt = o, this.fe = null, // The corresponding `Target` of this `Query` instance, for use with
    // non-aggregate queries.
    this.me = null, // The corresponding `Target` of this `Query` instance, for use with
    // aggregate queries. Unlike targets for non-aggregate queries,
    // aggregate query targets do not contain normalized order-bys, they only
    // contain explicit order-bys.
    this.pe = null, this.startAt, this.endAt;
  }
}
function __PRIVATE_newQuery(e, t, n, r, i, s, _, o) {
  return new __PRIVATE_QueryImpl(e, t, n, r, i, s, _, o);
}
function __PRIVATE_newQueryForPath(e) {
  return new __PRIVATE_QueryImpl(e);
}
function __PRIVATE_queryMatchesAllDocuments(e) {
  return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
}
function __PRIVATE_isDocumentQuery$1(e) {
  return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
function __PRIVATE_isCollectionGroupQuery(e) {
  return null !== e.collectionGroup;
}
function __PRIVATE_queryNormalizedOrderBy(e) {
  const t = __PRIVATE_debugCast(e);
  if (null === t.fe) {
    t.fe = [];
    const e2 = /* @__PURE__ */ new Set();
    for (const n2 of t.explicitOrderBy) t.fe.push(n2), e2.add(n2.field.canonicalString());
    const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", r = (function __PRIVATE_getInequalityFilterFields(e3) {
      let t2 = new SortedSet(FieldPath$1.comparator);
      return e3.filters.forEach(((e4) => {
        e4.getFlattenedFilters().forEach(((e5) => {
          e5.isInequality() && (t2 = t2.add(e5.field));
        }));
      })), t2;
    })(t);
    r.forEach(((r2) => {
      e2.has(r2.canonicalString()) || r2.isKeyField() || t.fe.push(new OrderBy(r2, n));
    })), // Add the document key field to the last if it is not explicitly ordered.
    e2.has(FieldPath$1.keyField().canonicalString()) || t.fe.push(new OrderBy(FieldPath$1.keyField(), n));
  }
  return t.fe;
}
function __PRIVATE_queryToTarget(e) {
  const t = __PRIVATE_debugCast(e);
  return t.me || (t.me = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.me;
}
function __PRIVATE__queryToTarget(e, t) {
  if ("F" === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
  {
    t = t.map(((e2) => {
      const t2 = "desc" === e2.dir ? "asc" : "desc";
      return new OrderBy(e2.field, t2);
    }));
    const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
  }
}
function __PRIVATE_queryWithLimit(e, t, n) {
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
}
function __PRIVATE_queryEquals(e, t) {
  return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
}
function __PRIVATE_stringifyQuery(e) {
  return `Query(target=${(function __PRIVATE_stringifyTarget(e2) {
    let t = e2.path.canonicalString();
    return null !== e2.collectionGroup && (t += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t += `, filters: [${e2.filters.map(((e3) => __PRIVATE_stringifyFilter(e3))).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t += `, orderBy: [${e2.orderBy.map(((e3) => (function __PRIVATE_stringifyOrderBy(e4) {
      return `${e4.field.canonicalString()} (${e4.dir})`;
    })(e3))).join(", ")}]`), e2.startAt && (t += ", startAt: ", t += e2.startAt.inclusive ? "b:" : "a:", t += e2.startAt.position.map(((e3) => canonicalId(e3))).join(",")), e2.endAt && (t += ", endAt: ", t += e2.endAt.inclusive ? "a:" : "b:", t += e2.endAt.position.map(((e3) => canonicalId(e3))).join(",")), `Target(${t})`;
  })(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
}
function __PRIVATE_queryMatches(e, t) {
  return t.isFoundDocument() && (function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t2) {
    const n = t2.key.path;
    return null !== e2.collectionGroup ? t2.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n) : e2.path.isImmediateParentOf(n);
  })(e, t) && (function __PRIVATE_queryMatchesOrderBy(e2, t2) {
    for (const n of __PRIVATE_queryNormalizedOrderBy(e2))
      if (!n.field.isKeyField() && null === t2.data.field(n.field)) return false;
    return true;
  })(e, t) && (function __PRIVATE_queryMatchesFilters(e2, t2) {
    for (const n of e2.filters) if (!n.matches(t2)) return false;
    return true;
  })(e, t) && (function __PRIVATE_queryMatchesBounds(e2, t2) {
    if (e2.startAt && !/**
    * Returns true if a document sorts before a bound using the provided sort
    * order.
    */
    (function __PRIVATE_boundSortsBeforeDocument(e3, t3, n) {
      const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r <= 0 : r < 0;
    })(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t2)) return false;
    if (e2.endAt && !(function __PRIVATE_boundSortsAfterDocument(e3, t3, n) {
      const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r >= 0 : r > 0;
    })(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t2)) return false;
    return true;
  })(e, t);
}
function __PRIVATE_newQueryComparator(e) {
  return (t, n) => {
    let r = false;
    for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
      const e2 = __PRIVATE_compareDocs(i, t, n);
      if (0 !== e2) return e2;
      r = r || i.field.isKeyField();
    }
    return 0;
  };
}
function __PRIVATE_compareDocs(e, t, n) {
  const r = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : (function __PRIVATE_compareDocumentsByField(e2, t2, n2) {
    const r2 = t2.data.field(e2), i = n2.data.field(e2);
    return null !== r2 && null !== i ? __PRIVATE_valueCompare(r2, i) : fail(42886);
  })(e.field, t, n);
  switch (e.dir) {
    case "asc":
      return r;
    case "desc":
      return -1 * r;
    default:
      return fail(19790, {
        direction: e.dir
      });
  }
}
var Pt, Rt;
function __PRIVATE_isPermanentError(e) {
  switch (e) {
    case D.OK:
      return fail(64938);
    case D.CANCELLED:
    case D.UNKNOWN:
    case D.DEADLINE_EXCEEDED:
    case D.RESOURCE_EXHAUSTED:
    case D.INTERNAL:
    case D.UNAVAILABLE:
    // Unauthenticated means something went wrong with our token and we need
    // to retry with new credentials which will happen automatically.
    case D.UNAUTHENTICATED:
      return false;
    case D.INVALID_ARGUMENT:
    case D.NOT_FOUND:
    case D.ALREADY_EXISTS:
    case D.PERMISSION_DENIED:
    case D.FAILED_PRECONDITION:
    // Aborted might be retried in some scenarios, but that is dependent on
    // the context and should handled individually by the calling code.
    // See https://cloud.google.com/apis/design/errors.
    case D.ABORTED:
    case D.OUT_OF_RANGE:
    case D.UNIMPLEMENTED:
    case D.DATA_LOSS:
      return true;
    default:
      return fail(15467, {
        code: e
      });
  }
}
function __PRIVATE_mapCodeFromRpcCode(e) {
  if (void 0 === e)
    return __PRIVATE_logError("GRPC error has no .code"), D.UNKNOWN;
  switch (e) {
    case Pt.OK:
      return D.OK;
    case Pt.CANCELLED:
      return D.CANCELLED;
    case Pt.UNKNOWN:
      return D.UNKNOWN;
    case Pt.DEADLINE_EXCEEDED:
      return D.DEADLINE_EXCEEDED;
    case Pt.RESOURCE_EXHAUSTED:
      return D.RESOURCE_EXHAUSTED;
    case Pt.INTERNAL:
      return D.INTERNAL;
    case Pt.UNAVAILABLE:
      return D.UNAVAILABLE;
    case Pt.UNAUTHENTICATED:
      return D.UNAUTHENTICATED;
    case Pt.INVALID_ARGUMENT:
      return D.INVALID_ARGUMENT;
    case Pt.NOT_FOUND:
      return D.NOT_FOUND;
    case Pt.ALREADY_EXISTS:
      return D.ALREADY_EXISTS;
    case Pt.PERMISSION_DENIED:
      return D.PERMISSION_DENIED;
    case Pt.FAILED_PRECONDITION:
      return D.FAILED_PRECONDITION;
    case Pt.ABORTED:
      return D.ABORTED;
    case Pt.OUT_OF_RANGE:
      return D.OUT_OF_RANGE;
    case Pt.UNIMPLEMENTED:
      return D.UNIMPLEMENTED;
    case Pt.DATA_LOSS:
      return D.DATA_LOSS;
    default:
      return fail(39323, {
        code: e
      });
  }
}
(Rt = Pt || (Pt = {}))[Rt.OK = 0] = "OK", Rt[Rt.CANCELLED = 1] = "CANCELLED", Rt[Rt.UNKNOWN = 2] = "UNKNOWN", Rt[Rt.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", Rt[Rt.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", Rt[Rt.NOT_FOUND = 5] = "NOT_FOUND", Rt[Rt.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", Rt[Rt.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", Rt[Rt.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", Rt[Rt.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", Rt[Rt.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", Rt[Rt.ABORTED = 10] = "ABORTED", Rt[Rt.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", Rt[Rt.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", Rt[Rt.INTERNAL = 13] = "INTERNAL", Rt[Rt.UNAVAILABLE = 14] = "UNAVAILABLE", Rt[Rt.DATA_LOSS = 15] = "DATA_LOSS";
class ObjectMap {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    this.inner = {}, /** The number of entries stored in the map */
    this.innerSize = 0;
  }
  /** Get a value for this key, or undefined if it does not exist. */
  get(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (void 0 !== n) {
      for (const [t2, r] of n) if (this.equalsFn(t2, e)) return r;
    }
  }
  has(e) {
    return void 0 !== this.get(e);
  }
  /** Put this key and value in the map. */
  set(e, t) {
    const n = this.mapKeyFn(e), r = this.inner[n];
    if (void 0 === r) return this.inner[n] = [[e, t]], void this.innerSize++;
    for (let n2 = 0; n2 < r.length; n2++) if (this.equalsFn(r[n2][0], e))
      return void (r[n2] = [e, t]);
    r.push([e, t]), this.innerSize++;
  }
  /**
   * Remove this key from the map. Returns a boolean if anything was deleted.
   */
  delete(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (void 0 === n) return false;
    for (let r = 0; r < n.length; r++) if (this.equalsFn(n[r][0], e)) return 1 === n.length ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, true;
    return false;
  }
  forEach(e) {
    forEach(this.inner, ((t, n) => {
      for (const [t2, r] of n) e(t2, r);
    }));
  }
  isEmpty() {
    return isEmpty(this.inner);
  }
  size() {
    return this.innerSize;
  }
}
const It = new SortedMap(DocumentKey.comparator);
function __PRIVATE_mutableDocumentMap() {
  return It;
}
const At = new SortedMap(DocumentKey.comparator);
function documentMap(...e) {
  let t = At;
  for (const n of e) t = t.insert(n.key, n);
  return t;
}
function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
  let t = At;
  return e.forEach(((e2, n) => t = t.insert(e2, n.overlayedDocument))), t;
}
function __PRIVATE_newOverlayMap() {
  return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newMutationMap() {
  return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newDocumentKeyMap() {
  return new ObjectMap(((e) => e.toString()), ((e, t) => e.isEqual(t)));
}
const Vt = new SortedMap(DocumentKey.comparator);
const dt = new SortedSet(DocumentKey.comparator);
function __PRIVATE_documentKeySet(...e) {
  let t = dt;
  for (const n of e) t = t.add(n);
  return t;
}
const ft = new SortedSet(__PRIVATE_primitiveComparator);
function __PRIVATE_targetIdSet() {
  return ft;
}
new Integer([4294967295, 4294967295], 0);
class JsonProtoSerializer {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
}
function toTimestamp(e, t) {
  if (e.useProto3Json) {
    return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + t.seconds,
    nanos: t.nanoseconds
  };
}
function fromTimestamp(e) {
  const t = __PRIVATE_normalizeTimestamp(e);
  return new Timestamp(t.seconds, t.nanos);
}
function __PRIVATE_toBytes(e, t) {
  return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}
function __PRIVATE_toVersion(e, t) {
  return toTimestamp(e, t.toTimestamp());
}
function __PRIVATE_fromVersion(e) {
  return __PRIVATE_hardAssert(!!e, 49232), SnapshotVersion.fromTimestamp(fromTimestamp(e));
}
function __PRIVATE_toResourceName(e, t) {
  return __PRIVATE_toResourcePath(e, t).canonicalString();
}
function __PRIVATE_toResourcePath(e, t) {
  const n = (function __PRIVATE_fullyQualifiedPrefixPath(e2) {
    return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
  })(e).child("documents");
  return void 0 === t ? n : n.child(t);
}
function __PRIVATE_fromResourceName(e) {
  const t = ResourcePath.fromString(e);
  return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t), 10190, {
    key: t.toString()
  }), t;
}
function __PRIVATE_toName(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t.path);
}
function __PRIVATE_fromQueryPath(e) {
  const t = __PRIVATE_fromResourceName(e);
  return 4 === t.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
}
function __PRIVATE_getEncodedDatabaseId(e) {
  return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
}
function __PRIVATE_extractLocalPathFromResourceName(e) {
  return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4), 29091, {
    key: e.toString()
  }), e.popFirst(5);
}
function __PRIVATE_toMutationDocument(e, t, n) {
  return {
    name: __PRIVATE_toName(e, t),
    fields: n.value.mapValue.fields
  };
}
function toMutation(e, t) {
  let n;
  if (t instanceof __PRIVATE_SetMutation) n = {
    update: __PRIVATE_toMutationDocument(e, t.key, t.value)
  };
  else if (t instanceof __PRIVATE_DeleteMutation) n = {
    delete: __PRIVATE_toName(e, t.key)
  };
  else if (t instanceof __PRIVATE_PatchMutation) n = {
    update: __PRIVATE_toMutationDocument(e, t.key, t.data),
    updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
  };
  else {
    if (!(t instanceof __PRIVATE_VerifyMutation)) return fail(16599, {
      gt: t.type
    });
    n = {
      verify: __PRIVATE_toName(e, t.key)
    };
  }
  return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map(((e2) => (function __PRIVATE_toFieldTransform(e3, t2) {
    const n2 = t2.transform;
    if (n2 instanceof __PRIVATE_ServerTimestampTransform) return {
      fieldPath: t2.field.canonicalString(),
      setToServerValue: "REQUEST_TIME"
    };
    if (n2 instanceof __PRIVATE_ArrayUnionTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      appendMissingElements: {
        values: n2.elements
      }
    };
    if (n2 instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      removeAllFromArray: {
        values: n2.elements
      }
    };
    if (n2 instanceof __PRIVATE_NumericIncrementTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      increment: n2.Re
    };
    if (n2 instanceof __PRIVATE_NumericMinimumTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      minimum: n2.Re
    };
    if (n2 instanceof __PRIVATE_NumericMaximumTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      maximum: n2.Re
    };
    throw fail(20930, {
      transform: t2.transform
    });
  })(0, e2)))), t.precondition.isNone || (n.currentDocument = (function __PRIVATE_toPrecondition(e2, t2) {
    return void 0 !== t2.updateTime ? {
      updateTime: __PRIVATE_toVersion(e2, t2.updateTime)
    } : void 0 !== t2.exists ? {
      exists: t2.exists
    } : fail(27497);
  })(e, t.precondition)), n;
}
function __PRIVATE_fromWriteResults(e, t) {
  return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t, 14353), e.map(((e2) => (function __PRIVATE_fromWriteResult(e3, t2) {
    let n = e3.updateTime ? __PRIVATE_fromVersion(e3.updateTime) : __PRIVATE_fromVersion(t2);
    return n.isEqual(SnapshotVersion.min()) && // The Firestore Emulator currently returns an update time of 0 for
    // deletes of non-existing documents (rather than null). This breaks the
    // test "get deleted doc while offline with source=cache" as NoDocuments
    // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
    // TODO(#2149): Remove this when Emulator is fixed
    (n = __PRIVATE_fromVersion(t2)), new MutationResult(n, e3.transformResults || []);
  })(e2, t)))) : [];
}
function __PRIVATE_convertQueryTargetToQuery(e) {
  let t = __PRIVATE_fromQueryPath(e.parent);
  const n = e.structuredQuery, r = n.from ? n.from.length : 0;
  let i = null;
  if (r > 0) {
    __PRIVATE_hardAssert(1 === r, 65062);
    const e2 = n.from[0];
    e2.allDescendants ? i = e2.collectionId : t = t.child(e2.collectionId);
  }
  let s = [];
  n.where && (s = (function __PRIVATE_fromFilters(e2) {
    const t2 = __PRIVATE_fromFilter(e2);
    if (t2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t2)) return t2.getFilters();
    return [t2];
  })(n.where));
  let _ = [];
  n.orderBy && (_ = (function __PRIVATE_fromOrder(e2) {
    return e2.map(((e3) => (function __PRIVATE_fromPropertyOrder(e4) {
      return new OrderBy(
        __PRIVATE_fromFieldPathReference(e4.field),
        // visible for testing
        (function __PRIVATE_fromDirection(e5) {
          switch (e5) {
            case "ASCENDING":
              return "asc";
            case "DESCENDING":
              return "desc";
            default:
              return;
          }
        })(e4.direction)
      );
    })(e3)));
  })(n.orderBy));
  let o = null;
  n.limit && (o = (function __PRIVATE_fromInt32Proto(e2) {
    let t2;
    return t2 = "object" == typeof e2 ? e2.value : e2, __PRIVATE_isNullOrUndefined(t2) ? null : t2;
  })(n.limit));
  let a = null;
  n.startAt && (a = (function __PRIVATE_fromStartAtCursor(e2) {
    const t2 = !!e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  })(n.startAt));
  let u = null;
  return n.endAt && (u = (function __PRIVATE_fromEndAtCursor(e2) {
    const t2 = !e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  })(n.endAt)), __PRIVATE_newQuery(t, i, _, s, o, "F", a, u);
}
function __PRIVATE_fromFilter(e) {
  return void 0 !== e.unaryFilter ? (function __PRIVATE_fromUnaryFilter(e2) {
    switch (e2.unaryFilter.op) {
      case "IS_NAN":
        const t = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(t, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const r = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(r, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      case "OPERATOR_UNSPECIFIED":
        return fail(61313);
      default:
        return fail(60726);
    }
  })(e) : void 0 !== e.fieldFilter ? (function __PRIVATE_fromFieldFilter(e2) {
    return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), (function __PRIVATE_fromOperatorName(e3) {
      switch (e3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        case "OPERATOR_UNSPECIFIED":
          return fail(58110);
        default:
          return fail(50506);
      }
    })(e2.fieldFilter.op), e2.fieldFilter.value);
  })(e) : void 0 !== e.compositeFilter ? (function __PRIVATE_fromCompositeFilter(e2) {
    return CompositeFilter.create(e2.compositeFilter.filters.map(((e3) => __PRIVATE_fromFilter(e3))), (function __PRIVATE_fromCompositeOperatorName(e3) {
      switch (e3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return fail(1026);
      }
    })(e2.compositeFilter.op));
  })(e) : fail(30097, {
    filter: e
  });
}
function __PRIVATE_fromFieldPathReference(e) {
  return FieldPath$1.fromServerFormat(e.fieldPath);
}
function __PRIVATE_toDocumentMask(e) {
  const t = [];
  return e.fields.forEach(((e2) => t.push(e2.canonicalString()))), {
    fieldPaths: t
  };
}
function __PRIVATE_isValidResourceName(e) {
  return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
}
function __PRIVATE_isProtoValueSerializable(e) {
  return !!e && "function" == typeof e._toProto && "ProtoValue" === e._protoValueType;
}
function toMapValue(e, t) {
  const n = {
    fields: {}
  };
  return t.forEach(((t2, r) => {
    if ("string" != typeof r) throw new Error(`Cannot encode map with non-string key: ${r}`);
    n.fields[r] = t2._toProto(e);
  })), {
    mapValue: n
  };
}
function __PRIVATE_toStringValue(e) {
  return {
    stringValue: e
  };
}
function __PRIVATE_newSerializer(e) {
  return new JsonProtoSerializer(
    e,
    /* useProto3Json= */
    true
  );
}
class Bytes {
  /** @hideconstructor */
  constructor(e) {
    this._byteString = e;
  }
  /**
   * Creates a new `Bytes` object from the given Base64 string, converting it to
   * bytes.
   *
   * @param base64 - The Base64 string used to create the `Bytes` object.
   */
  static fromBase64String(e) {
    try {
      return new Bytes(ByteString.fromBase64String(e));
    } catch (e2) {
      throw new FirestoreError(D.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
    }
  }
  /**
   * Creates a new `Bytes` object from the given Uint8Array.
   *
   * @param array - The Uint8Array used to create the `Bytes` object.
   */
  static fromUint8Array(e) {
    return new Bytes(ByteString.fromUint8Array(e));
  }
  /**
   * Returns the underlying bytes as a Base64-encoded string.
   *
   * @returns The Base64-encoded string created from the `Bytes` object.
   */
  toBase64() {
    return this._byteString.toBase64();
  }
  /**
   * Returns the underlying bytes in a new `Uint8Array`.
   *
   * @returns The Uint8Array created from the `Bytes` object.
   */
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  /**
   * Returns a string representation of the `Bytes` object.
   *
   * @returns A string representation of the `Bytes` object.
   */
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  /**
   * Returns true if this `Bytes` object is equal to the provided one.
   *
   * @param other - The `Bytes` object to compare against.
   * @returns true if this `Bytes` object is equal to the provided one.
   */
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
  /**
   * Returns a JSON-serializable representation of this `Bytes` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: Bytes._jsonSchemaVersion,
      bytes: this.toBase64()
    };
  }
  /**
   * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
   *
   * @param json - a JSON object represention of a `Bytes` instance
   * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, Bytes._jsonSchema)) return Bytes.fromBase64String(e.bytes);
  }
}
Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
  type: property("string", Bytes._jsonSchemaVersion),
  bytes: property("string")
};
class FieldPath {
  /**
   * Creates a `FieldPath` from the provided field names. If more than one field
   * name is provided, the path will point to a nested field in a document.
   *
   * @param fieldNames - A list of field names.
   */
  constructor(...e) {
    for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new FieldPath$1(e);
  }
  /**
   * Returns true if this `FieldPath` is equal to the provided one.
   *
   * @param other - The `FieldPath` to compare against.
   * @returns true if this `FieldPath` is equal to the provided one.
   */
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
}
function documentId$1() {
  return new FieldPath(F);
}
class FieldValue {
  /**
   * @param _methodName - The public API endpoint that returns this class.
   * @hideconstructor
   */
  constructor(e) {
    this._methodName = e;
  }
}
class GeoPoint {
  /**
   * Creates a new immutable `GeoPoint` object with the provided latitude and
   * longitude values.
   * @param latitude - The latitude as number between -90 and 90.
   * @param longitude - The longitude as number between -180 and 180.
   */
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(D.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180) throw new FirestoreError(D.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  /**
   * The latitude of this `GeoPoint` instance.
   */
  get latitude() {
    return this._lat;
  }
  /**
   * The longitude of this `GeoPoint` instance.
   */
  get longitude() {
    return this._long;
  }
  /**
   * Returns true if this `GeoPoint` is equal to the provided one.
   *
   * @param other - The `GeoPoint` to compare against.
   * @returns true if this `GeoPoint` is equal to the provided one.
   */
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  /**
   * Actually private to JS consumers of our API, so this function is prefixed
   * with an underscore.
   */
  _compareTo(e) {
    return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
  }
  /**
   * Returns a JSON-serializable representation of this `GeoPoint` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long,
      type: GeoPoint._jsonSchemaVersion
    };
  }
  /**
   * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
   *
   * @param json - a JSON object represention of a `GeoPoint` instance
   * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, GeoPoint._jsonSchema)) return new GeoPoint(e.latitude, e.longitude);
  }
}
function __PRIVATE_cloneLongPollingOptions(e) {
  const t = {};
  return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
}
GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
  type: property("string", GeoPoint._jsonSchemaVersion),
  latitude: property("number"),
  longitude: property("number")
};
class __PRIVATE_NoopConnectivityMonitor {
  bt(e) {
  }
  shutdown() {
  }
}
const vt = "ConnectivityMonitor";
class __PRIVATE_BrowserConnectivityMonitor {
  constructor() {
    this.vt = () => this.St(), this.Dt = () => this.xt(), this.Ct = [], this.Ft();
  }
  bt(e) {
    this.Ct.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.vt), window.removeEventListener("offline", this.Dt);
  }
  Ft() {
    window.addEventListener("online", this.vt), window.addEventListener("offline", this.Dt);
  }
  St() {
    __PRIVATE_logDebug(vt, "Network connectivity changed: AVAILABLE");
    for (const e of this.Ct) e(
      0
      /* NetworkStatus.AVAILABLE */
    );
  }
  xt() {
    __PRIVATE_logDebug(vt, "Network connectivity changed: UNAVAILABLE");
    for (const e of this.Ct) e(
      1
      /* NetworkStatus.UNAVAILABLE */
    );
  }
  // TODO(chenbrian): Consider passing in window either into this component or
  // here for testing via FakeWindow.
  /** Checks that all used attributes of window are available. */
  static C() {
    return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
  }
}
let St = null;
function __PRIVATE_generateUniqueDebugId() {
  return null === St ? St = (function __PRIVATE_generateInitialUniqueDebugId() {
    return 268435456 + Math.round(2147483648 * Math.random());
  })() : St++, "0x" + St.toString(16);
}
const Dt = "RestConnection", xt = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery",
  ExecutePipeline: "executePipeline"
};
class __PRIVATE_RestConnection {
  get Ot() {
    return false;
  }
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
    this.Mt = t + "://" + e.host, this.Nt = `projects/${n}/databases/${r}`, this.Lt = this.databaseId.database === st ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
  }
  Bt(e, t, n, r, i) {
    const s = __PRIVATE_generateUniqueDebugId(), _ = this.Ut(e, t.toUriEncodedString());
    __PRIVATE_logDebug(Dt, `Sending RPC '${e}' ${s}:`, _, n);
    const a = {
      "google-cloud-resource-prefix": this.Nt,
      "x-goog-request-params": this.Lt
    };
    this.kt(a, r, i);
    const { host: u } = new URL(_), c = isCloudWorkstation(u);
    return this.qt(e, _, a, n, c).then(((t2) => (__PRIVATE_logDebug(Dt, `Received RPC '${e}' ${s}: `, t2), t2)), ((t2) => {
      throw __PRIVATE_logWarn(Dt, `RPC '${e}' ${s} failed with error: `, t2, "url: ", _, "request:", n), t2;
    }));
  }
  $t(e, t, n, r, i, s) {
    return this.Bt(e, t, n, r, i);
  }
  /**
   * Modifies the headers for a request, adding any authorization token if
   * present and any additional headers for the request.
   */
  kt(e, t, n) {
    e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
    // so we need to get its value when we need it in a function.
    (function __PRIVATE_getGoogApiClientValue() {
      return "gl-js/ fire/" + v;
    })(), // Content-Type: text/plain will avoid preflight requests which might
    // mess with CORS and redirects by proxies. If we add custom headers
    // we will need to change this code to potentially use the $httpOverwrite
    // parameter supported by ESF to avoid triggering preflight requests.
    e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach(((t2, n2) => e[n2] = t2)), n && n.headers.forEach(((t2, n2) => e[n2] = t2));
  }
  Ut(e, t) {
    const n = xt[e];
    let r = `${this.Mt}/v1/${t}:${n}`;
    return this.databaseInfo.apiKey && (r = `${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), r;
  }
  /**
   * Closes and cleans up any resources associated with the connection. This
   * implementation is a no-op because there are no resources associated
   * with the RestConnection that need to be cleaned up.
   */
  terminate() {
  }
}
class __PRIVATE_StreamBridge {
  constructor(e) {
    this.Kt = e.Kt, this.Wt = e.Wt;
  }
  Qt(e) {
    this.Gt = e;
  }
  zt(e) {
    this.jt = e;
  }
  Ht(e) {
    this.Jt = e;
  }
  onMessage(e) {
    this.Yt = e;
  }
  close() {
    this.Wt();
  }
  send(e) {
    this.Kt(e);
  }
  Zt() {
    this.Gt();
  }
  Xt() {
    this.jt();
  }
  en(e) {
    this.Jt(e);
  }
  tn(e) {
    this.Yt(e);
  }
}
const Ct = "WebChannelConnection", __PRIVATE_unguardedEventListen = (e, t, n) => {
  e.listen(t, ((e2) => {
    try {
      n(e2);
    } catch (e3) {
      setTimeout((() => {
        throw e3;
      }), 0);
    }
  }));
};
class __PRIVATE_WebChannelConnection extends __PRIVATE_RestConnection {
  constructor(e) {
    super(e), /** A collection of open WebChannel instances */
    this.nn = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  /**
   * Initialize STAT_EVENT listener once. Subsequent calls are a no-op.
   * getStatEventTarget() returns the same target every time.
   */
  static rn() {
    if (!__PRIVATE_WebChannelConnection.sn) {
      const e = getStatEventTarget();
      __PRIVATE_unguardedEventListen(e, Event.STAT_EVENT, ((e2) => {
        e2.stat === Stat.PROXY ? __PRIVATE_logDebug(Ct, "STAT_EVENT: detected buffering proxy") : e2.stat === Stat.NOPROXY && __PRIVATE_logDebug(Ct, "STAT_EVENT: detected no buffering proxy");
      })), __PRIVATE_WebChannelConnection.sn = true;
    }
  }
  qt(e, t, n, r, i) {
    const s = __PRIVATE_generateUniqueDebugId();
    return new Promise(((i2, _) => {
      const o = new XhrIo();
      o.setWithCredentials(true), o.listenOnce(EventType.COMPLETE, (() => {
        try {
          switch (o.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const t2 = o.getResponseJson();
              __PRIVATE_logDebug(Ct, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(t2)), i2(t2);
              break;
            case ErrorCode.TIMEOUT:
              __PRIVATE_logDebug(Ct, `RPC '${e}' ${s} timed out`), _(new FirestoreError(D.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n2 = o.getStatus();
              if (__PRIVATE_logDebug(Ct, `RPC '${e}' ${s} failed with status:`, n2, "response text:", o.getResponseText()), n2 > 0) {
                let e2 = o.getResponseJson();
                Array.isArray(e2) && (e2 = e2[0]);
                const t3 = e2?.error;
                if (t3 && t3.status && t3.message) {
                  const e3 = (function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                    const t4 = e4.toLowerCase().replace(/_/g, "-");
                    return Object.values(D).indexOf(t4) >= 0 ? t4 : D.UNKNOWN;
                  })(t3.status);
                  _(new FirestoreError(e3, t3.message));
                } else _(new FirestoreError(D.UNKNOWN, "Server responded with status " + o.getStatus()));
              } else
                _(new FirestoreError(D.UNAVAILABLE, "Connection failed."));
              break;
            default:
              fail(9055, {
                _n: e,
                streamId: s,
                an: o.getLastErrorCode(),
                un: o.getLastError()
              });
          }
        } finally {
          __PRIVATE_logDebug(Ct, `RPC '${e}' ${s} completed.`);
        }
      }));
      const a = JSON.stringify(r);
      __PRIVATE_logDebug(Ct, `RPC '${e}' ${s} sending request:`, r), o.send(t, "POST", a, n, 15);
    }));
  }
  cn(e, t, n) {
    const r = __PRIVATE_generateUniqueDebugId(), i = [this.Mt, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = this.createWebChannelTransport(), _ = {
      // Required for backend stickiness, routing behavior is based on this
      // parameter.
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        // This param is used to improve routing and project isolation by the
        // backend and must be included in every request.
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        // Override the default timeout (randomized between 10-20 seconds) since
        // a large write batch on a slow internet connection may take a long
        // time to send to the backend. Rather than have WebChannel impose a
        // tight timeout which could lead to infinite timeouts and retries, we
        // set it very large (5-10 minutes) and rely on the browser's builtin
        // timeouts to kick in if the request isn't working.
        forwardChannelRequestTimeoutMs: 6e5
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, o = this.longPollingOptions.timeoutSeconds;
    void 0 !== o && (_.longPollingTimeout = Math.round(1e3 * o)), this.useFetchStreams && (_.useFetchStreams = true), this.kt(_.initMessageHeaders, t, n), // Sending the custom headers we just added to request.initMessageHeaders
    // (Authorization, etc.) will trigger the browser to make a CORS preflight
    // request because the XHR will no longer meet the criteria for a "simple"
    // CORS request:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
    // Therefore to avoid the CORS preflight request (an extra network
    // roundtrip), we use the encodeInitMessageHeaders option to specify that
    // the headers should instead be encoded in the request's POST payload,
    // which is recognized by the webchannel backend.
    _.encodeInitMessageHeaders = true;
    const a = i.join("");
    __PRIVATE_logDebug(Ct, `Creating RPC '${e}' stream ${r}: ${a}`, _);
    const u = s.createWebChannel(a, _);
    this.En(u);
    let c = false, l = false;
    const E = new __PRIVATE_StreamBridge({
      Kt: (t2) => {
        l ? __PRIVATE_logDebug(Ct, `Not sending because RPC '${e}' stream ${r} is closed:`, t2) : (c || (__PRIVATE_logDebug(Ct, `Opening RPC '${e}' stream ${r} transport.`), u.open(), c = true), __PRIVATE_logDebug(Ct, `RPC '${e}' stream ${r} sending:`, t2), u.send(t2));
      },
      Wt: () => u.close()
    });
    return __PRIVATE_unguardedEventListen(u, WebChannel.EventType.OPEN, (() => {
      l || (__PRIVATE_logDebug(Ct, `RPC '${e}' stream ${r} transport opened.`), E.Zt());
    })), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.CLOSE, (() => {
      l || (l = true, __PRIVATE_logDebug(Ct, `RPC '${e}' stream ${r} transport closed`), E.en(), this.hn(u));
    })), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.ERROR, ((t2) => {
      l || (l = true, __PRIVATE_logWarn(Ct, `RPC '${e}' stream ${r} transport errored. Name:`, t2.name, "Message:", t2.message), E.en(new FirestoreError(D.UNAVAILABLE, "The operation could not be completed")));
    })), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.MESSAGE, ((t2) => {
      if (!l) {
        const n2 = t2.data[0];
        __PRIVATE_hardAssert(!!n2, 16349);
        const i2 = n2, s2 = i2?.error || i2[0]?.error;
        if (s2) {
          __PRIVATE_logDebug(Ct, `RPC '${e}' stream ${r} received error:`, s2);
          const t3 = s2.status;
          let n3 = (
            /**
            * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
            *
            * @returns The Code equivalent to the given status string or undefined if
            *     there is no match.
            */
            (function __PRIVATE_mapCodeFromRpcStatus(e2) {
              const t4 = Pt[e2];
              if (void 0 !== t4) return __PRIVATE_mapCodeFromRpcCode(t4);
            })(t3)
          ), i3 = s2.message;
          "NOT_FOUND" === t3 && i3.includes("database") && i3.includes("does not exist") && i3.includes(this.databaseId.database) && __PRIVATE_logWarn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`), void 0 === n3 && (n3 = D.INTERNAL, i3 = "Unknown error status: " + t3 + " with message " + s2.message), // Mark closed so no further events are propagated
          l = true, E.en(new FirestoreError(n3, i3)), u.close();
        } else __PRIVATE_logDebug(Ct, `RPC '${e}' stream ${r} received:`, n2), E.tn(n2);
      }
    })), // Ensure that event listeners are configured for STAT_EVENTs.
    __PRIVATE_WebChannelConnection.rn(), setTimeout((() => {
      E.Xt();
    }), 0), E;
  }
  /**
   * Closes and cleans up any resources associated with the connection.
   */
  terminate() {
    this.nn.forEach(((e) => e.close())), this.nn = [];
  }
  /**
   * Add a WebChannel instance to the collection of open instances.
   * @param webChannel
   */
  En(e) {
    this.nn.push(e);
  }
  /**
   * Remove a WebChannel instance from the collection of open instances.
   * @param webChannel
   */
  hn(e) {
    this.nn = this.nn.filter(((t) => t === e));
  }
  /**
   * Modifies the headers for a request, adding the api key if present,
   * and then calling super.modifyHeadersForRequest
   */
  kt(e, t, n) {
    super.kt(e, t, n), // For web channel streams, we want to send the api key in the headers.
    this.databaseInfo.apiKey && (e["x-goog-api-key"] = this.databaseInfo.apiKey);
  }
  /**
   * Wrapped for mocking.
   * @protected
   */
  createWebChannelTransport() {
    return createWebChannelTransport();
  }
}
function __PRIVATE_newConnection(e) {
  return new __PRIVATE_WebChannelConnection(e);
}
__PRIVATE_WebChannelConnection.sn = false;
class __PRIVATE_ExponentialBackoff {
  constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
    this.Tn = e, this.timerId = t, this.Pn = n, this.Rn = r, this.In = i, this.An = 0, this.Vn = null, /** The last backoff attempt, as epoch milliseconds. */
    this.dn = Date.now(), this.reset();
  }
  /**
   * Resets the backoff delay.
   *
   * The very next backoffAndWait() will have no delay. If it is called again
   * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
   * subsequent ones will increase according to the backoffFactor.
   */
  reset() {
    this.An = 0;
  }
  /**
   * Resets the backoff delay to the maximum delay (e.g. for use after a
   * RESOURCE_EXHAUSTED error).
   */
  fn() {
    this.An = this.In;
  }
  /**
   * Returns a promise that resolves after currentDelayMs, and increases the
   * delay for any subsequent attempts. If there was a pending backoff operation
   * already, it will be canceled.
   */
  mn(e) {
    this.cancel();
    const t = Math.floor(this.An + this.pn()), n = Math.max(0, Date.now() - this.dn), r = Math.max(0, t - n);
    r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.An} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.Vn = this.Tn.enqueueAfterDelay(this.timerId, r, (() => (this.dn = Date.now(), e()))), // Apply backoff factor to determine next delay and ensure it is within
    // bounds.
    this.An *= this.Rn, this.An < this.Pn && (this.An = this.Pn), this.An > this.In && (this.An = this.In);
  }
  gn() {
    null !== this.Vn && (this.Vn.skipDelay(), this.Vn = null);
  }
  cancel() {
    null !== this.Vn && (this.Vn.cancel(), this.Vn = null);
  }
  /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
  pn() {
    return (Math.random() - 0.5) * this.An;
  }
}
const Ft = "PersistentStream";
class __PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s, _, o) {
    this.Tn = e, this.yn = n, this.wn = r, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = _, this.listener = o, this.state = 0, /**
     * A close count that's incremented every time the stream is closed; used by
     * getCloseGuardedDispatcher() to invalidate callbacks that happen after
     * close.
     */
    this.bn = 0, this.vn = null, this.Sn = null, this.stream = null, /**
     * Count of response messages received.
     */
    this.Dn = 0, this.xn = new __PRIVATE_ExponentialBackoff(e, t);
  }
  /**
   * Returns true if start() has been called and no error has occurred. True
   * indicates the stream is open or in the process of opening (which
   * encompasses respecting backoff, getting auth tokens, and starting the
   * actual RPC). Use isOpen() to determine if the stream is open and ready for
   * outbound requests.
   */
  Cn() {
    return 1 === this.state || 5 === this.state || this.Fn();
  }
  /**
   * Returns true if the underlying RPC is open (the onOpen() listener has been
   * called) and the stream is ready for outbound requests.
   */
  Fn() {
    return 2 === this.state || 3 === this.state;
  }
  /**
   * Starts the RPC. Only allowed if isStarted() returns false. The stream is
   * not immediately ready for use: onOpen() will be invoked when the RPC is
   * ready for outbound requests, at which point isOpen() will return true.
   *
   * When start returns, isStarted() will return true.
   */
  start() {
    this.Dn = 0, 4 !== this.state ? this.auth() : this.On();
  }
  /**
   * Stops the RPC. This call is idempotent and allowed regardless of the
   * current isStarted() state.
   *
   * When stop returns, isStarted() and isOpen() will both return false.
   */
  async stop() {
    this.Cn() && await this.close(
      0
      /* PersistentStreamState.Initial */
    );
  }
  /**
   * After an error the stream will usually back off on the next attempt to
   * start it. If the error warrants an immediate restart of the stream, the
   * sender can use this to indicate that the receiver should not back off.
   *
   * Each error will call the onClose() listener. That function can decide to
   * inhibit backoff if required.
   */
  Mn() {
    this.state = 0, this.xn.reset();
  }
  /**
   * Marks this stream as idle. If no further actions are performed on the
   * stream for one minute, the stream will automatically close itself and
   * notify the stream's onClose() handler with Status.OK. The stream will then
   * be in a !isStarted() state, requiring the caller to start the stream again
   * before further use.
   *
   * Only streams that are in state 'Open' can be marked idle, as all other
   * states imply pending network operations.
   */
  Nn() {
    this.Fn() && null === this.vn && (this.vn = this.Tn.enqueueAfterDelay(this.yn, 6e4, (() => this.Ln())));
  }
  /** Sends a message to the underlying stream. */
  Bn(e) {
    this.Un(), this.stream.send(e);
  }
  /** Called by the idle timer when the stream should close due to inactivity. */
  async Ln() {
    if (this.Fn())
      return this.close(
        0
        /* PersistentStreamState.Initial */
      );
  }
  /** Marks the stream as active again. */
  Un() {
    this.vn && (this.vn.cancel(), this.vn = null);
  }
  /** Cancels the health check delayed operation. */
  kn() {
    this.Sn && (this.Sn.cancel(), this.Sn = null);
  }
  /**
   * Closes the stream and cleans up as necessary:
   *
   * * closes the underlying GRPC stream;
   * * calls the onClose handler with the given 'error';
   * * sets internal stream state to 'finalState';
   * * adjusts the backoff timer based on the error
   *
   * A new stream can be opened by calling start().
   *
   * @param finalState - the intended state of the stream after closing.
   * @param error - the error the connection was closed with.
   */
  async close(e, t) {
    this.Un(), this.kn(), this.xn.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
    // underlying stream), guaranteeing they won't execute.
    this.bn++, 4 !== e ? (
      // If this is an intentional close ensure we don't delay our next connection attempt.
      this.xn.reset()
    ) : t && t.code === D.RESOURCE_EXHAUSTED ? (
      // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
      (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.xn.fn())
    ) : t && t.code === D.UNAUTHENTICATED && 3 !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
    // happen since both Auth and AppCheck ensure a sufficient TTL when we
    // request a token. If a user manually resets their system clock this can
    // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
    // before we received the first message and we need to invalidate the token
    // to ensure that we fetch a new token.
    (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
    null !== this.stream && (this.qn(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
    // inhibit backoff or otherwise manipulate the state in its non-started state.
    this.state = e, // Notify the listener that the stream closed.
    await this.listener.Ht(t);
  }
  /**
   * Can be overridden to perform additional cleanup before the stream is closed.
   * Calling super.tearDown() is not required.
   */
  qn() {
  }
  auth() {
    this.state = 1;
    const e = this.$n(this.bn), t = this.bn;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then((([e2, n]) => {
      this.bn === t && // Normally we'd have to schedule the callback on the AsyncQueue.
      // However, the following calls are safe to be called outside the
      // AsyncQueue since they don't chain asynchronous calls
      this.Kn(e2, n);
    }), ((t2) => {
      e((() => {
        const e2 = new FirestoreError(D.UNKNOWN, "Fetching auth token failed: " + t2.message);
        return this.Wn(e2);
      }));
    }));
  }
  Kn(e, t) {
    const n = this.$n(this.bn);
    this.stream = this.Qn(e, t), this.stream.Qt((() => {
      n((() => this.listener.Qt()));
    })), this.stream.zt((() => {
      n((() => (this.state = 2, this.Sn = this.Tn.enqueueAfterDelay(this.wn, 1e4, (() => (this.Fn() && (this.state = 3), Promise.resolve()))), this.listener.zt())));
    })), this.stream.Ht(((e2) => {
      n((() => this.Wn(e2)));
    })), this.stream.onMessage(((e2) => {
      n((() => 1 == ++this.Dn ? this.Gn(e2) : this.onNext(e2)));
    }));
  }
  On() {
    this.state = 5, this.xn.mn((async () => {
      this.state = 0, this.start();
    }));
  }
  // Visible for tests
  Wn(e) {
    return __PRIVATE_logDebug(Ft, `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  /**
   * Returns a "dispatcher" function that dispatches operations onto the
   * AsyncQueue but only runs them if closeCount remains unchanged. This allows
   * us to turn auth / stream callbacks into no-ops if the stream is closed /
   * re-opened, etc.
   */
  $n(e) {
    return (t) => {
      this.Tn.enqueueAndForget((() => this.bn === e ? t() : (__PRIVATE_logDebug(Ft, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve())));
    };
  }
}
class __PRIVATE_PersistentWriteStream extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
  }
  /**
   * Tracks whether or not a handshake has been successfully exchanged and
   * the stream is ready to accept mutations.
   */
  get Jn() {
    return this.Dn > 0;
  }
  // Override of PersistentStream.start
  start() {
    this.lastStreamToken = void 0, super.start();
  }
  qn() {
    this.Jn && this.Yn([]);
  }
  Qn(e, t) {
    return this.connection.cn("Write", e, t);
  }
  Gn(e) {
    return __PRIVATE_hardAssert(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, // The first response is always the handshake response
    __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length, 55816), this.listener.Zn();
  }
  onNext(e) {
    __PRIVATE_hardAssert(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, // A successful first write response means the stream is healthy,
    // Note, that we could consider a successful handshake healthy, however,
    // the write itself might be causing an error we want to back off from.
    this.xn.reset();
    const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
    return this.listener.Xn(n, t);
  }
  /**
   * Sends an initial streamToken to the server, performing the handshake
   * required to make the StreamingWrite RPC work. Subsequent
   * calls should wait until onHandshakeComplete was called.
   */
  er() {
    const e = {};
    e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.Bn(e);
  }
  /** Sends a group of mutations to the Firestore backend to apply. */
  Yn(e) {
    const t = {
      streamToken: this.lastStreamToken,
      writes: e.map(((e2) => toMutation(this.serializer, e2)))
    };
    this.Bn(t);
  }
}
class Datastore {
}
class __PRIVATE_DatastoreImpl extends Datastore {
  constructor(e, t, n, r) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r, this.tr = false;
  }
  nr() {
    if (this.tr) throw new FirestoreError(D.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  /** Invokes the provided RPC with auth and AppCheck tokens. */
  Bt(e, t, n, r) {
    return this.nr(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([i, s]) => this.connection.Bt(e, __PRIVATE_toResourcePath(t, n), r, i, s))).catch(((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === D.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(D.UNKNOWN, e2.toString());
    }));
  }
  /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
  $t(e, t, n, r, i) {
    return this.nr(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([s, _]) => this.connection.$t(e, __PRIVATE_toResourcePath(t, n), r, s, _, i))).catch(((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === D.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(D.UNKNOWN, e2.toString());
    }));
  }
  terminate() {
    this.tr = true, this.connection.terminate();
  }
}
function __PRIVATE_newDatastore(e, t, n, r) {
  return new __PRIVATE_DatastoreImpl(e, t, n, r);
}
const Ot = "ComponentProvider", Mt = /* @__PURE__ */ new Map();
function __PRIVATE_makeDatabaseInfo(e, t, n, r, i) {
  return new DatabaseInfo(e, t, n, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, r);
}
const Nt = {
  didRun: false,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
}, Lt = 41943040;
class LruParams {
  static withCacheSize(e) {
    return new LruParams(e, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
  constructor(e, t, n) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
  }
}
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(Lt, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
const Bt = "LruGarbageCollector", Ut = 1048576;
function __PRIVATE_bufferEntryComparator([e, t], [n, r]) {
  const i = __PRIVATE_primitiveComparator(e, n);
  return 0 === i ? __PRIVATE_primitiveComparator(t, r) : i;
}
class __PRIVATE_RollingSequenceNumberBuffer {
  constructor(e) {
    this.rr = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.ir = 0;
  }
  sr() {
    return ++this.ir;
  }
  _r(e) {
    const t = [e, this.sr()];
    if (this.buffer.size < this.rr) this.buffer = this.buffer.add(t);
    else {
      const e2 = this.buffer.last();
      __PRIVATE_bufferEntryComparator(t, e2) < 0 && (this.buffer = this.buffer.delete(e2).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
}
class __PRIVATE_LruScheduler {
  constructor(e, t, n) {
    this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.ar = null;
  }
  start() {
    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.ur(6e4);
  }
  stop() {
    this.ar && (this.ar.cancel(), this.ar = null);
  }
  get started() {
    return null !== this.ar;
  }
  ur(e) {
    __PRIVATE_logDebug(Bt, `Garbage collection scheduled in ${e}ms`), this.ar = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, (async () => {
      this.ar = null;
      try {
        await this.localStore.collectGarbage(this.garbageCollector);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug(Bt, "Ignoring IndexedDB error during garbage collection: ", e2) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      await this.ur(3e5);
    }));
  }
}
class __PRIVATE_LruGarbageCollectorImpl {
  constructor(e, t) {
    this.cr = e, this.params = t;
  }
  calculateTargetCount(e, t) {
    return this.cr.lr(e).next(((e2) => Math.floor(t / 100 * e2)));
  }
  nthSequenceNumber(e, t) {
    if (0 === t) return PersistencePromise.resolve(__PRIVATE_ListenSequence.ce);
    const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
    return this.cr.forEachTarget(e, ((e2) => n._r(e2.sequenceNumber))).next((() => this.cr.Er(e, ((e2) => n._r(e2))))).next((() => n.maxValue));
  }
  removeTargets(e, t, n) {
    return this.cr.removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    return this.cr.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(Nt)) : this.getCacheSize(e).next(((n) => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Nt) : this.hr(e, t)));
  }
  getCacheSize(e) {
    return this.cr.getCacheSize(e);
  }
  hr(e, t) {
    let n, r, i, s, _, o, a;
    const u = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next(((t2) => (
      // Cap at the configured max
      (t2 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t2}`), r = this.params.maximumSequenceNumbersToCollect) : r = t2, s = Date.now(), this.nthSequenceNumber(e, r))
    ))).next(((r2) => (n = r2, _ = Date.now(), this.removeTargets(e, n, t)))).next(((t2) => (i = t2, o = Date.now(), this.removeOrphanedDocuments(e, n)))).next(((e2) => {
      if (a = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
        __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${s - u}ms
	Determined least recently used ${r} in ` + (_ - s) + `ms
	Removed ${i} targets in ` + (o - _) + `ms
	Removed ${e2} documents in ` + (a - o) + `ms
Total Duration: ${a - u}ms`);
      }
      return PersistencePromise.resolve({
        didRun: true,
        sequenceNumbersCollected: r,
        targetsRemoved: i,
        documentsRemoved: e2
      });
    }));
  }
}
function __PRIVATE_newLruGarbageCollector(e, t) {
  return new __PRIVATE_LruGarbageCollectorImpl(e, t);
}
const kt = "firestore.googleapis.com", qt = true;
class FirestoreSettingsImpl {
  constructor(e) {
    if (void 0 === e.host) {
      if (void 0 !== e.ssl) throw new FirestoreError(D.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = kt, this.ssl = qt;
    } else this.host = e.host, this.ssl = e.ssl ?? qt;
    if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, void 0 === e.cacheSizeBytes) this.cacheSizeBytes = Lt;
    else {
      if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < Ut) throw new FirestoreError(D.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
      // For backwards compatibility, coerce the value to boolean even though
      // the TypeScript compiler has narrowed the type to boolean already.
      // noinspection PointlessBooleanExpressionJS
      this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
    ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(e.experimentalLongPollingOptions ?? {}), (function __PRIVATE_validateLongPollingOptions(e2) {
      if (void 0 !== e2.timeoutSeconds) {
        if (isNaN(e2.timeoutSeconds)) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    })(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && /**
    * @license
    * Copyright 2023 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
    /**
    * Compares two `ExperimentalLongPollingOptions` objects for equality.
    */
    (function __PRIVATE_longPollingOptionsEqual(e2, t) {
      return e2.timeoutSeconds === t.timeoutSeconds;
    })(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
}
class Firestore$1 {
  /** @hideconstructor */
  constructor(e, t, n, r) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r, /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false, this._emulatorOptions = {}, // A task that is assigned when the terminate() is invoked and resolved when
    // all components have shut down. Otherwise, Firestore is not terminated,
    // which can mean either the FirestoreClient is in the process of starting,
    // or restarting.
    this._terminateTask = "notTerminated";
  }
  /**
   * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
   * instance.
   */
  get app() {
    if (!this._app) throw new FirestoreError(D.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return "notTerminated" !== this._terminateTask;
  }
  _setSettings(e) {
    if (this._settingsFrozen) throw new FirestoreError(D.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, void 0 !== e.credentials && (this._authCredentials = (function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2) return new __PRIVATE_EmptyAuthCredentialsProvider();
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(D.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    })(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _getEmulatorOptions() {
    return this._emulatorOptions;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), this._terminateTask;
  }
  async _restart() {
    "notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
  }
  /** Returns a JSON-serializable representation of this `Firestore` instance. */
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  /**
   * Terminates all components used by this client. Subclasses can override
   * this method to clean up their own dependencies, but must also call this
   * method.
   *
   * Only ever called once.
   */
  _terminate() {
    return (function __PRIVATE_removeComponents(e) {
      const t = Mt.get(e);
      t && (__PRIVATE_logDebug(Ot, "Removing Datastore"), Mt.delete(e), t.terminate());
    })(this), Promise.resolve();
  }
}
function connectFirestoreEmulator(e, t, n, r = {}) {
  e = __PRIVATE_cast(e, Firestore$1);
  const i = isCloudWorkstation(t), s = e._getSettings(), _ = {
    ...s,
    emulatorOptions: e._getEmulatorOptions()
  }, l = `${t}:${n}`;
  i && pingServer(`https://${l}`), s.host !== kt && s.host !== l && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
  const E = {
    ...s,
    host: l,
    ssl: i,
    emulatorOptions: r
  };
  if (!deepEqual(E, _) && (e._setSettings(E), r.mockUserToken)) {
    let t2, n2;
    if ("string" == typeof r.mockUserToken) t2 = r.mockUserToken, n2 = User.MOCK_USER;
    else {
      t2 = createMockUserToken(r.mockUserToken, e._app?.options.projectId);
      const i2 = r.mockUserToken.sub || r.mockUserToken.user_id;
      if (!i2) throw new FirestoreError(D.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      n2 = new User(i2);
    }
    e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, n2));
  }
}
class Query {
  // This is the lite version of the Query class in the main SDK.
  /** @hideconstructor protected */
  constructor(e, t, n) {
    this.converter = t, this._query = n, /** The type of this Firestore reference. */
    this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new Query(this.firestore, e, this._query);
  }
}
class DocumentReference {
  /** @hideconstructor */
  constructor(e, t, n) {
    this.converter = t, this._key = n, /** The type of this Firestore reference. */
    this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  /**
   * The document's identifier within its collection.
   */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path() {
    return this._key.path.canonicalString();
  }
  /**
   * The collection this `DocumentReference` belongs to.
   */
  get parent() {
    return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new DocumentReference(this.firestore, e, this._key);
  }
  /**
   * Returns a JSON-serializable representation of this `DocumentReference` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: DocumentReference._jsonSchemaVersion,
      referencePath: this._key.toString()
    };
  }
  static fromJSON(e, t, n) {
    if (__PRIVATE_validateJSON(t, DocumentReference._jsonSchema)) return new DocumentReference(e, n || null, new DocumentKey(ResourcePath.fromString(t.referencePath)));
  }
}
DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
  type: property("string", DocumentReference._jsonSchemaVersion),
  referencePath: property("string")
};
class CollectionReference extends Query {
  /** @hideconstructor */
  constructor(e, t, n) {
    super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, /** The type of this Firestore reference. */
    this.type = "collection";
  }
  /** The collection's identifier. */
  get id() {
    return this._query.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  get path() {
    return this._query.path.canonicalString();
  }
  /**
   * A reference to the containing `DocumentReference` if this is a
   * subcollection. If this isn't a subcollection, the reference is null.
   */
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      new DocumentKey(e)
    );
  }
  withConverter(e) {
    return new CollectionReference(this.firestore, e, this._path);
  }
}
function collection(e, t, ...n) {
  if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
    const r = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateCollectionPath(r), new CollectionReference(
      e,
      /* converter= */
      null,
      r
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(D.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateCollectionPath(r), new CollectionReference(
      e.firestore,
      /* converter= */
      null,
      r
    );
  }
}
function doc(e, t, ...n) {
  if (e = getModularInstance(e), // We allow omission of 'pathString' but explicitly prohibit passing in both
  // 'undefined' and 'null'.
  1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof Firestore$1) {
    const r = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateDocumentPath(r), new DocumentReference(
      e,
      /* converter= */
      null,
      new DocumentKey(r)
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(D.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateDocumentPath(r), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r));
  }
}
class VectorValue {
  /**
   * @private
   * @internal
   */
  constructor(e) {
    this._values = (e || []).map(((e2) => e2));
  }
  /**
   * Returns a copy of the raw number array form of the vector.
   */
  toArray() {
    return this._values.map(((e) => e));
  }
  /**
   * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
   */
  isEqual(e) {
    return (function __PRIVATE_isPrimitiveArrayEqual(e2, t) {
      if (e2.length !== t.length) return false;
      for (let n = 0; n < e2.length; ++n) if (e2[n] !== t[n]) return false;
      return true;
    })(this._values, e._values);
  }
  /**
   * Returns a JSON-serializable representation of this `VectorValue` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: VectorValue._jsonSchemaVersion,
      vectorValues: this._values
    };
  }
  /**
   * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
   *
   * @param json - a JSON object represention of a `VectorValue` instance.
   * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, VectorValue._jsonSchema)) {
      if (Array.isArray(e.vectorValues) && e.vectorValues.every(((e2) => "number" == typeof e2))) return new VectorValue(e.vectorValues);
      throw new FirestoreError(D.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
    }
  }
}
VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
  type: property("string", VectorValue._jsonSchemaVersion),
  vectorValues: property("object")
};
const $t = /^__.*__$/;
class ParsedSetData {
  constructor(e, t, n) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = n;
  }
  toMutation(e, t) {
    return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
  }
}
function __PRIVATE_isWrite(e) {
  switch (e) {
    case 0:
    // fall through
    case 2:
    // fall through
    case 1:
      return true;
    case 3:
    case 4:
      return false;
    default:
      throw fail(40011, {
        dataSource: e
      });
  }
}
class ParseContextImpl {
  /**
   * Initializes a ParseContext with the given source and path.
   *
   * @param settings - The settings for the parser.
   * @param databaseId - The database ID of the Firestore instance.
   * @param serializer - The serializer to use to generate the Value proto.
   * @param ignoreUndefinedProperties - Whether to ignore undefined properties
   * rather than throw.
   * @param fieldTransforms - A mutable list of field transforms encountered
   * while parsing the data.
   * @param fieldMask - A mutable list of field paths encountered while parsing
   * the data.
   *
   * TODO(b/34871131): We don't support array paths right now, so path can be
   * null to indicate the context represents any location within an array (in
   * which case certain features will not work and errors will be somewhat
   * compromised).
   */
  constructor(e, t, n, r, i, s) {
    this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r, // Minor hack: If fieldTransforms is undefined, we assume this is an
    // external call and we need to validate the entire path.
    void 0 === i && this.validatePath(), this.fieldTransforms = i || [], this.fieldMask = s || [];
  }
  get path() {
    return this.settings.path;
  }
  get dataSource() {
    return this.settings.dataSource;
  }
  /** Returns a new context with the specified settings overwritten. */
  contextWith(e) {
    return new ParseContextImpl({
      ...this.settings,
      ...e
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  childContextForField(e) {
    const t = this.path?.child(e), n = this.contextWith({
      path: t,
      arrayElement: false
    });
    return n.validatePathSegment(e), n;
  }
  childContextForFieldPath(e) {
    const t = this.path?.child(e), n = this.contextWith({
      path: t,
      arrayElement: false
    });
    return n.validatePath(), n;
  }
  childContextForArray(e) {
    return this.contextWith({
      path: void 0,
      arrayElement: true
    });
  }
  createError(e) {
    return createError(e, this.settings.methodName, this.settings.hasConverter || false, this.path, this.settings.targetDoc);
  }
  /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
  contains(e) {
    return void 0 !== this.fieldMask.find(((t) => e.isPrefixOf(t))) || void 0 !== this.fieldTransforms.find(((t) => e.isPrefixOf(t.field)));
  }
  validatePath() {
    if (this.path) for (let e = 0; e < this.path.length; e++) this.validatePathSegment(this.path.get(e));
  }
  validatePathSegment(e) {
    if (0 === e.length) throw this.createError("Document fields must not be empty");
    if (__PRIVATE_isWrite(this.dataSource) && $t.test(e)) throw this.createError('Document fields cannot begin and end with "__"');
  }
}
class UserDataReader {
  constructor(e, t, n) {
    this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || __PRIVATE_newSerializer(e);
  }
  /** Creates a new top-level parse context. */
  createContext(e, t, n, r = false) {
    return new ParseContextImpl({
      dataSource: e,
      methodName: t,
      targetDoc: n,
      path: FieldPath$1.emptyPath(),
      arrayElement: false,
      hasConverter: r
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
}
function __PRIVATE_newUserDataReader(e) {
  const t = e._freezeSettings(), n = __PRIVATE_newSerializer(e._databaseId);
  return new UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, n);
}
function __PRIVATE_parseSetData(e, t, n, r, i, s = {}) {
  const _ = e.createContext(s.merge || s.mergeFields ? 2 : 0, t, n, i);
  __PRIVATE_validatePlainObject("Data must be an object, but it was:", _, r);
  const o = __PRIVATE_parseObject(r, _);
  let a, u;
  if (s.merge) a = new FieldMask(_.fieldMask), u = _.fieldTransforms;
  else if (s.mergeFields) {
    const e2 = [];
    for (const r2 of s.mergeFields) {
      const i2 = __PRIVATE_fieldPathFromArgument(t, r2, n);
      if (!_.contains(i2)) throw new FirestoreError(D.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
      __PRIVATE_fieldMaskContains(e2, i2) || e2.push(i2);
    }
    a = new FieldMask(e2), u = _.fieldTransforms.filter(((e3) => a.covers(e3.field)));
  } else a = null, u = _.fieldTransforms;
  return new ParsedSetData(new ObjectValue(o), a, u);
}
function __PRIVATE_parseData(e, t, n) {
  if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    e = getModularInstance(e)
  )) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), __PRIVATE_parseObject(e, t);
  if (e instanceof FieldValue)
    return (function __PRIVATE_parseSentinelFieldValue(e2, t2) {
      if (!__PRIVATE_isWrite(t2.dataSource)) throw t2.createError(`${e2._methodName}() can only be used with update() and set()`);
      if (!t2.path) throw t2.createError(`${e2._methodName}() is not currently supported inside arrays`);
      const n2 = e2._toFieldTransform(t2);
      n2 && t2.fieldTransforms.push(n2);
    })(e, t), null;
  if (void 0 === e && t.ignoreUndefinedProperties)
    return null;
  if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    t.path && t.fieldMask.push(t.path), e instanceof Array
  ) {
    if (t.settings.arrayElement && 4 !== t.dataSource) throw t.createError("Nested arrays are not supported");
    return (function __PRIVATE_parseArray(e2, t2) {
      const n2 = [];
      let r = 0;
      for (const i of e2) {
        let e3 = __PRIVATE_parseData(i, t2.childContextForArray(r));
        null == e3 && // Just include nulls in the array for fields being replaced with a
        // sentinel.
        (e3 = {
          nullValue: "NULL_VALUE"
        }), n2.push(e3), r++;
      }
      return {
        arrayValue: {
          values: n2
        }
      };
    })(e, t);
  }
  return (function __PRIVATE_parseScalarValue(e2, t2, n2) {
    if (null === (e2 = getModularInstance(e2))) return {
      nullValue: "NULL_VALUE"
    };
    if ("number" == typeof e2) return toNumber(t2.serializer, e2, n2);
    if ("boolean" == typeof e2) return {
      booleanValue: e2
    };
    if ("string" == typeof e2) return {
      stringValue: e2
    };
    if (e2 instanceof Date) {
      const n3 = Timestamp.fromDate(e2);
      return {
        timestampValue: toTimestamp(t2.serializer, n3)
      };
    }
    if (e2 instanceof Timestamp) {
      const n3 = new Timestamp(e2.seconds, 1e3 * Math.floor(e2.nanoseconds / 1e3));
      return {
        timestampValue: toTimestamp(t2.serializer, n3)
      };
    }
    if (e2 instanceof GeoPoint) return {
      geoPointValue: {
        latitude: e2.latitude,
        longitude: e2.longitude
      }
    };
    if (e2 instanceof Bytes) return {
      bytesValue: __PRIVATE_toBytes(t2.serializer, e2._byteString)
    };
    if (e2 instanceof DocumentReference) {
      const n3 = t2.databaseId, r = e2.firestore._databaseId;
      if (!r.isEqual(n3)) throw t2.createError(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n3.projectId}/${n3.database}`);
      return {
        referenceValue: __PRIVATE_toResourceName(e2.firestore._databaseId || t2.databaseId, e2._key.path)
      };
    }
    if (e2 instanceof VectorValue)
      return (function __PRIVATE_parseVectorValue(e3, t3) {
        const n3 = e3 instanceof VectorValue ? e3.toArray() : e3, r = {
          fields: {
            [_t]: {
              stringValue: ut
            },
            [ct]: {
              arrayValue: {
                values: n3.map(((e4) => {
                  if ("number" != typeof e4) throw t3.createError("VectorValues must only contain numeric values.");
                  return __PRIVATE_toDouble(t3.serializer, e4);
                }))
              }
            }
          }
        };
        return {
          mapValue: r
        };
      })(e2, t2);
    if (__PRIVATE_isProtoValueSerializable(e2)) return e2._toProto(t2.serializer);
    throw t2.createError(`Unsupported field value: ${__PRIVATE_valueDescription(e2)}`);
  })(e, t, n);
}
function __PRIVATE_parseObject(e, t) {
  const n = {};
  return isEmpty(e) ? (
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    t.path && t.path.length > 0 && t.fieldMask.push(t.path)
  ) : forEach(e, ((e2, r) => {
    const i = __PRIVATE_parseData(r, t.childContextForField(e2));
    null != i && (n[e2] = i);
  })), {
    mapValue: {
      fields: n
    }
  };
}
function __PRIVATE_looksLikeJsonObject(e) {
  return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue || __PRIVATE_isProtoValueSerializable(e));
}
function __PRIVATE_validatePlainObject(e, t, n) {
  if (!__PRIVATE_looksLikeJsonObject(n) || !__PRIVATE_isPlainObject(n)) {
    const r = __PRIVATE_valueDescription(n);
    throw "an object" === r ? t.createError(e + " a custom object") : t.createError(e + " " + r);
  }
}
function __PRIVATE_fieldPathFromArgument(e, t, n) {
  if (
    // If required, replace the FieldPath Compat class with the firestore-exp
    // FieldPath.
    (t = getModularInstance(t)) instanceof FieldPath
  ) return t._internalPath;
  if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
  throw createError(
    "Field path arguments must be of type string or ",
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n
  );
}
const Kt$1 = new RegExp("[~\\*/\\[\\]]");
function __PRIVATE_fieldPathFromDotSeparatedString(e, t, n) {
  if (t.search(Kt$1) >= 0) throw createError(
    `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n
  );
  try {
    return new FieldPath(...t.split("."))._internalPath;
  } catch (r) {
    throw createError(
      `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
  }
}
function createError(e, t, n, r, i) {
  const s = r && !r.isEmpty(), _ = void 0 !== i;
  let o = `Function ${t}() called with invalid data`;
  n && (o += " (via `toFirestore()`)"), o += ". ";
  let a = "";
  return (s || _) && (a += " (found", s && (a += ` in field ${r}`), _ && (a += ` in document ${i}`), a += ")"), new FirestoreError(D.INVALID_ARGUMENT, o + e + a);
}
function __PRIVATE_fieldMaskContains(e, t) {
  return e.some(((e2) => e2.isEqual(t)));
}
function __PRIVATE_isUserData(e) {
  return "function" == typeof e._readUserData;
}
class OptionsUtil {
  constructor(e) {
    this.optionDefinitions = e;
  }
  _getKnownOptions(e, t) {
    const n = ObjectValue.empty();
    for (const r in this.optionDefinitions) if (this.optionDefinitions.hasOwnProperty(r)) {
      const i = this.optionDefinitions[r];
      if (r in e) {
        const s = e[r];
        let _;
        if (i.nestedOptions && __PRIVATE_isPlainObject(s)) {
          _ = {
            mapValue: {
              fields: new OptionsUtil(i.nestedOptions).getOptionsProto(t, s)
            }
          };
        } else s && (_ = __PRIVATE_parseData(s, t) ?? void 0);
        _ && n.set(FieldPath$1.fromServerFormat(i.serverName), _);
      }
    }
    return n;
  }
  getOptionsProto(e, t, n) {
    const r = this._getKnownOptions(t, e);
    if (n) {
      const t2 = new Map(__PRIVATE_mapToArray(n, ((t3, n2) => [FieldPath$1.fromServerFormat(n2), void 0 !== t3 ? __PRIVATE_parseData(t3, e) : null])));
      r.setAll(t2);
    }
    return r.value.mapValue.fields ?? {};
  }
}
function __PRIVATE_isFirestoreValue(e) {
  return "object" == typeof e && null !== e && !!("nullValue" in e && (null === e.nullValue || "NULL_VALUE" === e.nullValue) || "booleanValue" in e && (null === e.booleanValue || "boolean" == typeof e.booleanValue) || "integerValue" in e && (null === e.integerValue || "number" == typeof e.integerValue || "string" == typeof e.integerValue) || "doubleValue" in e && (null === e.doubleValue || "number" == typeof e.doubleValue) || "timestampValue" in e && (null === e.timestampValue || (function __PRIVATE_isITimestamp(e2) {
    return "object" == typeof e2 && null !== e2 && "seconds" in e2 && (null === e2.seconds || "number" == typeof e2.seconds || "string" == typeof e2.seconds) && "nanos" in e2 && (null === e2.nanos || "number" == typeof e2.nanos);
  })(e.timestampValue)) || "stringValue" in e && (null === e.stringValue || "string" == typeof e.stringValue) || "bytesValue" in e && (null === e.bytesValue || e.bytesValue instanceof Uint8Array) || "referenceValue" in e && (null === e.referenceValue || "string" == typeof e.referenceValue) || "geoPointValue" in e && (null === e.geoPointValue || (function __PRIVATE_isILatLng(e2) {
    return "object" == typeof e2 && null !== e2 && "latitude" in e2 && (null === e2.latitude || "number" == typeof e2.latitude) && "longitude" in e2 && (null === e2.longitude || "number" == typeof e2.longitude);
  })(e.geoPointValue)) || "arrayValue" in e && (null === e.arrayValue || (function __PRIVATE_isIArrayValue(e2) {
    return "object" == typeof e2 && null !== e2 && !(!("values" in e2) || null !== e2.values && !Array.isArray(e2.values));
  })(e.arrayValue)) || "mapValue" in e && (null === e.mapValue || (function __PRIVATE_isIMapValue(e2) {
    return "object" == typeof e2 && null !== e2 && !(!("fields" in e2) || null !== e2.fields && !__PRIVATE_isPlainObject(e2.fields));
  })(e.mapValue)) || "fieldReferenceValue" in e && (null === e.fieldReferenceValue || "string" == typeof e.fieldReferenceValue) || "functionValue" in e && (null === e.functionValue || (function __PRIVATE_isIFunction(e2) {
    return "object" == typeof e2 && null !== e2 && !(!("name" in e2) || null !== e2.name && "string" != typeof e2.name || !("args" in e2) || null !== e2.args && !Array.isArray(e2.args));
  })(e.functionValue)) || "pipelineValue" in e && (null === e.pipelineValue || (function __PRIVATE_isIPipeline(e2) {
    return "object" == typeof e2 && null !== e2 && !(!("stages" in e2) || null !== e2.stages && !Array.isArray(e2.stages));
  })(e.pipelineValue)));
}
function vector(e) {
  return new VectorValue(e);
}
function __PRIVATE_valueToDefaultExpr(e) {
  let t;
  return e instanceof Expression ? e : (t = __PRIVATE_isPlainObject(e) ? __PRIVATE__map(e) : e instanceof Array ? array(e) : __PRIVATE__constant(e, void 0), t);
}
function __PRIVATE_vectorToExpr(e) {
  if (e instanceof Expression) return e;
  if (e instanceof VectorValue) return constant(e);
  if (Array.isArray(e)) return constant(vector(e));
  throw new Error("Unsupported value: " + typeof e);
}
function __PRIVATE_fieldOrExpression(e) {
  if (__PRIVATE_isString$1(e)) {
    return field(e);
  }
  return __PRIVATE_valueToDefaultExpr(e);
}
class Expression {
  constructor() {
    this._protoValueType = "ProtoValue";
  }
  /**
   * Creates an expression that adds this expression to another expression.
   *
   * @example
   * ```typescript
   * // Add the value of the 'quantity' field and the 'reserve' field.
   * field("quantity").add(field("reserve"));
   * ```
   *
   * @param second - The expression or literal to add to this expression.
   * @param others - Optional additional expressions or literals to add to this expression.
   * @returns A new `Expression` representing the addition operation.
   */
  add(e) {
    return new FunctionExpression("add", [this, __PRIVATE_valueToDefaultExpr(e)], "add");
  }
  /**
   * Wraps the expression in a [BooleanExpression].
   *
   * @returns A [BooleanExpression] representing the same expression.
   */
  asBoolean() {
    if (this instanceof BooleanExpression) return this;
    if (this instanceof Constant) return new __PRIVATE_BooleanConstant(this);
    if (this instanceof Field) return new __PRIVATE_BooleanField(this);
    if (this instanceof FunctionExpression) return new __PRIVATE_BooleanFunctionExpression(this);
    throw new FirestoreError("invalid-argument", `Conversion of type ${typeof this} to BooleanExpression not supported.`);
  }
  subtract(e) {
    return new FunctionExpression("subtract", [this, __PRIVATE_valueToDefaultExpr(e)], "subtract");
  }
  /**
   * Creates an expression that multiplies this expression by another expression.
   *
   * @example
   * ```typescript
   * // Multiply the 'quantity' field by the 'price' field
   * field("quantity").multiply(field("price"));
   * ```
   *
   * @param second - The second expression or literal to multiply by.
   * @param others - Optional additional expressions or literals to multiply by.
   * @returns A new `Expression` representing the multiplication operation.
   */
  multiply(e) {
    return new FunctionExpression("multiply", [this, __PRIVATE_valueToDefaultExpr(e)], "multiply");
  }
  divide(e) {
    return new FunctionExpression("divide", [this, __PRIVATE_valueToDefaultExpr(e)], "divide");
  }
  mod(e) {
    return new FunctionExpression("mod", [this, __PRIVATE_valueToDefaultExpr(e)], "mod");
  }
  equal(e) {
    return new FunctionExpression("equal", [this, __PRIVATE_valueToDefaultExpr(e)], "equal").asBoolean();
  }
  notEqual(e) {
    return new FunctionExpression("not_equal", [this, __PRIVATE_valueToDefaultExpr(e)], "notEqual").asBoolean();
  }
  lessThan(e) {
    return new FunctionExpression("less_than", [this, __PRIVATE_valueToDefaultExpr(e)], "lessThan").asBoolean();
  }
  lessThanOrEqual(e) {
    return new FunctionExpression("less_than_or_equal", [this, __PRIVATE_valueToDefaultExpr(e)], "lessThanOrEqual").asBoolean();
  }
  greaterThan(e) {
    return new FunctionExpression("greater_than", [this, __PRIVATE_valueToDefaultExpr(e)], "greaterThan").asBoolean();
  }
  greaterThanOrEqual(e) {
    return new FunctionExpression("greater_than_or_equal", [this, __PRIVATE_valueToDefaultExpr(e)], "greaterThanOrEqual").asBoolean();
  }
  /**
   * Creates an expression that concatenates an array expression with one or more other arrays.
   *
   * @example
   * ```typescript
   * // Combine the 'items' array with another array field.
   * field("items").arrayConcat(field("otherItems"));
   * ```
   * @param secondArray - Second array expression or array literal to concatenate.
   * @param otherArrays - Optional additional array expressions or array literals to concatenate.
   * @returns A new `Expression` representing the concatenated array.
   */
  arrayConcat(e, ...t) {
    const n = [e, ...t].map(((e2) => __PRIVATE_valueToDefaultExpr(e2)));
    return new FunctionExpression("array_concat", [this, ...n], "arrayConcat");
  }
  arrayContains(e) {
    return new FunctionExpression("array_contains", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayContains").asBoolean();
  }
  arrayContainsAll(e) {
    const t = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr), "arrayContainsAll") : e;
    return new FunctionExpression("array_contains_all", [this, t], "arrayContainsAll").asBoolean();
  }
  arrayContainsAny(e) {
    const t = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr), "arrayContainsAny") : e;
    return new FunctionExpression("array_contains_any", [this, t], "arrayContainsAny").asBoolean();
  }
  /**
   * Creates an expression that reverses an array.
   *
   * @example
   * ```typescript
   * // Reverse the value of the 'myArray' field.
   * field("myArray").arrayReverse();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed array.
   */
  arrayReverse() {
    return new FunctionExpression("array_reverse", [this]);
  }
  /**
   * Creates an expression that calculates the length of an array.
   *
   * @example
   * ```typescript
   * // Get the number of items in the 'cart' array
   * field("cart").arrayLength();
   * ```
   *
   * @returns A new `Expression` representing the length of the array.
   */
  arrayLength() {
    return new FunctionExpression("array_length", [this], "arrayLength");
  }
  equalAny(e) {
    const t = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr), "equalAny") : e;
    return new FunctionExpression("equal_any", [this, t], "equalAny").asBoolean();
  }
  notEqualAny(e) {
    const t = Array.isArray(e) ? new __PRIVATE_ListOfExprs(e.map(__PRIVATE_valueToDefaultExpr), "notEqualAny") : e;
    return new FunctionExpression("not_equal_any", [this, t], "notEqualAny").asBoolean();
  }
  /**
   * Creates an expression that checks if a field exists in the document.
   *
   * @example
   * ```typescript
   * // Check if the document has a field named "phoneNumber"
   * field("phoneNumber").exists();
   * ```
   *
   * @returns A new `Expression` representing the 'exists' check.
   */
  exists() {
    return new FunctionExpression("exists", [this], "exists").asBoolean();
  }
  /**
   * Creates an expression that calculates the character length of a string in UTF-8.
   *
   * @example
   * ```typescript
   * // Get the character length of the 'name' field in its UTF-8 form.
   * field("name").charLength();
   * ```
   *
   * @returns A new `Expression` representing the length of the string.
   */
  charLength() {
    return new FunctionExpression("char_length", [this], "charLength");
  }
  like(e) {
    return new FunctionExpression("like", [this, __PRIVATE_valueToDefaultExpr(e)], "like").asBoolean();
  }
  regexContains(e) {
    return new FunctionExpression("regex_contains", [this, __PRIVATE_valueToDefaultExpr(e)], "regexContains").asBoolean();
  }
  regexFind(e) {
    return new FunctionExpression("regex_find", [this, __PRIVATE_valueToDefaultExpr(e)], "regexFind");
  }
  regexFindAll(e) {
    return new FunctionExpression("regex_find_all", [this, __PRIVATE_valueToDefaultExpr(e)], "regexFindAll");
  }
  regexMatch(e) {
    return new FunctionExpression("regex_match", [this, __PRIVATE_valueToDefaultExpr(e)], "regexMatch").asBoolean();
  }
  stringContains(e) {
    return new FunctionExpression("string_contains", [this, __PRIVATE_valueToDefaultExpr(e)], "stringContains").asBoolean();
  }
  startsWith(e) {
    return new FunctionExpression("starts_with", [this, __PRIVATE_valueToDefaultExpr(e)], "startsWith").asBoolean();
  }
  endsWith(e) {
    return new FunctionExpression("ends_with", [this, __PRIVATE_valueToDefaultExpr(e)], "endsWith").asBoolean();
  }
  /**
   * Creates an expression that converts a string to lowercase.
   *
   * @example
   * ```typescript
   * // Convert the 'name' field to lowercase
   * field("name").toLower();
   * ```
   *
   * @returns A new `Expression` representing the lowercase string.
   */
  toLower() {
    return new FunctionExpression("to_lower", [this], "toLower");
  }
  /**
   * Creates an expression that converts a string to uppercase.
   *
   * @example
   * ```typescript
   * // Convert the 'title' field to uppercase
   * field("title").toUpper();
   * ```
   *
   * @returns A new `Expression` representing the uppercase string.
   */
  toUpper() {
    return new FunctionExpression("to_upper", [this], "toUpper");
  }
  /**
   * Creates an expression that removes leading and trailing characters from a string or byte array.
   *
   * @example
   * ```typescript
   * // Trim whitespace from the 'userInput' field
   * field("userInput").trim();
   *
   * // Trim quotes from the 'userInput' field
   * field("userInput").trim('"');
   * ```
   * @param valueToTrim - Optional This parameter is treated as a set of characters or bytes that will be
   * trimmed from the input. If not specified, then whitespace will be trimmed.
   * @returns A new `Expression` representing the trimmed string or byte array.
   */
  trim(e) {
    const t = [this];
    return e && t.push(__PRIVATE_valueToDefaultExpr(e)), new FunctionExpression("trim", t, "trim");
  }
  /**
   * Trims whitespace or a specified set of characters/bytes from the beginning of a string or byte array.
   *
   * @example
   * ```typescript
   * // Trim whitespace from the beginning of the 'userInput' field
   * field("userInput").ltrim();
   *
   * // Trim quotes from the beginning of the 'userInput' field
   * field("userInput").ltrim('"');
   * ```
   *
   * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
   * If not specified, whitespace will be trimmed.
   * @returns A new `Expression` representing the trimmed string.
   */
  ltrim(e) {
    const t = [this];
    return e && t.push(__PRIVATE_valueToDefaultExpr(e)), new FunctionExpression("ltrim", t, "ltrim");
  }
  /**
   * Trims whitespace or a specified set of characters/bytes from the end of a string or byte array.
   *
   * @example
   * ```typescript
   * // Trim whitespace from the end of the 'userInput' field
   * field("userInput").rtrim();
   *
   * // Trim quotes from the end of the 'userInput' field
   * field("userInput").rtrim('"');
   * ```
   *
   * @param valueToTrim - Optional. A string or byte array containing the characters/bytes to trim.
   * If not specified, whitespace will be trimmed.
   * @returns A new `Expression` representing the trimmed string or byte array.
   */
  rtrim(e) {
    const t = [this];
    return e && t.push(__PRIVATE_valueToDefaultExpr(e)), new FunctionExpression("rtrim", t, "rtrim");
  }
  /**
   * Creates an expression that returns the data type of this expression's result, as a string.
   *
   * @remarks
   * This is evaluated on the backend. This means:
   * 1. Generic typed elements (like `array<string>`) evaluate strictly to the primitive `'array'`.
   * 2. Any custom `FirestoreDataConverter` mappings are ignored.
   * 3. For numeric values, the backend does not yield the JavaScript `"number"` type; it evaluates
   *    precisely as `"int64"` or `"float64"`.
   * 4. For date or timestamp objects, the backend evaluates to `"timestamp"`.
   *
   * @example
   * ```typescript
   * // Get the data type of the value in field 'title'
   * field('title').type()
   * ```
   *
   * @returns A new `Expression` representing the data type.
   */
  type() {
    return new FunctionExpression("type", [this]);
  }
  /**
   * Creates an expression that checks if the result of this expression is of the given type.
   *
   * @remarks Null or undefined fields evaluate to skip/error. Use `ifAbsent()` / `isAbsent()` to evaluate missing data.
   * Supported values for `type` are:
   * `'null'`, `'array'`, `'boolean'`, `'bytes'`, `'timestamp'`, `'geo_point'`, `'number'`,
   * `'int32'`, `'int64'`, `'float64'`, `'decimal128'`, `'map'`, `'reference'`, `'string'`,
   * `'vector'`, `'max_key'`, `'min_key'`, `'object_id'`, `'regex'`, `'request_timestamp'`.
   *
   * @example
   * ```typescript
   * // Check if the 'price' field is specifically an integer (not just 'number')
   * field('price').isType('int64');
   * ```
   *
   * @param type - The type to check for.
   * @returns A new `BooleanExpression` that evaluates to true if the expression's result is of the given type, false otherwise.
   */
  isType(e) {
    return new FunctionExpression("is_type", [this, constant(e)], "isType").asBoolean();
  }
  /**
   * Creates an expression that concatenates string expressions together.
   *
   * @example
   * ```typescript
   * // Combine the 'firstName', " ", and 'lastName' fields into a single string
   * field("firstName").stringConcat(constant(" "), field("lastName"));
   * ```
   *
   * @param secondString - The additional expression or string literal to concatenate.
   * @param otherStrings - Optional additional expressions or string literals to concatenate.
   * @returns A new `Expression` representing the concatenated string.
   */
  stringConcat(e, ...t) {
    const n = [e, ...t].map(__PRIVATE_valueToDefaultExpr);
    return new FunctionExpression("string_concat", [this, ...n], "stringConcat");
  }
  /**
   * Creates an expression that finds the index of the first occurrence of a substring or byte sequence.
   *
   * @example
   * ```typescript
   * // Find the index of "foo" in the 'text' field
   * field("text").stringIndexOf("foo");
   * ```
   *
   * @param search - The substring or byte sequence to search for.
   * @returns A new `Expression` representing the index of the first occurrence.
   */
  stringIndexOf(e) {
    return new FunctionExpression("string_index_of", [this, __PRIVATE_valueToDefaultExpr(e)], "stringIndexOf");
  }
  /**
   * Creates an expression that repeats a string or byte array a specified number of times.
   *
   * @example
   * ```typescript
   * // Repeat the 'label' field 3 times
   * field("label").stringRepeat(3);
   * ```
   *
   * @param repetitions - The number of times to repeat the string or byte array.
   * @returns A new `Expression` representing the repeated string or byte array.
   */
  stringRepeat(e) {
    return new FunctionExpression("string_repeat", [this, __PRIVATE_valueToDefaultExpr(e)], "stringRepeat");
  }
  /**
   * Creates an expression that replaces all occurrences of a substring or byte sequence with a replacement.
   *
   * @example
   * ```typescript
   * // Replace all occurrences of "foo" with "bar" in the 'text' field
   * field("text").stringReplaceAll("foo", "bar");
   * ```
   *
   * @param find - The substring or byte sequence to search for.
   * @param replacement - The replacement string or byte sequence.
   * @returns A new `Expression` representing the string or byte array with replacements.
   */
  stringReplaceAll(e, t) {
    return new FunctionExpression("string_replace_all", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr(t)], "stringReplaceAll");
  }
  /**
   * Creates an expression that replaces the first occurrence of a substring or byte sequence with a replacement.
   *
   * @example
   * ```typescript
   * // Replace the first occurrence of "foo" with "bar" in the 'text' field
   * field("text").stringReplaceOne("foo", "bar");
   * ```
   *
   * @param find - The substring or byte sequence to search for.
   * @param replacement - The replacement string or byte sequence.
   * @returns A new `Expression` representing the string or byte array with the replacement.
   */
  stringReplaceOne(e, t) {
    return new FunctionExpression("string_replace_one", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr(t)], "stringReplaceOne");
  }
  /**
   * Creates an expression that concatenates expression results together.
   *
   * @example
   * ```typescript
   * // Combine the 'firstName', ' ', and 'lastName' fields into a single value.
   * field("firstName").concat(constant(" "), field("lastName"));
   * ```
   *
   * @param second - The additional expression or literal to concatenate.
   * @param others - Optional additional expressions or literals to concatenate.
   * @returns A new `Expression` representing the concatenated value.
   */
  concat(e, ...t) {
    const n = [e, ...t].map(__PRIVATE_valueToDefaultExpr);
    return new FunctionExpression("concat", [this, ...n], "concat");
  }
  /**
   * Creates an expression that reverses this string expression.
   *
   * @example
   * ```typescript
   * // Reverse the value of the 'myString' field.
   * field("myString").reverse();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
   */
  reverse() {
    return new FunctionExpression("reverse", [this], "reverse");
  }
  /**
   * Filters the array using a provided alias and predicate expression.
   *
   * @example
   * ```typescript
   * // Filter the 'items' array to only include those where the 'price' is greater than 10
   * field("items").arrayFilter('item', greaterThan(variable('item.price'), 10));
   * ```
   *
   * @param alias - The variable name to use for each element.
   * @param filter - The predicate boolean expression to filter by.
   * @returns A new `Expression` representing the filtered array.
   */
  arrayFilter(e, t) {
    return new FunctionExpression("array_filter", [this, __PRIVATE_valueToDefaultExpr(e), t], "arrayFilter");
  }
  /**
   * Creates an expression that applies a provided transformation to each element in an array.
   *
   * @example
   * ```typescript
   * // Transform the 'scores' array by multiplying each score by 10
   * field("scores").arrayTransform("score", multiply(variable("score"), 10));
   * ```
   *
   * @param elementAlias - The variable name to use for each element.
   * @param transform - The lambda expression used to transform the elements.
   * @returns A new `Expression` representing the arrayTransform operation.
   */
  arrayTransform(e, t) {
    return new FunctionExpression("array_transform", [this, __PRIVATE_valueToDefaultExpr(e), t], "arrayTransform");
  }
  /**
   * Creates an expression that applies a provided transformation to each element in an array, providing the element's index to the transformation expression.
   *
   * @example
   * ```typescript
   * // Transform the 'scores' array by adding the index to each score
   * field("scores").arrayTransformWithIndex("score", "i", add(variable("score"), variable("i")));
   * ```
   *
   * @param elementAlias - The variable name to use for each element.
   * @param indexAlias - The variable name to use for the current index.
   * @param transform - The lambda expression used to transform the elements.
   * @returns A new `Expression` representing the arrayTransformWithIndex operation.
   */
  arrayTransformWithIndex(e, t, n) {
    return new FunctionExpression("array_transform", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr(t), n], "arrayTransformWithIndex");
  }
  /**
   * Returns a subset of the array.
   *
   * @example
   * ```typescript
   * // Get 5 elements from the 'items' array starting from index 2
   * field("items").arraySlice(2, 5);
   *
   * // Get n number of elements from the 'items' array starting from index 2
   * field("items").arraySlice(2, field("count"));
   * ```
   *
   * @param offset - The starting offset.
   * @param length - The optional length of the slice.
   * @returns A new `Expression` representing the sliced array.
   */
  arraySlice(e, t) {
    const n = [this, __PRIVATE_valueToDefaultExpr(e)];
    return void 0 !== t && n.push(__PRIVATE_valueToDefaultExpr(t)), new FunctionExpression("array_slice", n, "arraySlice");
  }
  /**
   * Returns the first element of the array.
   *
   * @example
   * ```typescript
   * // Get the first element of the 'myArray' field.
   * field("myArray").arrayFirst();
   * ```
   *
   * @returns A new `Expression` representing the first element.
   */
  arrayFirst() {
    return new FunctionExpression("array_first", [this], "arrayFirst");
  }
  arrayFirstN(e) {
    return new FunctionExpression("array_first_n", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayFirstN");
  }
  /**
   * Returns the last element of the array.
   *
   * @example
   * ```typescript
   * // Get the last element of the 'myArray' field.
   * field("myArray").arrayLast();
   * ```
   *
   * @returns A new `Expression` representing the last element.
   */
  arrayLast() {
    return new FunctionExpression("array_last", [this], "arrayLast");
  }
  arrayLastN(e) {
    return new FunctionExpression("array_last_n", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayLastN");
  }
  /**
   * Returns the maximum value in the array.
   *
   * @example
   * ```typescript
   * // Get the maximum value of the 'myArray' field.
   * field("myArray").arrayMaximum();
   * ```
   *
   * @returns A new `Expression` representing the maximum value.
   */
  arrayMaximum() {
    return new FunctionExpression("maximum", [this], "arrayMaximum");
  }
  arrayMaximumN(e) {
    return new FunctionExpression("maximum_n", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayMaximumN");
  }
  /**
   * Returns the minimum value in the array.
   *
   * @example
   * ```typescript
   * // Get the minimum value of the 'myArray' field.
   * field("myArray").arrayMinimum();
   * ```
   *
   * @returns A new `Expression` representing the minimum value.
   */
  arrayMinimum() {
    return new FunctionExpression("minimum", [this], "arrayMinimum");
  }
  arrayMinimumN(e) {
    return new FunctionExpression("minimum_n", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayMinimumN");
  }
  arrayIndexOf(e) {
    return new FunctionExpression("array_index_of", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr("first")], "arrayIndexOf");
  }
  arrayLastIndexOf(e) {
    return new FunctionExpression("array_index_of", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr("last")], "arrayLastIndexOf");
  }
  arrayIndexOfAll(e) {
    return new FunctionExpression("array_index_of_all", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayIndexOfAll");
  }
  /**
   * Creates an expression that calculates the length of this string expression in bytes.
   *
   * @example
   * ```typescript
   * // Calculate the length of the 'myString' field in bytes.
   * field("myString").byteLength();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the string in bytes.
   */
  byteLength() {
    return new FunctionExpression("byte_length", [this], "byteLength");
  }
  /**
   * Creates an expression that computes the ceiling of a numeric value.
   *
   * @example
   * ```typescript
   * // Compute the ceiling of the 'price' field.
   * field("price").ceil();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the ceiling of the numeric value.
   */
  ceil() {
    return new FunctionExpression("ceil", [this]);
  }
  /**
   * Creates an expression that computes the floor of a numeric value.
   *
   * @example
   * ```typescript
   * // Compute the floor of the 'price' field.
   * field("price").floor();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the floor of the numeric value.
   */
  floor() {
    return new FunctionExpression("floor", [this]);
  }
  /**
   * Creates an expression that computes the absolute value of a numeric value.
   *
   * @example
   * ```typescript
   * // Compute the absolute value of the 'price' field.
   * field("price").abs();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the absolute value of the numeric value.
   */
  abs() {
    return new FunctionExpression("abs", [this]);
  }
  /**
   * Creates an expression that computes e to the power of this expression.
   *
   * @example
   * ```typescript
   * // Compute e to the power of the 'value' field.
   * field("value").exp();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the exp of the numeric value.
   */
  exp() {
    return new FunctionExpression("exp", [this]);
  }
  /**
   * Accesses a value from a map (object) field using the provided key.
   *
   * @example
   * ```typescript
   * // Get the 'city' value from the 'address' map field
   * field("address").mapGet("city");
   * ```
   *
   * @param subfield - The key to access in the map.
   * @returns A new `Expression` representing the value associated with the given key in the map.
   */
  mapGet(e) {
    return new FunctionExpression("map_get", [this, constant(e)], "mapGet");
  }
  /**
   * Creates an expression that returns a new map with the specified entries added or updated.
   *
   * @remarks
   * Note that `mapSet` only performs shallow updates to the map. Setting a value to `null`
   * will retain the key with a `null` value. To remove a key entirely, use `mapRemove`.
   *
   * @example
   * ```typescript
   * // Set the 'city' to "San Francisco" in the 'address' map
   * field("address").mapSet("city", "San Francisco");
   * ```
   *
   * @param key - The key to set. Must be a string or a constant string expression.
   * @param value - The value to set.
   * @param moreKeyValues - Additional key-value pairs to set.
   * @returns A new `Expression` representing the map with the entries set.
   */
  mapSet(e, t, ...n) {
    const r = [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr(t), ...n.map(__PRIVATE_valueToDefaultExpr)];
    return new FunctionExpression("map_set", r, "mapSet");
  }
  /**
   * Creates an expression that returns the keys of a map.
   *
   * @remarks
   * While the backend generally preserves insertion order, relying on the
   * order of the output array is not guaranteed and should be avoided.
   *
   * @example
   * ```typescript
   * // Get the keys of the 'address' map
   * field("address").mapKeys();
   * ```
   *
   * @returns A new `Expression` representing the keys of the map.
   */
  mapKeys() {
    return new FunctionExpression("map_keys", [this], "mapKeys");
  }
  /**
   * Creates an expression that returns the values of a map.
   *
   * @remarks
   * While the backend generally preserves insertion order, relying on the
   * order of the output array is not guaranteed and should be avoided.
   *
   * @example
   * ```typescript
   * // Get the values of the 'address' map
   * field("address").mapValues();
   * ```
   *
   * @returns A new `Expression` representing the values of the map.
   */
  mapValues() {
    return new FunctionExpression("map_values", [this], "mapValues");
  }
  /**
   * Creates an expression that returns the entries of a map as an array of maps,
   * where each map contains a `"k"` property for the key and a `"v"` property for the value.
   * For example: `[{ k: "key1", v: "value1" }, ...]`.
   *
   * @example
   * ```typescript
   * // Get the entries of the 'address' map
   * field("address").mapEntries();
   * ```
   *
   * @returns A new `Expression` representing the entries of the map.
   */
  mapEntries() {
    return new FunctionExpression("map_entries", [this], "mapEntries");
  }
  /**
   * @public
   * Creates an expression that returns the value of a field from the document that results from the evaluation of this expression.
   *
   * @example
   * ```typescript
   * // Get the value of the "city" field in the "address" document.
   * field("address").getField("city")
   * ```
   *
   * @param key The field to access in the document.
   * @returns A new `Expression` representing the value of the field in the document.
   */
  getField(e) {
    return new FunctionExpression("get_field", [this, __PRIVATE_valueToDefaultExpr(e)], "get_field");
  }
  /**
   * Creates an aggregation that counts the number of stage inputs with valid evaluations of the
   * expression or field.
   *
   * @example
   * ```typescript
   * // Count the total number of products
   * field("productId").count().as("totalProducts");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'count' aggregation.
   */
  count() {
    return AggregateFunction._create("count", [this], "count");
  }
  /**
   * Creates an aggregation that calculates the sum of a numeric field across multiple stage inputs.
   *
   * @example
   * ```typescript
   * // Calculate the total revenue from a set of orders
   * field("orderAmount").sum().as("totalRevenue");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'sum' aggregation.
   */
  sum() {
    return AggregateFunction._create("sum", [this], "sum");
  }
  /**
   * Creates an aggregation that calculates the average (mean) of a numeric field across multiple
   * stage inputs.
   *
   * @example
   * ```typescript
   * // Calculate the average age of users
   * field("age").average().as("averageAge");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'average' aggregation.
   */
  average() {
    return AggregateFunction._create("average", [this], "average");
  }
  /**
   * Creates an aggregation that finds the minimum value of a field across multiple stage inputs.
   *
   * @example
   * ```typescript
   * // Find the lowest price of all products
   * field("price").minimum().as("lowestPrice");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'minimum' aggregation.
   */
  minimum() {
    return AggregateFunction._create("minimum", [this], "minimum");
  }
  /**
   * Creates an aggregation that finds the maximum value of a field across multiple stage inputs.
   *
   * @example
   * ```typescript
   * // Find the highest score in a leaderboard
   * field("score").maximum().as("highestScore");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'maximum' aggregation.
   */
  maximum() {
    return AggregateFunction._create("maximum", [this], "maximum");
  }
  /**
   * Creates an aggregation that finds the first value of an expression across multiple stage inputs.
   *
   * @example
   * ```typescript
   * // Find the first value of the 'rating' field
   * field("rating").first().as("firstRating");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'first' aggregation.
   */
  first() {
    return AggregateFunction._create("first", [this], "first");
  }
  /**
   * Creates an aggregation that finds the last value of an expression across multiple stage inputs.
   *
   * @example
   * ```typescript
   * // Find the last value of the 'rating' field
   * field("rating").last().as("lastRating");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'last' aggregation.
   */
  last() {
    return AggregateFunction._create("last", [this], "last");
  }
  /**
   * Creates an aggregation that collects all values of an expression across multiple stage inputs
   * into an array.
   *
   * @remarks
   * If the expression resolves to an absent value, it is converted to `null`.
   * The order of elements in the output array is not stable and shouldn't be relied upon.
   *
   * @example
   * ```typescript
   * // Collect all tags from books into an array
   * field("tags").arrayAgg().as("allTags");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'array_agg' aggregation.
   */
  arrayAgg() {
    return AggregateFunction._create("array_agg", [this], "arrayAgg");
  }
  /**
   * Creates an aggregation that collects all distinct values of an expression across multiple stage
   * inputs into an array.
   *
   * @remarks
   * If the expression resolves to an absent value, it is converted to `null`.
   * The order of elements in the output array is not stable and shouldn't be relied upon.
   *
   * @example
   * ```typescript
   * // Collect all distinct tags from books into an array
   * field("tags").arrayAggDistinct().as("allDistinctTags");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'array_agg_distinct' aggregation.
   */
  arrayAggDistinct() {
    return AggregateFunction._create("array_agg_distinct", [this], "arrayAggDistinct");
  }
  /**
   * Creates an aggregation that counts the number of distinct values of the expression or field.
   *
   * @example
   * ```typescript
   * // Count the distinct number of products
   * field("productId").countDistinct().as("distinctProducts");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'count_distinct' aggregation.
   */
  countDistinct() {
    return AggregateFunction._create("count_distinct", [this], "countDistinct");
  }
  /**
   * Creates an expression that returns the larger value between this expression and another expression, based on Firestore's value type ordering.
   *
   * @example
   * ```typescript
   * // Returns the larger value between the 'timestamp' field and the current timestamp.
   * field("timestamp").logicalMaximum(currentTimestamp());
   * ```
   *
   * @param second - The second expression or literal to compare with.
   * @param others - Optional additional expressions or literals to compare with.
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical maximum operation.
   */
  logicalMaximum(e, ...t) {
    const n = [e, ...t];
    return new FunctionExpression("maximum", [this, ...n.map(__PRIVATE_valueToDefaultExpr)], "logicalMaximum");
  }
  /**
   * Creates an expression that returns the smaller value between this expression and another expression, based on Firestore's value type ordering.
   *
   * @example
   * ```typescript
   * // Returns the smaller value between the 'timestamp' field and the current timestamp.
   * field("timestamp").logicalMinimum(currentTimestamp());
   * ```
   *
   * @param second - The second expression or literal to compare with.
   * @param others - Optional additional expressions or literals to compare with.
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the logical minimum operation.
   */
  logicalMinimum(e, ...t) {
    const n = [e, ...t];
    return new FunctionExpression("minimum", [this, ...n.map(__PRIVATE_valueToDefaultExpr)], "minimum");
  }
  /**
   * Creates an expression that calculates the length (number of dimensions) of this Firestore Vector expression.
   *
   * @example
   * ```typescript
   * // Get the vector length (dimension) of the field 'embedding'.
   * field("embedding").vectorLength();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the length of the vector.
   */
  vectorLength() {
    return new FunctionExpression("vector_length", [this], "vectorLength");
  }
  cosineDistance(e) {
    return new FunctionExpression("cosine_distance", [this, __PRIVATE_vectorToExpr(e)], "cosineDistance");
  }
  dotProduct(e) {
    return new FunctionExpression("dot_product", [this, __PRIVATE_vectorToExpr(e)], "dotProduct");
  }
  euclideanDistance(e) {
    return new FunctionExpression("euclidean_distance", [this, __PRIVATE_vectorToExpr(e)], "euclideanDistance");
  }
  /**
   * Creates an expression that interprets this expression as the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
   * and returns a timestamp.
   *
   * @example
   * ```typescript
   * // Interpret the 'microseconds' field as microseconds since epoch.
   * field("microseconds").unixMicrosToTimestamp();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
   */
  unixMicrosToTimestamp() {
    return new FunctionExpression("unix_micros_to_timestamp", [this], "unixMicrosToTimestamp");
  }
  /**
   * Creates an expression that converts this timestamp expression to the number of microseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
   *
   * @example
   * ```typescript
   * // Convert the 'timestamp' field to microseconds since epoch.
   * field("timestamp").timestampToUnixMicros();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of microseconds since epoch.
   */
  timestampToUnixMicros() {
    return new FunctionExpression("timestamp_to_unix_micros", [this], "timestampToUnixMicros");
  }
  /**
   * Creates an expression that interprets this expression as the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC)
   * and returns a timestamp.
   *
   * @example
   * ```typescript
   * // Interpret the 'milliseconds' field as milliseconds since epoch.
   * field("milliseconds").unixMillisToTimestamp();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
   */
  unixMillisToTimestamp() {
    return new FunctionExpression("unix_millis_to_timestamp", [this], "unixMillisToTimestamp");
  }
  /**
   * Creates an expression that converts this timestamp expression to the number of milliseconds since the Unix epoch (1970-01-01 00:00:00 UTC).
   *
   * @example
   * ```typescript
   * // Convert the 'timestamp' field to milliseconds since epoch.
   * field("timestamp").timestampToUnixMillis();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of milliseconds since epoch.
   */
  timestampToUnixMillis() {
    return new FunctionExpression("timestamp_to_unix_millis", [this], "timestampToUnixMillis");
  }
  /**
   * Creates an expression that interprets this expression as the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC)
   * and returns a timestamp.
   *
   * @example
   * ```typescript
   * // Interpret the 'seconds' field as seconds since epoch.
   * field("seconds").unixSecondsToTimestamp();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the timestamp.
   */
  unixSecondsToTimestamp() {
    return new FunctionExpression("unix_seconds_to_timestamp", [this], "unixSecondsToTimestamp");
  }
  /**
   * Creates an expression that converts this timestamp expression to the number of seconds since the Unix epoch (1970-01-01 00:00:00 UTC).
   *
   * @example
   * ```typescript
   * // Convert the 'timestamp' field to seconds since epoch.
   * field("timestamp").timestampToUnixSeconds();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the number of seconds since epoch.
   */
  timestampToUnixSeconds() {
    return new FunctionExpression("timestamp_to_unix_seconds", [this], "timestampToUnixSeconds");
  }
  timestampAdd(e, t) {
    return new FunctionExpression("timestamp_add", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr(t)], "timestampAdd");
  }
  timestampSubtract(e, t) {
    return new FunctionExpression("timestamp_subtract", [this, __PRIVATE_valueToDefaultExpr(e), __PRIVATE_valueToDefaultExpr(t)], "timestampSubtract");
  }
  timestampDiff(e, t) {
    return new FunctionExpression("timestamp_diff", [this, __PRIVATE_fieldOrExpression(e), __PRIVATE_valueToDefaultExpr(t)], "timestampDiff");
  }
  timestampExtract(e, t) {
    const n = [this, __PRIVATE_valueToDefaultExpr(e)];
    return t && n.push(__PRIVATE_valueToDefaultExpr(t)), new FunctionExpression("timestamp_extract", n, "timestampExtract");
  }
  /**
   *
   * Creates an expression that returns the document ID from a path.
   *
   * @example
   * ```typescript
   * // Get the document ID from a path.
   * field("__path__").documentId();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the documentId operation.
   */
  documentId() {
    return new FunctionExpression("document_id", [this], "documentId");
  }
  /**
   *
   * Creates an expression that returns the parent document reference of a document reference.
   *
   * @example
   * ```typescript
   * // Get the parent document reference of a document reference.
   * field("__path__").parent();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the parent operation.
   */
  parent() {
    return new FunctionExpression("parent", [this], "parent");
  }
  substring(e, t) {
    const n = __PRIVATE_valueToDefaultExpr(e);
    return new FunctionExpression("substring", void 0 === t ? [this, n] : [this, n, __PRIVATE_valueToDefaultExpr(t)], "substring");
  }
  arrayGet(e) {
    return new FunctionExpression("array_get", [this, __PRIVATE_valueToDefaultExpr(e)], "arrayGet");
  }
  /**
   *
   * Creates an expression that checks if a given expression produces an error.
   *
   * @example
   * ```typescript
   * // Check if the result of a calculation is an error
   * field("title").arrayContains(1).isError();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#BooleanExpression} representing the 'isError' check.
   */
  isError() {
    return new FunctionExpression("is_error", [this], "isError").asBoolean();
  }
  ifError(e) {
    const t = new FunctionExpression("if_error", [this, __PRIVATE_valueToDefaultExpr(e)], "ifError");
    return e instanceof BooleanExpression ? t.asBoolean() : t;
  }
  /**
   *
   * Creates an expression that returns `true` if the result of this expression
   * is absent. Otherwise, returns `false` even if the value is `null`.
   *
   * @example
   * ```typescript
   * // Check if the field `value` is absent.
   * field("value").isAbsent();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#BooleanExpression} representing the 'isAbsent' check.
   */
  isAbsent() {
    return new FunctionExpression("is_absent", [this], "isAbsent").asBoolean();
  }
  mapRemove(e) {
    return new FunctionExpression("map_remove", [this, __PRIVATE_valueToDefaultExpr(e)], "mapRemove");
  }
  /**
   *
   * Creates an expression that merges multiple map values.
   *
   * @example
   * ```
   * // Merges the map in the settings field with, a map literal, and a map in
   * // that is conditionally returned by another expression
   * field('settings').mapMerge({ enabled: true }, conditional(field('isAdmin'), { admin: true}, {})
   * ```
   *
   * @param secondMap - A required second map to merge. Represented as a literal or
   * an expression that returns a map.
   * @param otherMaps - Optional additional maps to merge. Each map is represented
   * as a literal or an expression that returns a map.
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the 'mapMerge' operation.
   */
  mapMerge(e, ...t) {
    const n = __PRIVATE_valueToDefaultExpr(e), r = t.map(__PRIVATE_valueToDefaultExpr);
    return new FunctionExpression("map_merge", [this, n, ...r], "mapMerge");
  }
  pow(e) {
    return new FunctionExpression("pow", [this, __PRIVATE_valueToDefaultExpr(e)]);
  }
  trunc(e) {
    return void 0 === e ? new FunctionExpression("trunc", [this]) : new FunctionExpression("trunc", [this, __PRIVATE_valueToDefaultExpr(e)], "trunc");
  }
  round(e) {
    return void 0 === e ? new FunctionExpression("round", [this]) : new FunctionExpression("round", [this, __PRIVATE_valueToDefaultExpr(e)], "round");
  }
  /**
   * Creates an expression that returns the collection ID from a path.
   *
   * @example
   * ```typescript
   * // Get the collection ID from a path.
   * field("__path__").collectionId();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the collectionId operation.
   */
  collectionId() {
    return new FunctionExpression("collection_id", [this]);
  }
  /**
   * Creates an expression that calculates the length of a string, array, map, vector, or bytes.
   *
   * @example
   * ```typescript
   * // Get the length of the 'name' field.
   * field("name").length();
   *
   * // Get the number of items in the 'cart' array.
   * field("cart").length();
   * ```
   *
   * @returns A new `Expression` representing the length of the string, array, map, vector, or bytes.
   */
  length() {
    return new FunctionExpression("length", [this]);
  }
  /**
   * Creates an expression that computes the natural logarithm of a numeric value.
   *
   * @example
   * ```typescript
   * // Compute the natural logarithm of the 'value' field.
   * field("value").ln();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the natural logarithm of the numeric value.
   */
  ln() {
    return new FunctionExpression("ln", [this]);
  }
  /**
   * Creates an expression that computes the square root of a numeric value.
   *
   * @example
   * ```typescript
   * // Compute the square root of the 'value' field.
   * field("value").sqrt();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the square root of the numeric value.
   */
  sqrt() {
    return new FunctionExpression("sqrt", [this]);
  }
  /**
   * Creates an expression that reverses a string.
   *
   * @example
   * ```typescript
   * // Reverse the value of the 'myString' field.
   * field("myString").stringReverse();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the reversed string.
   */
  stringReverse() {
    return new FunctionExpression("string_reverse", [this]);
  }
  ifAbsent(e) {
    return new FunctionExpression("if_absent", [this, __PRIVATE_valueToDefaultExpr(e)], "ifAbsent");
  }
  ifNull(e) {
    return new FunctionExpression("if_null", [this, __PRIVATE_valueToDefaultExpr(e)], "ifNull");
  }
  /**
   * Creates an expression that returns the first non-null, non-absent argument, without evaluating
   * the rest of the arguments. When all arguments are null or absent, returns the last argument.
   *
   * @example
   * ```typescript
   * // Returns the value of the first non-null, non-absent field among 'preferredName', 'fullName',
   * // or the last argument if all previous fields are null.
   * field("preferredName").coalesce(field("fullName"), "Anonymous");
   * ```
   *
   * @param replacement - The value to use if this expression evaluates to null.
   * @param others - Optional additional values to check if previous values are null.
   * @returns A new `Expression` representing the coalesce operation.
   */
  coalesce(e, ...t) {
    return new FunctionExpression("coalesce", [this, __PRIVATE_valueToDefaultExpr(e), ...t.map(__PRIVATE_valueToDefaultExpr)], "coalesce");
  }
  join(e) {
    return new FunctionExpression("join", [this, __PRIVATE_valueToDefaultExpr(e)], "join");
  }
  /**
   * Creates an expression that computes the base-10 logarithm of a numeric value.
   *
   * @example
   * ```typescript
   * // Compute the base-10 logarithm of the 'value' field.
   * field("value").log10();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the base-10 logarithm of the numeric value.
   */
  log10() {
    return new FunctionExpression("log10", [this]);
  }
  /**
   * Creates an expression that computes the sum of the elements in an array.
   *
   * @example
   * ```typescript
   * // Compute the sum of the elements in the 'scores' field.
   * field("scores").arraySum();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the sum of the elements in the array.
   */
  arraySum() {
    return new FunctionExpression("sum", [this]);
  }
  split(e) {
    return new FunctionExpression("split", [this, __PRIVATE_valueToDefaultExpr(e)]);
  }
  timestampTruncate(e, t) {
    const n = [this, __PRIVATE_valueToDefaultExpr(e)];
    return t && n.push(__PRIVATE_valueToDefaultExpr(t)), new FunctionExpression("timestamp_trunc", n);
  }
  // TODO(search) enable with backend support
  // /**
  //  * Evaluates if the result of this `expression` is between
  //  * the `lowerBound` (inclusive) and `upperBound` (inclusive).
  //  *
  //  * @example
  //  * ```
  //  * // Evaluate if the 'tireWidth' is between 2.2 and 2.4
  //  * field('tireWidth').between(constant(2.2), constant(2.4))
  //  *
  //  * // This is functionally equivalent to
  //  * and(field('tireWidth').greaterThanOrEqual(contant(2.2)), field('tireWidth').lessThanOrEqual(constant(2.4)))
  //  * ```
  //  *
  //  * @param lowerBound - Lower bound (inclusive) of the range.
  //  * @param upperBound - Upper bound (inclusive) of the range.
  //  */
  // between(lowerBound: Expression, upperBound: Expression): BooleanExpression;
  // /**
  //  * Evaluates if the result of this `expression` is between
  //  * the `lowerBound` (inclusive) and `upperBound` (inclusive).
  //  *
  //  * @example
  //  * ```
  //  * // Evaluate if the 'tireWidth' is between 2.2 and 2.4
  //  * field('tireWidth').between(2.2, 2.4)
  //  *
  //  * // This is functionally equivalent to
  //  * and(field('tireWidth').greaterThanOrEqual(2.2), field('tireWidth').lessThanOrEqual(2.4))
  //  * ```
  //  *
  //  * @param lowerBound - Lower bound (inclusive) of the range.
  //  * @param upperBound - Upper bound (inclusive) of the range.
  //  */
  // between(lowerBound: unknown, upperBound: unknown): BooleanExpression;
  // between(lowerBound: unknown, upperBound: unknown): BooleanExpression {
  //   return new FunctionExpression('between', [
  //     this,
  //     valueToDefaultExpr(lowerBound),
  //     valueToDefaultExpr(upperBound)
  //   ]).asBoolean();
  // }
  // TODO(search) enable with backend support
  // /**
  //  * Evaluates to an HTML-formatted text snippet that renders terms matching
  //  * the search query in `<b>bold</b>`.
  //  *
  //  * @remarks This Expression can only be used within a `search` stage.
  //  *
  //  * @param rquery Define the search query using the search domain-specific language (DSL).
  //  */
  // snippet(rquery: string): Expression;
  // /**
  //  * Evaluates to an HTML-formatted text snippet that renders terms matching
  //  * the search query in `<b>bold</b>`.
  //  *
  //  * @remarks This Expression can only be used within a `search` stage.
  //  *
  //  * @param options Define how snippeting behaves.
  //  */
  // snippet(options: SnippetOptions): Expression;
  // snippet(queryOrOptions: string | SnippetOptions): Expression {
  //   const options: SnippetOptions = isString(queryOrOptions)
  //     ? { rquery: queryOrOptions }
  //     : queryOrOptions;
  //   const rquery = options.rquery;
  //   const internalOptions = {
  //     maxSnippetWidth: options.maxSnippetWidth,
  //     maxSnippets: options.maxSnippets,
  //     separator: options.separator
  //   };
  //   return new SnippetExpression([this, constant(rquery)], internalOptions);
  // }
  // TODO(new-expression): Add new expression method definitions above this line
  /**
   * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in ascending order based on this expression.
   *
   * @example
   * ```typescript
   * // Sort documents by the 'name' field in ascending order
   * firestore.pipeline().collection("users")
   *   .sort(field("name").ascending());
   * ```
   *
   * @returns A new `Ordering` for ascending sorting.
   */
  ascending() {
    return ascending(this);
  }
  /**
   * Creates an {@link @firebase/firestore/pipelines#Ordering} that sorts documents in descending order based on this expression.
   *
   * @example
   * ```typescript
   * // Sort documents by the 'createdAt' field in descending order
   * firestore.pipeline().collection("users")
   *   .sort(field("createdAt").descending());
   * ```
   *
   * @returns A new `Ordering` for descending sorting.
   */
  descending() {
    return descending(this);
  }
  /**
   * Assigns an alias to this expression.
   *
   * Aliases are useful for renaming fields in the output of a stage or for giving meaningful
   * names to calculated values.
   *
   * @example
   * ```typescript
   * // Calculate the total price and assign it the alias "totalPrice" and add it to the output.
   * firestore.pipeline().collection("items")
   *   .addFields(field("price").multiply(field("quantity")).as("totalPrice"));
   * ```
   *
   * @param name - The alias to assign to this expression.
   * @returns A new {@link @firebase/firestore/pipelines#AliasedExpression} that wraps this
   *     expression and associates it with the provided alias.
   */
  as(e) {
    return new AliasedExpression(this, e, "as");
  }
}
class AggregateFunction {
  constructor(e, t) {
    this.name = e, this.params = t, this.exprType = "AggregateFunction", this._protoValueType = "ProtoValue";
  }
  /**
   * @internal
   * @private
   */
  static _create(e, t, n) {
    const r = new AggregateFunction(e, t);
    return r._methodName = n, r;
  }
  /**
   * Assigns an alias to this AggregateFunction. The alias specifies the name that
   * the aggregated value will have in the output document.
   *
   * @example
   * ```typescript
   * // Calculate the average price of all items and assign it the alias "averagePrice".
   * firestore.pipeline().collection("items")
   *   .aggregate(field("price").average().as("averagePrice"));
   * ```
   *
   * @param name - The alias to assign to this AggregateFunction.
   * @returns A new {@link @firebase/firestore/pipelines#AliasedAggregate} that wraps this
   *     AggregateFunction and associates it with the provided alias.
   */
  as(e) {
    return new AliasedAggregate(this, e, "as");
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    return {
      functionValue: {
        name: this.name,
        args: this.params.map(((t) => t._toProto(e)))
      }
    };
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    e = this._methodName ? e.contextWith({
      methodName: this._methodName
    }) : e, this.params.forEach(((t) => t._readUserData(e)));
  }
}
class AliasedAggregate {
  constructor(e, t, n) {
    this.aggregate = e, this.alias = t, this._methodName = n;
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    this.aggregate._readUserData(e);
  }
}
class AliasedExpression {
  constructor(e, t, n) {
    this.expr = e, this.alias = t, this._methodName = n, this.exprType = "AliasedExpression", this.selectable = true;
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    this.expr._readUserData(e);
  }
}
class __PRIVATE_ListOfExprs extends Expression {
  constructor(e, t) {
    super(), this.Rr = e, this._methodName = t, this.expressionType = "ListOfExpressions";
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    return {
      arrayValue: {
        values: this.Rr.map(((t) => t._toProto(e)))
      }
    };
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    this.Rr.forEach(((t) => t._readUserData(e)));
  }
}
class Field extends Expression {
  /**
   * @internal
   * @private
   * @hideconstructor
   * @param fieldPath
   */
  constructor(e, t) {
    super(), this.fieldPath = e, this._methodName = t, this.expressionType = "Field", this.selectable = true;
  }
  get _fieldPath() {
    return this.fieldPath;
  }
  get fieldName() {
    return this.fieldPath.canonicalString();
  }
  get alias() {
    return this.fieldName;
  }
  get expr() {
    return this;
  }
  // TODO(search) enable with backend support
  // /**
  //  * Perform a full-text search on this field.
  //  *
  //  * @remarks This Expression can only be used within a `search` stage.
  //  *
  //  * @param rquery Define the search query using the search domain-specific language (DSL).
  //  */
  // matches(rquery: string | Expression): BooleanExpression {
  //   return new FunctionExpression(
  //     'matches',
  //     [this, valueToDefaultExpr(rquery)],
  //     'matches'
  //   ).asBoolean();
  // }
  /**
   * @beta
   * Evaluates to the distance in meters between the location specified
   * by this field and the query location.
   *
   * @remarks This Expression can only be used within a `search` stage.
   *
   * @param location - Compute distance to this GeoPoint.
   */
  geoDistance(e) {
    return new FunctionExpression("geo_distance", [this, __PRIVATE_valueToDefaultExpr(e)], "geoDistance");
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    return {
      fieldReferenceValue: this.fieldPath.canonicalString()
    };
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
  }
}
function field(e) {
  return _field(e, "field");
}
function _field(e, t) {
  return new Field("string" == typeof e ? F === e ? documentId$1()._internalPath : __PRIVATE_fieldPathFromArgument("field", e) : e._internalPath, t);
}
class Constant extends Expression {
  /**
   * @private
   * @internal
   * @hideconstructor
   * @param value - The value of the constant.
   */
  constructor(e, t) {
    super(), this.value = e, this._methodName = t, this.expressionType = "Constant";
  }
  /**
   * @private
   * @internal
   */
  static _fromProto(e) {
    const t = new Constant(e, void 0);
    return t._protoValue = e, t;
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    return __PRIVATE_hardAssert(void 0 !== this._protoValue, 237), this._protoValue;
  }
  _getValue() {
    return this._protoValue;
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    e = this._methodName ? e.contextWith({
      methodName: this._methodName
    }) : e, __PRIVATE_isFirestoreValue(this._protoValue) || (this._protoValue = __PRIVATE_parseData(this.value, e));
  }
}
function constant(e, t) {
  return __PRIVATE__constant(e, "constant");
}
function __PRIVATE__constant(e, t) {
  const n = new Constant(e, t);
  return "boolean" == typeof e ? new __PRIVATE_BooleanConstant(n) : n;
}
class FunctionExpression extends Expression {
  /**
   * @hideconstructor
   */
  constructor(e, t, n, r) {
    super(), this.name = e, this.params = t, this.expressionType = "Function", /**
     * @private
     * @internal
     */
    this._optionsProto = void 0, void 0 !== n && (this._methodName = n), void 0 !== r && (this._options = r);
  }
  /**
   * @private
   * @internal
   */
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    const t = {
      functionValue: {
        name: this.name,
        args: this.params.map(((t2) => t2._toProto(e)))
      }
    };
    return this._optionsProto && (t.functionValue.options = this._optionsProto), t;
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    e = this._methodName ? e.contextWith({
      methodName: this._methodName
    }) : e, this.params.forEach(((t) => t._readUserData(e))), this._options && (this._optionsProto = this._optionsUtil.getOptionsProto(e, this._options));
  }
}
class BooleanExpression extends Expression {
  get _methodName() {
    return this._expr._methodName;
  }
  /**
   * Creates an aggregation that finds the count of input documents satisfying
   * this boolean expression.
   *
   * @example
   * ```typescript
   * // Find the count of documents with a score greater than 90
   * field("score").greaterThan(90).countIf().as("highestScore");
   * ```
   *
   * @returns A new `AggregateFunction` representing the 'countIf' aggregation.
   */
  countIf() {
    return AggregateFunction._create("count_if", [this], "countIf");
  }
  /**
   * Creates an expression that negates this boolean expression.
   *
   * @example
   * ```typescript
   * // Find documents where the 'tags' field does not contain 'completed'
   * field("tags").arrayContains("completed").not();
   * ```
   *
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the negated filter condition.
   */
  not() {
    return new FunctionExpression("not", [this], "not").asBoolean();
  }
  /**
   * Creates a conditional expression that evaluates to the 'then' expression
   * if `this` expression evaluates to `true`,
   * or evaluates to the 'else' expression if `this` expressions evaluates `false`.
   *
   * @example
   * ```typescript
   * // If 'age' is greater than 18, return "Adult"; otherwise, return "Minor".
   * field("age").greaterThanOrEqual(18).conditional(constant("Adult"), constant("Minor"));
   * ```
   *
   * @param thenExpr - The expression to evaluate if the condition is true.
   * @param elseExpr - The expression to evaluate if the condition is false.
   * @returns A new {@link @firebase/firestore/pipelines#Expression} representing the conditional expression.
   */
  conditional(e, t) {
    return new FunctionExpression("conditional", [this, e, t], "conditional");
  }
  ifError(e) {
    const t = __PRIVATE_valueToDefaultExpr(e), n = new FunctionExpression("if_error", [this, t], "ifError");
    return t instanceof BooleanExpression ? n.asBoolean() : n;
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    return this._expr._toProto(e);
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    this._expr._readUserData(e);
  }
}
class __PRIVATE_BooleanFunctionExpression extends BooleanExpression {
  constructor(e) {
    super(), this._expr = e, this.expressionType = "Function";
  }
}
class __PRIVATE_BooleanConstant extends BooleanExpression {
  constructor(e) {
    super(), this._expr = e, this.expressionType = "Constant";
  }
  _getValue() {
    return this._expr._getValue();
  }
}
class __PRIVATE_BooleanField extends BooleanExpression {
  constructor(e) {
    super(), this._expr = e, this.expressionType = "Field";
  }
}
function __PRIVATE__map(e, t) {
  const n = [];
  for (const t2 in e) if (Object.prototype.hasOwnProperty.call(e, t2)) {
    const r = e[t2];
    n.push(constant(t2)), n.push(__PRIVATE_valueToDefaultExpr(r));
  }
  return new FunctionExpression("map", n, "map");
}
function array(e) {
  return (function __PRIVATE__array(e2, t) {
    return new FunctionExpression("array", e2.map(((e3) => __PRIVATE_valueToDefaultExpr(e3))), t);
  })(e, "array");
}
function ascending(e) {
  return new Ordering(__PRIVATE_fieldOrExpression(e), "ascending", "ascending");
}
function descending(e) {
  return new Ordering(__PRIVATE_fieldOrExpression(e), "descending", "descending");
}
class Ordering {
  constructor(e, t, n) {
    this.expr = e, this.direction = t, this._methodName = n, this._protoValueType = "ProtoValue";
  }
  /**
   * @private
   * @internal
   */
  _toProto(e) {
    return {
      mapValue: {
        fields: {
          direction: __PRIVATE_toStringValue(this.direction),
          expression: this.expr._toProto(e)
        }
      }
    };
  }
  /**
   * @private
   * @internal
   */
  _readUserData(e) {
    this.expr._readUserData(e);
  }
}
class Stage {
  constructor(e) {
    this.optionsProto = void 0, { rawOptions: this.rawOptions, ...this.knownOptions } = e;
  }
  _readUserData(e) {
    this.optionsProto = this._optionsUtil.getOptionsProto(e, this.knownOptions, this.rawOptions);
  }
  _toProto(e) {
    return {
      name: this._name,
      options: this.optionsProto
    };
  }
}
class __PRIVATE_AddFields extends Stage {
  get _name() {
    return "add_fields";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.fields = e;
  }
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [toMapValue(e, this.fields)]
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.fields, e);
  }
}
class __PRIVATE_Aggregate extends Stage {
  get _name() {
    return "aggregate";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t, n) {
    super(n), this.groups = e, this.accumulators = t;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [toMapValue(e, this.accumulators), toMapValue(e, this.groups)]
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.groups, e), __PRIVATE_readUserDataHelper(this.accumulators, e);
  }
}
class __PRIVATE_Distinct extends Stage {
  get _name() {
    return "distinct";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.groups = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [toMapValue(e, this.groups)]
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.groups, e);
  }
}
class __PRIVATE_CollectionSource extends Stage {
  get _name() {
    return "collection";
  }
  get _optionsUtil() {
    return new OptionsUtil({
      forceIndex: {
        serverName: "force_index"
      }
    });
  }
  constructor(e, t) {
    super(t), // prepend slash to collection string
    this.Vr = e.startsWith("/") ? e : "/" + e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [{
        referenceValue: this.Vr
      }]
    };
  }
  _readUserData(e) {
    super._readUserData(e);
  }
}
class __PRIVATE_CollectionGroupSource extends Stage {
  get _name() {
    return "collection_group";
  }
  get _optionsUtil() {
    return new OptionsUtil({
      forceIndex: {
        serverName: "force_index"
      }
    });
  }
  constructor(e, t) {
    super(t), this.collectionId = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [{
        referenceValue: ""
      }, {
        stringValue: this.collectionId
      }]
    };
  }
  _readUserData(e) {
    super._readUserData(e);
  }
}
class __PRIVATE_DatabaseSource extends Stage {
  get _name() {
    return "database";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e)
    };
  }
  _readUserData(e) {
    super._readUserData(e);
  }
}
class __PRIVATE_DocumentsSource extends Stage {
  get _name() {
    return "documents";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    if (super(t), !e || 0 === e.length) throw new FirestoreError(D.INVALID_ARGUMENT, "Empty document paths are not allowed in DocumentsSource");
    const n = e.map(((e2) => e2.startsWith("/") ? e2 : "/" + e2)), r = new Set(n);
    if (r.size !== n.length) throw new FirestoreError(D.INVALID_ARGUMENT, "Duplicate document paths are not allowed in DocumentsSource");
    this.dr = n, this.mr = r;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: this.dr.map(((e2) => ({
        referenceValue: e2
      })))
    };
  }
  _readUserData(e) {
    super._readUserData(e);
  }
}
class __PRIVATE_Where extends Stage {
  get _name() {
    return "where";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.condition = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [this.condition._toProto(e)]
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.condition, e);
  }
}
class __PRIVATE_Limit extends Stage {
  get _name() {
    return "limit";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    __PRIVATE_hardAssert(!isNaN(e) && e !== 1 / 0 && e !== -1 / 0, 34860), super(t), this.limit = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [toNumber(e, this.limit)]
    };
  }
}
class __PRIVATE_Offset extends Stage {
  get _name() {
    return "offset";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.offset = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [toNumber(e, this.offset)]
    };
  }
}
class __PRIVATE_Select extends Stage {
  get _name() {
    return "select";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.selections = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [toMapValue(e, this.selections)]
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.selections, e);
  }
}
class __PRIVATE_Sort extends Stage {
  get _name() {
    return "sort";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.orderings = e;
  }
  /**
   * @internal
   * @private
   */
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: this.orderings.map(((t) => t._toProto(e)))
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.orderings, e);
  }
}
class __PRIVATE_Replace extends Stage {
  get _name() {
    return "replace_with";
  }
  get _optionsUtil() {
    return new OptionsUtil({});
  }
  constructor(e, t) {
    super(t), this.map = e;
  }
  _toProto(e) {
    return {
      ...super._toProto(e),
      args: [this.map._toProto(e), __PRIVATE_toStringValue(__PRIVATE_Replace.pr)]
    };
  }
  _readUserData(e) {
    super._readUserData(e), __PRIVATE_readUserDataHelper(this.map, e);
  }
}
__PRIVATE_Replace.pr = "full_replace";
function __PRIVATE_readUserDataHelper(e, t) {
  return __PRIVATE_isUserData(e) ? e._readUserData(t) : Array.isArray(e) ? e.forEach(((e2) => e2._readUserData(t))) : e instanceof Map ? e.forEach(((e2) => e2._readUserData(t))) : Object.values(e).forEach(((e2) => e2._readUserData(t))), e;
}
class CorePipeline {
  constructor(e, t, n) {
    this.serializer = e, this.stages = t, this.listenOptions = n, this.isCorePipeline = true;
  }
  getPipelineCollection() {
    return getPipelineCollection(this);
  }
  getPipelineCollectionGroup() {
    return getPipelineCollectionGroup(this);
  }
  getPipelineCollectionId() {
    return getPipelineCollectionId(this);
  }
  getPipelineDocuments() {
    return getPipelineDocuments(this);
  }
  getPipelineFlavor() {
    return (function getPipelineFlavor(e) {
      let t = "exact";
      return e.stages.forEach(((n, r) => {
        n._name !== __PRIVATE_Distinct.name && n._name !== __PRIVATE_Aggregate.name || (t = "keyless"), n._name === __PRIVATE_Select.name && "exact" === t && (t = "augmented"), // TODO(pipeline): verify the last stage is addFields, and it is added by the SDK.
        n._name === __PRIVATE_AddFields.name && r < e.stages.length - 1 && "exact" === t && (t = "augmented");
      })), t;
    })(this);
  }
  getPipelineSourceType() {
    return getPipelineSourceType(this);
  }
}
function getPipelineSourceType(e) {
  const t = e.stages[0];
  return t instanceof __PRIVATE_CollectionSource || t instanceof __PRIVATE_CollectionGroupSource || t instanceof __PRIVATE_DatabaseSource || t instanceof __PRIVATE_DocumentsSource ? t._name : "unknown";
}
function getPipelineCollection(e) {
  if ("collection" === getPipelineSourceType(e)) return e.stages[0].Vr;
}
function getPipelineCollectionGroup(e) {
  if ("collection_group" === getPipelineSourceType(e)) return e.stages[0].collectionId;
}
function getPipelineCollectionId(e) {
  switch (getPipelineSourceType(e)) {
    case "collection":
      return ResourcePath.fromString(getPipelineCollection(e)).lastSegment();
    case "collection_group":
      return getPipelineCollectionGroup(e);
    default:
      return;
  }
}
function getPipelineDocuments(e) {
  if ("documents" === getPipelineSourceType(e)) return e.stages[0].dr;
}
class __PRIVATE_EvaluateResult {
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  static vr() {
    return new __PRIVATE_EvaluateResult("ERROR", void 0);
  }
  static Sr() {
    return new __PRIVATE_EvaluateResult("UNSET", void 0);
  }
  static Dr() {
    return new __PRIVATE_EvaluateResult("NULL", lt);
  }
  static newValue(e) {
    return __PRIVATE_isNullValue(e) ? new __PRIVATE_EvaluateResult("NULL", lt) : (function __PRIVATE_isBoolean(e2) {
      return !!e2 && "booleanValue" in e2;
    })(e) ? new __PRIVATE_EvaluateResult("BOOLEAN", e) : isInteger(e) ? new __PRIVATE_EvaluateResult("INT", e) : __PRIVATE_isDouble(e) ? new __PRIVATE_EvaluateResult("DOUBLE", e) : (function __PRIVATE_isTimestampValue(e2) {
      return !!e2 && "timestampValue" in e2 && !!e2.timestampValue;
    })(e) ? new __PRIVATE_EvaluateResult("TIMESTAMP", e) : (function __PRIVATE_isString(e2) {
      return !!e2 && "stringValue" in e2;
    })(e) ? new __PRIVATE_EvaluateResult("STRING", e) : (function __PRIVATE_isBytes(e2) {
      return !!e2 && "bytesValue" in e2;
    })(e) ? new __PRIVATE_EvaluateResult("BYTES", e) : e.referenceValue ? new __PRIVATE_EvaluateResult("REFERENCE", e) : e.geoPointValue ? new __PRIVATE_EvaluateResult("GEO_POINT", e) : isArray(e) ? new __PRIVATE_EvaluateResult("ARRAY", e) : __PRIVATE_isVectorValue(e) ? new __PRIVATE_EvaluateResult("VECTOR", e) : __PRIVATE_isMapValue(e) ? new __PRIVATE_EvaluateResult("MAP", e) : new __PRIVATE_EvaluateResult("ERROR", void 0);
  }
  Cr() {
    return "ERROR" === this.type || "UNSET" === this.type;
  }
  Fr() {
    return "NULL" === this.type;
  }
}
function __PRIVATE_valueOrUndefined(e) {
  if (!e.Cr()) return e.value;
}
function __PRIVATE_unwrapExpression(e) {
  return e instanceof BooleanExpression ? e._expr : e;
}
function __PRIVATE_toEvaluable(e) {
  if ((e = __PRIVATE_unwrapExpression(e)) instanceof Field) return new __PRIVATE_CoreField(e);
  if (e instanceof Constant) return new __PRIVATE_CoreConstant(e);
  if (e instanceof __PRIVATE_ListOfExprs) return new __PRIVATE_CoreListOfExprs(e);
  if (e instanceof FunctionExpression) {
    if ("add" === e.name) return new __PRIVATE_CoreAdd(e);
    if ("subtract" === e.name) return new __PRIVATE_CoreSubtract(e);
    if ("multiply" === e.name) return new __PRIVATE_CoreMultiply(e);
    if ("divide" === e.name) return new __PRIVATE_CoreDivide(e);
    if ("mod" === e.name) return new __PRIVATE_CoreMod(e);
    if ("and" === e.name) return new __PRIVATE_CoreAnd(e);
    if ("equal" === e.name) return new __PRIVATE_CoreEq(e);
    if ("not_equal" === e.name) return new __PRIVATE_CoreNeq(e);
    if ("less_than" === e.name) return new __PRIVATE_CoreLt(e);
    if ("less_than_or_equal" === e.name) return new __PRIVATE_CoreLte(e);
    if ("greater_than" === e.name) return new __PRIVATE_CoreGt(e);
    if ("greater_than_or_equal" === e.name) return new __PRIVATE_CoreGte(e);
    if ("array_concat" === e.name) return new __PRIVATE_CoreArrayConcat(e);
    if ("array_reverse" === e.name) return new __PRIVATE_CoreArrayReverse(e);
    if ("array_contains" === e.name) return new __PRIVATE_CoreArrayContains(e);
    if ("array_contains_all" === e.name) return new __PRIVATE_CoreArrayContainsAll(e);
    if ("array_contains_any" === e.name) return new __PRIVATE_CoreArrayContainsAny(e);
    if ("array_length" === e.name) return new __PRIVATE_CoreArrayLength(e);
    if ("array_element" === e.name) return new __PRIVATE_CoreArrayElement(e);
    if ("equal_any" === e.name) return new __PRIVATE_CoreEqAny(e);
    if ("not_equal_any" === e.name) return new __PRIVATE_CoreNotEqAny(e);
    if ("is_nan" === e.name) return new __PRIVATE_CoreIsNan(e);
    if ("is_not_nan" === e.name) return new __PRIVATE_CoreIsNotNan(e);
    if ("is_null" === e.name) return new __PRIVATE_CoreIsNull(e);
    if ("is_not_null" === e.name) return new __PRIVATE_CoreIsNotNull(e);
    if ("is_error" === e.name) return new __PRIVATE_CoreIsError(e);
    if ("exists" === e.name) return new __PRIVATE_CoreExists(e);
    if ("not" === e.name) return new __PRIVATE_CoreNot(e);
    if ("or" === e.name) return new __PRIVATE_CoreOr(e);
    if ("xor" === e.name) return new __PRIVATE_CoreXor(e);
    if ("conditional" === e.name) return new __PRIVATE_CoreCond(e);
    if ("maximum" === e.name) return new __PRIVATE_CoreLogicalMaximum(e);
    if ("minimum" === e.name) return new __PRIVATE_CoreLogicalMinimum(e);
    if ("reverse" === e.name) return new __PRIVATE_CoreReverse(e);
    if ("replace_first" === e.name) return new __PRIVATE_CoreReplaceFirst(e);
    if ("replace_all" === e.name) return new __PRIVATE_CoreReplaceAll(e);
    if ("char_length" === e.name) return new __PRIVATE_CoreCharLength(e);
    if ("byte_length" === e.name) return new __PRIVATE_CoreByteLength(e);
    if ("like" === e.name) return new __PRIVATE_CoreLike(e);
    if ("regex_contains" === e.name) return new __PRIVATE_CoreRegexContains(e);
    if ("regex_match" === e.name) return new __PRIVATE_CoreRegexMatch(e);
    if ("string_contains" === e.name) return new __PRIVATE_CoreStrContains(e);
    if ("starts_with" === e.name) return new __PRIVATE_CoreStartsWith(e);
    if ("ends_with" === e.name) return new __PRIVATE_CoreEndsWith(e);
    if ("to_lower" === e.name) return new __PRIVATE_CoreToLower(e);
    if ("to_upper" === e.name) return new __PRIVATE_CoreToUpper(e);
    if ("trim" === e.name) return new __PRIVATE_CoreTrim(e);
    if ("string_concat" === e.name) return new __PRIVATE_CoreStrConcat(e);
    if ("map_get" === e.name) return new __PRIVATE_CoreMapGet(e);
    if ("cosine_distance" === e.name) return new __PRIVATE_CoreCosineDistance(e);
    if ("dot_product" === e.name) return new __PRIVATE_CoreDotProduct(e);
    if ("euclidean_distance" === e.name) return new __PRIVATE_CoreEuclideanDistance(e);
    if ("vector_length" === e.name) return new __PRIVATE_CoreVectorLength(e);
    if ("unix_micros_to_timestamp" === e.name) return new __PRIVATE_CoreUnixMicrosToTimestamp(e);
    if ("timestamp_to_unix_micros" === e.name) return new __PRIVATE_CoreTimestampToUnixMicros(e);
    if ("unix_millis_to_timestamp" === e.name) return new __PRIVATE_CoreUnixMillisToTimestamp(e);
    if ("timestamp_to_unix_millis" === e.name) return new __PRIVATE_CoreTimestampToUnixMillis(e);
    if ("unix_seconds_to_timestamp" === e.name) return new __PRIVATE_CoreUnixSecondsToTimestamp(e);
    if ("timestamp_to_unix_seconds" === e.name) return new __PRIVATE_CoreTimestampToUnixSeconds(e);
    if ("timestamp_add" === e.name) return new __PRIVATE_CoreTimestampAdd(e);
    if ("timestamp_subtract" === e.name) return new __PRIVATE_CoreTimestampSub(e);
  }
  throw new Error(`Unknown Expr : ${e}`);
}
class __PRIVATE_CoreField {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    if (this.expr.fieldName === F) return __PRIVATE_EvaluateResult.newValue({
      referenceValue: __PRIVATE_toName(e.serializer, t.key)
    });
    if ("__update_time__" === this.expr.fieldName) return __PRIVATE_EvaluateResult.newValue({
      timestampValue: __PRIVATE_toVersion(e.serializer, t.version)
    });
    if ("__create_time__" === this.expr.fieldName) return __PRIVATE_EvaluateResult.newValue({
      timestampValue: __PRIVATE_toVersion(e.serializer, t.createTime)
    });
    const n = t.data.field(this.expr._fieldPath);
    return n ? __PRIVATE_isServerTimestamp(n) ? __PRIVATE_EvaluateResult.newValue((function __PRIVATE_getServerTimestampValue(e2, t2) {
      if ("estimate" === e2.serverTimestampBehavior) return {
        timestampValue: __PRIVATE_toVersion(e2.serializer, SnapshotVersion.fromTimestamp(__PRIVATE_getLocalWriteTime(t2)))
      };
      if ("previous" === e2.serverTimestampBehavior) {
        const e3 = __PRIVATE_getPreviousValue(t2);
        if (e3) return e3;
      }
      return {
        nullValue: "NULL_VALUE"
      };
    })(e, n)) : __PRIVATE_EvaluateResult.newValue(n) : __PRIVATE_EvaluateResult.Sr();
  }
}
class __PRIVATE_CoreConstant {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    return __PRIVATE_EvaluateResult.newValue(this.expr._getValue());
  }
}
class __PRIVATE_CoreListOfExprs {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    const n = this.expr.Rr.map(((n2) => __PRIVATE_toEvaluable(n2).evaluate(e, t)));
    return n.some(((e2) => e2.Cr())) ? __PRIVATE_EvaluateResult.vr() : __PRIVATE_EvaluateResult.newValue({
      arrayValue: {
        values: n.map(((e2) => e2.value))
      }
    });
  }
}
function __PRIVATE_asDouble(e) {
  return __PRIVATE_isDouble(e) ? Number(e.doubleValue) : Number(e.integerValue);
}
function __PRIVATE_asBigInt(e) {
  return BigInt(e.integerValue);
}
const Wt = BigInt("0x7fffffffffffffff"), Qt = -BigInt("0x8000000000000000");
class __PRIVATE_BigIntOrDoubleArithmetics {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(this.expr.params.length >= 2, 24778);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t), r = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    let i = this.Or(n, r);
    for (const n2 of this.expr.params.slice(2)) {
      const r2 = __PRIVATE_toEvaluable(n2).evaluate(e, t);
      i = this.Or(i, r2);
    }
    return i;
  }
  Or(e, t) {
    if (e.Cr() || t.Cr()) return __PRIVATE_EvaluateResult.vr();
    if (e.Fr() || t.Fr()) return __PRIVATE_EvaluateResult.Dr();
    const n = e.value, r = t.value;
    if (!__PRIVATE_isDouble(n) && !isInteger(n) || !__PRIVATE_isDouble(r) && !isInteger(r)) return __PRIVATE_EvaluateResult.vr();
    if (__PRIVATE_isDouble(n) || __PRIVATE_isDouble(r)) {
      const e2 = this.Mr(n, r);
      return e2 ? __PRIVATE_EvaluateResult.newValue(e2) : __PRIVATE_EvaluateResult.vr();
    }
    if (isInteger(n) && isInteger(r)) {
      const e2 = this.Nr(n, r);
      return void 0 === e2 ? __PRIVATE_EvaluateResult.vr() : "number" == typeof e2 ? __PRIVATE_EvaluateResult.newValue({
        doubleValue: e2
      }) : e2 < Qt || e2 > Wt ? __PRIVATE_EvaluateResult.vr() : __PRIVATE_EvaluateResult.newValue({
        integerValue: `${e2}`
      });
    }
    return __PRIVATE_EvaluateResult.vr();
  }
}
function __PRIVATE_strictValueEquals(e, t) {
  return __PRIVATE_typeOrder(e) !== __PRIVATE_typeOrder(t) ? "TYPE_MISMATCH" : __PRIVATE_isNanValue(e) || __PRIVATE_isNanValue(t) ? "NOT_EQ" : __PRIVATE_isNullValue(e) && __PRIVATE_isNullValue(t) ? "EQ" : __PRIVATE_isNullValue(e) || __PRIVATE_isNullValue(t) ? "NULL" : isArray(e) && isArray(t) ? (function __PRIVATE_strictArrayValueEquals(e2, t2) {
    if (e2.values?.length !== t2.values?.length) return "NOT_EQ";
    let n = false;
    for (let r = 0; r < (e2.values?.length ?? 0); r++) {
      const i = e2.values[r], s = t2.values[r];
      switch (__PRIVATE_strictValueEquals(i, s)) {
        case "EQ":
          break;
        case "NOT_EQ":
        case "TYPE_MISMATCH":
          return "NOT_EQ";
        case "NULL":
          n = true;
          break;
        default:
          fail(44609, {
            Lr: i,
            Br: s
          });
      }
    }
    if (n) return "NULL";
    return "EQ";
  })(e.arrayValue, t.arrayValue) : __PRIVATE_isVectorValue(e) && __PRIVATE_isVectorValue(t) || __PRIVATE_isMapValue(e) && __PRIVATE_isMapValue(t) ? (function __PRIVATE_strictObjectValueEquals(e2, t2) {
    const n = e2.fields || {}, r = t2.fields || {};
    if (__PRIVATE_objectSize(n) !== __PRIVATE_objectSize(r)) return "NOT_EQ";
    let i = false;
    for (const e3 in n) if (n.hasOwnProperty(e3)) {
      if (void 0 === r[e3]) return "NOT_EQ";
      switch (__PRIVATE_strictValueEquals(n[e3], r[e3])) {
        case "NOT_EQ":
        case "TYPE_MISMATCH":
          return "NOT_EQ";
        case "NULL":
          i = true;
      }
    }
    if (i) return "NULL";
    return "EQ";
  })(e.mapValue, t.mapValue) : (function __PRIVATE_valueEquals(e2, t2) {
    return __PRIVATE_valueEquals$1(e2, t2, {
      Te: false,
      Ee: true,
      he: true
    });
  })(e, t) ? "EQ" : "NOT_EQ";
}
class __PRIVATE_CoreAdd extends __PRIVATE_BigIntOrDoubleArithmetics {
  Nr(e, t) {
    return __PRIVATE_asBigInt(e) + __PRIVATE_asBigInt(t);
  }
  Mr(e, t) {
    return {
      doubleValue: __PRIVATE_asDouble(e) + __PRIVATE_asDouble(t)
    };
  }
}
class __PRIVATE_CoreSubtract extends __PRIVATE_BigIntOrDoubleArithmetics {
  constructor(e) {
    super(e), this.expr = e;
  }
  Nr(e, t) {
    return __PRIVATE_asBigInt(e) - __PRIVATE_asBigInt(t);
  }
  Mr(e, t) {
    return {
      doubleValue: __PRIVATE_asDouble(e) - __PRIVATE_asDouble(t)
    };
  }
}
class __PRIVATE_CoreMultiply extends __PRIVATE_BigIntOrDoubleArithmetics {
  constructor(e) {
    super(e), this.expr = e;
  }
  Nr(e, t) {
    return __PRIVATE_asBigInt(e) * __PRIVATE_asBigInt(t);
  }
  Mr(e, t) {
    return {
      doubleValue: __PRIVATE_asDouble(e) * __PRIVATE_asDouble(t)
    };
  }
}
class __PRIVATE_CoreDivide extends __PRIVATE_BigIntOrDoubleArithmetics {
  constructor(e) {
    super(e), this.expr = e;
  }
  Nr(e, t) {
    const n = __PRIVATE_asBigInt(t);
    if (n !== BigInt(0)) return __PRIVATE_asBigInt(e) / n;
  }
  Mr(e, t) {
    const n = __PRIVATE_asDouble(t);
    return 0 === n ? {
      doubleValue: __PRIVATE_isNegativeZero(n) ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY
    } : {
      doubleValue: __PRIVATE_asDouble(e) / n
    };
  }
}
class __PRIVATE_CoreMod extends __PRIVATE_BigIntOrDoubleArithmetics {
  constructor(e) {
    super(e), this.expr = e;
  }
  Nr(e, t) {
    const n = __PRIVATE_asBigInt(t);
    if (n !== BigInt(0)) return __PRIVATE_asBigInt(e) % n;
  }
  Mr(e, t) {
    const n = __PRIVATE_asDouble(t);
    if (0 !== n) return {
      doubleValue: __PRIVATE_asDouble(e) % n
    };
  }
}
class __PRIVATE_CoreAnd {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    let n = false, r = false;
    for (const i of this.expr.params) {
      const s = __PRIVATE_toEvaluable(i).evaluate(e, t);
      switch (s.type) {
        case "BOOLEAN":
          if (!s.value?.booleanValue) return __PRIVATE_EvaluateResult.newValue(ht);
          break;
        case "NULL":
          r = true;
          break;
        default:
          n = true;
      }
    }
    return n ? __PRIVATE_EvaluateResult.vr() : r ? __PRIVATE_EvaluateResult.Dr() : __PRIVATE_EvaluateResult.newValue(Et);
  }
}
class __PRIVATE_CoreNot {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 9634);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "BOOLEAN":
        return __PRIVATE_EvaluateResult.newValue({
          booleanValue: !n.value?.booleanValue
        });
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreOr {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    let n = false, r = false;
    for (const i of this.expr.params) {
      const s = __PRIVATE_toEvaluable(i).evaluate(e, t);
      switch (s.type) {
        case "BOOLEAN":
          if (s.value?.booleanValue) return __PRIVATE_EvaluateResult.newValue(Et);
          break;
        case "NULL":
          r = true;
          break;
        default:
          n = true;
      }
    }
    return n ? __PRIVATE_EvaluateResult.vr() : r ? __PRIVATE_EvaluateResult.Dr() : __PRIVATE_EvaluateResult.newValue(ht);
  }
}
class __PRIVATE_CoreXor {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    let n = false, r = false;
    for (const i of this.expr.params) {
      const s = __PRIVATE_toEvaluable(i).evaluate(e, t);
      switch (s.type) {
        case "BOOLEAN":
          n = __PRIVATE_CoreXor.xor(n, !!s.value?.booleanValue);
          break;
        case "NULL":
          r = true;
          break;
        default:
          return __PRIVATE_EvaluateResult.vr();
      }
    }
    return r ? __PRIVATE_EvaluateResult.Dr() : __PRIVATE_EvaluateResult.newValue({
      booleanValue: n
    });
  }
  // XOR(a, b) is equivalent to (a OR b) AND NOT(a AND b)
  // It is required to evaluate all arguments to ensure that the correct error semantics are
  // applied.
  static xor(e, t) {
    return (e || t) && !(e && t);
  }
}
class __PRIVATE_CoreEqAny {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 55094);
    let n = false;
    const r = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (r.type) {
      case "NULL":
        n = true;
        break;
      case "ERROR":
      case "UNSET":
        return __PRIVATE_EvaluateResult.vr();
    }
    const i = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    switch (i.type) {
      case "ARRAY":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    if (n) return __PRIVATE_EvaluateResult.Dr();
    for (const e2 of i.value?.arrayValue?.values ?? []) {
      switch (__PRIVATE_isNullValue(r.value) && __PRIVATE_isNullValue(e2) ? "EQ" : __PRIVATE_strictValueEquals(r.value, e2)) {
        case "EQ":
          return __PRIVATE_EvaluateResult.newValue(Et);
        case "NOT_EQ":
        case "TYPE_MISMATCH":
          break;
        case "NULL":
          n = true;
          break;
        default:
          fail(44608, {
            value: r.value,
            candidate: e2
          });
      }
    }
    return n ? __PRIVATE_EvaluateResult.Dr() : __PRIVATE_EvaluateResult.newValue(ht);
  }
}
class __PRIVATE_CoreNotEqAny {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    return new __PRIVATE_CoreNot(new FunctionExpression("not", [new FunctionExpression("equal_any", this.expr.params)])).evaluate(e, t);
  }
}
class __PRIVATE_CoreIsNan {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 23322);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "INT":
        return __PRIVATE_EvaluateResult.newValue(ht);
      case "DOUBLE":
        return __PRIVATE_EvaluateResult.newValue({
          booleanValue: isNaN(__PRIVATE_asDouble(n.value))
        });
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreIsNotNan {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 50406);
    return new __PRIVATE_CoreNot(new FunctionExpression("not", [new FunctionExpression("is_nan", this.expr.params)])).evaluate(e, t);
  }
}
class __PRIVATE_CoreIsNull {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 23123);
    switch (__PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t).type) {
      case "NULL":
        return __PRIVATE_EvaluateResult.newValue(Et);
      case "UNSET":
      case "ERROR":
        return __PRIVATE_EvaluateResult.vr();
      default:
        return __PRIVATE_EvaluateResult.newValue(ht);
    }
  }
}
class __PRIVATE_CoreIsNotNull {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 23167);
    return new __PRIVATE_CoreNot(new FunctionExpression("not", [new FunctionExpression("is_null", this.expr.params)])).evaluate(e, t);
  }
}
class __PRIVATE_CoreIsError {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 5228);
    return "ERROR" === __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t).type ? __PRIVATE_EvaluateResult.newValue(Et) : __PRIVATE_EvaluateResult.newValue(ht);
  }
}
class __PRIVATE_CoreExists {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 6877);
    switch (__PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t).type) {
      case "ERROR":
        return __PRIVATE_EvaluateResult.vr();
      case "UNSET":
        return __PRIVATE_EvaluateResult.newValue(ht);
      default:
        return __PRIVATE_EvaluateResult.newValue(Et);
    }
  }
}
class __PRIVATE_CoreCond {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(3 === this.expr.params.length, 11706);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "BOOLEAN":
        return n.value?.booleanValue ? __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t) : __PRIVATE_toEvaluable(this.expr.params[2]).evaluate(e, t);
      case "NULL":
        return __PRIVATE_toEvaluable(this.expr.params[2]).evaluate(e, t);
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreLogicalMaximum {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    const n = this.expr.params.map(((n2) => __PRIVATE_toEvaluable(n2).evaluate(e, t)));
    let r;
    for (const e2 of n) switch (e2.type) {
      case "ERROR":
      case "UNSET":
      case "NULL":
        continue;
      default:
        r = void 0 === r || __PRIVATE_valueCompare(e2.value, r.value) > 0 ? e2 : r;
    }
    return void 0 === r ? __PRIVATE_EvaluateResult.Dr() : r;
  }
}
class __PRIVATE_CoreLogicalMinimum {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    const n = this.expr.params.map(((n2) => __PRIVATE_toEvaluable(n2).evaluate(e, t)));
    let r;
    for (const e2 of n) switch (e2.type) {
      case "ERROR":
      case "UNSET":
      case "NULL":
        continue;
      default:
        r = void 0 === r || __PRIVATE_valueCompare(e2.value, r.value) < 0 ? e2 : r;
    }
    return void 0 === r ? __PRIVATE_EvaluateResult.Dr() : r;
  }
}
class __PRIVATE_ComparisonBase {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 31033, `${this.expr.name}() function should have exactly 2 params`);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "ERROR":
      case "UNSET":
        return __PRIVATE_EvaluateResult.vr();
    }
    const r = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    switch (r.type) {
      case "ERROR":
      case "UNSET":
        return __PRIVATE_EvaluateResult.vr();
    }
    return this.Ur(n, r);
  }
}
class __PRIVATE_CoreEq extends __PRIVATE_ComparisonBase {
  constructor(e) {
    super(e), this.expr = e;
  }
  Ur(e, t) {
    if (e.Fr() && t.Fr()) return __PRIVATE_EvaluateResult.newValue(Et);
    if (e.Fr() || t.Fr()) return __PRIVATE_EvaluateResult.newValue(ht);
    if (__PRIVATE_isNanValue(e.value) || __PRIVATE_isNanValue(t.value)) return __PRIVATE_EvaluateResult.newValue(ht);
    if (__PRIVATE_typeOrder(e.value) !== __PRIVATE_typeOrder(t.value)) return __PRIVATE_EvaluateResult.newValue(ht);
    switch (__PRIVATE_strictValueEquals(e.value, t.value)) {
      case "EQ":
        return __PRIVATE_EvaluateResult.newValue(Et);
      case "NOT_EQ":
        return __PRIVATE_EvaluateResult.newValue(ht);
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        fail(44615, {
          left: e,
          right: t
        });
    }
  }
}
class __PRIVATE_CoreNeq extends __PRIVATE_ComparisonBase {
  constructor(e) {
    super(e), this.expr = e;
  }
  Ur(e, t) {
    switch (__PRIVATE_strictValueEquals(e.value, t.value)) {
      case "EQ":
        return __PRIVATE_EvaluateResult.newValue(ht);
      case "NOT_EQ":
      case "TYPE_MISMATCH":
        return __PRIVATE_EvaluateResult.newValue(Et);
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        fail(44614, {
          left: e,
          right: t
        });
    }
  }
}
class __PRIVATE_CoreLt extends __PRIVATE_ComparisonBase {
  constructor(e) {
    super(e), this.expr = e;
  }
  Ur(e, t) {
    return __PRIVATE_typeOrder(e.value) !== __PRIVATE_typeOrder(t.value) || __PRIVATE_isNanValue(e.value) || __PRIVATE_isNanValue(t.value) ? __PRIVATE_EvaluateResult.newValue(ht) : __PRIVATE_EvaluateResult.newValue({
      booleanValue: __PRIVATE_valueCompare(e.value, t.value) < 0
    });
  }
}
class __PRIVATE_CoreLte extends __PRIVATE_ComparisonBase {
  constructor(e) {
    super(e), this.expr = e;
  }
  Ur(e, t) {
    return __PRIVATE_typeOrder(e.value) !== __PRIVATE_typeOrder(t.value) || __PRIVATE_isNanValue(e.value) || __PRIVATE_isNanValue(t.value) ? __PRIVATE_EvaluateResult.newValue(ht) : "EQ" === __PRIVATE_strictValueEquals(e.value, t.value) ? __PRIVATE_EvaluateResult.newValue(Et) : __PRIVATE_EvaluateResult.newValue({
      booleanValue: __PRIVATE_valueCompare(e.value, t.value) < 0
    });
  }
}
class __PRIVATE_CoreGt extends __PRIVATE_ComparisonBase {
  constructor(e) {
    super(e), this.expr = e;
  }
  Ur(e, t) {
    return __PRIVATE_typeOrder(e.value) !== __PRIVATE_typeOrder(t.value) || __PRIVATE_isNanValue(e.value) || __PRIVATE_isNanValue(t.value) ? __PRIVATE_EvaluateResult.newValue(ht) : __PRIVATE_EvaluateResult.newValue({
      booleanValue: __PRIVATE_valueCompare(e.value, t.value) > 0
    });
  }
}
class __PRIVATE_CoreGte extends __PRIVATE_ComparisonBase {
  constructor(e) {
    super(e), this.expr = e;
  }
  Ur(e, t) {
    return __PRIVATE_typeOrder(e.value) !== __PRIVATE_typeOrder(t.value) || __PRIVATE_isNanValue(e.value) || __PRIVATE_isNanValue(t.value) ? __PRIVATE_EvaluateResult.newValue(ht) : "EQ" === __PRIVATE_strictValueEquals(e.value, t.value) ? __PRIVATE_EvaluateResult.newValue(Et) : __PRIVATE_EvaluateResult.newValue({
      booleanValue: __PRIVATE_valueCompare(e.value, t.value) > 0
    });
  }
}
class __PRIVATE_CoreArrayConcat {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    throw new Error("Unimplemented");
  }
}
class __PRIVATE_CoreArrayReverse {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 216);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      case "ARRAY": {
        const e2 = n.value.arrayValue?.values ?? [];
        return __PRIVATE_EvaluateResult.newValue({
          arrayValue: {
            values: [...e2].reverse()
          }
        });
      }
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreArrayContains {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    return __PRIVATE_hardAssert(2 === this.expr.params.length, 52884), new __PRIVATE_CoreEqAny(new FunctionExpression("eq_any", [this.expr.params[1], this.expr.params[0]])).evaluate(e, t);
  }
}
class __PRIVATE_CoreArrayContainsAll {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 1392);
    let n = false;
    const r = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (r.type) {
      case "ARRAY":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const i = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    switch (i.type) {
      case "ARRAY":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    if (n) return __PRIVATE_EvaluateResult.Dr();
    const s = i.value?.arrayValue?.values ?? [], _ = r.value?.arrayValue?.values ?? [];
    for (const e2 of s) {
      let t2 = false;
      n = false;
      for (const r2 of _) {
        switch (__PRIVATE_isNullValue(e2) && __PRIVATE_isNullValue(r2) ? "EQ" : __PRIVATE_strictValueEquals(e2, r2)) {
          case "EQ":
            t2 = true;
            break;
          case "NOT_EQ":
          case "TYPE_MISMATCH":
            break;
          case "NULL":
            n = true;
            break;
          default:
            fail(44613, {
              value: r2,
              search: e2
            });
        }
        if (t2)
          break;
      }
      if (!t2)
        return __PRIVATE_EvaluateResult.newValue(ht);
    }
    return __PRIVATE_EvaluateResult.newValue(Et);
  }
}
class __PRIVATE_CoreArrayContainsAny {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 2680);
    let n = false;
    const r = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (r.type) {
      case "ARRAY":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const i = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    switch (i.type) {
      case "ARRAY":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    if (n) return __PRIVATE_EvaluateResult.Dr();
    const s = i.value?.arrayValue?.values ?? [], _ = r.value?.arrayValue?.values ?? [];
    for (const e2 of _) for (const t2 of s) {
      switch (__PRIVATE_isNullValue(e2) && __PRIVATE_isNullValue(t2) ? "EQ" : __PRIVATE_strictValueEquals(e2, t2)) {
        case "EQ":
          return __PRIVATE_EvaluateResult.newValue(Et);
        case "NOT_EQ":
        case "TYPE_MISMATCH":
          break;
        case "NULL":
          n = true;
          break;
        default:
          fail(44608, {
            value: e2,
            search: t2
          });
      }
    }
    return n ? __PRIVATE_EvaluateResult.Dr() : __PRIVATE_EvaluateResult.newValue(ht);
  }
}
class __PRIVATE_CoreArrayLength {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 38605);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      case "ARRAY":
        return __PRIVATE_EvaluateResult.newValue({
          integerValue: `${n.value?.arrayValue?.values?.length ?? 0}`
        });
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreArrayElement {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    throw new Error("Unimplemented");
  }
}
class __PRIVATE_CoreReverse {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 1508);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      case "BYTES": {
        const e2 = n.value?.bytesValue;
        if ("string" == typeof e2) {
          const t2 = ByteString.fromBase64String(e2).toUint8Array();
          return t2.reverse(), __PRIVATE_EvaluateResult.newValue({
            bytesValue: ByteString.fromUint8Array(t2).toBase64()
          });
        }
        return __PRIVATE_EvaluateResult.newValue({
          bytesValue: new Uint8Array(e2).reverse()
        });
      }
      case "STRING": {
        const e2 = n.value?.stringValue, t2 = new Intl.__PRIVATE_Segmenter(void 0, {
          granularity: "grapheme"
        }).segment(e2), r = Array.from(t2, ((e3) => e3.segment)).reverse();
        return __PRIVATE_EvaluateResult.newValue({
          stringValue: r.join("")
        });
      }
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreReplaceFirst {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    throw new Error("Unimplemented");
  }
}
class __PRIVATE_CoreReplaceAll {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    throw new Error("Unimplemented");
  }
}
class __PRIVATE_CoreCharLength {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 19400);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      case "STRING": {
        const e2 = (function __PRIVATE_getUnicodePointCount(e3) {
          let t2 = 0;
          for (let n2 = 0; n2 < e3.length; n2++) {
            const r = e3.codePointAt(n2);
            if (void 0 === r) return;
            if (r <= 65535)
              if (r >= 55296 && r <= 57343)
                if (r <= 56319) {
                  const r2 = e3.codePointAt(n2 + 1);
                  void 0 !== r2 && r2 >= 56320 && r2 <= 57343 ? (
                    // Valid surrogate pair (counts as one character)
                    (t2 += 1, n2++)
                  ) : (
                    // Lone high surrogate - treat as one character for length, but invalid for byte length
                    t2 += 1
                  );
                } else
                  t2 += 1;
              else
                t2 += 1;
            else {
              if (!(r <= 1114111)) return;
              t2 += 1, n2++;
            }
          }
          return t2;
        })(n.value.stringValue);
        return void 0 === e2 ? __PRIVATE_EvaluateResult.vr() : __PRIVATE_EvaluateResult.newValue({
          integerValue: e2
        });
      }
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreByteLength {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 8486);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "BYTES": {
        const e2 = n.value?.bytesValue;
        return "string" == typeof e2 ? __PRIVATE_EvaluateResult.newValue({
          integerValue: ByteString.fromBase64String(e2).toUint8Array().length
        }) : __PRIVATE_EvaluateResult.newValue({
          integerValue: new Uint8Array(e2).length
        });
      }
      case "STRING": {
        const e2 = (function __PRIVATE_getUtf8ByteLength(e3) {
          let t2 = 0;
          for (let n2 = 0; n2 < e3.length; n2++) {
            const r = e3.codePointAt(n2);
            if (void 0 === r) return;
            if (r >= 55296 && r <= 57343) {
              if (!(r <= 56319)) return;
              {
                const r2 = e3.codePointAt(n2 + 1);
                if (void 0 === r2 || !(r2 >= 56320 && r2 <= 57343)) return;
                t2 += 4, n2++;
              }
            } else if (r <= 127) t2 += 1;
            else if (r <= 2047) t2 += 2;
            else if (r <= 65535) t2 += 3;
            else {
              if (!(r <= 1114111)) return;
              t2 += 4, n2++;
            }
          }
          return t2;
        })(n.value?.stringValue);
        return void 0 === e2 ? __PRIVATE_EvaluateResult.vr() : __PRIVATE_EvaluateResult.newValue({
          integerValue: e2
        });
      }
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_StringSearchFunctionBase {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 39773, `${this.expr.name}() function should have exactly two parameters`);
    let n = false;
    const r = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (r.type) {
      case "STRING":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const i = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    switch (i.type) {
      case "STRING":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    return n ? __PRIVATE_EvaluateResult.Dr() : this.kr(r.value?.stringValue, i.value?.stringValue);
  }
}
class __PRIVATE_CoreLike extends __PRIVATE_StringSearchFunctionBase {
  kr(e, t) {
    try {
      const n = (function __PRIVATE_likeToRegex(e2) {
        let t2 = "";
        for (let n2 = 0; n2 < e2.length; n2++) {
          const r2 = e2.charAt(n2);
          switch (r2) {
            case "_":
              t2 += ".";
              break;
            case "%":
              t2 += ".*";
              break;
            // Escape regex special characters
            case "\\":
            // Need to escape backslash itself
            case ".":
            case "*":
            case "?":
            case "+":
            case "^":
            case "$":
            case "|":
            case "(":
            case ")":
            case "[":
            case "]":
            case "{":
            case "}":
              t2 += "\\" + r2;
              break;
            default:
              t2 += r2;
          }
        }
        return "^" + t2 + "$";
      })(t), r = RE2JS.compile(n);
      return __PRIVATE_EvaluateResult.newValue({
        booleanValue: r.matches(e)
      });
    } catch (e2) {
      return __PRIVATE_logWarn(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${e2}`), __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreRegexContains extends __PRIVATE_StringSearchFunctionBase {
  kr(e, t) {
    try {
      const n = RE2JS.compile(t);
      return __PRIVATE_EvaluateResult.newValue({
        booleanValue: n.matcher(e).find()
      });
    } catch (e2) {
      return __PRIVATE_logWarn(`Invalid regex pattern found in regex_contains: ${t}, returning error`), __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreRegexMatch extends __PRIVATE_StringSearchFunctionBase {
  kr(e, t) {
    try {
      return __PRIVATE_EvaluateResult.newValue({
        booleanValue: RE2JS.compile(t).matches(e)
      });
    } catch (e2) {
      return __PRIVATE_logWarn(`Invalid regex pattern found in regex_match: ${t}, returning error`), __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreStrContains extends __PRIVATE_StringSearchFunctionBase {
  kr(e, t) {
    return __PRIVATE_EvaluateResult.newValue({
      booleanValue: e.includes(t)
    });
  }
}
class __PRIVATE_CoreStartsWith extends __PRIVATE_StringSearchFunctionBase {
  kr(e, t) {
    return __PRIVATE_EvaluateResult.newValue({
      booleanValue: e.startsWith(t)
    });
  }
}
class __PRIVATE_CoreEndsWith extends __PRIVATE_StringSearchFunctionBase {
  kr(e, t) {
    return __PRIVATE_EvaluateResult.newValue({
      booleanValue: e.endsWith(t)
    });
  }
}
class __PRIVATE_CoreToLower {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 29079);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "STRING":
        return __PRIVATE_EvaluateResult.newValue({
          stringValue: n.value?.stringValue?.toLowerCase()
        });
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreToUpper {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 60487);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "STRING":
        return __PRIVATE_EvaluateResult.newValue({
          stringValue: n.value?.stringValue?.toUpperCase()
        });
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreTrim {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 28544);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "STRING":
        return __PRIVATE_EvaluateResult.newValue({
          stringValue: n.value?.stringValue?.trim()
        });
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreStrConcat {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    const n = this.expr.params.map(((n2) => __PRIVATE_toEvaluable(n2).evaluate(e, t)));
    let r = "", i = false;
    for (const e2 of n) switch (e2.type) {
      case "STRING":
        r += e2.value.stringValue;
        break;
      case "NULL":
        i = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    return i ? __PRIVATE_EvaluateResult.Dr() : __PRIVATE_EvaluateResult.newValue({
      stringValue: r
    });
  }
}
class __PRIVATE_CoreMapGet {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 4483);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "UNSET":
        return __PRIVATE_EvaluateResult.Sr();
      case "MAP":
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const r = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    if ("STRING" !== r.type) return __PRIVATE_EvaluateResult.vr();
    const i = n.value?.mapValue?.fields?.[r.value?.stringValue];
    return void 0 === i ? __PRIVATE_EvaluateResult.Sr() : __PRIVATE_EvaluateResult.newValue(i);
  }
}
class __PRIVATE_DistanceBase {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(2 === this.expr.params.length, 25231, `${this.expr.name}() function should have exactly 2 params`);
    let n = false;
    const r = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (r.type) {
      case "VECTOR":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const i = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    switch (i.type) {
      case "VECTOR":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    if (n) return __PRIVATE_EvaluateResult.Dr();
    const s = __PRIVATE_getVectorValue(r.value), _ = __PRIVATE_getVectorValue(i.value);
    if (void 0 === s || void 0 === _ || s.values?.length !== _.values?.length) return __PRIVATE_EvaluateResult.vr();
    const o = this.qr(s, _);
    return void 0 === o || isNaN(o) ? __PRIVATE_EvaluateResult.vr() : __PRIVATE_EvaluateResult.newValue({
      doubleValue: o
    });
  }
}
class __PRIVATE_CoreCosineDistance extends __PRIVATE_DistanceBase {
  qr(e, t) {
    const n = e?.values ?? [], r = t?.values ?? [];
    if (0 === n.length) return;
    let i = 0, s = 0, _ = 0;
    for (let e2 = 0; e2 < n.length; e2++) {
      if (!__PRIVATE_isNumber(n[e2]) || !__PRIVATE_isNumber(r[e2])) return;
      const t2 = __PRIVATE_asDouble(n[e2]), o2 = __PRIVATE_asDouble(r[e2]);
      i += t2 * o2, s += t2 * t2, _ += o2 * o2;
    }
    const o = Math.sqrt(s) * Math.sqrt(_);
    if (0 === o) return;
    return 1 - Math.max(-1, Math.min(1, i / o));
  }
}
class __PRIVATE_CoreDotProduct extends __PRIVATE_DistanceBase {
  qr(e, t) {
    const n = e?.values ?? [], r = t?.values ?? [];
    if (0 === n.length) return 0;
    let i = 0;
    for (let e2 = 0; e2 < n.length; e2++) {
      if (!__PRIVATE_isNumber(n[e2]) || !__PRIVATE_isNumber(r[e2])) return;
      i += __PRIVATE_asDouble(n[e2]) * __PRIVATE_asDouble(r[e2]);
    }
    return i;
  }
}
class __PRIVATE_CoreEuclideanDistance extends __PRIVATE_DistanceBase {
  qr(e, t) {
    const n = e?.values ?? [], r = t?.values ?? [];
    if (0 === n.length) return 0;
    let i = 0;
    for (let e2 = 0; e2 < n.length; e2++) {
      if (!__PRIVATE_isNumber(n[e2]) || !__PRIVATE_isNumber(r[e2])) return;
      const t2 = __PRIVATE_asDouble(n[e2]), s = __PRIVATE_asDouble(r[e2]);
      i += Math.pow(t2 - s, 2);
    }
    return Math.sqrt(i);
  }
}
class __PRIVATE_CoreVectorLength {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 39044);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "VECTOR": {
        const e2 = __PRIVATE_getVectorValue(n.value);
        return __PRIVATE_EvaluateResult.newValue({
          integerValue: e2?.values?.length ?? 0
        });
      }
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
const Gt = BigInt(-62135596800), zt = BigInt(253402300799), jt = BigInt(1e3), Ht = BigInt(1e6), Jt = Gt * jt, Yt$1 = zt * jt + BigInt(999), Zt = Gt * Ht, Xt = zt * Ht + BigInt(999999);
function __PRIVATE_isMicrosInBounds(e) {
  return e >= Zt && e <= Xt;
}
function __PRIVATE_isSecondsInBounds(e) {
  return e >= Gt && e <= zt;
}
function __PRIVATE_isTimestampInBounds(e, t) {
  const n = BigInt(e);
  return !(n < Gt || n > zt) && // Nanos must be non-negative and less than 1 second
  (!(t < 0 || t >= 1e9) && // Additional check for min/max boundaries
  ((n !== Gt || 0 === t) && !(n === zt && t > 999999999)));
}
function __PRIVATE_adjustTimestamp(e, t) {
  return t < 0 ? {
    seconds: e - 1,
    nanos: t + 1e9
  } : {
    seconds: e,
    nanos: t
  };
}
function __PRIVATE_timestampToMicros(e) {
  return BigInt(e.seconds) * Ht + // Integer division truncates towards zero
  BigInt(Math.trunc(e.nanoseconds / 1e3));
}
class __PRIVATE_UnixToTimestamp {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 49262, `${this.expr.name}() function should have exactly one parameter`);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "INT":
        return this.toTimestamp(BigInt(n.value.integerValue));
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
  }
}
class __PRIVATE_CoreUnixMicrosToTimestamp extends __PRIVATE_UnixToTimestamp {
  toTimestamp(e) {
    if (!__PRIVATE_isMicrosInBounds(e)) return __PRIVATE_EvaluateResult.vr();
    let t = Number(e / Ht), n = Number(e % Ht * BigInt(1e3));
    const r = __PRIVATE_adjustTimestamp(t, n);
    return t = r.seconds, n = r.nanos, __PRIVATE_isTimestampInBounds(t, n) ? __PRIVATE_EvaluateResult.newValue({
      timestampValue: {
        seconds: t,
        nanos: n
      }
    }) : __PRIVATE_EvaluateResult.vr();
  }
}
class __PRIVATE_CoreUnixMillisToTimestamp extends __PRIVATE_UnixToTimestamp {
  toTimestamp(e) {
    if (!(function __PRIVATE_isMillisInBounds(e2) {
      return e2 >= Jt && e2 <= Yt$1;
    })(e)) return __PRIVATE_EvaluateResult.vr();
    let t = Number(e / jt), n = Number(e % jt * BigInt(1e6));
    const r = __PRIVATE_adjustTimestamp(t, n);
    return t = r.seconds, n = r.nanos, __PRIVATE_isTimestampInBounds(t, n) ? __PRIVATE_EvaluateResult.newValue({
      timestampValue: {
        seconds: t,
        nanos: n
      }
    }) : __PRIVATE_EvaluateResult.vr();
  }
}
class __PRIVATE_CoreUnixSecondsToTimestamp extends __PRIVATE_UnixToTimestamp {
  toTimestamp(e) {
    if (!__PRIVATE_isSecondsInBounds(e)) return __PRIVATE_EvaluateResult.vr();
    const t = Number(e);
    return __PRIVATE_EvaluateResult.newValue({
      timestampValue: {
        seconds: t,
        nanos: 0
      }
    });
  }
}
class __PRIVATE_TimestampToUnix {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(1 === this.expr.params.length, 1265, `${this.expr.name}() function should have exactly one parameter`);
    const n = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (n.type) {
      case "TIMESTAMP":
        break;
      case "NULL":
        return __PRIVATE_EvaluateResult.Dr();
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const r = fromTimestamp(n.value.timestampValue);
    return __PRIVATE_isTimestampInBounds(r.seconds, r.nanoseconds) ? this.$r(r) : __PRIVATE_EvaluateResult.vr();
  }
}
class __PRIVATE_CoreTimestampToUnixMicros extends __PRIVATE_TimestampToUnix {
  $r(e) {
    const t = __PRIVATE_timestampToMicros(e);
    return __PRIVATE_isMicrosInBounds(t) ? __PRIVATE_EvaluateResult.newValue({
      integerValue: `${t.toString()}`
    }) : __PRIVATE_EvaluateResult.vr();
  }
}
class __PRIVATE_CoreTimestampToUnixMillis extends __PRIVATE_TimestampToUnix {
  $r(e) {
    const t = __PRIVATE_timestampToMicros(e), n = t / BigInt(1e3), r = t % BigInt(1e3);
    return n > BigInt(0) || r === BigInt(0) ? __PRIVATE_EvaluateResult.newValue({
      integerValue: n.toString()
    }) : __PRIVATE_EvaluateResult.newValue({
      integerValue: (n - BigInt(1)).toString()
    });
  }
}
class __PRIVATE_CoreTimestampToUnixSeconds extends __PRIVATE_TimestampToUnix {
  $r(e) {
    const t = BigInt(e.seconds);
    return __PRIVATE_isSecondsInBounds(t) ? __PRIVATE_EvaluateResult.newValue({
      integerValue: t.toString()
    }) : __PRIVATE_EvaluateResult.vr();
  }
}
class __PRIVATE_TimestampArithmetic {
  constructor(e) {
    this.expr = e;
  }
  evaluate(e, t) {
    __PRIVATE_hardAssert(3 === this.expr.params.length, 2775, `${this.expr.name}() function should have exactly 3 parameters`);
    let n = false;
    const r = __PRIVATE_toEvaluable(this.expr.params[0]).evaluate(e, t);
    switch (r.type) {
      case "TIMESTAMP":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const i = __PRIVATE_toEvaluable(this.expr.params[1]).evaluate(e, t);
    let s;
    switch (i.type) {
      case "STRING":
        if (s = (function __PRIVATE_asTimeUnit(e2) {
          switch (e2) {
            case "microsecond":
              return "microsecond";
            case "millisecond":
              return "millisecond";
            case "second":
              return "second";
            case "minute":
              return "minute";
            case "hour":
              return "hour";
            case "day":
              return "day";
            default:
              return;
          }
        })(i.value.stringValue), void 0 === s) return __PRIVATE_EvaluateResult.vr();
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    const _ = __PRIVATE_toEvaluable(this.expr.params[2]).evaluate(e, t);
    switch (_.type) {
      case "INT":
        break;
      case "NULL":
        n = true;
        break;
      default:
        return __PRIVATE_EvaluateResult.vr();
    }
    if (n) return __PRIVATE_EvaluateResult.Dr();
    const o = BigInt(_.value.integerValue);
    let a;
    try {
      switch (s) {
        case "microsecond":
          a = o;
          break;
        case "millisecond":
          a = o * BigInt(1e3);
          break;
        case "second":
          a = o * BigInt(1e6);
          break;
        case "minute":
          a = o * BigInt(6e7);
          break;
        case "hour":
          a = o * BigInt(36e8);
          break;
        case "day":
          a = o * BigInt(864e8);
          break;
        default:
          return __PRIVATE_EvaluateResult.vr();
      }
      if ("microsecond" !== s && o !== BigInt(0) && a / o !== BigInt(this.Kr(s))) return __PRIVATE_EvaluateResult.vr();
    } catch (e2) {
      return __PRIVATE_logWarn(`Error during timestamp arithmetic: ${e2}`), __PRIVATE_EvaluateResult.vr();
    }
    const u = fromTimestamp(r.value.timestampValue);
    if (!__PRIVATE_isTimestampInBounds(u.seconds, u.nanoseconds)) return __PRIVATE_EvaluateResult.vr();
    const c = __PRIVATE_timestampToMicros(u), l = this.Wr(c, a);
    if (!__PRIVATE_isMicrosInBounds(l)) return __PRIVATE_EvaluateResult.vr();
    const E = Number(l / Ht), h = l % Ht, T = Number((h < 0 ? h + Ht : h) * BigInt(1e3)), P = h < 0 ? E - 1 : E;
    return __PRIVATE_isTimestampInBounds(P, T) ? __PRIVATE_EvaluateResult.newValue({
      timestampValue: {
        seconds: P,
        nanos: T
      }
    }) : __PRIVATE_EvaluateResult.vr();
  }
  Kr(e) {
    switch (e) {
      case "millisecond":
        return 1e3;
      case "second":
        return 1e6;
      case "minute":
        return 6e7;
      case "hour":
        return 36e8;
      case "day":
        return 864e8;
      default:
        return 1;
    }
  }
}
class __PRIVATE_CoreTimestampAdd extends __PRIVATE_TimestampArithmetic {
  Wr(e, t) {
    return e + t;
  }
}
class __PRIVATE_CoreTimestampSub extends __PRIVATE_TimestampArithmetic {
  Wr(e, t) {
    return e - t;
  }
}
function __PRIVATE_canonifyExpr(e) {
  if ((e = __PRIVATE_unwrapExpression(e)) instanceof Field) return `fld(${e.fieldName})`;
  if (e instanceof Constant) return `cst(${(function __PRIVATE_canonifyConstantValue(e2) {
    return null === e2 ? "null" : "number" == typeof e2 ? e2.toString() : "string" == typeof e2 ? `"${e2}"` : e2 instanceof DocumentReference ? `ref(${e2.path})` : e2 instanceof VectorValue ? `vec(${JSON.stringify(e2)})` : JSON.stringify(e2);
  })(e.value)})`;
  if (e instanceof FunctionExpression) return `fn(${e.name},[${e.params.map(__PRIVATE_canonifyExpr).join(",")}])`;
  if ("ListOfExpressions" === e.expressionType) return `list([${e.Rr.map(__PRIVATE_canonifyExpr).join(",")}])`;
  throw new Error(`Unrecognized expr ${JSON.stringify(e, null, 2)}`);
}
function __PRIVATE_canonifyStage(e) {
  if (e instanceof __PRIVATE_AddFields) return `${e._name}(${__PRIVATE_canonifyExprMap(e.fields)})`;
  if (e instanceof __PRIVATE_Aggregate) {
    let t = `${e._name}(${__PRIVATE_canonifyExprMap(e.accumulators)})`;
    return e.groups.size > 0 && (t += `grouping(${__PRIVATE_canonifyExprMap(e.groups)})`), t;
  }
  if (e instanceof __PRIVATE_Distinct) return `${e._name}(${__PRIVATE_canonifyExprMap(e.groups)})`;
  if (e instanceof __PRIVATE_CollectionSource) return `${e._name}(${e.Vr})`;
  if (e instanceof __PRIVATE_CollectionGroupSource) return `${e._name}(${e.collectionId})`;
  if (e instanceof __PRIVATE_DatabaseSource) return `${e._name}()`;
  if (e instanceof __PRIVATE_DocumentsSource) return `${e._name}(${e.dr.sort()})`;
  if (e instanceof __PRIVATE_Where) return `${e._name}(${__PRIVATE_canonifyExpr(e.condition)})`;
  if (e instanceof __PRIVATE_Limit) return `${e._name}(${e.limit})`;
  if (e instanceof __PRIVATE_Sort) return `${e._name}(${(function __PRIVATE_canonifySortOrderings(e2) {
    return e2.map(((e3) => `${__PRIVATE_canonifyExpr(e3.expr)}${e3.direction}`)).join(",");
  })(e.orderings)})`;
  throw new Error(`Unrecognized stage ${e._name}`);
}
function __PRIVATE_canonifyExprMap(e) {
  return `${Array.from(e.entries()).sort().map((([e2, t]) => `${e2}=${__PRIVATE_canonifyExpr(t)}`)).join(",")}`;
}
function __PRIVATE_canonifyPipeline(e) {
  return e.stages.map(((e2) => __PRIVATE_canonifyStage(e2))).join("|");
}
function __PRIVATE_pipelineEq(e, t) {
  return __PRIVATE_canonifyPipeline(e) === __PRIVATE_canonifyPipeline(t);
}
function __PRIVATE_isPipeline(e) {
  return e instanceof CorePipeline;
}
function __PRIVATE_stringifyQueryOrPipeline(e) {
  return __PRIVATE_isPipeline(e) ? __PRIVATE_canonifyPipeline(e) : __PRIVATE_stringifyQuery(e);
}
function __PRIVATE_canonifyQueryOrPipeline(e) {
  return __PRIVATE_isPipeline(e) ? __PRIVATE_canonifyPipeline(e) : (function __PRIVATE_canonifyQuery(e2) {
    return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e2))}|lt:${e2.limitType}`;
  })(e);
}
function __PRIVATE_queryOrPipelineEqual(e, t) {
  return e instanceof CorePipeline && t instanceof CorePipeline ? __PRIVATE_pipelineEq(e, t) : !(e instanceof CorePipeline && !(t instanceof CorePipeline) || !(e instanceof CorePipeline) && t instanceof CorePipeline) && __PRIVATE_queryEquals(e, t);
}
function __PRIVATE_canonifyTargetOrPipeline(e) {
  return __PRIVATE_targetIsPipelineTarget(e) ? __PRIVATE_canonifyPipeline(e) : __PRIVATE_canonifyTarget(e);
}
function __PRIVATE_targetOrPipelineEqual(e, t) {
  return e instanceof CorePipeline && t instanceof CorePipeline ? __PRIVATE_pipelineEq(e, t) : !(e instanceof CorePipeline && !(t instanceof CorePipeline) || !(e instanceof CorePipeline) && t instanceof CorePipeline) && __PRIVATE_targetEquals(e, t);
}
class MutationBatch {
  /**
   * @param batchId - The unique ID of this mutation batch.
   * @param localWriteTime - The original write time of this mutation.
   * @param baseMutations - Mutations that are used to populate the base
   * values when this mutation is applied locally. This can be used to locally
   * overwrite values that are persisted in the remote document cache. Base
   * mutations are never sent to the backend.
   * @param mutations - The user-provided mutations in this mutation batch.
   * User-provided mutations are applied both locally and remotely on the
   * backend.
   */
  constructor(e, t, n, r) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
  }
  /**
   * Applies all the mutations in this MutationBatch to the specified document
   * to compute the state of the remote document
   *
   * @param document - The document to apply mutations to.
   * @param batchResult - The result of applying the MutationBatch to the
   * backend.
   */
  applyToRemoteDocument(e, t) {
    const n = t.mutationResults;
    for (let t2 = 0; t2 < this.mutations.length; t2++) {
      const r = this.mutations[t2];
      if (r.key.isEqual(e.key)) {
        __PRIVATE_mutationApplyToRemoteDocument(r, e, n[t2]);
      }
    }
  }
  /**
   * Computes the local view of a document given all the mutations in this
   * batch.
   *
   * @param document - The document to apply mutations to.
   * @param mutatedFields - Fields that have been updated before applying this mutation batch.
   * @returns A `FieldMask` representing all the fields that are mutated.
   */
  applyToLocalView(e, t) {
    for (const n of this.baseMutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    for (const n of this.mutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    return t;
  }
  /**
   * Computes the local view for all provided documents given the mutations in
   * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
   * replace all the mutation applications.
   */
  applyToLocalDocumentSet(e, t) {
    const n = __PRIVATE_newMutationMap();
    return this.mutations.forEach(((r) => {
      const i = e.get(r.key), s = i.overlayedDocument;
      let _ = this.applyToLocalView(s, i.mutatedFields);
      _ = t.has(r.key) ? null : _;
      const o = __PRIVATE_calculateOverlayMutation(s, _);
      null !== o && n.set(r.key, o), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
    })), n;
  }
  keys() {
    return this.mutations.reduce(((e, t) => e.add(t.key)), __PRIVATE_documentKeySet());
  }
  isEqual(e) {
    return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, ((e2, t) => __PRIVATE_mutationEquals(e2, t))) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, ((e2, t) => __PRIVATE_mutationEquals(e2, t)));
  }
}
class MutationBatchResult {
  constructor(e, t, n, r) {
    this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r;
  }
  /**
   * Creates a new MutationBatchResult for the given batch and results. There
   * must be one result for each mutation in the batch. This static factory
   * caches a document=&gt;version mapping (docVersions).
   */
  static from(e, t, n) {
    __PRIVATE_hardAssert(e.mutations.length === n.length, 58842, {
      Qr: e.mutations.length,
      Gr: n.length
    });
    let r = /* @__PURE__ */ (function __PRIVATE_documentVersionMap() {
      return Vt;
    })();
    const i = e.mutations;
    for (let e2 = 0; e2 < i.length; e2++) r = r.insert(i[e2].key, n[e2].version);
    return new MutationBatchResult(e, t, n, r);
  }
}
class Overlay {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return null !== e && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
  }
}
class __PRIVATE_LocalSerializer {
  constructor(e) {
    this.zr = e;
  }
}
function __PRIVATE_fromBundledQuery(e) {
  const t = __PRIVATE_convertQueryTargetToQuery({
    parent: e.parent,
    structuredQuery: e.structuredQuery
  });
  return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(
    t,
    t.limit,
    "L"
    /* LimitType.Last */
  ) : t;
}
class __PRIVATE_MemoryIndexManager {
  constructor() {
    this.Hi = new __PRIVATE_MemoryCollectionParentIndex();
  }
  addToCollectionParentIndex(e, t) {
    return this.Hi.add(t), PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    return PersistencePromise.resolve(this.Hi.getEntries(t));
  }
  addFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteAllFieldIndexes(e) {
    return PersistencePromise.resolve();
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return PersistencePromise.resolve(null);
  }
  getIndexType(e, t) {
    return PersistencePromise.resolve(
      0
      /* IndexType.NONE */
    );
  }
  getFieldIndexes(e, t) {
    return PersistencePromise.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return PersistencePromise.resolve(null);
  }
  getMinOffset(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  updateCollectionGroup(e, t, n) {
    return PersistencePromise.resolve();
  }
  updateIndexEntries(e, t) {
    return PersistencePromise.resolve();
  }
}
class __PRIVATE_MemoryCollectionParentIndex {
  constructor() {
    this.index = {};
  }
  // Returns false if the entry already existed.
  add(e) {
    const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r.has(n);
    return this.index[t] = r.add(n), i;
  }
  has(e) {
    const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
    return r && r.has(n);
  }
  getEntries(e) {
    return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
  }
}
class __PRIVATE_TargetIdGenerator {
  constructor(e) {
    this.Ds = e;
  }
  next() {
    return this.Ds += 2, this.Ds;
  }
  static xs() {
    return new __PRIVATE_TargetIdGenerator(0);
  }
  static Cs() {
    return new __PRIVATE_TargetIdGenerator(-1);
  }
}
function __PRIVATE_runPipeline(e, t) {
  let n = t;
  for (const t2 of e.stages) n = evaluate({
    serializer: e.serializer,
    serverTimestampBehavior: e.listenOptions?.serverTimestampBehavior
  }, t2, n);
  return n;
}
function __PRIVATE_pipelineMatches(e, t) {
  return __PRIVATE_runPipeline(e, [t]).length > 0;
}
function evaluate(e, t, n) {
  if (t instanceof __PRIVATE_CollectionSource) return (function __PRIVATE_evaluateCollection(e2, t2, n2) {
    return n2.filter(((e3) => e3.isFoundDocument() && `/${e3.key.getCollectionPath().canonicalString()}` === t2.Vr));
  })(0, t, n);
  if (t instanceof __PRIVATE_Where) return (function __PRIVATE_evaluateWhere(e2, t2, n2) {
    return n2.filter(((n3) => {
      const r = __PRIVATE_valueOrUndefined(__PRIVATE_toEvaluable(t2.condition).evaluate(e2, n3));
      return void 0 !== r && __PRIVATE_valueEquals$1(r, Et);
    }));
  })(e, t, n);
  if (t instanceof __PRIVATE_CollectionGroupSource) return (function __PRIVATE_evaluateCollectionGroup(e2, t2, n2) {
    return n2.filter(((e3) => e3.isFoundDocument() && e3.key.getCollectionPath().lastSegment() === t2.collectionId));
  })(0, t, n);
  if (t instanceof __PRIVATE_DatabaseSource) return (function __PRIVATE_evaluateDatabase(e2, t2, n2) {
    return n2.filter(((e3) => e3.isFoundDocument()));
  })(0, 0, n);
  if (t instanceof __PRIVATE_DocumentsSource) return (function __PRIVATE_evaluateDocuments(e2, t2, n2) {
    return n2.filter(((e3) => e3.isFoundDocument() && t2.mr.has(e3.key.path.toStringWithLeadingSlash())));
  })(0, t, n);
  if (t instanceof __PRIVATE_Limit) return (function __PRIVATE_evaluateLimit(e2, t2, n2) {
    return n2.slice(0, t2.limit);
  })(0, t, n);
  if (t instanceof __PRIVATE_Sort) return (function __PRIVATE_evaluateSort(e2, t2, n2) {
    const r = t2.orderings.map(((e3) => ({
      ks: __PRIVATE_toEvaluable(e3.expr),
      direction: e3.direction
    })));
    return [...n2].sort(((t3, n3) => {
      for (const { ks: i, direction: s } of r) {
        const r2 = __PRIVATE_valueOrUndefined(i.evaluate(e2, t3)), _ = __PRIVATE_valueOrUndefined(i.evaluate(e2, n3)), o = __PRIVATE_valueCompare(r2 ?? lt, _ ?? lt);
        if (0 !== o)
          return "ascending" === s ? o : -o;
      }
      return 0;
    }));
  })(e, t, n);
  throw new Error(`Unknown stage: ${t._name}`);
}
function __PRIVATE_newPipelineComparator(e) {
  const t = (function __PRIVATE_lastEffectiveSort(e2) {
    for (let t2 = e2.stages.length - 1; t2 >= 0; t2--) {
      const n = e2.stages[t2];
      if (n instanceof __PRIVATE_Sort) return n.orderings;
    }
    throw new Error("Pipeline must contain at least one Sort stage");
  })(e);
  return (n, r) => {
    for (const i of t) {
      const t2 = __PRIVATE_valueOrUndefined(__PRIVATE_toEvaluable(i.expr).evaluate({
        serializer: e.serializer
      }, n)), s = __PRIVATE_valueOrUndefined(__PRIVATE_toEvaluable(i.expr).evaluate({
        serializer: e.serializer
      }, r)), _ = __PRIVATE_valueCompare(t2 || lt, s || lt);
      if (0 !== _) return "ascending" === i.direction ? _ : -_;
    }
    return 0;
  };
}
class RemoteDocumentChangeBuffer {
  constructor() {
    this.changes = new ObjectMap(((e) => e.toString()), ((e, t) => e.isEqual(t))), this.changesApplied = false;
  }
  /**
   * Buffers a `RemoteDocumentCache.addEntry()` call.
   *
   * You can only modify documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  /**
   * Buffers a `RemoteDocumentCache.removeEntry()` call.
   *
   * You can only remove documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
  }
  /**
   * Looks up an entry in the cache. The buffered changes will first be checked,
   * and if no buffered change applies, this will forward to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKey - The key of the entry to look up.
   * @returns The cached document or an invalid document if we have nothing
   * cached.
   */
  getEntry(e, t) {
    this.assertNotApplied();
    const n = this.changes.get(t);
    return void 0 !== n ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
  }
  /**
   * Looks up several entries in the cache, forwarding to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKeys - The keys of the entries to look up.
   * @returns A map of cached documents, indexed by key. If an entry cannot be
   *     found, the corresponding key will be mapped to an invalid document.
   */
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  /**
   * Applies buffered changes to the underlying RemoteDocumentCache, using
   * the provided transaction.
   */
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
  }
  /** Helper to assert this.changes is not null  */
  assertNotApplied() {
  }
}
class OverlayedDocument {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
}
class LocalDocumentsView {
  constructor(e, t, n, r) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r;
  }
  /**
   * Get the local view of the document identified by `key`.
   *
   * @returns Local view of the document or null if we don't have any cached
   * state for it.
   */
  getDocument(e, t) {
    let n = null;
    return this.documentOverlayCache.getOverlay(e, t).next(((r) => (n = r, this.remoteDocumentCache.getEntry(e, t)))).next(((e2) => (null !== n && __PRIVATE_mutationApplyToLocalView(n.mutation, e2, FieldMask.empty(), Timestamp.now()), e2)));
  }
  /**
   * Gets the local view of the documents identified by `keys`.
   *
   * If we don't have cached state for a document in `keys`, a NoDocument will
   * be stored for that key in the resulting set.
   */
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next(((t2) => this.getLocalViewOfDocuments(e, t2, __PRIVATE_documentKeySet()).next((() => t2))));
  }
  /**
   * Similar to `getDocuments`, but creates the local view from the given
   * `baseDocs` without retrieving documents from the local store.
   *
   * @param transaction - The transaction this operation is scoped to.
   * @param docs - The documents to apply local mutations to get the local views.
   * @param existenceStateChanged - The set of document keys whose existence state
   *   is changed. This is useful to determine if some documents overlay needs
   *   to be recalculated.
   */
  getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
    const r = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, r, t).next((() => this.computeViews(e, t, r, n).next(((e2) => {
      let t2 = documentMap();
      return e2.forEach(((e3, n2) => {
        t2 = t2.insert(e3, n2.overlayedDocument);
      })), t2;
    }))));
  }
  /**
   * Gets the overlayed documents for the given document map, which will include
   * the local view of those documents and a `FieldMask` indicating which fields
   * are mutated locally, `null` if overlay is a Set or Delete mutation.
   */
  getOverlayedDocuments(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, n, t).next((() => this.computeViews(e, t, n, __PRIVATE_documentKeySet())));
  }
  /**
   * Fetches the overlays for {@code docs} and adds them to provided overlay map
   * if the map does not already contain an entry for the given document key.
   */
  populateOverlays(e, t, n) {
    const r = [];
    return n.forEach(((e2) => {
      t.has(e2) || r.push(e2);
    })), this.documentOverlayCache.getOverlays(e, r).next(((e2) => {
      e2.forEach(((e3, n2) => {
        t.set(e3, n2);
      }));
    }));
  }
  /**
   * Computes the local view for the given documents.
   *
   * @param docs - The documents to compute views for. It also has the base
   *   version of the documents.
   * @param overlays - The overlays that need to be applied to the given base
   *   version of the documents.
   * @param existenceStateChanged - A set of documents whose existence states
   *   might have changed. This is used to determine if we need to re-calculate
   *   overlays from mutation queues.
   * @returns A map represents the local documents view.
   */
  computeViews(e, t, n, r) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_newDocumentKeyMap(), _ = (function __PRIVATE_newOverlayedDocumentMap() {
      return __PRIVATE_newDocumentKeyMap();
    })();
    return t.forEach(((e2, t2) => {
      const _2 = n.get(t2.key);
      r.has(t2.key) && (void 0 === _2 || _2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t2.key, t2) : void 0 !== _2 ? (s.set(t2.key, _2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(_2.mutation, t2, _2.mutation.getFieldMask(), Timestamp.now())) : (
        // no overlay exists
        // Using EMPTY to indicate there is no overlay for the document.
        s.set(t2.key, FieldMask.empty())
      );
    })), this.recalculateAndSaveOverlays(e, i).next(((e2) => (e2.forEach(((e3, t2) => s.set(e3, t2))), t.forEach(((e3, t2) => _.set(e3, new OverlayedDocument(t2, s.get(e3) ?? null)))), _)));
  }
  recalculateAndSaveOverlays(e, t) {
    const n = __PRIVATE_newDocumentKeyMap();
    let r = new SortedMap(((e2, t2) => e2 - t2)), i = __PRIVATE_documentKeySet();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next(((e2) => {
      for (const i2 of e2) i2.keys().forEach(((e3) => {
        const s = t.get(e3);
        if (null === s) return;
        let _ = n.get(e3) || FieldMask.empty();
        _ = i2.applyToLocalView(s, _), n.set(e3, _);
        const o = (r.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
        r = r.insert(i2.batchId, o);
      }));
    })).next((() => {
      const s = [], _ = r.getReverseIterator();
      for (; _.hasNext(); ) {
        const r2 = _.getNext(), o = r2.key, a = r2.value, u = __PRIVATE_newMutationMap();
        a.forEach(((e2) => {
          if (!i.has(e2)) {
            const r3 = __PRIVATE_calculateOverlayMutation(t.get(e2), n.get(e2));
            null !== r3 && u.set(e2, r3), i = i.add(e2);
          }
        })), s.push(this.documentOverlayCache.saveOverlays(e, o, u));
      }
      return PersistencePromise.waitFor(s);
    })).next((() => n));
  }
  /**
   * Recalculates overlays by reading the documents from remote document cache
   * first, and saves them after they are calculated.
   */
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next(((t2) => this.recalculateAndSaveOverlays(e, t2)));
  }
  /**
   * Performs a query against the local view of all documents.
   *
   * @param transaction - The persistence transaction.
   * @param query - The query to match documents against.
   * @param offset - Read time and key to start scanning by (exclusive).
   * @param context - A optional tracker to keep a record of important details
   *   during database local query execution.
   */
  getDocumentsMatchingQuery(e, t, n, r) {
    return __PRIVATE_isPipeline(t) ? this.getDocumentsMatchingPipeline(e, t, n, r) : __PRIVATE_isDocumentQuery$1(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
  }
  /**
   * Given a collection group, returns the next documents that follow the provided offset, along
   * with an updated batch ID.
   *
   * <p>The documents returned by this method are ordered by remote version from the provided
   * offset. If there are no more remote documents after the provided offset, documents with
   * mutations in order of batch id from the offset are returned. Since all documents in a batch are
   * returned together, the total number of documents returned can exceed {@code count}.
   *
   * @param transaction
   * @param collectionGroup - The collection group for the documents.
   * @param offset - The offset to index into.
   * @param count - The number of documents to return
   * @returns A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
   */
  getNextDocuments(e, t, n, r) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next(((i) => {
      const s = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
      let _ = L, o = i;
      return s.next(((t2) => PersistencePromise.forEach(t2, ((t3, n2) => (_ < n2.largestBatchId && (_ = n2.largestBatchId), i.get(t3) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t3).next(((e2) => {
        o = o.insert(t3, e2);
      }))))).next((() => this.populateOverlays(e, t2, i))).next((() => this.computeViews(e, o, t2, __PRIVATE_documentKeySet()))).next(((e2) => ({
        batchId: _,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
      })))));
    }));
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new DocumentKey(t)).next(((e2) => {
      let t2 = documentMap();
      return e2.isFoundDocument() && (t2 = t2.insert(e2.key, e2)), t2;
    }));
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
    const i = t.collectionGroup;
    let s = documentMap();
    return this.indexManager.getCollectionParents(e, i).next(((_) => PersistencePromise.forEach(_, ((_2) => {
      const o = (function __PRIVATE_asCollectionQueryAtPath(e2, t2) {
        return new __PRIVATE_QueryImpl(
          t2,
          /*collectionGroup=*/
          null,
          e2.explicitOrderBy.slice(),
          e2.filters.slice(),
          e2.limit,
          e2.limitType,
          e2.startAt,
          e2.endAt
        );
      })(t, _2.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, o, n, r).next(((e2) => {
        e2.forEach(((e3, t2) => {
          s = s.insert(e3, t2);
        }));
      }));
    })).next((() => s))));
  }
  getDocumentsMatchingCollectionQuery(e, t, n, r) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next(((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r)))).next(((e2) => this.retrieveMatchingLocalDocuments(i, e2, ((e3) => __PRIVATE_queryMatches(t, e3)))));
  }
  getDocumentsMatchingPipeline(e, t, n, r) {
    if ("collection_group" === getPipelineSourceType(t)) {
      const i = getPipelineCollectionGroup(t);
      let s = documentMap();
      return this.indexManager.getCollectionParents(e, i).next(((_) => PersistencePromise.forEach(_, ((_2) => {
        const o = (function __PRIVATE_asCollectionPipelineAtPath(e2, t2) {
          const n2 = e2.stages.map(((e3) => e3 instanceof __PRIVATE_CollectionGroupSource ? new __PRIVATE_CollectionSource(t2.canonicalString(), {}) : e3));
          return new CorePipeline(e2.serializer, n2);
        })(t, _2.child(i));
        return this.getDocumentsMatchingPipeline(e, o, n, r).next(((e2) => {
          e2.forEach(((e3, t2) => {
            s = s.insert(e3, t2);
          }));
        }));
      })).next((() => s))));
    }
    {
      let i;
      return this.getOverlaysForPipeline(e, t, n.largestBatchId).next(((s) => {
        switch (i = s, getPipelineSourceType(t)) {
          case "collection":
            return this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r);
          case "documents":
            let s2 = __PRIVATE_documentKeySet();
            for (const e2 of getPipelineDocuments(t)) s2 = s2.add(DocumentKey.fromPath(e2));
            return this.remoteDocumentCache.getEntries(e, s2);
          case "database":
            return this.remoteDocumentCache.getAllEntries(e);
          default:
            throw new FirestoreError("invalid-argument", `Invalid pipeline source to execute offline: ${__PRIVATE_canonifyPipeline(t)}`);
        }
      })).next(((e2) => this.retrieveMatchingLocalDocuments(i, e2, ((e3) => __PRIVATE_pipelineMatches(t, e3)))));
    }
  }
  retrieveMatchingLocalDocuments(e, t, n) {
    e.forEach(((e2, n2) => {
      const r2 = n2.getKey();
      null === t.get(r2) && (t = t.insert(r2, MutableDocument.newInvalidDocument(r2)));
    }));
    let r = documentMap();
    return t.forEach(((t2, i) => {
      const s = e.get(t2);
      void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, i, FieldMask.empty(), Timestamp.now()), // Finally, insert the documents that still match the query
      n(i) && (r = r.insert(t2, i));
    })), r;
  }
  getOverlaysForPipeline(e, t, n) {
    switch (getPipelineSourceType(t)) {
      case "collection":
        return this.documentOverlayCache.getOverlaysForCollection(e, ResourcePath.fromString(getPipelineCollection(t)), n);
      case "collection_group":
        throw new FirestoreError("invalid-argument", `Unexpected collection group pipeline: ${__PRIVATE_canonifyPipeline(t)}`);
      case "documents":
        return this.documentOverlayCache.getOverlays(e, getPipelineDocuments(t).map(((e2) => DocumentKey.fromPath(e2))));
      case "database":
        return this.documentOverlayCache.getAllOverlays(e, n);
      default:
        throw new FirestoreError("invalid-argument", `Failed to get overlays for pipeline: ${__PRIVATE_canonifyPipeline(t)}`);
    }
  }
}
class __PRIVATE_MemoryBundleCache {
  constructor(e) {
    this.serializer = e, this.Hs = /* @__PURE__ */ new Map(), this.Js = /* @__PURE__ */ new Map();
  }
  getBundleMetadata(e, t) {
    return PersistencePromise.resolve(this.Hs.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.Hs.set(
      t.id,
      /** Decodes a BundleMetadata proto into a BundleMetadata object. */
      (function __PRIVATE_fromBundleMetadata(e2) {
        return {
          id: e2.id,
          version: e2.version,
          createTime: __PRIVATE_fromVersion(e2.createTime)
        };
      })(t)
    ), PersistencePromise.resolve();
  }
  getNamedQuery(e, t) {
    return PersistencePromise.resolve(this.Js.get(t));
  }
  saveNamedQuery(e, t) {
    return this.Js.set(t.name, (function __PRIVATE_fromProtoNamedQuery(e2) {
      return {
        name: e2.name,
        query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
        readTime: __PRIVATE_fromVersion(e2.readTime)
      };
    })(t)), PersistencePromise.resolve();
  }
}
class __PRIVATE_MemoryDocumentOverlayCache {
  constructor() {
    this.overlays = new SortedMap(DocumentKey.comparator), this.Ys = /* @__PURE__ */ new Map();
  }
  getOverlay(e, t) {
    return PersistencePromise.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, ((t2) => this.getOverlay(e, t2).next(((e2) => {
      null !== e2 && n.set(t2, e2);
    })))).next((() => n));
  }
  getAllOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return this.overlays.forEach(((e2, r) => {
      r.largestBatchId > t && n.set(e2, r);
    })), PersistencePromise.resolve(n);
  }
  saveOverlays(e, t, n) {
    return n.forEach(((n2, r) => {
      this.Hr(e, t, r);
    })), PersistencePromise.resolve();
  }
  removeOverlaysForBatchId(e, t, n) {
    const r = this.Ys.get(n);
    return void 0 !== r && (r.forEach(((e2) => this.overlays = this.overlays.remove(e2))), this.Ys.delete(n)), PersistencePromise.resolve();
  }
  getOverlaysForCollection(e, t, n) {
    const r = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), _ = this.overlays.getIteratorFrom(s);
    for (; _.hasNext(); ) {
      const e2 = _.getNext().value, s2 = e2.getKey();
      if (!t.isPrefixOf(s2.path)) break;
      s2.path.length === i && (e2.largestBatchId > n && r.set(e2.getKey(), e2));
    }
    return PersistencePromise.resolve(r);
  }
  getOverlaysForCollectionGroup(e, t, n, r) {
    let i = new SortedMap(((e2, t2) => e2 - t2));
    const s = this.overlays.getIterator();
    for (; s.hasNext(); ) {
      const e2 = s.getNext().value;
      if (e2.getKey().getCollectionGroup() === t && e2.largestBatchId > n) {
        let t2 = i.get(e2.largestBatchId);
        null === t2 && (t2 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t2)), t2.set(e2.getKey(), e2);
      }
    }
    const _ = __PRIVATE_newOverlayMap(), o = i.getIterator();
    for (; o.hasNext(); ) {
      if (o.getNext().value.forEach(((e2, t2) => _.set(e2, t2))), _.size() >= r) break;
    }
    return PersistencePromise.resolve(_);
  }
  Hr(e, t, n) {
    const r = this.overlays.get(n.key);
    if (null !== r) {
      const e2 = this.Ys.get(r.largestBatchId).delete(n.key);
      this.Ys.set(r.largestBatchId, e2);
    }
    this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
    let i = this.Ys.get(t);
    void 0 === i && (i = __PRIVATE_documentKeySet(), this.Ys.set(t, i)), this.Ys.set(t, i.add(n.key));
  }
}
class __PRIVATE_MemoryGlobalsCache {
  constructor() {
    this.sessionToken = ByteString.EMPTY_BYTE_STRING;
  }
  getSessionToken(e) {
    return PersistencePromise.resolve(this.sessionToken);
  }
  setSessionToken(e, t) {
    return this.sessionToken = t, PersistencePromise.resolve();
  }
}
class __PRIVATE_ReferenceSet {
  constructor() {
    this.Zs = new SortedSet(__PRIVATE_DocReference.Xs), // A set of outstanding references to a document sorted by target id.
    this.e_ = new SortedSet(__PRIVATE_DocReference.t_);
  }
  /** Returns true if the reference set contains no references. */
  isEmpty() {
    return this.Zs.isEmpty();
  }
  /** Adds a reference to the given document key for the given ID. */
  addReference(e, t) {
    const n = new __PRIVATE_DocReference(e, t);
    this.Zs = this.Zs.add(n), this.e_ = this.e_.add(n);
  }
  /** Add references to the given document keys for the given ID. */
  n_(e, t) {
    e.forEach(((e2) => this.addReference(e2, t)));
  }
  /**
   * Removes a reference to the given document key for the given
   * ID.
   */
  removeReference(e, t) {
    this.r_(new __PRIVATE_DocReference(e, t));
  }
  i_(e, t) {
    e.forEach(((e2) => this.removeReference(e2, t)));
  }
  /**
   * Clears all references with a given ID. Calls removeRef() for each key
   * removed.
   */
  s_(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1), i = [];
    return this.e_.forEachInRange([n, r], ((e2) => {
      this.r_(e2), i.push(e2.key);
    })), i;
  }
  __() {
    this.Zs.forEach(((e) => this.r_(e)));
  }
  r_(e) {
    this.Zs = this.Zs.delete(e), this.e_ = this.e_.delete(e);
  }
  o_(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1);
    let i = __PRIVATE_documentKeySet();
    return this.e_.forEachInRange([n, r], ((e2) => {
      i = i.add(e2.key);
    })), i;
  }
  containsKey(e) {
    const t = new __PRIVATE_DocReference(e, 0), n = this.Zs.firstAfterOrEqual(t);
    return null !== n && e.isEqual(n.key);
  }
}
class __PRIVATE_DocReference {
  constructor(e, t) {
    this.key = e, this.a_ = t;
  }
  /** Compare by key then by ID */
  static Xs(e, t) {
    return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.a_, t.a_);
  }
  /** Compare by ID then by key */
  static t_(e, t) {
    return __PRIVATE_primitiveComparator(e.a_, t.a_) || DocumentKey.comparator(e.key, t.key);
  }
}
class __PRIVATE_MemoryMutationQueue {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, /**
     * The set of all mutations that have been sent but not yet been applied to
     * the backend.
     */
    this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
    this.gs = 1, /** An ordered mapping between documents and the mutations batch IDs. */
    this.u_ = new SortedSet(__PRIVATE_DocReference.Xs);
  }
  checkEmpty(e) {
    return PersistencePromise.resolve(0 === this.mutationQueue.length);
  }
  addMutationBatch(e, t, n, r) {
    const i = this.gs;
    this.gs++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const s = new MutationBatch(i, t, n, r);
    this.mutationQueue.push(s);
    for (const t2 of r) this.u_ = this.u_.add(new __PRIVATE_DocReference(t2.key, i)), this.indexManager.addToCollectionParentIndex(e, t2.key.path.popLast());
    return PersistencePromise.resolve(s);
  }
  lookupMutationBatch(e, t) {
    return PersistencePromise.resolve(this.c_(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r = this.l_(n), i = r < 0 ? 0 : r;
    return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return PersistencePromise.resolve(0 === this.mutationQueue.length ? $ : this.gs - 1);
  }
  getAllMutationBatches(e) {
    return PersistencePromise.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
    return this.u_.forEachInRange([n, r], ((e2) => {
      const t2 = this.c_(e2.a_);
      i.push(t2);
    })), PersistencePromise.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    return t.forEach(((e2) => {
      const t2 = new __PRIVATE_DocReference(e2, 0), r = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
      this.u_.forEachInRange([t2, r], ((e3) => {
        n = n.add(e3.a_);
      }));
    })), PersistencePromise.resolve(this.E_(n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r = n.length + 1;
    let i = n;
    DocumentKey.isDocumentKey(i) || (i = i.child(""));
    const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
    let _ = new SortedSet(__PRIVATE_primitiveComparator);
    return this.u_.forEachWhile(((e2) => {
      const t2 = e2.key.path;
      return !!n.isPrefixOf(t2) && // Rows with document keys more than one segment longer than the query
      // path can't be matches. For example, a query on 'rooms' can't match
      // the document /rooms/abc/messages/xyx.
      // TODO(mcg): we'll need a different scanner when we implement
      // ancestor queries.
      (t2.length === r && (_ = _.add(e2.a_)), true);
    }), s), PersistencePromise.resolve(this.E_(_));
  }
  E_(e) {
    const t = [];
    return e.forEach(((e2) => {
      const n = this.c_(e2);
      null !== n && t.push(n);
    })), t;
  }
  removeMutationBatch(e, t) {
    __PRIVATE_hardAssert(0 === this.h_(t.batchId, "removed"), 55003), this.mutationQueue.shift();
    let n = this.u_;
    return PersistencePromise.forEach(t.mutations, ((r) => {
      const i = new __PRIVATE_DocReference(r.key, t.batchId);
      return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
    })).next((() => {
      this.u_ = n;
    }));
  }
  bs(e) {
  }
  containsKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r = this.u_.firstAfterOrEqual(n);
    return PersistencePromise.resolve(t.isEqual(r && r.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, PersistencePromise.resolve();
  }
  /**
   * Finds the index of the given batchId in the mutation queue and asserts that
   * the resulting index is within the bounds of the queue.
   *
   * @param batchId - The batchId to search for
   * @param action - A description of what the caller is doing, phrased in passive
   * form (e.g. "acknowledged" in a routine that acknowledges batches).
   */
  h_(e, t) {
    return this.l_(e);
  }
  /**
   * Finds the index of the given batchId in the mutation queue. This operation
   * is O(1).
   *
   * @returns The computed index of the batch with the given batchId, based on
   * the state of the queue. Note this index can be negative if the requested
   * batchId has already been removed from the queue or past the end of the
   * queue if the batchId is larger than the last added batch.
   */
  l_(e) {
    if (0 === this.mutationQueue.length)
      return 0;
    return e - this.mutationQueue[0].batchId;
  }
  /**
   * A version of lookupMutationBatch that doesn't return a promise, this makes
   * other functions that uses this code easier to read and more efficient.
   */
  c_(e) {
    const t = this.l_(e);
    if (t < 0 || t >= this.mutationQueue.length) return null;
    return this.mutationQueue[t];
  }
}
class __PRIVATE_MemoryRemoteDocumentCacheImpl {
  /**
   * @param sizer - Used to assess the size of a document. For eager GC, this is
   * expected to just return 0 to avoid unnecessarily doing the work of
   * calculating the size.
   */
  constructor(e) {
    this.T_ = e, /** Underlying cache of documents and their read times. */
    this.docs = (function __PRIVATE_documentEntryMap() {
      return new SortedMap(DocumentKey.comparator);
    })(), /** Size of all cached documents. */
    this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  /**
   * Adds the supplied entry to the cache and updates the cache size as appropriate.
   *
   * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  addEntry(e, t) {
    const n = t.key, r = this.docs.get(n), i = r ? r.size : 0, s = this.T_(t);
    return this.docs = this.docs.insert(n, {
      document: t.mutableCopy(),
      size: s
    }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
  }
  /**
   * Removes the specified entry from the cache and updates the cache size as appropriate.
   *
   * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const n = this.docs.get(t);
    return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return t.forEach(((e2) => {
      const t2 = this.docs.get(e2);
      n = n.insert(e2, t2 ? t2.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
    })), PersistencePromise.resolve(n);
  }
  getAllEntries(e) {
    let t = __PRIVATE_mutableDocumentMap();
    return this.docs.forEach(((e2, n) => {
      t = t.insert(e2, n.document);
    })), PersistencePromise.resolve(t);
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    let i, s;
    __PRIVATE_isPipeline(t) ? (
      // Documents are ordered by key, so we can use a prefix scan to narrow down
      // the documents we need to match the query against.
      (i = ResourcePath.fromString(getPipelineCollection(t)), s = (e2) => __PRIVATE_pipelineMatches(t, e2))
    ) : (
      // Documents are ordered by key, so we can use a prefix scan to narrow down
      // the documents we need to match the query against.
      (i = t.path, s = (e2) => __PRIVATE_queryMatches(t, e2))
    );
    let _ = __PRIVATE_mutableDocumentMap();
    const o = new DocumentKey(i.child("__id-9223372036854775808__")), a = this.docs.getIteratorFrom(o);
    for (; a.hasNext(); ) {
      const { key: e2, value: { document: t2 } } = a.getNext();
      if (!i.isPrefixOf(e2.path)) break;
      e2.path.length > i.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(t2), n) <= 0 || (r.has(t2.key) || s(t2)) && (_ = _.insert(t2.key, t2.mutableCopy())));
    }
    return PersistencePromise.resolve(_);
  }
  getAllFromCollectionGroup(e, t, n, r) {
    fail(9500);
  }
  P_(e, t) {
    return PersistencePromise.forEach(this.docs, ((e2) => t(e2)));
  }
  newChangeBuffer(e) {
    return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
  }
  getSize(e) {
    return PersistencePromise.resolve(this.size);
  }
}
class __PRIVATE_MemoryRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
  constructor(e) {
    super(), this.zs = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach(((n, r) => {
      r.isValidDocument() ? t.push(this.zs.addEntry(e, r)) : this.zs.removeEntry(n);
    })), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this.zs.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this.zs.getEntries(e, t);
  }
}
class __PRIVATE_MemoryTargetCache {
  constructor(e) {
    this.persistence = e, /**
     * Maps a target to the data about that target
     */
    this.R_ = new ObjectMap(((e2) => __PRIVATE_canonifyTargetOrPipeline(e2)), __PRIVATE_targetOrPipelineEqual), /** The last received snapshot version. */
    this.lastRemoteSnapshotVersion = SnapshotVersion.min(), /** The highest numbered target ID encountered. */
    this.highestTargetId = 0, /** The highest sequence number encountered. */
    this.I_ = 0, /**
     * A ordered bidirectional mapping between documents and the remote target
     * IDs.
     */
    this.A_ = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this.V_ = __PRIVATE_TargetIdGenerator.xs();
  }
  forEachTarget(e, t) {
    return this.R_.forEach(((e2, n) => t(n))), PersistencePromise.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return PersistencePromise.resolve(this.I_);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.V_.next(), PersistencePromise.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, n) {
    return n && (this.lastRemoteSnapshotVersion = n), t > this.I_ && (this.I_ = t), PersistencePromise.resolve();
  }
  Ms(e) {
    this.R_.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.V_ = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.I_ && (this.I_ = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.Ms(t), this.targetCount += 1, PersistencePromise.resolve();
  }
  updateTargetData(e, t) {
    return this.Ms(t), PersistencePromise.resolve();
  }
  removeTargetData(e, t) {
    return this.R_.delete(t.target), this.A_.s_(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
  }
  removeTargets(e, t, n) {
    let r = 0;
    const i = [];
    return this.R_.forEach(((s, _) => {
      _.sequenceNumber <= t && null === n.get(_.targetId) && (this.R_.delete(s), i.push(this.removeMatchingKeysForTargetId(e, _.targetId)), r++);
    })), PersistencePromise.waitFor(i).next((() => r));
  }
  getTargetCount(e) {
    return PersistencePromise.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const n = this.R_.get(t) || null;
    return PersistencePromise.resolve(n);
  }
  addMatchingKeys(e, t, n) {
    return this.A_.n_(t, n), PersistencePromise.resolve();
  }
  removeMatchingKeys(e, t, n) {
    this.A_.i_(t, n);
    const r = this.persistence.referenceDelegate, i = [];
    return r && t.forEach(((t2) => {
      i.push(r.markPotentiallyOrphaned(e, t2));
    })), PersistencePromise.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this.A_.s_(t), PersistencePromise.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const n = this.A_.o_(t);
    return PersistencePromise.resolve(n);
  }
  containsKey(e, t) {
    return PersistencePromise.resolve(this.A_.containsKey(t));
  }
}
class __PRIVATE_MemoryPersistence {
  /**
   * The constructor accepts a factory for creating a reference delegate. This
   * allows both the delegate and this instance to have strong references to
   * each other without having nullable fields that would then need to be
   * checked or asserted on every access.
   */
  constructor(e, t) {
    this.d_ = {}, this.overlays = {}, this.f_ = new __PRIVATE_ListenSequence(0), this.m_ = false, this.m_ = true, this.p_ = new __PRIVATE_MemoryGlobalsCache(), this.referenceDelegate = e(this), this.g_ = new __PRIVATE_MemoryTargetCache(this);
    this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = (function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
      return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
    })(((e2) => this.referenceDelegate.y_(e2))), this.serializer = new __PRIVATE_LocalSerializer(t), this.w_ = new __PRIVATE_MemoryBundleCache(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.m_ = false, Promise.resolve();
  }
  get started() {
    return this.m_;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let n = this.d_[e.toKey()];
    return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.d_[e.toKey()] = n), n;
  }
  getGlobalsCache() {
    return this.p_;
  }
  getTargetCache() {
    return this.g_;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.w_;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
    const r = new __PRIVATE_MemoryTransaction(this.f_.next());
    return this.referenceDelegate.b_(), n(r).next(((e2) => this.referenceDelegate.v_(r).next((() => e2)))).toPromise().then(((e2) => (r.raiseOnCommittedEvent(), e2)));
  }
  S_(e, t) {
    return PersistencePromise.or(Object.values(this.d_).map(((n) => () => n.containsKey(e, t))));
  }
}
class __PRIVATE_MemoryTransaction extends PersistenceTransaction {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
}
class __PRIVATE_MemoryEagerDelegate {
  constructor(e) {
    this.persistence = e, /** Tracks all documents that are active in Query views. */
    this.D_ = new __PRIVATE_ReferenceSet(), /** The list of documents that are potentially GCed after each transaction. */
    this.x_ = null;
  }
  static C_(e) {
    return new __PRIVATE_MemoryEagerDelegate(e);
  }
  get F_() {
    if (this.x_) return this.x_;
    throw fail(60996);
  }
  addReference(e, t, n) {
    return this.D_.addReference(n, t), this.F_.delete(n.toString()), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.D_.removeReference(n, t), this.F_.add(n.toString()), PersistencePromise.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.F_.add(t.toString()), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    this.D_.s_(t.targetId).forEach(((e2) => this.F_.add(e2.toString())));
    const n = this.persistence.getTargetCache();
    return n.getMatchingKeysForTargetId(e, t.targetId).next(((e2) => {
      e2.forEach(((e3) => this.F_.add(e3.toString())));
    })).next((() => n.removeTargetData(e, t)));
  }
  b_() {
    this.x_ = /* @__PURE__ */ new Set();
  }
  v_(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return PersistencePromise.forEach(this.F_, ((n) => {
      const r = DocumentKey.fromPath(n);
      return this.O_(e, r).next(((e2) => {
        e2 || t.removeEntry(r, SnapshotVersion.min());
      }));
    })).next((() => (this.x_ = null, t.apply(e))));
  }
  updateLimboDocument(e, t) {
    return this.O_(e, t).next(((e2) => {
      e2 ? this.F_.delete(t.toString()) : this.F_.add(t.toString());
    }));
  }
  y_(e) {
    return 0;
  }
  O_(e, t) {
    return PersistencePromise.or([() => PersistencePromise.resolve(this.D_.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.S_(e, t)]);
  }
}
class __PRIVATE_MemoryLruDelegate {
  constructor(e, t) {
    this.persistence = e, this.M_ = new ObjectMap(((e2) => __PRIVATE_encodeResourcePath(e2.path)), ((e2, t2) => e2.isEqual(t2))), this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
  }
  static C_(e, t) {
    return new __PRIVATE_MemoryLruDelegate(e, t);
  }
  // No-ops, present so memory persistence doesn't have to care which delegate
  // it has.
  b_() {
  }
  v_(e) {
    return PersistencePromise.resolve();
  }
  forEachTarget(e, t) {
    return this.persistence.getTargetCache().forEachTarget(e, t);
  }
  lr(e) {
    const t = this.Ls(e);
    return this.persistence.getTargetCache().getTargetCount(e).next(((e2) => t.next(((t2) => e2 + t2))));
  }
  Ls(e) {
    let t = 0;
    return this.Er(e, ((e2) => {
      t++;
    })).next((() => t));
  }
  Er(e, t) {
    return PersistencePromise.forEach(this.M_, ((n, r) => this.Us(e, n, r).next(((e2) => e2 ? PersistencePromise.resolve() : t(r)))));
  }
  removeTargets(e, t, n) {
    return this.persistence.getTargetCache().removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    let n = 0;
    const r = this.persistence.getRemoteDocumentCache(), i = r.newChangeBuffer();
    return r.P_(e, ((r2) => this.Us(e, r2, t).next(((e2) => {
      e2 || (n++, i.removeEntry(r2, SnapshotVersion.min()));
    })))).next((() => i.apply(e))).next((() => n));
  }
  markPotentiallyOrphaned(e, t) {
    return this.M_.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    const n = t.withSequenceNumber(e.currentSequenceNumber);
    return this.persistence.getTargetCache().updateTargetData(e, n);
  }
  addReference(e, t, n) {
    return this.M_.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.M_.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  updateLimboDocument(e, t) {
    return this.M_.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  y_(e) {
    let t = e.key.toString().length;
    return e.isFoundDocument() && (t += __PRIVATE_estimateByteSize(e.data.value)), t;
  }
  Us(e, t, n) {
    return PersistencePromise.or([() => this.persistence.S_(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
      const e2 = this.M_.get(t);
      return PersistencePromise.resolve(void 0 !== e2 && e2 > n);
    }]);
  }
  getCacheSize(e) {
    return this.persistence.getRemoteDocumentCache().getSize(e);
  }
}
class __PRIVATE_LocalViewChanges {
  constructor(e, t, n, r) {
    this.targetId = e, this.fromCache = t, this.wo = n, this.bo = r;
  }
  static vo(e, t) {
    let n = __PRIVATE_documentKeySet(), r = __PRIVATE_documentKeySet();
    for (const e2 of t.docChanges) switch (e2.type) {
      case 0:
        n = n.add(e2.doc.key);
        break;
      case 1:
        r = r.add(e2.doc.key);
    }
    return new __PRIVATE_LocalViewChanges(e, t.fromCache, n, r);
  }
}
function __PRIVATE_compareByKey(e, t) {
  return DocumentKey.comparator(e.key, t.key);
}
class QueryContext {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
}
class __PRIVATE_QueryEngine {
  constructor() {
    this.So = false, this.Do = false, /**
     * SDK only decides whether it should create index when collection size is
     * larger than this.
     */
    this.xo = 100, this.Co = /**
    * This cost represents the evaluation result of
    * (([index, docKey] + [docKey, docContent]) per document in the result set)
    * / ([docKey, docContent] per documents in full collection scan) coming from
    * experiment [enter PR experiment URL here].
    */
    (function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
      return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
    })();
  }
  /** Sets the document view to query against. */
  initialize(e, t) {
    this.Fo = e, this.indexManager = t, this.So = true;
  }
  /** Returns all local documents matching the specified query. */
  getDocumentsMatchingQuery(e, t, n, r) {
    const i = {
      result: null
    };
    return this.Oo(e, t).next(((e2) => {
      i.result = e2;
    })).next((() => {
      if (!i.result) return this.Mo(e, t, r, n).next(((e2) => {
        i.result = e2;
      }));
    })).next((() => {
      if (i.result) return;
      const n2 = new QueryContext();
      return this.No(e, t, n2).next(((r2) => {
        if (i.result = r2, this.Do) return this.Lo(e, t, n2, r2.size);
      }));
    })).next((() => i.result));
  }
  Lo(e, t, n, r) {
    return __PRIVATE_isPipeline(t) ? PersistencePromise.resolve() : n.documentReadCount < this.xo ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.xo, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), n.documentReadCount > this.Co * r ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
  }
  /**
   * Performs an indexed query that evaluates the query based on a collection's
   * persisted index values. Returns `null` if an index is not available.
   */
  Oo(e, t) {
    if (__PRIVATE_isPipeline(t)) return PersistencePromise.resolve(null);
    let n = t;
    if (__PRIVATE_queryMatchesAllDocuments(n))
      return PersistencePromise.resolve(null);
    let r = __PRIVATE_queryToTarget(n);
    return this.indexManager.getIndexType(e, r).next(((t2) => 0 === t2 ? null : (null !== n.limit && 1 === t2 && // We cannot apply a limit for targets that are served using a partial
    // index. If a partial index will be used to serve the target, the
    // query may return a superset of documents that match the target
    // (e.g. if the index doesn't include all the target's filters), or
    // may return the correct set of documents in the wrong order (e.g. if
    // the index doesn't include a segment for one of the orderBys).
    // Therefore, a limit should not be applied in such cases.
    (n = __PRIVATE_queryWithLimit(
      n,
      null,
      "F"
      /* LimitType.First */
    ), r = __PRIVATE_queryToTarget(n)), this.indexManager.getDocumentsMatchingTarget(e, r).next(((t3) => {
      const i = __PRIVATE_documentKeySet(...t3);
      return this.Fo.getDocuments(e, i).next(((t4) => this.indexManager.getMinOffset(e, r).next(((r2) => {
        const s = this.Bo(n, t4);
        return this.Uo(n, s, i, r2.readTime) ? this.Oo(e, __PRIVATE_queryWithLimit(
          n,
          null,
          "F"
          /* LimitType.First */
        )) : this.ko(e, s, n, r2);
      }))));
    })))));
  }
  /**
   * Performs a query based on the target's persisted query mapping. Returns
   * `null` if the mapping is not available or cannot be used.
   */
  Mo(e, t, n, r) {
    return (__PRIVATE_isPipeline(t) ? (function __PRIVATE_pipelineMatchesAllDocuments(e2) {
      for (const t2 of e2.stages) {
        if (t2 instanceof __PRIVATE_Limit || t2 instanceof __PRIVATE_Offset) return false;
        if (t2 instanceof __PRIVATE_Where) {
          if (t2.condition instanceof __PRIVATE_BooleanFunctionExpression && "exists" === t2.condition._expr.name && t2.condition._expr.params[0] instanceof Field && t2.condition._expr.params[0].fieldName === F) continue;
          return false;
        }
      }
      return true;
    })(t) : __PRIVATE_queryMatchesAllDocuments(t)) || r.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.Fo.getDocuments(e, n).next(((i) => {
      const s = this.Bo(t, i);
      return this.Uo(t, s, n, r) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), __PRIVATE_stringifyQueryOrPipeline(t)), this.ko(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, L)).next(((e2) => e2)));
    }));
  }
  /** Applies the query filter and sorting to the provided documents.  */
  Bo(e, t) {
    let n, r;
    return __PRIVATE_isPipeline(e) ? (
      // TODO(pipeline): the order here does not actually matter, not until we implement
      // refill logic for pipelines as well.
      (n = new SortedSet(__PRIVATE_compareByKey), r = (t2) => __PRIVATE_pipelineMatches(e, t2))
    ) : (
      // Sort the documents and re-apply the query filter since previously
      // matching documents do not necessarily still match the query.
      (n = new SortedSet(__PRIVATE_newQueryComparator(e)), r = (t2) => __PRIVATE_queryMatches(e, t2))
    ), t.forEach(((e2, t2) => {
      r(t2) && (n = n.add(t2));
    })), n;
  }
  /**
   * Determines if a limit query needs to be refilled from cache, making it
   * ineligible for index-free execution.
   *
   * @param query - The query.
   * @param sortedPreviousResults - The documents that matched the query when it
   * was last synchronized, sorted by the query's comparator.
   * @param remoteKeys - The document keys that matched the query at the last
   * snapshot.
   * @param limboFreeSnapshotVersion - The version of the snapshot when the
   * query was last synchronized.
   */
  Uo(e, t, n, r) {
    if (__PRIVATE_isPipeline(e)) return (function __PRIVATE_pipelineHasRanges(e2) {
      return e2.stages.some(((e3) => e3 instanceof __PRIVATE_Limit || e3 instanceof __PRIVATE_Offset));
    })(e);
    if (null === e.limit)
      return false;
    if (n.size !== t.size)
      return true;
    const i = "F" === e.limitType ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
  }
  No(e, t, n) {
    return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQueryOrPipeline(t)), this.Fo.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
  }
  /**
   * Combines the results from an indexed execution with the remaining documents
   * that have not yet been indexed.
   */
  ko(e, t, n, r) {
    return this.Fo.getDocumentsMatchingQuery(e, n, r).next(((e2) => (
      // Merge with existing results
      (t.forEach(((t2) => {
        e2 = e2.insert(t2.key, t2);
      })), e2)
    )));
  }
}
const un = "LocalStore";
class __PRIVATE_LocalStoreImpl {
  constructor(e, t, n, r) {
    this.persistence = e, this.qo = t, this.serializer = r, /**
     * Maps a targetID to data about its target.
     *
     * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
     * of `applyRemoteEvent()` idempotent.
     */
    this.$o = new SortedMap(__PRIVATE_primitiveComparator), /** Maps a target to its targetID. */
    // TODO(wuandy): Evaluate if TargetId can be part of Target.
    this.Ko = new ObjectMap(((e2) => __PRIVATE_canonifyTargetOrPipeline(e2)), __PRIVATE_targetOrPipelineEqual), /**
     * A per collection group index of the last read time processed by
     * `getNewDocumentChanges()`.
     *
     * PORTING NOTE: This is only used for multi-tab synchronization.
     */
    this.Wo = /* @__PURE__ */ new Map(), this.Qo = e.getRemoteDocumentCache(), this.g_ = e.getTargetCache(), this.w_ = e.getBundleCache(), this.Go(n);
  }
  Go(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.Qo, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.Qo.setIndexManager(this.indexManager), this.qo.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", ((t) => e.collect(t, this.$o)));
  }
}
function __PRIVATE_newLocalStore(e, t, n, r) {
  return new __PRIVATE_LocalStoreImpl(e, t, n, r);
}
async function __PRIVATE_localStoreHandleUserChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  return await n.persistence.runTransaction("Handle user change", "readonly", ((e2) => {
    let r;
    return n.mutationQueue.getAllMutationBatches(e2).next(((i) => (r = i, n.Go(t), n.mutationQueue.getAllMutationBatches(e2)))).next(((t2) => {
      const i = [], s = [];
      let _ = __PRIVATE_documentKeySet();
      for (const e3 of r) {
        i.push(e3.batchId);
        for (const t3 of e3.mutations) _ = _.add(t3.key);
      }
      for (const e3 of t2) {
        s.push(e3.batchId);
        for (const t3 of e3.mutations) _ = _.add(t3.key);
      }
      return n.localDocuments.getDocuments(e2, _).next(((e3) => ({
        zo: e3,
        removedBatchIds: i,
        addedBatchIds: s
      })));
    }));
  }));
}
function __PRIVATE_localStoreAcknowledgeBatch(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", ((e2) => {
    const r = t.batch.keys(), i = n.Qo.newChangeBuffer({
      trackRemovals: true
    });
    return (function __PRIVATE_applyWriteToRemoteDocuments(e3, t2, n2, r2) {
      const i2 = n2.batch, s = i2.keys();
      let _ = PersistencePromise.resolve();
      return s.forEach(((e4) => {
        _ = _.next((() => r2.getEntry(t2, e4))).next(((t3) => {
          const s2 = n2.docVersions.get(e4);
          __PRIVATE_hardAssert(null !== s2, 48541), t3.version.compareTo(s2) < 0 && (i2.applyToRemoteDocument(t3, n2), t3.isValidDocument() && // We use the commitVersion as the readTime rather than the
          // document's updateTime since the updateTime is not advanced
          // for updates that do not modify the underlying document.
          (t3.setReadTime(n2.commitVersion), r2.addEntry(t3)));
        }));
      })), _.next((() => e3.mutationQueue.removeMutationBatch(t2, i2)));
    })(n, e2, t, i).next((() => i.apply(e2))).next((() => n.mutationQueue.performConsistencyCheck(e2))).next((() => n.documentOverlayCache.removeOverlaysForBatchId(e2, r, t.batch.batchId))).next((() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e2, (function __PRIVATE_getKeysWithTransformResults(e3) {
      let t2 = __PRIVATE_documentKeySet();
      for (let n2 = 0; n2 < e3.mutationResults.length; ++n2) {
        e3.mutationResults[n2].transformResults.length > 0 && (t2 = t2.add(e3.batch.mutations[n2].key));
      }
      return t2;
    })(t)))).next((() => n.localDocuments.getDocuments(e2, r)));
  }));
}
function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
  const t = __PRIVATE_debugCast(e);
  return t.persistence.runTransaction("Get last remote snapshot version", "readonly", ((e2) => t.g_.getLastRemoteSnapshotVersion(e2)));
}
function __PRIVATE_localStoreGetNextMutationBatch(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Get next mutation batch", "readonly", ((e2) => (void 0 === t && (t = $), n.mutationQueue.getNextMutationBatchAfterBatchId(e2, t))));
}
class __PRIVATE_LocalClientState {
  constructor() {
    this.activeTargetIds = __PRIVATE_targetIdSet();
  }
  na(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  ra(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  /**
   * Converts this entry into a JSON-encoded format we can use for WebStorage.
   * Does not encode `clientId` as it is part of the key in WebStorage.
   */
  ta() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
}
class __PRIVATE_MemorySharedClientState {
  constructor() {
    this.Ua = new __PRIVATE_LocalClientState(), this.ka = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t, n) {
  }
  addLocalQueryTarget(e, t = true) {
    return t && this.Ua.na(e), this.ka[e] || "not-current";
  }
  updateQueryState(e, t, n) {
    this.ka[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.Ua.ra(e);
  }
  isLocalQueryTarget(e) {
    return this.Ua.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.ka[e];
  }
  getAllActiveQueryTargets() {
    return this.Ua.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.Ua.activeTargetIds.has(e);
  }
  start() {
    return this.Ua = new __PRIVATE_LocalClientState(), Promise.resolve();
  }
  handleUserChange(e, t, n) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
}
function getDocument() {
  return "undefined" != typeof document ? document : null;
}
class __PRIVATE_OnlineStateTracker {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, /** The current OnlineState. */
    this.state = "Unknown", /**
     * A count of consecutive failures to open the stream. If it reaches the
     * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
     * Offline.
     */
    this.qa = 0, /**
     * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
     * transition from OnlineState.Unknown to OnlineState.Offline without waiting
     * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
     */
    this.$a = null, /**
     * Whether the client should log a warning message if it fails to connect to
     * the backend (initially true, cleared after a successful stream, or if we've
     * logged the message already).
     */
    this.Ka = true;
  }
  /**
   * Called by RemoteStore when a watch stream is started (including on each
   * backoff attempt).
   *
   * If this is the first attempt, it sets the OnlineState to Unknown and starts
   * the onlineStateTimer.
   */
  Wa() {
    0 === this.qa && (this.Qa(
      "Unknown"
      /* OnlineState.Unknown */
    ), this.$a = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, (() => (this.$a = null, this.Ga("Backend didn't respond within 10 seconds."), this.Qa(
      "Offline"
      /* OnlineState.Offline */
    ), Promise.resolve()))));
  }
  /**
   * Updates our OnlineState as appropriate after the watch stream reports a
   * failure. The first failure moves us to the 'Unknown' state. We then may
   * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
   * actually transition to the 'Offline' state.
   */
  za(e) {
    "Online" === this.state ? this.Qa(
      "Unknown"
      /* OnlineState.Unknown */
    ) : (this.qa++, this.qa >= 1 && (this.ja(), this.Ga(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.Qa(
      "Offline"
      /* OnlineState.Offline */
    )));
  }
  /**
   * Explicitly sets the OnlineState to the specified state.
   *
   * Note that this resets our timers / failure counters, etc. used by our
   * Offline heuristics, so must not be used in place of
   * handleWatchStreamStart() and handleWatchStreamFailure().
   */
  set(e) {
    this.ja(), this.qa = 0, "Online" === e && // We've connected to watch at least once. Don't warn the developer
    // about being offline going forward.
    (this.Ka = false), this.Qa(e);
  }
  Qa(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  Ga(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.Ka ? (__PRIVATE_logError(t), this.Ka = false) : __PRIVATE_logDebug("OnlineStateTracker", t);
  }
  ja() {
    null !== this.$a && (this.$a.cancel(), this.$a = null);
  }
}
const Rn = "RemoteStore";
class __PRIVATE_RemoteStoreImpl {
  constructor(e, t, n, r, i) {
    this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, /**
     * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
     * LocalStore via fillWritePipeline() and have or will send to the write
     * stream.
     *
     * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
     * restart the write stream. When the stream is established the writes in the
     * pipeline will be sent in order.
     *
     * Writes remain in writePipeline until they are acknowledged by the backend
     * and thus will automatically be re-sent if the stream is interrupted /
     * restarted before they're acknowledged.
     *
     * Write responses from the backend are linked to their originating request
     * purely based on order, and so we can just shift() writes from the front of
     * the writePipeline as we receive responses.
     */
    this.Ha = [], /**
     * A mapping of watched targets that the client cares about tracking and the
     * user has explicitly called a 'listen' for this target.
     *
     * These targets may or may not have been sent to or acknowledged by the
     * server. On re-establishing the listen stream, these targets should be sent
     * to the server. The targets removed with unlistens are removed eagerly
     * without waiting for confirmation from the listen stream.
     */
    this.Ja = /* @__PURE__ */ new Map(), this.Ya = /* @__PURE__ */ new Map(), this.Za = /* @__PURE__ */ new Map(), this.Xa = new __PRIVATE_TargetIdGenerator(1e3), this.eu = new __PRIVATE_TargetIdGenerator(1001), /**
     * A set of reasons for why the RemoteStore may be offline. If empty, the
     * RemoteStore may start its network connections.
     */
    this.tu = /* @__PURE__ */ new Set(), /**
     * Event handlers that get called when the network is disabled or enabled.
     *
     * PORTING NOTE: These functions are used on the Web client to create the
     * underlying streams (to support tree-shakeable streams). On Android and iOS,
     * the streams are created during construction of RemoteStore.
     */
    this.nu = [], this.ru = i, this.ru.bt(((e2) => {
      n.enqueueAndForget((async () => {
        __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug(Rn, "Restarting streams for network reachability change."), await (async function __PRIVATE_restartNetwork(e3) {
          const t2 = __PRIVATE_debugCast(e3);
          t2.tu.add(
            4
            /* OfflineCause.ConnectivityChange */
          ), await __PRIVATE_disableNetworkInternal(t2), t2.iu.set(
            "Unknown"
            /* OnlineState.Unknown */
          ), t2.tu.delete(
            4
            /* OfflineCause.ConnectivityChange */
          ), await __PRIVATE_enableNetworkInternal(t2);
        })(this));
      }));
    })), this.iu = new __PRIVATE_OnlineStateTracker(n, r);
  }
}
async function __PRIVATE_enableNetworkInternal(e) {
  if (__PRIVATE_canUseNetwork(e)) for (const t of e.nu) await t(
    /* enabled= */
    true
  );
}
async function __PRIVATE_disableNetworkInternal(e) {
  for (const t of e.nu) await t(
    /* enabled= */
    false
  );
}
function __PRIVATE_canUseNetwork(e) {
  return 0 === __PRIVATE_debugCast(e).tu.size;
}
async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
  if (!__PRIVATE_isIndexedDbTransactionError(t)) throw t;
  e.tu.add(
    1
    /* OfflineCause.IndexedDbFailed */
  ), // Disable network and raise offline snapshots
  await __PRIVATE_disableNetworkInternal(e), e.iu.set(
    "Offline"
    /* OnlineState.Offline */
  ), n || // Use a simple read operation to determine if IndexedDB recovered.
  // Ideally, we would expose a health check directly on SimpleDb, but
  // RemoteStore only has access to persistence through LocalStore.
  (n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), // Probe IndexedDB periodically and re-enable network
  e.asyncQueue.enqueueRetryable((async () => {
    __PRIVATE_logDebug(Rn, "Retrying IndexedDB access"), await n(), e.tu.delete(
      1
      /* OfflineCause.IndexedDbFailed */
    ), await __PRIVATE_enableNetworkInternal(e);
  }));
}
function __PRIVATE_executeWithRecovery(e, t) {
  return t().catch(((n) => __PRIVATE_disableNetworkUntilRecovery(e, n, t)));
}
async function __PRIVATE_fillWritePipeline(e) {
  const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
  let r = t.Ha.length > 0 ? t.Ha[t.Ha.length - 1].batchId : $;
  for (; __PRIVATE_canAddToWritePipeline(t); ) try {
    const e2 = await __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r);
    if (null === e2) {
      0 === t.Ha.length && n.Nn();
      break;
    }
    r = e2.batchId, __PRIVATE_addToWritePipeline(t, e2);
  } catch (e2) {
    await __PRIVATE_disableNetworkUntilRecovery(t, e2);
  }
  __PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
}
function __PRIVATE_canAddToWritePipeline(e) {
  return __PRIVATE_canUseNetwork(e) && e.Ha.length < 10;
}
function __PRIVATE_addToWritePipeline(e, t) {
  e.Ha.push(t);
  const n = __PRIVATE_ensureWriteStream(e);
  n.Fn() && n.Jn && n.Yn(t.mutations);
}
function __PRIVATE_shouldStartWriteStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).Cn() && e.Ha.length > 0;
}
function __PRIVATE_startWriteStream(e) {
  __PRIVATE_ensureWriteStream(e).start();
}
async function __PRIVATE_onWriteStreamOpen(e) {
  __PRIVATE_ensureWriteStream(e).er();
}
async function __PRIVATE_onWriteHandshakeComplete(e) {
  const t = __PRIVATE_ensureWriteStream(e);
  for (const n of e.Ha) t.Yn(n.mutations);
}
async function __PRIVATE_onMutationResult(e, t, n) {
  const r = e.Ha.shift(), i = MutationBatchResult.from(r, t, n);
  await __PRIVATE_executeWithRecovery(e, (() => e.remoteSyncer.applySuccessfulWrite(i))), // It's possible that with the completion of this mutation another
  // slot has freed up.
  await __PRIVATE_fillWritePipeline(e);
}
async function __PRIVATE_onWriteStreamClose(e, t) {
  t && __PRIVATE_ensureWriteStream(e).Jn && // This error affects the actual write.
  await (async function __PRIVATE_handleWriteError(e2, t2) {
    if ((function __PRIVATE_isPermanentWriteError(e3) {
      return __PRIVATE_isPermanentError(e3) && e3 !== D.ABORTED;
    })(t2.code)) {
      const n = e2.Ha.shift();
      __PRIVATE_ensureWriteStream(e2).Mn(), await __PRIVATE_executeWithRecovery(e2, (() => e2.remoteSyncer.rejectFailedWrite(n.batchId, t2))), // It's possible that with the completion of this mutation
      // another slot has freed up.
      await __PRIVATE_fillWritePipeline(e2);
    }
  })(e, t), // The write stream might have been started by refilling the write
  // pipeline for failed writes
  __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
}
async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Rn, "RemoteStore received new credentials");
  const r = __PRIVATE_canUseNetwork(n);
  n.tu.add(
    3
    /* OfflineCause.CredentialChange */
  ), await __PRIVATE_disableNetworkInternal(n), r && // Don't set the network status to Unknown if we are offline.
  n.iu.set(
    "Unknown"
    /* OnlineState.Unknown */
  ), await n.remoteSyncer.handleCredentialChange(t), n.tu.delete(
    3
    /* OfflineCause.CredentialChange */
  ), await __PRIVATE_enableNetworkInternal(n);
}
async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
  const n = __PRIVATE_debugCast(e);
  t ? (n.tu.delete(
    2
    /* OfflineCause.IsSecondary */
  ), await __PRIVATE_enableNetworkInternal(n)) : t || (n.tu.add(
    2
    /* OfflineCause.IsSecondary */
  ), await __PRIVATE_disableNetworkInternal(n), n.iu.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
function __PRIVATE_ensureWriteStream(e) {
  return e.ou || // Create stream (but note that it is not started yet).
  (e.ou = (function __PRIVATE_newPersistentWriteStream(e2, t, n) {
    const r = __PRIVATE_debugCast(e2);
    return r.nr(), new __PRIVATE_PersistentWriteStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
  })(e.datastore, e.asyncQueue, {
    Qt: () => Promise.resolve(),
    zt: __PRIVATE_onWriteStreamOpen.bind(null, e),
    Ht: __PRIVATE_onWriteStreamClose.bind(null, e),
    Zn: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
    Xn: __PRIVATE_onMutationResult.bind(null, e)
  }), e.nu.push((async (t) => {
    t ? (e.ou.Mn(), // This will start the write stream if necessary.
    await __PRIVATE_fillWritePipeline(e)) : (await e.ou.stop(), e.Ha.length > 0 && (__PRIVATE_logDebug(Rn, `Stopping write stream with ${e.Ha.length} pending writes`), e.Ha = []));
  }))), e.ou;
}
class DelayedOperation {
  constructor(e, t, n, r, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
    // and so we attach a dummy catch callback to avoid
    // 'UnhandledPromiseRejectionWarning' log spam.
    this.deferred.promise.catch(((e2) => {
    }));
  }
  get promise() {
    return this.deferred.promise;
  }
  /**
   * Creates and returns a DelayedOperation that has been scheduled to be
   * executed on the provided asyncQueue after the provided delayMs.
   *
   * @param asyncQueue - The queue to schedule the operation on.
   * @param id - A Timer ID identifying the type of operation this is.
   * @param delayMs - The delay (ms) before the operation should be scheduled.
   * @param op - The operation to run.
   * @param removalCallback - A callback to be called synchronously once the
   *   operation is executed or canceled, notifying the AsyncQueue to remove it
   *   from its delayedOperations list.
   *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
   *   the DelayedOperation class public.
   */
  static createAndSchedule(e, t, n, r, i) {
    const s = Date.now() + n, _ = new DelayedOperation(e, t, s, r, i);
    return _.start(n), _;
  }
  /**
   * Starts the timer. This is called immediately after construction by
   * createAndSchedule().
   */
  start(e) {
    this.timerHandle = setTimeout((() => this.handleDelayElapsed()), e);
  }
  /**
   * Queues the operation to run immediately (if it hasn't already been run or
   * canceled).
   */
  skipDelay() {
    return this.handleDelayElapsed();
  }
  /**
   * Cancels the operation if it hasn't already been executed or canceled. The
   * promise will be rejected.
   *
   * As long as the operation has not yet been run, calling cancel() provides a
   * guarantee that the operation will not be run.
   */
  cancel(e) {
    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(D.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget((() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then(((e) => this.deferred.resolve(e)))) : Promise.resolve()));
  }
  clearTimeout() {
    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
}
function __PRIVATE_wrapInUserErrorIfRecoverable(e, t) {
  if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e)) return new FirestoreError(D.UNAVAILABLE, `${t}: ${e}`);
  throw e;
}
class __PRIVATE_EventManagerImpl {
  constructor() {
    this.queries = __PRIVATE_newQueriesObjectMap(), this.onlineState = "Unknown", this.Pu = /* @__PURE__ */ new Set();
  }
  terminate() {
    !(function __PRIVATE_errorAllTargets(e, t) {
      const n = __PRIVATE_debugCast(e), r = n.queries;
      n.queries = __PRIVATE_newQueriesObjectMap(), r.forEach(((e2, n2) => {
        for (const e3 of n2.Eu) e3.onError(t);
      }));
    })(this, new FirestoreError(D.ABORTED, "Firestore shutting down"));
  }
}
function __PRIVATE_newQueriesObjectMap() {
  return new ObjectMap(((e) => __PRIVATE_canonifyQueryOrPipeline(e)), __PRIVATE_queryOrPipelineEqual);
}
function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
  e.Pu.forEach(((e2) => {
    e2.next();
  }));
}
var In;
!(function(e) {
  e.Default = "default", /** Listen to changes in cache only */
  e.Cache = "cache";
})(In || (In = {}));
const An = "SyncEngine";
class __PRIVATE_SyncEngineImpl {
  constructor(e, t, n, r, i, s) {
    this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Xu = {}, this.ec = new ObjectMap(((e2) => __PRIVATE_canonifyQueryOrPipeline(e2)), __PRIVATE_queryOrPipelineEqual), this.tc = /* @__PURE__ */ new Map(), /**
     * The keys of documents that are in limbo for which we haven't yet started a
     * limbo resolution query. The strings in this set are the result of calling
     * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
     *
     * The `Set` type was chosen because it provides efficient lookup and removal
     * of arbitrary elements and it also maintains insertion order, providing the
     * desired queue-like FIFO semantics.
     */
    this.nc = /* @__PURE__ */ new Set(), /**
     * Keeps track of the target ID for each document that is in limbo with an
     * active target.
     */
    this.rc = new SortedMap(DocumentKey.comparator), /**
     * Keeps track of the information about an active limbo resolution for each
     * active target ID that was started for the purpose of limbo resolution.
     */
    this.sc = /* @__PURE__ */ new Map(), this._c = new __PRIVATE_ReferenceSet(), /** Stores user completion handlers, indexed by User and BatchId. */
    this.oc = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
    this.ac = /* @__PURE__ */ new Map(), this.uc = __PRIVATE_TargetIdGenerator.Cs(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
    // startup. In the interim, a client should only be considered primary if
    // `isPrimary` is true.
    this.cc = void 0;
  }
  get isPrimaryClient() {
    return true === this.cc;
  }
}
async function __PRIVATE_syncEngineWrite(e, t, n) {
  const r = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
  try {
    const e2 = await (function __PRIVATE_localStoreWriteLocally(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3), r2 = Timestamp.now(), i = t2.reduce(((e4, t3) => e4.add(t3.key)), __PRIVATE_documentKeySet());
      let s, _;
      return n2.persistence.runTransaction("Locally write mutations", "readwrite", ((e4) => {
        let o = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
        return n2.Qo.getEntries(e4, i).next(((e5) => {
          o = e5, o.forEach(((e6, t3) => {
            t3.isValidDocument() || (a = a.add(e6));
          }));
        })).next((() => n2.localDocuments.getOverlayedDocuments(e4, o))).next(((i2) => {
          s = i2;
          const _2 = [];
          for (const e5 of t2) {
            const t3 = __PRIVATE_mutationExtractBaseValue(e5, s.get(e5.key).overlayedDocument);
            null != t3 && // NOTE: The base state should only be applied if there's some
            // existing document to override, so use a Precondition of
            // exists=true
            _2.push(new __PRIVATE_PatchMutation(e5.key, t3, __PRIVATE_extractFieldMask(t3.value.mapValue), Precondition.exists(true)));
          }
          return n2.mutationQueue.addMutationBatch(e4, r2, _2, t2);
        })).next(((t3) => {
          _ = t3;
          const r3 = t3.applyToLocalDocumentSet(s, a);
          return n2.documentOverlayCache.saveOverlays(e4, t3.batchId, r3);
        }));
      })).then((() => ({
        batchId: _.batchId,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
      })));
    })(r.localStore, t);
    r.sharedClientState.addPendingMutation(e2.batchId), (function __PRIVATE_addMutationCallback(e3, t2, n2) {
      let r2 = e3.oc[e3.currentUser.toKey()];
      r2 || (r2 = new SortedMap(__PRIVATE_primitiveComparator));
      r2 = r2.insert(t2, n2), e3.oc[e3.currentUser.toKey()] = r2;
    })(r, e2.batchId, n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e2.changes), await __PRIVATE_fillWritePipeline(r.remoteStore);
  } catch (e2) {
    const t2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, "Failed to persist write");
    n.reject(t2);
  }
}
function __PRIVATE_syncEngineApplyOnlineStateChange(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  if (r.isPrimaryClient && 0 === n || !r.isPrimaryClient && 1 === n) {
    const e2 = [];
    r.ec.forEach(((n2, r2) => {
      const i = r2.view.Ru(t);
      i.snapshot && e2.push(i.snapshot);
    })), (function __PRIVATE_eventManagerOnOnlineStateChange(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      n2.onlineState = t2;
      let r2 = false;
      n2.queries.forEach(((e4, n3) => {
        for (const e5 of n3.Eu)
          e5.Ru(t2) && (r2 = true);
      })), r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
    })(r.eventManager, t), e2.length && r.Xu.zn(e2), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
  }
}
async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
  const n = __PRIVATE_debugCast(e), r = t.batch.batchId;
  try {
    const e2 = await __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
    __PRIVATE_processUserCallback(
      n,
      r,
      /*error=*/
      null
    ), __PRIVATE_triggerPendingWritesCallbacks(n, r), n.sharedClientState.updateMutationState(r, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
async function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  try {
    const e2 = await (function __PRIVATE_localStoreRejectBatch(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      return n2.persistence.runTransaction("Reject batch", "readwrite-primary", ((e4) => {
        let r2;
        return n2.mutationQueue.lookupMutationBatch(e4, t2).next(((t3) => (__PRIVATE_hardAssert(null !== t3, 37113), r2 = t3.keys(), n2.mutationQueue.removeMutationBatch(e4, t3)))).next((() => n2.mutationQueue.performConsistencyCheck(e4))).next((() => n2.documentOverlayCache.removeOverlaysForBatchId(e4, r2, t2))).next((() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e4, r2))).next((() => n2.localDocuments.getDocuments(e4, r2)));
      }));
    })(r.localStore, t);
    __PRIVATE_processUserCallback(r, t, n), __PRIVATE_triggerPendingWritesCallbacks(r, t), r.sharedClientState.updateMutationState(t, "rejected", n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e2);
  } catch (n2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(n2);
  }
}
function __PRIVATE_triggerPendingWritesCallbacks(e, t) {
  (e.ac.get(t) || []).forEach(((e2) => {
    e2.resolve();
  })), e.ac.delete(t);
}
function __PRIVATE_processUserCallback(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  let i = r.oc[r.currentUser.toKey()];
  if (i) {
    const e2 = i.get(t);
    e2 && (n ? e2.reject(n) : e2.resolve(), i = i.remove(t)), r.oc[r.currentUser.toKey()] = i;
  }
}
async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = [], s = [], _ = [];
  r.ec.isEmpty() || (r.ec.forEach(((e2, o) => {
    _.push(r.lc(o, t, n).then(((e3) => {
      if ((e3 || n) && r.isPrimaryClient) {
        const t2 = e3 ? !e3.fromCache : n?.targetChanges.get(o.targetId)?.current;
        r.sharedClientState.updateQueryState(o.targetId, t2 ? "current" : "not-current");
      }
      if (e3) {
        i.push(e3);
        const t2 = __PRIVATE_LocalViewChanges.vo(o.targetId, e3);
        s.push(t2);
      }
    })));
  })), await Promise.all(_), r.Xu.zn(i), await (async function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t2) {
    const n2 = __PRIVATE_debugCast(e2);
    try {
      await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", ((e3) => PersistencePromise.forEach(t2, ((t3) => PersistencePromise.forEach(t3.wo, ((r2) => n2.persistence.referenceDelegate.addReference(e3, t3.targetId, r2))).next((() => PersistencePromise.forEach(t3.bo, ((r2) => n2.persistence.referenceDelegate.removeReference(e3, t3.targetId, r2)))))))));
    } catch (e3) {
      if (!__PRIVATE_isIndexedDbTransactionError(e3)) throw e3;
      __PRIVATE_logDebug(un, "Failed to update sequence numbers: " + e3);
    }
    for (const e3 of t2) {
      const t3 = e3.targetId;
      if (!e3.fromCache) {
        const e4 = n2.$o.get(t3), r2 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r2);
        n2.$o = n2.$o.insert(t3, i2);
      }
    }
  })(r.localStore, s));
}
async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  if (!n.currentUser.isEqual(t)) {
    __PRIVATE_logDebug(An, "User change. New user:", t.toKey());
    const e2 = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
    n.currentUser = t, // Fails tasks waiting for pending writes requested by previous user.
    (function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t2) {
      e3.ac.forEach(((e4) => {
        e4.forEach(((e5) => {
          e5.reject(new FirestoreError(D.CANCELLED, t2));
        }));
      })), e3.ac.clear();
    })(n, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
    n.sharedClientState.handleUserChange(t, e2.removedBatchIds, e2.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2.zo);
  }
}
function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), t;
}
class __PRIVATE_MemoryOfflineComponentProvider {
  constructor() {
    this.kind = "memory", this.synchronizeTabs = false;
  }
  async initialize(e) {
    this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.Rc(e), this.persistence = this.Ic(e), await this.persistence.start(), this.localStore = this.Ac(e), this.gcScheduler = this.Vc(e, this.localStore), this.indexBackfillerScheduler = this.dc(e, this.localStore);
  }
  Vc(e, t) {
    return null;
  }
  dc(e, t) {
    return null;
  }
  Ac(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
  }
  Ic(e) {
    return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.C_, this.serializer);
  }
  Rc(e) {
    return new __PRIVATE_MemorySharedClientState();
  }
  async terminate() {
    this.gcScheduler?.stop(), this.indexBackfillerScheduler?.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
}
__PRIVATE_MemoryOfflineComponentProvider.provider = {
  build: () => new __PRIVATE_MemoryOfflineComponentProvider()
};
class __PRIVATE_LruGcMemoryOfflineComponentProvider extends __PRIVATE_MemoryOfflineComponentProvider {
  constructor(e) {
    super(), this.cacheSizeBytes = e;
  }
  Vc(e, t) {
    __PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate, 46915);
    const n = this.persistence.referenceDelegate.garbageCollector;
    return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
  }
  Ic(e) {
    const t = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
    return new __PRIVATE_MemoryPersistence(((e2) => __PRIVATE_MemoryLruDelegate.C_(e2, t)), this.serializer);
  }
}
class OnlineComponentProvider {
  async initialize(e, t) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(
      t,
      /* startAsPrimary=*/
      !e.synchronizeTabs
    ), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      1
      /* OnlineStateSource.SharedClientState */
    ), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return (function __PRIVATE_newEventManager() {
      return new __PRIVATE_EventManagerImpl();
    })();
  }
  createDatastore(e) {
    const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = __PRIVATE_newConnection(e.databaseInfo);
    return __PRIVATE_newDatastore(e.authCredentials, e.appCheckCredentials, n, t);
  }
  createRemoteStore(e) {
    return (function __PRIVATE_newRemoteStore(e2, t, n, r, i) {
      return new __PRIVATE_RemoteStoreImpl(e2, t, n, r, i);
    })(this.localStore, this.datastore, e.asyncQueue, ((e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      0
      /* OnlineStateSource.RemoteStore */
    )), (function __PRIVATE_newConnectivityMonitor() {
      return __PRIVATE_BrowserConnectivityMonitor.C() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
    })());
  }
  createSyncEngine(e, t) {
    return (function __PRIVATE_newSyncEngine(e2, t2, n, r, i, s, _) {
      const o = new __PRIVATE_SyncEngineImpl(e2, t2, n, r, i, s);
      return _ && (o.cc = true), o;
    })(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  async terminate() {
    await (async function __PRIVATE_remoteStoreShutdown(e) {
      const t = __PRIVATE_debugCast(e);
      __PRIVATE_logDebug(Rn, "RemoteStore shutting down."), t.tu.add(
        5
        /* OfflineCause.Shutdown */
      ), await __PRIVATE_disableNetworkInternal(t), t.ru.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
      // triggering spurious listener events with cached data, etc.
      t.iu.set(
        "Unknown"
        /* OnlineState.Unknown */
      );
    })(this.remoteStore), this.datastore?.terminate(), this.eventManager?.terminate();
  }
}
OnlineComponentProvider.provider = {
  build: () => new OnlineComponentProvider()
};
const Vn = "FirestoreClient";
class FirestoreClient {
  constructor(e, t, n, r, i) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this._databaseInfo = r, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(n, (async (e2) => {
      __PRIVATE_logDebug(Vn, "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
    })), this.appCheckCredentials.start(n, ((e2) => (__PRIVATE_logDebug(Vn, "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user))));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this._databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred();
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
        // RemoteStore as it will prevent the RemoteStore from retrieving auth
        // tokens.
        this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
        e.reject(n);
      }
    })), e.promise;
  }
}
async function __PRIVATE_setOfflineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Vn, "Initializing OfflineComponentProvider");
  const n = e.configuration;
  await t.initialize(n);
  let r = n.initialUser;
  e.setCredentialChangeListener((async (e2) => {
    r.isEqual(e2) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e2), r = e2);
  })), // When a user calls clearPersistence() in one client, all other clients
  // need to be terminated to allow the delete to succeed.
  t.persistence.setDatabaseDeletedListener((() => e.terminate())), e._offlineComponents = t;
}
async function __PRIVATE_setOnlineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress();
  const n = await __PRIVATE_ensureOfflineComponents(e);
  __PRIVATE_logDebug(Vn, "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), // The CredentialChangeListener of the online component provider takes
  // precedence over the offline component provider.
  e.setCredentialChangeListener(((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e2))), e.setAppCheckTokenChangeListener(((e2, n2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n2))), e._onlineComponents = t;
}
async function __PRIVATE_ensureOfflineComponents(e) {
  if (!e._offlineComponents) if (e._uninitializedComponentsProvider) {
    __PRIVATE_logDebug(Vn, "Using user provided OfflineComponentProvider");
    try {
      await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
    } catch (t) {
      const n = t;
      if (!(function __PRIVATE_canFallbackFromIndexedDbError(e2) {
        return "FirebaseError" === e2.name ? e2.code === D.FAILED_PRECONDITION || e2.code === D.UNIMPLEMENTED : !("undefined" != typeof DOMException && e2 instanceof DOMException) || // When the browser is out of quota we could get either quota exceeded
        // or an aborted error depending on whether the error happened during
        // schema migration.
        22 === e2.code || 20 === e2.code || // Firefox Private Browsing mode disables IndexedDb and returns
        // INVALID_STATE for any usage.
        11 === e2.code;
      })(n)) throw n;
      __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_MemoryOfflineComponentProvider());
    }
  } else __PRIVATE_logDebug(Vn, "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_LruGcMemoryOfflineComponentProvider(void 0));
  return e._offlineComponents;
}
async function __PRIVATE_ensureOnlineComponents(e) {
  return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug(Vn, "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug(Vn, "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider()))), e._onlineComponents;
}
function __PRIVATE_getSyncEngine(e) {
  return __PRIVATE_ensureOnlineComponents(e).then(((e2) => e2.syncEngine));
}
function __PRIVATE_firestoreClientWrite(e, t) {
  const n = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget((async () => __PRIVATE_syncEngineWrite(await __PRIVATE_getSyncEngine(e), t, n))), n.promise;
}
const dn = "AsyncQueue";
class __PRIVATE_AsyncQueueImpl {
  constructor(e = Promise.resolve()) {
    this.qc = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
    // be changed again.
    this.$c = false, // Operations scheduled to be queued in the future. Operations are
    // automatically removed after they are run or canceled.
    this.Kc = [], // visible for testing
    this.Wc = null, // Flag set while there's an outstanding AsyncQueue operation, used for
    // assertion sanity-checks.
    this.Qc = false, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
    this.Gc = false, // List of TimerIds to fast-forward delays for.
    this.zc = [], // Backoff timer used to schedule retries for retryable operations
    this.xn = new __PRIVATE_ExponentialBackoff(
      this,
      "async_queue_retry"
      /* TimerId.AsyncQueueRetry */
    ), // Visibility handler that triggers an immediate retry of all retryable
    // operations. Meant to speed up recovery when we regain file system access
    // after page comes into foreground.
    this.jc = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug(dn, "Visibility state changed to " + e2.visibilityState), this.xn.gn();
    }, this.Hc = e;
    const t = getDocument();
    t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.jc);
  }
  get isShuttingDown() {
    return this.$c;
  }
  /**
   * Adds a new operation to the queue without waiting for it to complete (i.e.
   * we ignore the Promise result).
   */
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.Jc(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.Yc(e);
  }
  enterRestrictedMode(e) {
    if (!this.$c) {
      this.$c = true, this.Gc = e || false;
      const t = getDocument();
      t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this.jc);
    }
  }
  enqueue(e) {
    if (this.Jc(), this.$c)
      return new Promise((() => {
      }));
    const t = new __PRIVATE_Deferred();
    return this.Yc((() => this.$c && this.Gc ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise))).then((() => t.promise));
  }
  enqueueRetryable(e) {
    this.enqueueAndForget((() => (this.qc.push(e), this.Zc())));
  }
  /**
   * Runs the next operation from the retryable queue. If the operation fails,
   * reschedules with backoff.
   */
  async Zc() {
    if (0 !== this.qc.length) {
      try {
        await this.qc[0](), this.qc.shift(), this.xn.reset();
      } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
        __PRIVATE_logDebug(dn, "Operation failed with retryable error: " + e);
      }
      this.qc.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
      // This is necessary to run retryable operations that failed during
      // their initial attempt since we don't know whether they are already
      // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
      // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
      // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
      // call scheduled here.
      // Since `backoffAndRun()` cancels an existing backoff and schedules a
      // new backoff on every call, there is only ever a single additional
      // operation in the queue.
      this.xn.mn((() => this.Zc()));
    }
  }
  Yc(e) {
    const t = this.Hc.then((() => (this.Qc = true, e().catch(((e2) => {
      this.Wc = e2, this.Qc = false;
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", __PRIVATE_getMessageOrStack(e2)), e2;
    })).then(((e2) => (this.Qc = false, e2))))));
    return this.Hc = t, t;
  }
  enqueueAfterDelay(e, t, n) {
    this.Jc(), // Fast-forward delays for timerIds that have been overridden.
    this.zc.indexOf(e) > -1 && (t = 0);
    const r = DelayedOperation.createAndSchedule(this, e, t, n, ((e2) => this.Xc(e2)));
    return this.Kc.push(r), r;
  }
  Jc() {
    this.Wc && fail(47125, {
      el: __PRIVATE_getMessageOrStack(this.Wc)
    });
  }
  verifyOperationInProgress() {
  }
  /**
   * Waits until all currently queued tasks are finished executing. Delayed
   * operations are not run.
   */
  async tl() {
    let e;
    do {
      e = this.Hc, await e;
    } while (e !== this.Hc);
  }
  /**
   * For Tests: Determine if a delayed operation with a particular TimerId
   * exists.
   */
  nl(e) {
    for (const t of this.Kc) if (t.timerId === e) return true;
    return false;
  }
  /**
   * For Tests: Runs some or all delayed operations early.
   *
   * @param lastTimerId - Delayed operations up to and including this TimerId
   * will be drained. Pass TimerId.All to run all delayed operations.
   * @returns a Promise that resolves once all operations have been run.
   */
  rl(e) {
    return this.tl().then((() => {
      this.Kc.sort(((e2, t) => e2.targetTimeMs - t.targetTimeMs));
      for (const t of this.Kc) if (t.skipDelay(), "all" !== e && t.timerId === e) break;
      return this.tl();
    }));
  }
  /**
   * For Tests: Skip all subsequent delays for a timer id.
   */
  il(e) {
    this.zc.push(e);
  }
  /** Called once a DelayedOperation is run or canceled. */
  Xc(e) {
    const t = this.Kc.indexOf(e);
    this.Kc.splice(t, 1);
  }
}
function __PRIVATE_getMessageOrStack(e) {
  let t = e.message || "";
  return e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack), t;
}
class Firestore extends Firestore$1 {
  /** @hideconstructor */
  constructor(e, t, n, r) {
    super(e, t, n, r), /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    this.type = "firestore", this._queue = new __PRIVATE_AsyncQueueImpl(), this._persistenceKey = r?.name || "[DEFAULT]";
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      this._queue = new __PRIVATE_AsyncQueueImpl(e), this._firestoreClient = void 0, await e;
    }
  }
}
function getFirestore(e, n) {
  const r = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : st, s = _getProvider(r, "firestore").getImmediate({
    identifier: i
  });
  if (!s._initialized) {
    const e2 = getDefaultEmulatorHostnameAndPort("firestore");
    e2 && connectFirestoreEmulator(s, ...e2);
  }
  return s;
}
function ensureFirestoreConfigured(e) {
  if (e._terminated) throw new FirestoreError(D.FAILED_PRECONDITION, "The client has already been terminated.");
  return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient;
}
function __PRIVATE_configureFirestore(e) {
  const t = e._freezeSettings(), n = __PRIVATE_makeDatabaseInfo(e._databaseId, e._app?.options.appId || "", e._persistenceKey, e._app?.options.apiKey, t);
  e._componentsProvider || t.localCache?._offlineComponentProvider && t.localCache?._onlineComponentProvider && (e._componentsProvider = {
    _offline: t.localCache._offlineComponentProvider,
    _online: t.localCache._onlineComponentProvider
  }), e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, n, e._componentsProvider && (function __PRIVATE_buildComponentProvider(e2) {
    const t2 = e2?._online.build();
    return {
      _offline: e2?._offline.build(t2),
      _online: t2
    };
  })(e._componentsProvider));
}
const Yt = "@firebase/firestore", Kt = "4.16.0";
class DocumentSnapshot$1 {
  // Note: This class is stripped down version of the DocumentSnapshot in
  // the legacy SDK. The changes are:
  // - No support for SnapshotMetadata.
  // - No support for SnapshotOptions.
  /** @hideconstructor protected */
  constructor(t, e, n, r, s) {
    this._firestore = t, this._userDataWriter = e, this._key = n, this._document = r, this._converter = s;
  }
  /** Property of the `DocumentSnapshot` that provides the document's ID. */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * The `DocumentReference` for the document included in the `DocumentSnapshot`.
   */
  get ref() {
    return new DocumentReference(this._firestore, this._converter, this._key);
  }
  /**
   * Signals whether or not the document at the snapshot's location exists.
   *
   * @returns true if the document exists.
   */
  exists() {
    return null !== this._document;
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  data() {
    if (this._document) {
      if (this._converter) {
        const t = new QueryDocumentSnapshot$1(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(t);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  /**
   * @internal
   * @private
   *
   * Retrieves all fields in the document as a proto Value. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  _fieldsProto() {
    return this._document?.data.clone().value.mapValue.fields ?? void 0;
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(t) {
    if (this._document) {
      const e = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
      if (null !== e) return this._userDataWriter.convertValue(e);
    }
  }
}
class QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * @override
   * @returns An `Object` containing all fields in the document.
   */
  data() {
    return super.data();
  }
}
function __PRIVATE_applyFirestoreDataConverter(t, e, n) {
  let r;
  return r = t ? t.toFirestore(e) : e, r;
}
class SnapshotMetadata {
  /** @hideconstructor */
  constructor(t, e) {
    this.hasPendingWrites = t, this.fromCache = e;
  }
  /**
   * Returns true if this `SnapshotMetadata` is equal to the provided one.
   *
   * @param other - The `SnapshotMetadata` to compare against.
   * @returns true if this `SnapshotMetadata` is equal to the provided one.
   */
  isEqual(t) {
    return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
  }
}
class DocumentSnapshot extends DocumentSnapshot$1 {
  /** @hideconstructor protected */
  constructor(t, e, n, r, s, a) {
    super(t, e, n, r, a), this._firestore = t, this._firestoreImpl = t, this.metadata = s;
  }
  /**
   * Returns whether or not the data exists. True if the document exists.
   */
  exists() {
    return super.exists();
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document or `undefined` if
   * the document doesn't exist.
   */
  data(t = {}) {
    if (this._document) {
      if (this._converter) {
        const e = new QueryDocumentSnapshot(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          this.metadata,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(e, t);
      }
      return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * By default, a `serverTimestamp()` that has not yet been set to
   * its final value will be returned as `null`. You can override this by
   * passing an options object.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @param options - An options object to configure how the field is retrieved
   * from the snapshot (for example the desired behavior for server timestamps
   * that have not yet been set to their final value).
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(t, e = {}) {
    if (this._document) {
      const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
      if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
    }
  }
  /**
   * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
   *
   * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
   * `DocumentSnapshot` has pending writes.
   */
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new FirestoreError(D.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const t = this._document, e = {};
    if (e.type = DocumentSnapshot._jsonSchemaVersion, e.bundle = "", e.bundleSource = "DocumentSnapshot", e.bundleName = this._key.toString(), !t || !t.isValidDocument() || !t.isFoundDocument()) return e;
    this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields, "previous");
    return e.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), e;
  }
}
DocumentSnapshot._jsonSchemaVersion = "firestore/documentSnapshot/1.0", DocumentSnapshot._jsonSchema = {
  type: property("string", DocumentSnapshot._jsonSchemaVersion),
  bundleSource: property("string", "DocumentSnapshot"),
  bundleName: property("string"),
  bundle: property("string")
};
class QueryDocumentSnapshot extends DocumentSnapshot {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @override
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document.
   */
  data(t = {}) {
    return super.data(t);
  }
}
class QuerySnapshot {
  /** @hideconstructor */
  constructor(t, e, n, r) {
    this._firestore = t, this._userDataWriter = e, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), this.query = n;
  }
  /** An array of all the documents in the `QuerySnapshot`. */
  get docs() {
    const t = [];
    return this.forEach(((e) => t.push(e))), t;
  }
  /** The number of documents in the `QuerySnapshot`. */
  get size() {
    return this._snapshot.docs.size;
  }
  /** True if there are no documents in the `QuerySnapshot`. */
  get empty() {
    return 0 === this.size;
  }
  /**
   * Enumerates all of the documents in the `QuerySnapshot`.
   *
   * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg - The `this` binding for the callback.
   */
  forEach(t, e) {
    this._snapshot.docs.forEach(((n) => {
      t.call(e, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
    }));
  }
  /**
   * Returns an array of the documents changes since the last snapshot. If this
   * is the first snapshot, all documents will be in the list as 'added'
   * changes.
   *
   * @param options - `SnapshotListenOptions` that control whether metadata-only
   * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
   * snapshot events.
   */
  docChanges(t = {}) {
    const e = !!t.includeMetadataChanges;
    if (e && this._snapshot.excludesMetadataChanges) throw new FirestoreError(D.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
    (function __PRIVATE_changesFromSnapshot(t2, e2) {
      if (t2._snapshot.oldDocs.isEmpty()) {
        let e3 = 0;
        return t2._snapshot.docChanges.map(((n) => {
          __PRIVATE_isPipeline(t2._snapshot.query) ? __PRIVATE_newPipelineComparator(t2._snapshot.query) : __PRIVATE_newQueryComparator(t2.query._query);
          const r = new QueryDocumentSnapshot(t2._firestore, t2._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(t2._snapshot.mutatedKeys.has(n.doc.key), t2._snapshot.fromCache), t2.query.converter);
          return n.doc, {
            type: "added",
            doc: r,
            oldIndex: -1,
            newIndex: e3++
          };
        }));
      }
      {
        let n = t2._snapshot.oldDocs;
        return t2._snapshot.docChanges.filter(((t3) => e2 || 3 !== t3.type)).map(((e3) => {
          const r = new QueryDocumentSnapshot(t2._firestore, t2._userDataWriter, e3.doc.key, e3.doc, new SnapshotMetadata(t2._snapshot.mutatedKeys.has(e3.doc.key), t2._snapshot.fromCache), t2.query.converter);
          let s = -1, a = -1;
          return 0 !== e3.type && (s = n.indexOf(e3.doc.key), n = n.delete(e3.doc.key)), 1 !== e3.type && (n = n.add(e3.doc), a = n.indexOf(e3.doc.key)), {
            type: __PRIVATE_resultChangeType(e3.type),
            doc: r,
            oldIndex: s,
            newIndex: a
          };
        }));
      }
    })(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
  }
  /**
   * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
   *
   * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
   * `QuerySnapshot` has pending writes.
   */
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new FirestoreError(D.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const t = {};
    t.type = QuerySnapshot._jsonSchemaVersion, t.bundleSource = "QuerySnapshot", t.bundleName = __PRIVATE_AutoId.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
    const e = [], n = [], r = [];
    return this.docs.forEach(((t2) => {
      null !== t2._document && (e.push(t2._document), n.push(this._userDataWriter.convertObjectMap(t2._document.data.value.mapValue.fields, "previous")), r.push(t2.ref.path));
    })), t.bundle = (this._firestore, this.query._query, t.bundleName, "NOT SUPPORTED"), t;
  }
}
function __PRIVATE_resultChangeType(t) {
  switch (t) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return fail(61501, {
        type: t
      });
  }
}
QuerySnapshot._jsonSchemaVersion = "firestore/querySnapshot/1.0", QuerySnapshot._jsonSchema = {
  type: property("string", QuerySnapshot._jsonSchemaVersion),
  bundleSource: property("string", "QuerySnapshot"),
  bundleName: property("string"),
  bundle: property("string")
};
function addDoc(t, e) {
  const n = __PRIVATE_cast(t.firestore, Firestore), r = doc(t), s = __PRIVATE_applyFirestoreDataConverter(t.converter, e), o = __PRIVATE_newUserDataReader(t.firestore);
  return executeWrite(n, [__PRIVATE_parseSetData(o, "addDoc", r._key, s, null !== t.converter, {}).toMutation(r._key, Precondition.exists(false))]).then((() => r));
}
function executeWrite(t, e) {
  const n = ensureFirestoreConfigured(t);
  return __PRIVATE_firestoreClientWrite(n, e);
}
!(function __PRIVATE_registerFirestore(h, d = true) {
  __PRIVATE_setSDKVersion(SDK_VERSION), _registerComponent(new Component("firestore", ((t, { instanceIdentifier: e, options: n }) => {
    const r = t.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(t.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(r, t.getProvider("app-check-internal")), __PRIVATE_databaseIdFromApp(r, e), r);
    return n = {
      useFetchStreams: d,
      ...n
    }, s._setSettings(n), s;
  }), "PUBLIC").setMultipleInstances(true)), registerVersion(Yt, Kt, h), // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
  registerVersion(Yt, Kt, "esm2020");
})();
export {
  addDoc as a,
  collection as c,
  getFirestore as g
};
