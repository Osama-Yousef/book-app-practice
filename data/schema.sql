DROP TABLE IF EXISTS bookstable ;
CREATE TABLE bookstable(

id SERIAL PRIMARY KEY ,
title VARCHAR(255),
author VARCHAR(255),
bookshelf VARCHAR(255),
isbn VARCHAR(255),
description TEXT ,
image VARCHAR(255)

);