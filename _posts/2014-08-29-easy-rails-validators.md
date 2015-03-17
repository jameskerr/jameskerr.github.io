---
layout: post
title: Easy Custom Rails Validators
excerpt: I Googled 'custom rails date validation' and found a gem and a cool Validator ruby class. But rather than add yet another dependency to this app or create another file, I found a very simple solution tucked away deep in the rails guides...
published: true
photo: /images/rails-validations.png
categories: Ruby Rails
---

I have a simple problem.  I am working on an app that has an Event model (the kind of things that human beings attend).  The model has start_time and end_time attributes.  Naturally, I want to prevent users from creating time travel events where the start_time is after the end_time.

I Googled "custom rails date validation" and found a gem and a cool Validator ruby class. But rather than add yet another dependency to this app or create another file, I found a very simple solution tucked away deep in the [rails guides](http://guides.rubyonrails.org/active_record_validations.html "Rails Guides") (See section 6.2).

First off, it would be useful to know what makes an ActiveRecord object invalid.  Turns out, all you need to do it add a string to the obejct's errors hash.  Easy!

{% highlight ruby %}
event.errors[:start_time] << 'No time traveling events!'
# Boom, that event is now invalid.

# You can also use the accessor method like so...
event.errors.add(:start_time, 'No time traveling events!')
{% endhighlight %}

Ok, good to know.  Another good thing to know is that the rails ```validate``` method takes a symbol method name as a parameter that will be called upon validation.  See where this is going?

{% highlight ruby %}
# event.rb
validate :time_travel_is_illegal
{% endhighlight %}

So now we can simply define the method in the same file.

{% highlight ruby %}
# event.rb
def time_travel_is_illegal
  if start_time.present? && end_time.present?
    if start_time > end_time
      errors[:base] << 'This is definitely not allowed in this universe'
    end
  end
end
{% endhighlight %}

Adding an error to the ```:base``` key simply means that the error is for the entire object, rather than for a specific attribute.

I like this solution because I didn't add tons of extra code and my friends can easily read what is going on.

Thanks rails for making custom validation easy.

Sincerely,
James Kerr