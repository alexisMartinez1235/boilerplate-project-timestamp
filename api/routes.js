const express = require('express');
const router = express.Router();

// your first API endpoint... 
router.get("/hello", (req, res) => {
  res.json({greeting: 'hello API'});
});


router.get("/:date?", (req, res, next) => {
  const { date: dateString} = req.params;
  // console.log(dateString);
  
  if (dateString === undefined) {
    res.locals.date = new Date();
  } else if(/^\d{13}$/.test(dateString)) {
    res.locals.date = new Date(parseInt(dateString));
  } else {
    res.locals.date = new Date(dateString);
  }
  
  if (res.locals.date.toString() === "Invalid Date") {
    res.json({
      error : "Invalid Date"
    });
  } else {
    // console.log(res.locals.date);
    next();
  }
  
});

// extract info from date
router.use((req, res, next) => {
  const { date } = res.locals;
  
  res.locals.weekDay = date.toLocaleString('en-US', { weekday: 'short' });
  res.locals.monthName = date.toLocaleString('en-US', { month: 'short' });
  res.locals.monthDay = date.getUTCDate().toString();
  res.locals.year = date.getUTCFullYear().toString();

  res.locals.hour = date.getHours();
  res.locals.minute = date.getMinutes();
  res.locals.second = date.getSeconds();
  
  next();
});

// function to pass (x int) => "0x" and (xx int) => "xx"
// force size 2

router.use((req, res, next) => {
  const { monthDay, hour, minute, second } = res.locals;
  
  const toChange = [
    monthDay, hour, minute, second
  ].map((obj) => ("0" + obj).slice(-2));
    
  const toChangeJSON = {
    monthDay: toChange[0],
    hour: toChange[1],
    minute: toChange[2],
    second: toChange[3]
  };
  
  res.locals = {
    ...res.locals,
    ...toChangeJSON
  };

  next();
});

// return json
router.use((req, res) => {
  const {
    date,
    weekDay,
    monthName,
    monthDay,
    year,
    hour,
    minute,
    second
  } = res.locals;
  
  res.json({
    unix: date.valueOf(),
    utc: `${weekDay}, ${monthDay} ${monthName} ${year} ${hour}:${minute}:${second} GMT`,
  });
});

module.exports = {
  router
};