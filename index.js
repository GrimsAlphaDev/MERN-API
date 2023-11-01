const express = require('express');
const app = express();

app.use(() => {
    console.log('SERVER IS RUNNING');
});

app.listen(4000);
