const getCarriers = (req, res) => {
  res.json([
    { id: 1, name: "Mutual of Omaha" },
    { id: 2, name: "Americo" },
    { id: 3, name: "Transamerica" },
    { id: 4, name: "Corebridge" },
    { id: 5, name: "Royal Neighbors" },
    { id: 6, name: "American Amicable" },
  ]);
};

module.exports = { getCarriers };