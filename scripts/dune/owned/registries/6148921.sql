-- Solana facilitator list
WITH sol AS (
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
FROM sol;

