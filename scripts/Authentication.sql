-- Script created using PostgREST Docs, additional details can be found in the original doc: http://postgrest.org/en/v5.0/auth.html#client-auth
-- Priyank Purohit
-- 2018

-- IMPORTANT!! *************** CHANGE SECRET ON LINE 105, PASSWORDS AND EMAIL ON 115-118. *************** IMPORTANT!!


-- INSTALL PGJWT
-- Copy both files to /postgres/share/extensions/
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgjwt;  -- Note: for AWS RDS see ./pgjwt_alternative_for_aws_rds.sql



-- We put things inside the basic_auth schema to hide them from public view.
-- Certain public procs/views will refer to helpers and tables inside.
CREATE SCHEMA IF NOT EXISTS basic_auth;
CREATE TABLE IF NOT EXISTS
basic_auth.users (
email TEXT PRIMARY KEY CHECK ( email ~* '^.+@.+\..+$' ),
pass TEXT NOT NULL CHECK (length(pass) < 512),
role NAME NOT NULL CHECK (length(role) < 512)
);



-- We would like the role to be a foreign key to actual database roles, 
-- however PostgreSQL does not support these constraints against the pg_roles table.
-- We’ll use a trigger to manually enforce it.
CREATE OR REPLACE FUNCTION basic_auth.check_role_exists() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles AS r WHERE r.rolname = new.role) THEN
    raise foreign_key_violation using message =
    'unknown database role: ' || new.role;
    return null;
  END IF;
  return new;
END
$$;

DROP TRIGGER IF EXISTS ensure_user_role_exists ON basic_auth.users;
CREATE CONSTRAINT TRIGGER ensure_user_role_exists
  AFTER INSERT OR UPDATE ON basic_auth.users
  FOR EACH ROW
  execute procedure basic_auth.check_role_exists();



-- Next we’ll use the pgcrypto extension and a trigger to keep passwords safe in the users table.
CREATE OR REPLACE FUNCTION basic_auth.encrypt_pass() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF tg_op = 'INSERT' OR new.pass <> old.pass THEN
    new.pass = crypt(new.pass, gen_salt('bf'));
  END IF;
  return new;
END
$$;

DROP TRIGGER IF EXISTS encrypt_pass ON basic_auth.users;
CREATE TRIGGER encrypt_pass
  BEFORE INSERT OR UPDATE ON basic_auth.users
  FOR EACH ROW
  execute procedure basic_auth.encrypt_pass();



-- Make a helper to check a password against the encrypted column. It returns the database role for a user if the email and password are correct.
CREATE OR REPLACE FUNCTION basic_auth.user_role(email TEXT, pass TEXT) RETURNS name
LANGUAGE plpgsql
AS $$
BEGIN
  return (
  SELECT role FROM basic_auth.users
  WHERE users.email = user_role.email
    AND users.pass = crypt(user_role.pass, users.pass)
  );
END;
$$;


-- As described in JWT from SQL, we’ll create a JWT inside our login function.
-- Note that you’ll need to adjust the secret key which is hard-coded in this example to a secure (at least thirty-two character) secret of your choosing.
CREATE TYPE basic_auth.jwt_token AS (
  token text
);

CREATE OR REPLACE FUNCTION login(email TEXT, pass TEXT) RETURNs basic_auth.jwt_token
LANGUAGE plpgsql
AS $$
DECLARE
  _role name;
  result basic_auth.jwt_token;
BEGIN
  -- check email and password
  SELECT basic_auth.user_role(email, pass) INTO _role;
  IF _role IS NULL THEN
    raise invalid_password using message = 'invalid user or password';
  END IF;

  SELECT sign(
      row_to_json(r), 'fkajs;dlkfjieondskj82naj8jkldjkldas87'
    ) AS token
    from (
      SELECT _role AS role, login.email AS email,
         extract(epoch from now())::integer + 60*60 AS exp
    ) r
    into result;
  return result;
END;
$$;

INSERT INTO basic_auth.users VALUES ('admin@domain.com', 'CHNAGME123', 'edituser');
INSERT INTO basic_auth.users VALUES ('edit@domain.com', 'CHNAGEME12', 'edituser');
INSERT INTO basic_auth.users VALUES ('read@domain.com', 'CHANGEME1', 'readuser');



-- The anon role should be supplied to PostgREST in its config file.
-- It can be the public role that does not read the database at all.
CREATE ROLE anon;
CREATE ROLE authenticator noinherit;
GRANT anon TO authenticator;

GRANT usage ON SCHEMA public, basic_auth TO anon;
GRANT SELECT ON TABLE pg_authid TO anon;
GRANT SELECT ON TABLE basic_auth.users TO anon;
GRANT EXECUTE ON FUNCTION login(text,text) TO anon;



-- -- Grant readuser ability to login when doing a publicy readble database
-- GRANT readuser TO authenticator;
-- GRANT usage ON SCHEMA public, basic_auth TO readuser;
-- GRANT SELECT ON TABLE pg_authid, basic_auth.users TO readuser;
-- GRANT EXECUTE ON FUNCTION login(text,text) TO readuser;
