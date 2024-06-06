const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// Middleware
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + '/public')); // Adjust static directory
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.render("index");
});
app.post('/submit-pnr', (req, res) => {
    const pnr = req.body.pnr;

    // Logic to validate and handle the PNR
    if (pnr) {
        // Assume it's successful for now
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Add more routes to handle form submissions here

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
