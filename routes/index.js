var express = require("express");
var router = express.Router();
var {scrapGoogleSearch} = require('../services/ScrapService')
router.get("/", function (req, res, next) {
  res.send("Bienvenue !!!");
});

router.get("/scrap", async (req, res, next) => {
  const { search } = req.query;
  if (!search)
    return res.status(500).json({
      error: "Provide a `search` query field",
    });
  const response = await scrapGoogleSearch(search);
  res.send(response);
});
module.exports = router;
