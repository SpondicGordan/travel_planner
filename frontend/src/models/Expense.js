// models/Expense.js

/**
 * @typedef {Object} Expense
 * @property {number} id
 * @property {number} travelPlanId
 * @property {string} name
 * @property {'TRANSPORT'|'ACCOMMODATION'|'FOOD'|'TICKETS'|'SHOPPING'|'OTHER'} category
 * @property {number} amount
 * @property {string} date
 * @property {string} description
 */

/**
 * @typedef {Object} BudgetSummary
 * @property {number} plannedBudget
 * @property {number} totalSpent
 * @property {number} remainingBudget
 */