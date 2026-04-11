/**
 * Barrel export — controllers can keep using `email.service` or import
 * `welcome.mail.service`, `reset.mail.service`, `newsletter.mail.service` directly.
 */
module.exports = {
  ...require("./welcome.mail.service"),
  ...require("./newsletter.mail.service"),
};
