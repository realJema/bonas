/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/categories/:mainCategory",
  "/categories/:mainCategory/:subCategory",
  "/categories/:mainCategory/:subCategory/:subSubCategory",
  "/:mainCategory/:subCategory/:subSubCategory/:listingId",
  "/api/categories",
  "/api/postListing",
  "/auth/new-verification",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect the logged in user to the /settings page
 * @type {string[]}
 */
export const authRoutes = [
  "/profile/:username",
  "/profile/:username/settings",
  "/profile/:username/settings/edit/account",
  "/profile/:username/settings/edit/security",
  "/profile/:username/settings/edit/notifications",
  "/profile/:username/settings/edit/business-information",
  "/profile/user-dashboard/:username",
  "/profile/user-dashboard/:username/:category",
];

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
