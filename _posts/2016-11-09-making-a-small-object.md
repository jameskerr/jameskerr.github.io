---
layout: post
title: Complex Sorting in ActiveRecord
excerpt: The thought process behind creating a simple object to help deal with complex ActiveRecord ORDER BY queries with a strong focus on the Single Responsibility Principal.
published: true
categories: SQL Ruby ActiveRecord
---

I get excited about small objects when I program. I often open up files that are hundreds of lines long with mixed responsibilities and lots of complexity. I recently had an opportunity to make a small object with a single responsibility. The object would be used to build the SQL fragment that gets passed as a parameter to ActiveRecord's `.order()` method.

[ActiveRecord's order method](http://guides.rubyonrails.org/active_record_querying.html#ordering
) will take multiple string sql fragments as the arguments like so:

```ruby
User.order('name DESC, email')
# => SELECT "users".* FROM "users" ORDER BY name DESC, email 
```

My table of data had several columns that the user could order by. Like in an Excel spreadsheet, they wanted the ordering of previous columns to persist when ordering by a new column.

For example, if I first ordered by name, then ordered by location, the table should first be ordered A-Z by location, then A-Z by name.

Something like this:

```
| Name    | Location | Hire Date |
+---------+----------+-----------+
  Andy    | Alabama  | 10/10/2016
  Anthony | Alabama  | 09/12/2014
  Betty   | Alabama  | 05/22/2015
```

There were also subtle differences with how we handled `NULL` values that needed to be addressed.

Normally, null values appear first when a column is sorted ascending. We wanted this reversed, appearing last when ascending and first when descending. The exception to the rule was the hire date column, where we wanted the nulls to show up first when ascending and last when descending.

The PostgreSQL syntax to do this is simply to supply `NULLS FIRST` or `NULLS LAST` to the statement.

Unfortunately, there were some empty strings in the location column that we wanted to treat the same as nulls.

The syntax for this in PostgreSQL is pretty simple as well `NULL_IF(column_name, value)`. In our case, `NULL_IF(location, '')` would do the trick.

If the user asked to order first by **name** *ascending* then by **hire_date** *descending* then by **location** *descending*, the client would pass up parameters that look like this:

```json
{
  "sort_orders": [
    { "by": "name",      "direction": "asc" },
    { "by": "hire_date", "direction": "desc"},
    { "by": "location",  "direction": "desc"}
  ]
}
```

Based on these params, I needed to somehow generate code that looks like this:

```ruby
query.order(
  "name ASC NULLS LAST",
  "hire_date DESC NULLS LAST",
  "NULL_IF(location, '') DESC NULLS FIRST"
)
```

I decided to make a small object called `OrderBy`. It is used like this:

```ruby
OrderBy.new("location", nulls: :reversed, null_if: "").to_sql
# => "NULLIF(employees.job_location, '') ASC NULLS LAST"
```

Its implementation is small and simple.

```ruby
class OrderBy
  attr_accessor :direction

  def initialize(column, direction: :asc, nulls: nil, null_if: nil)
    @column    = column
    @direction = direction
    @nulls     = nulls
    @null_if   = null_if
  end

  def to_sql
    fragments = [column_sql, direction_sql, nulls_sql]
    fragments.compact.join ' '
  end

  private

  attr_reader :column, :nulls, :null_if

  def column_sql
    if null_if
      "NULLIF(#{column}, '#{null_if}')"
    else
      column
    end
  end

  def direction_sql
    direction.to_s.upcase
  end

  def nulls_sql
    if nulls == :reversed
      asc? ? 'NULLS LAST' : 'NULLS FIRST'
    end
  end

  def asc?
    direction.to_s.downcase == 'asc'
  end
end
```


The controller would use the objects like so:

```ruby
ORDER_BY_MAP = {
  'name'      => OrderBy.new('name',     nulls: :reversed, null_if: ''),
  'location'  => OrderBy.new('location', nulls: :reversed, null_if: ''),
  'hire_date' => OrderBy.new('hire_date')
}

def index
  query.order(*order_by_args)
end

private

def order_by_args
  permitted_params[:sort_orders].map do |param|
    order_by_object           = ORDER_BY_MAP[param[:by]]
    order_by_object.direction = param[:direction]
    order_by_object.to_sql
  end
end

def permitted_params
  params.permit(orders: [:by, :direction])
end
```

At the end of this, I have a small object that can be re-used anytime I need to order something in a non-trivial way. It has a single responsibility, it is easy to test, and it is comprehensible to the next developer that reads it.
