-- Fix9 Issue Register System
-- Run this script once to set up the database

CREATE DATABASE IF NOT EXISTS fix9_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fix9_db;

CREATE TABLE IF NOT EXISTS users (
  userid      INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  password    VARCHAR(255)  NOT NULL,          -- bcrypt hash
  image       LONGTEXT      DEFAULT NULL,      -- base64 string or URL
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (userid),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
