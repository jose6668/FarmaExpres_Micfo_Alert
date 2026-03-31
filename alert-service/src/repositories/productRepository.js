const { getPool } = require("../config/database");
const { env } = require("../config/env");

async function findLowStockProducts() {
  const pool = getPool();
  const query = `
    SELECT
      id,
      code,
      name,
      stock,
      minimumstock AS "minimumStock",
      expirationdate AS "expirationDate",
      asset AS active
    FROM ${env.inventory.productsTable}
    WHERE asset = TRUE
      AND stock < minimumstock
    ORDER BY stock ASC, name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

async function findExpiredProducts() {
  const pool = getPool();
  const query = `
    SELECT
      id,
      code,
      name,
      stock,
      minimumstock AS "minimumStock",
      expirationdate AS "expirationDate",
      asset AS active
    FROM ${env.inventory.productsTable}
    WHERE asset = TRUE
      AND expirationdate < CURRENT_DATE
    ORDER BY expirationdate ASC, name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

async function findOutOfStockProducts() {
  const pool = getPool();
  const query = `
    SELECT
      id,
      code,
      name,
      stock,
      minimumstock AS "minimumStock",
      expirationdate AS "expirationDate",
      asset AS active
    FROM ${env.inventory.productsTable}
    WHERE asset = TRUE
      AND stock = 0
    ORDER BY name ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

module.exports = {
  findExpiredProducts,
  findLowStockProducts,
  findOutOfStockProducts,
};
