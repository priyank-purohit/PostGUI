-- Used to keep track of changes made to the db.
-- TODO: create a PostgreSQL db trigger that does this instead of using API calls to achieve this.
-- Priyank Purohit, 2018


-- Creates a table to keep track of changes
DROP TABLE IF EXISTS change_log;
CREATE TABLE change_log (
p_id SERIAL PRIMARY KEY,
change_timestamp timestamp NOT NULL,
table_changed TEXT NOT NULL,
primary_key_of_changed_row TEXT NOT NULL,
column_changed TEXT NOT NULL,
old_value TEXT NOT NULL,
new_value TEXT NOT NULL,
notes TEXT,
user_name TEXT NOT NULL
);


-- Allow the edit user to do only insertions to the change_log
-- It is also possible to make this change_log invisible to edit users by revoking SELECT on change_log to edituser.
REVOKE ALL ON TABLE change_log FROM edituser;
GRANT SELECT, INSERT ON TABLE change_log TO edituser;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO edituser;
