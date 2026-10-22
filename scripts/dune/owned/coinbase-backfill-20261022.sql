-- Repair only the verified owned-registry era; no unverified additions to older frozen aggregates.
WITH activity AS (
 SELECT CAST(date_trunc('day', block_time) AS VARCHAR) AS day, "from" AS address, COUNT(*) AS daily_txs
 FROM base.transactions
 WHERE block_time >= TIMESTAMP '2026-09-16' AND block_time < TIMESTAMP '2026-10-22'
 AND success AND "from" IN (0x8f5cb67b49555e614892b7233cfddebfb746e531,
0x67b9ce703d9ce658d7c4ac3c289cea112fe662af,
0x68a96f41ff1e9f2e7b591a931a4ad224e7c07863,
0x97acce27d5069544480bde0f04d9f47d7422a016,
0xa32ccda98ba7529705a059bd2d213da8de10d101,
0x2a89407a98a0732b7fd578c4e156b7166540eb5a,
0xe72f0af4cf41356d433723547f1412ca27fbb1b8,
0xca5e87f82b3fa093800e6ad67d621a427d79c70d,
0x4c934c63c786157fefd990945b25ea60a0fb0205,
0x64cc42b1ce598e3abcfbb64df4688521ddbf1f0a,
0xe74817f4cdc15844314812b2271276e64e890fae,
0x625d8a65134079f8faaac39a7947c73d93c6ac39,
0x14fda13953fc30428938e6bf950d036e77214e52,
0x68efafe862d89ce66dd3d7b07d5a3747a0871164,
0x59b7ebc67a3d627fabaf06768c818638452ae704,
0x42dd53906b49c202e8e934b059dc019e04634b00,
0xb87e1a2cc2b4643f2892768e80e41167f17c5860,
0x8cda367232d78c067116e3260da881d2da8ffa39,
0x93f6601151ccb08f333ab4b1cccfb1e188c0be44,
0x772003a2e9c2ccc8af956870a37a66f64f8cec38)
 GROUP BY 1,2
), payments AS (
 SELECT CAST(date_trunc('day', block_time) AS VARCHAR) AS day, tx_from AS address,
 COUNT(DISTINCT tx_hash) AS transfer_txs, COALESCE(SUM(amount_usd),0) AS volume,
 COUNT(DISTINCT CASE WHEN contract_address = 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913 THEN tx_hash END) AS usdc_txs
 FROM tokens.transfers
 WHERE blockchain='base' AND block_time >= TIMESTAMP '2026-09-16' AND block_time < TIMESTAMP '2026-10-22'
 AND tx_from IN (0x8f5cb67b49555e614892b7233cfddebfb746e531,
0x67b9ce703d9ce658d7c4ac3c289cea112fe662af,
0x68a96f41ff1e9f2e7b591a931a4ad224e7c07863,
0x97acce27d5069544480bde0f04d9f47d7422a016,
0xa32ccda98ba7529705a059bd2d213da8de10d101,
0x2a89407a98a0732b7fd578c4e156b7166540eb5a,
0xe72f0af4cf41356d433723547f1412ca27fbb1b8,
0xca5e87f82b3fa093800e6ad67d621a427d79c70d,
0x4c934c63c786157fefd990945b25ea60a0fb0205,
0x64cc42b1ce598e3abcfbb64df4688521ddbf1f0a,
0xe74817f4cdc15844314812b2271276e64e890fae,
0x625d8a65134079f8faaac39a7947c73d93c6ac39,
0x14fda13953fc30428938e6bf950d036e77214e52,
0x68efafe862d89ce66dd3d7b07d5a3747a0871164,
0x59b7ebc67a3d627fabaf06768c818638452ae704,
0x42dd53906b49c202e8e934b059dc019e04634b00,
0xb87e1a2cc2b4643f2892768e80e41167f17c5860,
0x8cda367232d78c067116e3260da881d2da8ffa39,
0x93f6601151ccb08f333ab4b1cccfb1e188c0be44,
0x772003a2e9c2ccc8af956870a37a66f64f8cec38) GROUP BY 1,2
)
SELECT COALESCE(a.day,p.day) AS day, CAST(COALESCE(a.address,p.address) AS VARCHAR) AS address,
 COALESCE(a.daily_txs,0) AS daily_txs, COALESCE(p.transfer_txs,0) AS transfer_txs,
 COALESCE(p.volume,0) AS volume, COALESCE(p.usdc_txs,0) AS usdc_txs
FROM activity a FULL OUTER JOIN payments p ON a.day=p.day AND a.address=p.address
ORDER BY 1,2
