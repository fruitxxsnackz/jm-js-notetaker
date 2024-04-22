const express = require('express');
const path = require('path');
const indexroute = require('./routes/index');
const textroute = require('./routes/textroute');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', indexroute);
app.use('/', textroute);
app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});