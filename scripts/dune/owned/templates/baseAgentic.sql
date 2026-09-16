WITH agentic_contracts AS (
    SELECT address, name, category FROM (
        VALUES
        (0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b, 'Virtuals Protocol', 'Infrastructure'),
        (0x96419929d7949d6a801a6909c145c8eef6a40431, 'Spectral', 'Infrastructure'),
        (0x1bc0c42215582d5a085795f4badbac3ff36d1bcb, 'Clanker', 'Infrastructure'),
        (0xacfE6019Ed1A7Dc6f7B508C02d1b04ec88cC21bf, 'Venice', 'Infrastructure'),
        (0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825, 'AIXBT', 'Infrastructure'),
        (0xC44141a684f6AA4E36cD9264ab55550B03C88643, 'Ethy AI', 'Infrastructure'),
        (0x58Db197E91Bc8Cf1587F75850683e4bd0730e6BF, 'Axelrod', 'Infrastructure'),
        (0x1b4617734c43f6159f3a70b7e06d883647512778, 'AWE', 'Consumer'),
        (0xb33Ff54b9F7242EF1593d2C9Bcd8f9df46c77935, 'FAI', 'Consumer'),
        (0x731814e491571a2e9ee3c5b1f7f3b962ee8f4870, 'VADER', 'Consumer'),
        (0x9f86db9fc6f7c9408e8fda3ff8ce4e78ac7a6b07, 'CLAWD', 'Consumer'),
        (0x22af33fe49fd1fa80c7149773dde5890d3c76f3b, 'Bankr', 'Consumer'),
        (0xA4A2E2ca3fBfE21aed83471D28b6f65A233C6e00, 'Ribbita', 'Consumer')
    ) AS t(address, name, category)
),
first_seen AS (
    SELECT
        t."from" AS wallet,
        ac.category,
        MIN(date_trunc('day', t.block_time)) AS first_day
    FROM base.transactions t
    INNER JOIN agentic_contracts ac ON t."to" = ac.address
    WHERE t.block_time >= DATE '2026-01-01'
      AND t.success = true
    GROUP BY 1, 2
),
new_users_daily AS (
    SELECT
        first_day AS day,
        category,
        COUNT(*) AS new_users
    FROM first_seen
    GROUP BY 1, 2
),
daily_raw AS (
    SELECT
        date_trunc('day', t.block_time) AS day,
        ac.category,
        COUNT(*) AS daily_txs,
        COUNT(DISTINCT t."from") AS daily_users
    FROM base.transactions t
    INNER JOIN agentic_contracts ac
        ON t."to" = ac.address
    WHERE t.block_time >= DATE '2026-01-01'
      AND t.success = true
    GROUP BY 1, 2
),
date_spine AS (
    SELECT
        day,
        category
    FROM UNNEST(sequence(DATE '2026-01-01', current_date, interval '1' day)) AS t(day)
    CROSS JOIN (VALUES ('Infrastructure'), ('Consumer')) AS c(category)
),
daily_filled AS (
    SELECT
        ds.day,
        ds.category,
        COALESCE(dr.daily_txs, 0) AS daily_txs,
        COALESCE(dr.daily_users, 0) AS daily_users,
        COALESCE(nu.new_users, 0) AS new_users
    FROM date_spine ds
    LEFT JOIN daily_raw dr
        ON ds.day = dr.day
        AND ds.category = dr.category
    LEFT JOIN new_users_daily nu
        ON ds.day = nu.day
        AND ds.category = nu.category
),
with_ma AS (
    SELECT
        day,
        category,
        daily_txs,
        daily_users,
        new_users,
        AVG(daily_txs) OVER (
            PARTITION BY category
            ORDER BY day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS txs_7d_ma,
        AVG(daily_users) OVER (
            PARTITION BY category
            ORDER BY day
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS users_7d_ma,
        SUM(new_users) OVER (
            PARTITION BY category
            ORDER BY day
        ) AS cumulative_unique_users
    FROM daily_filled
)
SELECT
    day,
    category,
    daily_txs AS "Daily Transactions",
    daily_users AS "Daily Active Addresses",
    ROUND(txs_7d_ma, 0) AS "Txs 7d MA",
    ROUND(users_7d_ma, 0) AS "Users 7d MA",
    cumulative_unique_users AS "Cumulative Users"
FROM with_ma
WHERE day < current_date
ORDER BY day ASC, category
