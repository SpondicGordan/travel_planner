// models/User.js

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {'USER'|'ADMIN'} role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {User} user
 */