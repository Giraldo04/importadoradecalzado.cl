const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.get('/sign', (req, res) => {
  const { timestamp, folder } = req.query;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(paramsToSign + apiSecret)
    .digest('hex');

  res.json({
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
});

module.exports = router;
