/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/", 
    "/categories/:mainCategory/:subCategory",
    "/auth/new-verification"
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect the logged in user to the /settings page
 * @type {string[]}
 */
export const authRoutes = ["/dashboard", "/profile"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
