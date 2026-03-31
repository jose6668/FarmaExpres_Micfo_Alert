const { ALERT_SEVERITIES } = require("../config/constants");

function resolveLowStockSeverity(stock, minimumStock) {
  const deficit = Number(minimumStock) - Number(stock);

  if (deficit >= 5) {
    return ALERT_SEVERITIES.HIGH;
  }

  if (deficit >= 1) {
    return ALERT_SEVERITIES.MEDIUM;
  }

  return ALERT_SEVERITIES.LOW;
}

module.exports = {
  resolveLowStockSeverity,
};
