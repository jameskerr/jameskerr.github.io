---
published: false
layout: post
date: 2014-09-04 20:06:00
title: "Database Definition & SQL Intro"
excerpt: "A good database system needs to allow a user to create a database, provide the ability to query data, insert data, set up permissions and handle lots of transactions.  Good databases should follow the principles of ACID (Atomicity, Consistency, Isolation and Durability."
categories: database class notes
---

> **Database**: *Collection of data*

### Database Management System (DBMS)

A good one needs to:

1.	Allow a user to create a database
2.	Ability to query data, and insert data
3.	Support for large amount of data
4.	Assign multiple users with permissions
5.	Must support high volume of transactions

------------

### ACID

All good database systems have these attributes.*

> **Atomicity** : *all or nothing*

> **Consistency**: *all the data written to the database follows certain guidelines*

> **Isolation**: *each transaction should be isolated from other transactions*

> **Durability**: *a transaction is never lost*

-------------

ACID


### Relational Database Management System (RDBMS)
Database:
1. Tables (relation)
	A) Rows (tuple)
	B) Columns(attributes)

**Relation Scheme**: `Account(account_number, balance)`
**Key**: Unique identifier for a row (tuple)
**Database Schema**: set of all relations in the database

> Whenever something is underlined in a relation scheme, that means that it is a key.

--------

### SQL: *Structured Query Language*

#### Common Operands

**SELECT** : Retrieves tuples from the relation

**INSERT**: Creates a new tuple in the relation

**UPDATE**: Modifies a tuple in the relation

**DELETE**: Removes a tuple from the relation


```sql
-- Create a table --
CREATE TABLE table_name (
	account_number INT,
	balance FLOAT
);
-- Select from table --
SELECT <attributes> FROM <relation>;
```

### **Homework** - September 9 ###

```yaml
Read: Chapter 1 and 2 (Skip anything about xml)
Setup: AdventureWorks Database in SQLServer
```


