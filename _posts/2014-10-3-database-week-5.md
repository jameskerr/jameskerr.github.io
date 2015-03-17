---
title: Aggregate Functions & Stored Procedures in C#
excerpt: Database Class at Chapman University moves on to discuss creating stored procedures in a SQLServer Management Studio, then how to call them in a c# application.
layout: post
published: false
---

### Aggregate Functions

```sql
ORDER BY
SELECT DISTINCT
COUNT
AVG
SUM

SELECT name, count(pizza) count
FROM eats
GROUP BY name
ORDER BY name ASC
```

When ever you have an aggregate function, you need a group by.  HAVING is like a WHERE for a GROUP BY.

### Stored Procedures
It's basically a method in your procedure.

```sql
CREATE PROCEDURE [dbo].[GetAllEats]
AS
SELECT * FROM Eats
```

Then to use it in a C# application

```c#
comm = new Command("exec GetAllEats", sqlConn);
sql.SelectCommand.CommandType = CommandType.StoredProcedure;
sql.Fill(dt);
```

Once the stored procedure exists, you have to change the keyword from `CREATE` to `ALTER`.

```sql
ALTER PROCEDURE [dbo].[GetAllEats]
AS

SELECT name,pizza FROM Eats
```

Add parameters to your stored procedure.

```sql
ALTER PROCEDURE [dbo].[GetAllEats]
@name varchar(20)
AS

SELECT name,pizza
FROM Eats
WHERE name = @name;
```

Your can test it out in the query window like so
`GetAllEats 'james'`

Then in C#

```c#
comm = new Command("exec GetAllEats", sqlConn);
sql.SelectCommand = comm;
sql.SelectCommand.CommandType = CommandType.StoredProcedure;
sql.SelectCommand.Parameters.AddWithValue("@name", "rene");
sql.Fill(dt);
```

### SubQueries

```sql
SELECT * FROM Person
WHERE name IN (SELECT name FROM Person WHERE gender='male');
```

Usually checking one attribute in an IN.  Usually subqueries are used with INs.

### SQL Injections

How to protect yourself with C# code.

```c#
public string escapeSql(string input) {
	return input.Replace("'", "''");
}
```