const db = require("../db/db");

const fetchQuantityType = (item_id) => {
  const query = "SELECT * FROM quantity_type";
  return new Promise((resolve, reject) => {
    db.query(query, [item_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(JSON.stringify(results)));
      }
    });
  });
};

module.exports = {
  fetchQuantityType,
};
