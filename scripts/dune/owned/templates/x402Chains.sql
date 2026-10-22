-- AE owned chain activity, registry snapshot 2026-09-15 (Chris EVM v34 / Solana v9).
-- Preserves legacy tx-sender membership across chains. This is observed
-- facilitator-address activity, not proof every transfer is an x402 payment.
-- One transaction hash per chain/day. Complete UTC days only.
WITH evm_registry AS (SELECT * FROM query_6057445),
sol_registry AS (WITH sol AS (
  SELECT facilitator, address, chain
  FROM (VALUES
    ('payai',    '2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4', 'solana'),
    ('corbits',  'AepWpq3GQwL8CeKMtZyKtKPa7W91Coygh3ropAJapVdU', 'solana'),
    ('daydreams','DuQ4jFMmVABWGxabYHFkGzdyeJgS1hp4wrRuCtsJgT9a', 'solana'),
    ('dexter',   'DEXVS3su4dZQWTvvPnLDJLRK1CeeKG6K3QqdzthgAkNV', 'solana'),
    ('coinbase', 'L54zkaPQFeTn1UsEqieEXBqWrPShiaZEPD7mS5WXfQg', 'solana'),
    ('x402rs',   'C7ckEzH4varMpBQsaD9bJZSCnWVyk4zAKYA85spuuNbR', 'solana'),
    ('ultravioleta','F742C4VfFLQ9zRQyithoj5229ZgtX2WqKCSFKgH2EThq', 'solana'),
    ('codenut',  'HsozMJWWHNADoZRmhDGKzua6XW6NNfNDdQ4CkE9i5wHt', 'solana'),
    ('aurracloud','8x8CzkTHTYkW18frrTR7HdCV6fsjenvcykJAXWvoPQW', 'solana')
  ) AS t(facilitator, address, chain)
)
SELECT *
FROM sol),
counts AS (
 SELECT CAST(date_trunc('day', block_time) AS DATE) AS day,
        blockchain, COUNT(DISTINCT tx_hash) AS total_txn
 FROM tokens.transfers
 WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
   AND block_time < CAST(current_date AS TIMESTAMP)
   AND tx_from IN (SELECT address FROM evm_registry)
   AND (blockchain = 'base' OR tx_from NOT IN (SELECT address FROM evm_registry WHERE lower(facilitator) = 'coinbase'))
 GROUP BY 1,2
 UNION ALL
 SELECT CAST(date_trunc('day', block_time) AS DATE) AS day,
        'solana' AS blockchain, COUNT(DISTINCT tx_id) AS total_txn
 FROM tokens_solana.transfers
 WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
   AND block_time < CAST(current_date AS TIMESTAMP)
   AND tx_signer IN (SELECT address FROM sol_registry)
 GROUP BY 1,2
)
SELECT day, blockchain, total_txn,
       '{{window_start}}' AS window_start,
       CAST(current_date AS VARCHAR) AS window_end
FROM counts ORDER BY day, blockchain
