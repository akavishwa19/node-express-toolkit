const CREATE_MIGRATION_TABLE = `
create table if not exists migrations(
    version int primary key,
    name varchar(36),
    created_at timestamp default current_timestamp
);
`;

const FETCH_APPLIED_MIGRATIONS = `
select version,name from migrations
order by created_at desc;
`;

const UPDATE_MIGRATIONS = `
insert into migrations (version,name) values( ?, ? );
`;

const CREATE_TABLE_USERS = `
create table if not exists users(
    id varchar(36) primary key,
    username varchar(50) unique,
    email varchar(100) unique,
    password varchar(100),
    age int,
    created_at timestamp default current_timestamp,
    updated_at timestamp default null on update current_timestamp ,
    is_active boolean default true
);
`;

const ADD_PHONENUMBER_FOR_USERS = `
alter table users 
add phone varchar(36)
`;

const REMOVE_PHONENUMBER_FOR_USERS = `
alter table users 
drop phone
`;

export {
  CREATE_MIGRATION_TABLE,
  CREATE_TABLE_USERS,
  FETCH_APPLIED_MIGRATIONS,
  UPDATE_MIGRATIONS,
  ADD_PHONENUMBER_FOR_USERS,
  REMOVE_PHONENUMBER_FOR_USERS
};
