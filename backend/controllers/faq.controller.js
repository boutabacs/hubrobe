const faqData = require("../data/faq");

const getFaq = async (req, res) => {
  res.status(200).json(faqData);
};

module.exports = { getFaq };

