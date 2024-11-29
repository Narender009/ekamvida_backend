const express = require('express');
const router = express.Router();

// Example endpoint for retrieving data
router.get('/example', (req, res) => {
    res.json({ message: 'Example route working!' });
});

module.exports = router;
