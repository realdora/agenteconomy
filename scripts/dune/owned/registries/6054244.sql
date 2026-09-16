SELECT 
    address, 
    project,
    blockchain
FROM (
VALUES
    -- Coinbase 
    (0xDbDf3D8ED80f84c35d01c6C9F9271761BAd90Ba6, 'Coinbase', 'base'),
    (0x9aae2b0d1b9dc55ac9bab9556f9a26cb64995fb9, 'Coinbase', 'base'),
    (0x3a70788150c7645a21b95b7062ab1784d3cc2104, 'Coinbase', 'base'),
    (0x708e57b6650a9a741ab39cae1969ea1d2d10eca1, 'Coinbase', 'base'),
    (0xce82eeec8e98e443ec34fda3c3e999cbe4cb6ac2, 'Coinbase', 'base'),
    (0x7f6d822467df2a85f792d4508c5722ade96be056, 'Coinbase', 'base'),
    (0x001ddabba5782ee48842318bd9ff4008647c8d9c, 'Coinbase', 'base'),
    (0x9c09faa49c4235a09677159ff14f17498ac48738, 'Coinbase', 'base'),
    (0xcbb10c30a9a72fae9232f41cbbd566a097b4e03a, 'Coinbase', 'base'),
    (0x9fb2714af0a84816f5c6322884f2907e33946b88, 'Coinbase', 'base'),
    -- thirdweb
    (0x80c08de1a05df2bd633cf520754e40fde3c794d3, 'thirdweb', 'base'),
    (0x80c08de1a05df2bd633cf520754e40fde3c794d3, 'thirdweb', 'polygon'),
    (0x80c08de1a05df2bd633cf520754e40fde3c794d3, 'thirdweb', 'arbitrum'),
    (0x315F6446Ae22EBcf795d0F5A1b71F3D378DFF1A8, 'thirdweb', 'abstract'),
    -- Open X402
    (0x97316fa4730bc7d3b295234f8e4d04a0a4c093e8, 'Open X402', 'base'),
    (0x97db9b5291a218fc77198c285cefdc943ef74917, 'Open X402', 'base'),
    -- PayAI
    (0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'PayAI', 'base'),
    (0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'PayAI', 'polygon'),
    (0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'PayAI', 'sei'),
    (0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'PayAI', 'avalanche_c'),
    (0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63, 'PayAI', 'peaq'),
    -- ('2wKupLR9q6wXYppw8Gr2NvWxKBUqm4PPJKkQfoxHDBg4', 'PayAI', 'solana'),
    -- X402rs
    (0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'X402rs', 'base'),
    (0x76eee8f0acabd6b49f1cc4e9656a0c8892f3332e, 'X402rs', 'base'),
    (0x97d38aa5de015245dcca76305b53abe6da25f6a5, 'X402rs', 'base'),
    (0x0168f80e035ea68b191faf9bfc12778c87d92008, 'X402rs', 'base'),
    (0x5e437bee4321db862ac57085ea5eb97199c0ccc5, 'X402rs', 'base'),
    (0xc19829b32324f116ee7f80d193f99e445968499a, 'X402rs', 'base'),
    (0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'X402rs', 'avalanche_c'),
    (0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'X402rs', 'polygon'),
    (0xd8dfc729cbd05381647eb5540d756f4f8ad63eec, 'X402rs', 'sei'),
    -- ('C7ckEzH4varMpBQsaD9bJZSCnWVyk4zAKYA85spuuNbR', 'X402rs', 'solana'),
    -- AurraCloud
    (0x222c4367a2950f3b53af260e111fc3060b0983ff, 'AurraCloud', 'base'),
    (0xb70c4fe126de09bd292fe3d1e40c6d264ca6a52a, 'AurraCloud', 'base'),
    (0x279e08f711182c79Ba6d09669127a426228a4653, 'DayDreams', 'base'),
    (0xfe0920a0a7f0f8a1ec689146c30c3bbef439bf8a, 'Mogami', 'base'),
    -- CodeNut
    (0x8d8Fa42584a727488eeb0E29405AD794a105bb9b, 'CodeNut', 'base'),
    (0x87aF99356d774312B73018b3B6562e1aE0e018C9, 'CodeNut', 'base'),
    (0x65058CF664D0D07f68B663B0D4b4f12A5E331a38, 'CodeNut', 'base'),
    (0x88E13D4c764a6c840Ce722A0a3765f55A85b327E, 'CodeNut', 'base'),
    (0x8d8Fa42584a727488eeb0E29405AD794a105bb9b, 'CodeNut', 'bnb'),
    -- Questflow
    (0x724efafb051f17ae824afcdf3c0368ae312da264, 'Questflow', 'base'),
    (0xa9a54ef09fc8b86bc747cec6ef8d6e81c38c6180, 'Questflow', 'base'),
    (0x4638bc811c93bf5e60deed32325e93505f681576, 'Questflow', 'base'),
    (0xd7d91a42dfadd906c5b9ccde7226d28251e4cd0f, 'Questflow', 'base'),
    (0x4544b535938b67d2a410a98a7e3b0f8f68921ca7, 'Questflow', 'base'),
    (0x59e8014a3b884392fbb679fe461da07b18c1ff81, 'Questflow', 'base'),
    (0xe6123e6b389751c5f7e9349f3d626b105c1fe618, 'Questflow', 'base'),
    (0xf70e7cb30b132fab2a0a5e80d41861aa133ea21b, 'Questflow', 'base'),
    (0x90da501fdbec74bb0549100967eb221fed79c99b, 'Questflow', 'base'),
    (0xce7819f0b0b871733c933d1f486533bab95ec47b, 'Questflow', 'base'),
    (0x4a288FA07fC40F701e4fd2620F0a14338e12a4D7, 'Questflow', 'polgyon'),
    -- xEcho
    (0x3be45f576696a2fd5a93c1330cd19f1607ab311d, 'xEcho','base'),
    -- b402
    (0x26e824C08a4547aB90FBD761Fb80065f7e68768e, 'B402', 'bnb'),
    -- pieverse
    (0x12343e649e6b2b2b77649dfab88f103c02f3c78b, 'pieverse', 'bnb'),
    -- Ultravioleta DAO
    (0x103040545AC5031A11E8C03dd11324C7333a13C7, 'Ultravioleta DAO', 'avalanche_c'),
    (0x103040545AC5031A11E8C03dd11324C7333a13C7, 'Ultravioleta DAO', 'base'),
    (0x103040545AC5031A11E8C03dd11324C7333a13C7, 'Ultravioleta DAO', 'celo'),
    (0x103040545AC5031A11E8C03dd11324C7333a13C7, 'Ultravioleta DAO', 'hyperevm'),
    (0x103040545AC5031A11E8C03dd11324C7333a13C7, 'Ultravioleta DAO', 'polygon'),
    (0x103040545AC5031A11E8C03dd11324C7333a13C7, 'Ultravioleta DAO', 'optimism'),
    -- 402104
    (0x73b2b8df52fbe7c40fe78db52e3dffdd5db5ad07, '402104', 'base'),
    -- Corbits
    (0x06F0BfD2C8f36674DF5cdE852c1eeD8025C268C9, 'Corbits', 'polygon'),
    -- Polygon
    (0x29df60c005506AA325d7179F6e09eB4b4875dAde, 'Polygon', 'polygon'), -- x402_1.keys
    (0xF09A94831C18566781f70937f0996B96EfE691C8, 'Polygon', 'polygon'), -- x402_1.keys
    (0x42618f623Ec19beFf78dE9DbBFB653BfEaC05D09, 'Polygon', 'polygon'), -- x402_1.keys
    (0x3202643514D128FF0B4625D2682c0244CF58131c, 'Polygon', 'polygon'), -- x402_1.keys
    (0x11DA3fe5ADA6f5382Ebe972f14C3585DA4E65AeA, 'Polygon', 'polygon'), -- x402_1.keys
    (0x135DfE729F9bbd7F88181E1B708d7506fd499140, 'Polygon', 'polygon'), -- x402_1.keys
    (0xDcb0Ac359025dC0DB1e22e6d33F404e5c92A1564, 'Polygon', 'polygon'), -- x402_1.keys
    (0x99EFc08BB42282716fB59D221792f5207f714C9d, 'Polygon', 'polygon'), -- x402_1.keys
    (0xbE5115800247405f020197BF473eBFd085a2C635, 'Polygon', 'polygon'), -- x402_2.keys
    (0x5eAb3D78264Dab340340d6a37Ff0836464Ae5773, 'Polygon', 'polygon'), -- x402_2.keys
    (0xE5D4197eFd5D03E3f30cBf11C0fF63Eb95a0A656, 'Polygon', 'polygon'), -- x402_2.keys
    (0xfac8Edb989f1ba7F9dBb7A1233542D4e1fD6144F, 'Polygon', 'polygon'), -- x402_2.keys
    (0xaFdbfaCb5ed691bf0bCFA660901f299ce9775489, 'Polygon', 'polygon'), -- x402_2.keys
    (0x1e48Ed59a502D0B324CdAf83362865b3ff49ABa2, 'Polygon', 'polygon'), -- x402_2.keys
    (0xA1dcBDC2C34577ACD4A1152A98807B2f281A112e, 'Polygon', 'polygon'), -- x402_2.keys
    (0x9e281D4e26E1a4e7C27014E2ca8Cee7F2D44fa52, 'Polygon', 'polygon'), -- x402_2.keys
    (0x76FCb8ae3365A487E6EA235386C1cf3AbADeDA60, 'Polygon', 'polygon'), -- x402_3.keys
    (0x9523B120C75640469f1D16490Da0388928229452, 'Polygon', 'polygon'), -- x402_3.keys
    (0x153F3A70e4400c211d9B482b62aD721Bb02F96F6, 'Polygon', 'polygon'), -- x402_3.keys
    (0xd5dD012019C58882Dd507A8b3fCBB7b62e9a24c3, 'Polygon', 'polygon'), -- x402_3.keys
    (0xfff23108338C218F895d75980E14688218D4E92a, 'Polygon', 'polygon'), -- x402_3.keys
    (0xF744e153Ef63f7EEe4a58e0F13761D16C2125EE3, 'Polygon', 'polygon'), -- x402_3.keys
    (0x0a8B10FE8Bd3072351600Adef4796F3F7aF72Ab0, 'Polygon', 'polygon'), -- x402_3.keys
    (0x971b4079A618F72Fa0F1792b07ed5923dfBF3500, 'Polygon', 'polygon'), -- x402_3.keys
    -- Virtuals Protocol
    (0x80735b3f7808e2e229ace880dbe85e80115631ca, 'Virtuals Protocol', 'base'),
    -- Treasure
    (0xe07e9cbf9a55d02e3ac356ed4706353d98c5a618, 'Treasure', 'base'),
    -- Heurist
    (0xb578b7db22581507d62bdbeb85e06acd1be09e11, 'Heurist', 'base'),
    (0x021cc47adeca6673def958e324ca38023b80a5be, 'Heurist', 'base'),
    (0x3f61093f61817b29d9556d3b092e67746af8cdfd, 'Heurist', 'base'),
    (0x290d8b8edcafb25042725cb9e78bcac36b8865f8, 'Heurist', 'base'),
    (0x612d72dc8402bba997c61aa82ce718ea23b2df5d, 'Heurist', 'base'),
    (0x1fc230ee3c13d0d520d49360a967dbd1555c8326, 'Heurist', 'base'),
    (0x48ab4b0af4ddc2f666a3fcc43666c793889787a3, 'Heurist', 'base'),
    (0xd97c12726dcf994797c981d31cfb243d231189fb, 'Heurist', 'base'),
    (0x90d5e567017f6c696f1916f4365dd79985fce50f, 'Heurist', 'base')
) AS t(address, project, blockchain)

