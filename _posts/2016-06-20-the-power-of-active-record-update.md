---
layout: post
title: The Power of ActiveRecord's '#update'
excerpt: We all strive to keep our controllers skinny. The first sign of a fattening controller is commonly in the update action.  This action is responsible for updating a record in the database based on parameters passed in from a form or ajax (the mythological Greek hero).
published: true
categories: Ruby Rails ActiveRecord
---

We all strive to keep our controllers skinny. The first sign of a fattening controller is commonly in the `update` action.  This action is responsible for updating a record in the database based on parameters passed in from a form or ajax (the [mythological Greek hero](https://en.wikipedia.org/wiki/Ajax_%28mythology%29)).

In this post, the data will model a country.  Let's use the rails generator to scaffold a controller for us.

```bash
rails generate scaffold_controller Country
```


```ruby
# countries_controller.rb

  # PATCH/PUT /countries/1
  # PATCH/PUT /countries/1.json
  def update
    respond_to do |format|
      if @country.update(country_params)
        format.html { redirect_to @country, notice: 'Country was successfully updated.' }
        format.json { render :show, status: :ok, location: @country }
      else
        format.html { render :edit }
        format.json { render json: @country.errors, status: :unprocessable_entity }
      end
    end
  end
```

This is the most complex action rails generates for us.  Look at all it does already:

1. Validates the model before updating
2. Updates the model
3. Handles a successful update by rendering the `show` view
4. Handles failure by rolling back the changes and rendering the errors
5. Responds to both `json` and `html` request formats

Considering all it does with only eight lines of code, I deem it beautiful.  We must take action to defend said beauty.  The following three feature requests will attempt to attack this action, but if we understand rails and the power of the `update` method, we can keep this looking like it was just generated.

## Request #1
__A country has a "government_type" attribute that needs to default to "anarchy" if not specified in the form/ajax.__

The sad solution is to modify the `params` hash before passing it to update.

```ruby
def update
  params[:government_type] ||= "anarchy"

  respond_to do |format|
      if @country.update(country_params)
    # ... the same
```

Even worse...

```ruby
def update
  if params[:government_type]
    params[:government_type] = "anarchy"
  end

  respond_to do |format|
      if @country.update(country_params)
    # ... the same
```

Instead, add a default column to the database.  This ensures that every time you create a new country, it gets the default `government_type`.  The migration might look like this.

```bash
rails generate migration add_default_government_type_to_country
```

Then open up the new file and add...

```ruby
# db/migrate/add_default_government_type_to_country.rb

class AddDefaultGovernmentTypeToCountry < ActiveRecord::Migration

  def change
    change_column :countries, :government_type, :string, { default: "anarchy", null: false }
    #              table^      column^           type^          options^

    # Note: In ruby methods, the brackets {} for a
    #       hash are optional if they are the last
    #       argument in the method definition.  It
    #       took me a year to figure that out.  So
    #       the options at the end could have been
    #       written like default: 88, null: false
    #       Way more sexy. Way more "Ruby".
  end

end
```

After migrating your database with `rake db:migrate`, you are good to go with consistent defaults everywhere, including your skinny controller.

## Request #2
__The form submits a comma-separated string for a country's flag colors, but the database expects an array of strings.__

We live in the future.  Our relational database allows us to store an array in a column.  Our javascript dropdown library submits a comma-separated string to the rails back-end and its too hard to try to fit it into an array style param.

One might be tempted to write something like...

```ruby
def update
  params[:flag_colors] = params[:flag_colors].to_s.split(',')

  respond_to do |format|
    if @country.update(country_params)
    # ... the same
```

However, if we check out what `update` is actually doing, we see that it is looping through each `key => value` in the `country_params` hash.  Then it tries to send `"#{key}="` to `@country`, passing in `value` as an argument.

For example, if the params hash looked like this,

```ruby
{
  name: "USA",
  government_type: "democracy",
  flag_colors: "red,white,blue"
}
```

the update method would effectively be doing this...

```ruby
@country.name=("USA")
@country.government_type=("democracy")
@country.flag_colors=("red,white,blue")
```

This means that if we override the County Class's `flag_colors=` method, we'd be able to avoid fattening our controller.

```ruby
# models/country.rb

def flag_colors=(value)
  if value.is_a? String
    super value.split(',')
  else
    super
    # Note: Calling super with no arguments or parenthesis
    #       will call the old `flag_colors=` method with the same
    #       exact arguments that were passed in to this new
    #       one we just defined.  Nifty.
    #
    #       Also, always be sure to retain original behavior
    #       when overriding a setter, hence calling super.
  end
end
```

Nice, now we don't have to change the glorious update action.

## Request #3
__We must now be able to add citizens to a country through the form.__

You can imagine the front-end team made a super nice UI widget that allows public servants to add or update citizens in a country.  This gets tricky and there are many ways to handle these associations.  Lets enumerate through the options we have.

__After we update the country, add the citizens?__

```ruby
def update
  respond_to do |format|
    if @country.update(country_params)
    citizen_params.each do |citizen|
      citizen = Citizen.find_or_initialize(citizen[:id])
      @country.citizens << citizen
    end
  # same same
```

Aww, I don't like this because now I need to wrap this all in a transaction because what if one fails, and then I need to collect a custom array of error messages in case one of the citizen update fails... and ... and ... and ... code ... code ... code.

__Create a separate action the just handles updating the citizens?__

```ruby
def update_citizens
  @country = Country.find(:id)
  citizen_params.each do |citizen|
    citizen = Citizen.find_or_initialize(citizen[:id])
    @country.citizens << citizen
  end
end
```

I don't like creating non-default actions in my controllers. And what about error handling?  Besides, our fearless leader [DHH says stick to the default CRUD actions](http://jeromedalbert.com/how-dhh-organizes-his-rails-controllers/).

__Use accepts_nested_attributes_for and don't touch the controller?__ *YES, Winner!*

Rails provides a built-in way for us to create, update, and delete children objects through the parent.  It requires that we add a one line to the parent model and format our params a special way.

```ruby
# models/country.rb

class Country < ActiveRecord::Base
  has_many :citizens
  accepts_nested_attributes_for :citizens, allow_destroy: true # Add this one line
end
```

Now make sure your params hash has the key `citizens_attributes` (the plural name of the child model followed by "_attributes") which is an array of the children's attributes to update.  For example...

```ruby
# puts country_params
{
  name: "USA",
  government_type: "Democracy",
  citizens_attributes: [
    {
      id: 33, # The presence of an :id key
              # will update an existing citizen.
      name: "Bernie Sanders",
      age: 150
    },
    {
      # The lack of an :id key
      # will create a new citizen.
      name: "Baby Jane",
      age: 0
    },
    {
    id: 105,
    name: "Edward Snowden"
    _destroy: "1" # Setting the :_destroy key to "1"
                  # will destroy a citizen.
  }
  ]
}
```

The comments above show that you can control creation, updation (it's a word I just made up), and deletion all with the params.  The controller remains untouched.

I've found this to be very useful in my rails experience, however, it can be taken too far.  Please don't attempt to update everything in the database through one model. It can be much better to hit another resource's controller.  In this case, we could create a Citizens controller and pass the `country_id` to the create action.  The choice is yours, but at least now you are armed with the knowledge of what `update()` can do for you.

Please share with me other approaches you've discovered to keep a controller update action simple.
