SELECT 
    address, 
    project,
    blockchain
FROM (
VALUES
    -- Coinbase 
    ('L54zkaPQFeTn1UsEqieEXBqWrPShiaZEPD7mS5WXfQg', 'Coinbase', 'solana'),
    -- thirdweb
    
    -- Open X402
    
    -- PayAI
    
    ('2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4', 'PayAI', 'solana'),
    -- X402rs
    
    ('C7ckEzH4varMpBQsaD9bJZSCnWVyk4zAKYA85spuuNbR', 'X402rs', 'solana'),
    -- AurraCloud
    
    -- DayDreams
    ('DuQ4jFMmVABWGxabYHFkGzdyeJgS1hp4wrRuCtsJgT9a', 'DayDreams', 'solana'),
    
    -- Dextor
    ('DEXVS3su4dZQWTvvPnLDJLRK1CeeKG6K3QqdzthgAkNV', 'Dexter', 'solana'),
    -- Corbits
    ('AepWpq3GQwL8CeKMtZyKtKPa7W91Coygh3ropAJapVdU', 'Corbits', 'solana'),
    -- Ultravioleta DAO
    ('F742C4VfFLQ9zRQyithoj5229ZgtX2WqKCSFKgH2EThq', 'Ultravioleta DAO', 'solana')
) AS t(address, project, blockchain)

