---
title: Relational Algebra 101
excerpt: "This week the class discovers the brave new world of relational algebra.  We learn about selection, projection, logical conjunctions (AND), logical disjuntions (OR) and more."
categories: database class
date: 2014-09-09 17:30:00
layout: post
published: false
---

### σ - Selection
Selection
: Selects a subset of tuples (rows)

```sql
SELECT LoginId, JobTitle, Birthdate
FROM HumanResources.Employee
WHERE JobTitle = 'Design Engineer'
```

### π - Projection
Projection
: Selects a subset of attributes (columns)

```sql
SELECT LoginId, JobTitle, Birthdate
FROM HumanResources.Employee
```

### ∧ Logical Conjunction (AND)
Logical Conjunction
: Where all conditions are true

```sql
SELECT LoginId, JobTitle, Birthdate, Gender
FROM HumanResources.Employee
WHERE JobTitle = 'Production Technician - WC60'
AND Gender = 'F';
```


### ∨ Logical Disjunction (OR)
Logical Disjunction
: Where any one of the conditions are true

```sql
SELECT LoginId, JobTitle, Birthdate, Gender
FROM HumanResources.Employee
WHERE (JobTitle = 'Production Technician - WC60'
AND Gender = 'F') OR JobTitle = 'Design Engineer';
```

### Cross Products
Concatenating all the tuples in two relations

#### R1
Col 1 | Col2
------|------
A | B
C | D

#### R2
Col 1 | Col2
------|------
E | F
G | H

#### R3 (R1 X R2)
R1-Col 1 | R1-Col 2 | R2-Col 1 | R2-Col 2
--|---|---|---
A | B | E | F
C | D | G | H


### θ Theta Join
Concat the two tables then apply the conditions.  Doesn't care about the attribute names, so long as they both equal each other.

### Natural Join

The attributes names are identical, and you get rid of one so there is no duplicate attributes in the result.


* Equating attributes of the same name, and
* Projecting out one copy of each pair of equated attributes

### ρ Rho Operator
ρR1(A1,..An)
Renaming the attributes in the selection.  Creating an alias.

### Possible Quiz Topics
1. Convert the relational algebreaic expressions into SQL and vice versa

### Assignment 1

Sigma, Pi, and Rho have the hightest priority

1. Open up SQL Studio
2. Write the query
3. Translate to Relation Algebra