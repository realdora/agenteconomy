-- AE owned chain activity, registry snapshot 2026-09-15 (Chris EVM v34 / Solana v9).
-- Preserves legacy tx-sender membership across chains. This is observed
-- facilitator-address activity, not proof every transfer is an x402 payment.
-- One transaction hash per chain/day. Complete UTC days only.
WITH evm_registry AS (WITH evm AS (
  SELECT facilitator, address, chain
  FROM (VALUES

    ('coinbase', 0xdbdf3d8ed80f84c35d01c6c9f9271761bad90ba6, 'base'),
    ('coinbase', 0x9aae2b0d1b9dc55ac9bab9556f9a26cb64995fb9, 'base'),
    ('coinbase', 0x3a70788150c7645a21b95b7062ab1784d3cc2104, 'base'),
    ('coinbase', 0x708e57b6650a9a741ab39cae1969ea1d2d10eca1, 'base'),
    ('coinbase', 0xce82eeec8e98e443ec34fda3c3e999cbe4cb6ac2, 'base'),
    ('coinbase', 0x7f6d822467df2a85f792d4508c5722ade96be056, 'base'),
    ('coinbase', 0x001ddabba5782ee48842318bd9ff4008647c8d9c, 'base'),
    ('coinbase', 0x9c09faa49c4235a09677159ff14f17498ac48738, 'base'),
    ('coinbase', 0xcbb10c30a9a72fae9232f41cbbd566a097b4e03a, 'base'),
    ('coinbase', 0x9fb2714af0a84816f5c6322884f2907e33946b88, 'base'),


    ('x402rs', 0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'base'),
    ('x402rs', 0x76eee8f0acabd6b49f1cc4e9656a0c8892f3332e, 'base'),
    ('x402rs', 0x97d38aa5de015245dcca76305b53abe6da25f6a5, 'base'),
    ('x402rs', 0x0168f80e035ea68b191faf9bfc12778c87d92008, 'base'),
    ('x402rs', 0x5e437bee4321db862ac57085ea5eb97199c0ccc5, 'base'),
    ('x402rs', 0xc19829b32324f116ee7f80d193f99e445968499a, 'base'),
    ('x402rs', 0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'polygon'),
    ('x402rs', 0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'avalanche_c'),
    ('x402rs', 0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'sei'),


    ('codenut', 0x8d8fa42584a727488eeb0e29405ad794a105bb9b, 'base'),
    ('codenut', 0x87af99356d774312b73018b3b6562e1ae0e018c9, 'base'),
    ('codenut', 0x65058cf664d0d07f68b663b0d4b4f12a5e331a38, 'base'),
    ('codenut', 0x88e13d4c764a6c840ce722a0a3765f55a85b327e, 'base'),
    ('codenut', 0x8d8fa42584a727488eeb0e29405ad794a105bb9b, 'bnb'),


    ('payai', 0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'base'),
    ('payai', 0xb2bd29925cbbcea7628279c91945ca5b98bf371b, 'base'),
    ('payai', 0x25659315106580ce2a787ceec5efb2d347b539c9, 'base'),
    ('payai', 0xb8f41cb13b1f213da1e94e1b742ec1323235c48f, 'base'),
    ('payai', 0xe575fa51af90957d66fab6d63355f1ed021b887b, 'base'),
    ('payai', 0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'polygon'),
    ('payai', 0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'sei'),
    ('payai', 0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'avalanche_c'),
    ('payai', 0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'peaq'),


    ('questflow', 0x724efafb051f17ae824afcdf3c0368ae312da264, 'base'),
    ('questflow', 0xa9a54ef09fc8b86bc747cec6ef8d6e81c38c6180, 'base'),
    ('questflow', 0x4638bc811c93bf5e60deed32325e93505f681576, 'base'),
    ('questflow', 0xd7d91a42dfadd906c5b9ccde7226d28251e4cd0f, 'base'),
    ('questflow', 0x4544b535938b67d2a410a98a7e3b0f8f68921ca7, 'base'),
    ('questflow', 0x59e8014a3b884392fbb679fe461da07b18c1ff81, 'base'),
    ('questflow', 0xe6123e6b389751c5f7e9349f3d626b105c1fe618, 'base'),
    ('questflow', 0xf70e7cb30b132fab2a0a5e80d41861aa133ea21b, 'base'),
    ('questflow', 0x90da501fdbec74bb0549100967eb221fed79c99b, 'base'),
    ('questflow', 0xce7819f0b0b871733c933d1f486533bab95ec47b, 'base'),
    ('questflow', 0x4a288fa07fc40f701e4fd2620f0a14338e12a4d7, 'polygon'),


    ('ultravioleta', 0x103040545ac5031a11e8c03dd11324c7333a13c7, 'base'),
    ('ultravioleta', 0x103040545ac5031a11e8c03dd11324c7333a13c7, 'avalanche_c'),
    ('ultravioleta', 0x103040545ac5031a11e8c03dd11324c7333a13c7, 'celo'),
    ('ultravioleta', 0x103040545ac5031a11e8c03dd11324c7333a13c7, 'hyperevm'),
    ('ultravioleta', 0x103040545ac5031a11e8c03dd11324c7333a13c7, 'polygon'),
    ('ultravioleta', 0x103040545ac5031a11e8c03dd11324c7333a13c7, 'optimism'),


    ('thirdweb', 0x80c08de1a05df2bd633cf520754e40fde3c794d3, 'base'),
    ('thirdweb', 0x80c08de1a05df2bd633cf520754e40fde3c794d3, 'polygon'),
    ('thirdweb', 0x80c08de1a05df2bd633cf520754e40fde3c794d3, 'arbitrum'),
    ('thirdweb', 0x315f6446ae22ebcf795d0f5a1b71f3d378dff1a8, 'abstract'),


    ('aurracloud', 0x222c4367a2950f3b53af260e111fc3060b0983ff, 'base'),
    ('aurracloud', 0xb70c4fe126de09bd292fe3d1e40c6d264ca6a52a, 'base'),
    ('aurracloud', 0xd348e724e0ef36291a28dfeccf692399b0e179f8, 'base'),


    ('openx402', 0x97316fa4730bc7d3b295234f8e4d04a0a4c093e8, 'base'),
    ('openx402', 0x97db9b5291a218fc77198c285cefdc943ef74917, 'base'),


    ('daydreams', 0x279e08f711182c79ba6d09669127a426228a4653, 'base'),


    ('mogami', 0xfe0920a0a7f0f8a1ec689146c30c3bbef439bf8a, 'base'),


    ('402104', 0x73b2b8df52fbe7c40fe78db52e3dffdd5db5ad07, 'base'),


    ('xecho', 0x3be45f576696a2fd5a93c1330cd19f1607ab311d, 'base'),


    ('b402', 0x26e824c08a4547ab90fbd761fb80065f7e68768e, 'bnb'),


    ('pieverse', 0x12343e649e6b2b2b77649dfab88f103c02f3c78b, 'bnb'),

    ('402104', 0x73b2b8df52fbe7c40fe78db52e3dffdd5db5ad07, 'base'),
    ('Corbits', 0x06F0BfD2C8f36674DF5cdE852c1eeD8025C268C9, 'polygon'),


    ('Polygon', 0x29df60c005506AA325d7179F6e09eB4b4875dAde, 'polygon'),
    ('Polygon', 0xF09A94831C18566781f70937f0996B96EfE691C8, 'polygon'),
    ('Polygon', 0x42618f623Ec19beFf78dE9DbBFB653BfEaC05D09, 'polygon'),
    ('Polygon', 0x3202643514D128FF0B4625D2682c0244CF58131c, 'polygon'),
    ('Polygon', 0x11DA3fe5ADA6f5382Ebe972f14C3585DA4E65AeA, 'polygon'),
    ('Polygon', 0x135DfE729F9bbd7F88181E1B708d7506fd499140, 'polygon'),
    ('Polygon', 0xDcb0Ac359025dC0DB1e22e6d33F404e5c92A1564, 'polygon'),
    ('Polygon', 0x99EFc08BB42282716fB59D221792f5207f714C9d, 'polygon'),
    ('Polygon', 0xbE5115800247405f020197BF473eBFd085a2C635, 'polygon'),
    ('Polygon', 0x5eAb3D78264Dab340340d6a37Ff0836464Ae5773, 'polygon'),
    ('Polygon', 0xE5D4197eFd5D03E3f30cBf11C0fF63Eb95a0A656, 'polygon'),
    ('Polygon', 0xfac8Edb989f1ba7F9dBb7A1233542D4e1fD6144F, 'polygon'),
    ('Polygon', 0xaFdbfaCb5ed691bf0bCFA660901f299ce9775489, 'polygon'),
    ('Polygon', 0x1e48Ed59a502D0B324CdAf83362865b3ff49ABa2, 'polygon'),
    ('Polygon', 0xA1dcBDC2C34577ACD4A1152A98807B2f281A112e, 'polygon'),
    ('Polygon', 0x9e281D4e26E1a4e7C27014E2ca8Cee7F2D44fa52, 'polygon'),
    ('Polygon', 0x76FCb8ae3365A487E6EA235386C1cf3AbADeDA60, 'polygon'),
    ('Polygon', 0x9523B120C75640469f1D16490Da0388928229452, 'polygon'),
    ('Polygon', 0x153F3A70e4400c211d9B482b62aD721Bb02F96F6, 'polygon'),
    ('Polygon', 0xd5dD012019C58882Dd507A8b3fCBB7b62e9a24c3, 'polygon'),
    ('Polygon', 0xfff23108338C218F895d75980E14688218D4E92a, 'polygon'),
    ('Polygon', 0xF744e153Ef63f7EEe4a58e0F13761D16C2125EE3, 'polygon'),
    ('Polygon', 0x0a8B10FE8Bd3072351600Adef4796F3F7aF72Ab0, 'polygon'),
    ('Polygon', 0x971b4079A618F72Fa0F1792b07ed5923dfBF3500, 'polygon'),


    ('Virtuals Protocol', 0x80735b3f7808e2e229ace880dbe85e80115631ca, 'base'),


    ('Treasure', 0xe07e9cbf9a55d02e3ac356ed4706353d98c5a618, 'base'),


    ('Heurist', 0xb578b7db22581507d62bdbeb85e06acd1be09e11, 'base'),
    ('Heurist', 0x021cc47adeca6673def958e324ca38023b80a5be, 'base'),
    ('Heurist', 0x3f61093f61817b29d9556d3b092e67746af8cdfd, 'base'),
    ('Heurist', 0x290d8b8edcafb25042725cb9e78bcac36b8865f8, 'base'),
    ('Heurist', 0x612d72dc8402bba997c61aa82ce718ea23b2df5d, 'base'),
    ('Heurist', 0x1fc230ee3c13d0d520d49360a967dbd1555c8326, 'base'),
    ('Heurist', 0x48ab4b0af4ddc2f666a3fcc43666c793889787a3, 'base'),
    ('Heurist', 0xd97c12726dcf994797c981d31cfb243d231189fb, 'base'),
    ('Heurist', 0x90d5e567017f6c696f1916f4365dd79985fce50f, 'base'),


    ('Celo', 0x0d74D5Cefd2e7F24E623330ebE3d8D4cB45fFB48 , 'celo')

  ) AS t(facilitator, address, chain)
)
SELECT *
FROM evm),
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
