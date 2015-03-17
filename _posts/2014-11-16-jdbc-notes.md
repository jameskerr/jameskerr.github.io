---
layout: post
title: JDBC Notes
categories: Java, Database, Notes, Class, Chapman
date: 2014-12-4 07:00:00
published: false
---

### Java Database Connectivity (JDBC)

Wrapper for the ODBC.  JDBC ODBC bridge

```sql
import java.sql.*;
```


### Open Database Connectivity (ODBC)


### Making a Connection

```
Class.forName(com.mysql.jdbc.Driver);
Connection connection = DriverManager.getConnection(...);
```

### Statements

Statement: anobject that can accept a string that is a SQL statement and can execute such a string.

PreparedStatement: an object that has an associated SQL statement ready to exectue.


Statements are for DDL commands while PreparedStatments are for everything else.

### Creating Statements

```
Statement s1 = connection.createStatement();
PreparedStatement s2 = connection.prepareStatement(
  "SELECT * FROM restaurants WHERE bar = 'james kerr'"
);
// createStatement with no args retuns a statement, with one argument retuns a prepared statment
```

### Executing SQL Statements

JDBC distinguishes quiries from modifications, which it calls "updates."

Statement and PreparedStatement each have bethods executeQuery and executeUpdate.

Store things in a result set.  Results set start at index number 1 not 0.  The result set is kind of like a cursor.  It has a `next()`  method that will advance to the the thing cursor to the text.  If we want to grab an attribute, use getX(i) where X is the datatype and i is the component number. For example:

```
table(id, name, gpa)
getString(2);
getInt(1);
getFloat(3);
```


### Update Example

```
statement.executeUpdate(
 "INSERT INTO restaurants WHERE id=Awesome"
);

// Or......

PreparedStatement ps = connection.prepareStatement("Insert into Person(Name, Age) VALUES(?,?)");
ps.clearParameters();
ps.setString(1, "James Kerr");
ps.setInt(2, 24);
ps.executeUpdate();
```

### Query Example

```
ResultSet menu = statement.executeQuery();
```

### Called Statement

callInsert = connection.prepareCall("Exec [dbo].[getAllFood] ?, ?, ?, ?")
callInsert = setString(1, "food")
//...
callInsert.registerOutParameter(4, java.sql.Types.INTEGER);
int id = callInsert.getInt(4);