-- These functions are used by the web app to show FK chips in the left pane, and enable/disable edit feature based on presence of PK
-- Priyank Purohit, 2018

-- Reference: https://stackoverflow.com/questions/1152260/postgres-sql-to-list-table-foreign-keys/5490066#5490066
CREATE OR REPLACE FUNCTION foreign_keys () RETURNS json IMMUTABLE LANGUAGE SQL AS $$
  SELECT COALESCE(Array_to_json(Array_agg(Row_to_json(row))), '[]')
  FROM   (
    SELECT o.conname AS CONSTRAINT_NAME,
       m.relname AS TABLE_NAME,
  (SELECT a.attname
   FROM pg_attribute a
   WHERE a.attrelid = m.oid
     AND a.attnum = o.conkey[1]
     AND a.attisdropped = FALSE) AS COLUMN_NAME,
       f.relname AS foreign_table,
  (SELECT a.attname
   FROM pg_attribute a
   WHERE a.attrelid = f.oid
     AND a.attnum = o.confkey[1]
     AND a.attisdropped = FALSE) AS foreign_column
FROM pg_constraint o
LEFT JOIN pg_class c ON c.oid = o.conrelid
LEFT JOIN pg_class f ON f.oid = o.confrelid
LEFT JOIN pg_class m ON m.oid = o.conrelid
WHERE o.contype = 'f'
  AND o.conrelid IN
    (SELECT oid
     FROM pg_class c
     WHERE c.relkind = 'r')
    ) row;
  $$ ;


-- Reference: http://technosophos.com/2015/10/26/querying-postgresql-to-find-the-primary-key-of-a-table.html
CREATE OR REPLACE FUNCTION primary_keys() RETURNS json IMMUTABLE LANGUAGE SQL AS $$
  SELECT COALESCE(Array_to_json(Array_agg(Row_to_json(row))), '[]')
  FROM (
    SELECT t.table_name AS TABLE, array_agg(c.column_name::text) AS PRIMARY_KEYS
    FROM information_schema.key_column_usage AS c LEFT JOIN information_schema.table_constraints AS t ON t.constraint_name = c.constraint_name
    WHERE t.constraint_type = 'PRIMARY KEY'
    GROUP BY t.table_name
    ORDER BY t.table_name) row;
$$;



-- Role independent way to get primary keys out of the db...
-- select
--     t.relname as table_name,
--     i.relname as index_name,
--     a.attname as column_name,
--     d.adsrc   as default_value,
--     c.contype
-- from
--     pg_class t
--     join pg_attribute a on a.attrelid = t.oid
--     join pg_index ix    on t.oid = ix.indrelid AND a.attnum = ANY(ix.indkey)
--     join pg_constraint c on c.conrelid = t.oid
--     join pg_class i     on i.oid = ix.indexrelid
--     left join pg_attrdef d on d.adrelid = t.oid and d.adnum = a.attnum  
-- where
--     t.relkind = 'r' and
--     t.relhaspkey and 
--     c.contype = 'p' and 
--     t.relname in (select 
-- 		  tablename as table 
-- 		from 
-- 		  pg_tables  
-- 		where schemaname = 'public')
-- order by
--     t.relname,
--     i.relname,
--     a.attnum;