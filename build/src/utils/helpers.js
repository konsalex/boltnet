"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = void 0;
/** We do not care about truly random string */
const randomString = (n) => Math.random().toString(36).substring(n);
exports.randomString = randomString;
//# sourceMappingURL=helpers.js.map