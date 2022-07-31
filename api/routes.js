const express = require('express');
const router = express.Router();

function numToString(obj) {
  return ("0" + obj.toString()).slice(-2);
}

function getGeneralInfo(date) {
  
  const weekDay = date.toLocaleString('en-US', { weekday: 'short' });
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  const monthDay = date.getUTCDate().toString();

  const hour = numToString(date.getHours());
  const minute = numToString(date.getMinutes());
  const second = numToString(date.getSeconds());
  
  return [ weekDay, monthName, hour, minute, second];
}

// your first API endpoint... 
router.get("/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});

router.get("/:year-:month-:day", (req, res) => {
  const { year, month, day} = req.params;
  
  const date = new Date(`${year}-${month}-${day}`);

  const [weekDay, monthName, hour, minute, second] = getGeneralInfo(date)
  
  res.json({
    unix: date.valueOf(),
    utc: `${weekDay}, ${monthDay} ${monthName} ${year} ${hour}:${minute}:${second} GMT`,
  })
  
});


router.get("/:unix?", (req, res) => {
  const { unix: unixString} = req.params;
  
  const date = new Date(parseInt(unixString));
  

  const [weekDay, monthName, hour, minute, second] = getGeneralInfo(date);
  const year = date.getUTCFullYear().toString();

  
  res.json({
    unix: date.valueOf(),
    utc: `${weekDay}, ${monthDay} ${monthName} ${year} ${hour}:${minute}:${second} GMT`,
  })
  
});


module.exports = {
  router
};