CREATE DATABASE todoapp1;

CREATE TABLE todos1 (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255) ,
    title VARCHAR(30) , 
    progress INT , 
    date VARCHAR(300) 

);

    CREATE TABLE users1 (
        email VARCHAR(255) PRIMARY KEY,
        hased_password VARCHAR(255)
    );
