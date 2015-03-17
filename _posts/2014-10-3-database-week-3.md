---
title: C# SqlClient Classes
excerpt: "Our database class is now working in visual studio with the C# SqlClient package.  We will be using the special classes like the SqlDataAdapter, DataSet, DataTable, DataReader, SqlConnection and more."
layout: post
published: false
---
We will now be working on some real projects in Visual Studio.  

Create a new adbo .net project in VisualStudio

```c#
using System.Data.SqlClient; // Add this line

namespace dbexample {
	class Program {
		static void Main(string[] args) {
		
		}
	}
}
```

We will be using a few special classes.

#### SqlDataAdapter
Uses SQLCommands (another class) to populate, insert, update, or delete a dataset.

#### DataSet
Collection of data tables.  If the result from a query is multiple tables, it gets stuffed in a DataSet.

#### DataTable
Stores the data from a query if it comes from one table.

#### DataReader
A class that only provides read access to the query results.  Read-only, forward processing.  Very fast at processing data.

#### SqlConnection
Establishes the connection to our database.

-------

So first things first.  Make a connection string for the SQLConnection class to consume.
```c#
// For the data source name, right click server name, go to server properties, general, then name
static string strConnection = @"Data Source=Win-1pdffdfjiefja34234; Initial Catalog=PizzaDb; Integrated Security=SSPI;";

SqlConnection sqlConn = new SqlConnection(strConnectionString);

```

Cool, now in the main method, we can query some data.
```c#
	DataTable dt = new DataTable();
	SqlDataAdapter sql;
	SqlCommand command;
	command = new SqlCommand("SELECT * FROM eats");
	sql = new SqlDataAdapter(command, sqlConn);
	sql.Fill(dt);
	
	foreach(DataRow dr in dt.Rows) {
		foreach (DataColumn dc in dt.Columns) {
			Console.WriteLine(dr[dc]);
		}
	}
```

#### The sql.Fill(dt) method

This thing opens the connection, executes the query, fills the dt with the results, then closes the connection.

### Adding a record with the adapter

```c#
comm = new SqlCommand("INSERT INTO Person (name, age, gender) VALUES ('james', '24', 'm')", sqlConn);

sqlConn.open();
sql.InsertCommand = comm;
sql.InsertCommand.ExecuteNonQuery();
sqlConn.close();

// you can also do sql.DeleteCommand.ExectueNonQuery();
// or sql.UpdateCommand.ExecuteNonQuery();
```

You will mostly be using `Fill()` and `ExecuteNonQuery()` in your code.

You have to explicitly open your connection for `ExecuteNonQuery()`.



