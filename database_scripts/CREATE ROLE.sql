-- If any tables are added after executing these 4 statements, then re-execute the GRANT USAGE and GRANT SELECT ON statements so the readonly user can access the newly created tables
-- These were adapted from the PostgREST docs, additional details can be found in the original doc: http://postgrest.org/en/v5.0/auth.html#client-auth
-- Priyank Purohit, 2018

-- IMPORTANT: change <<<<DATABASE_NAME>>>> and others in this script!

-- Allows for read only access
CREATE ROLE readuser;
GRANT CONNECT ON DATABASE <<<<DATABASE_NAME>>>> TO readuser;
GRANT USAGE ON SCHEMA public TO readuser;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readuser;

-- -- Disable read only access
-- REVOKE CONNECT ON DATABASE <<<<DATABASE_NAME>>>> FROM readuser;
-- REVOKE USAGE ON SCHEMA public FROM readuser;
-- REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM readuser;

# Can do everything PostgREST can
CREATE ROLE edituser;
GRANT CONNECT ON DATABASE <<<<DATABASE_NAME>>>> TO edituser;
GRANT USAGE ON SCHEMA public TO edituser;
GRANT SELECT ON ALL TABLES IN SCHEMA public to edituser;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public to edituser;
GRANT EXECUTE ON FUNCTION primary_keys() to edituser; 
GRANT EXECUTE ON FUNCTION foreign_keys() to edituser; 