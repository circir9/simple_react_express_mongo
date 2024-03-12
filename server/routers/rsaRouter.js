const express = require('express');
const rsaKey = require('./rsaProducer');
const router = express.Router();

router.get('/getPublicKey', (req, res) => {
    if (rsaKey.publicKey) {
        res.send(rsaKey.publicKey);
    } else {
        res.status(500).send('Server public key not available');
    }
});

const Router = router;

module.exports = Router;