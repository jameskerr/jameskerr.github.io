---
layout: post
title: Android Activities, Widgets, Logs & Manifests
excerpt: In week 2 of Android Development at Chapman University, we discuss concepts like the Activity Life Cycle, views, widgets, logs and manifests.
published: false
categories: android
---

### Activities
>**Definition**: The difference "views" of android apps.

In the file structure, they are ClassName.java.  All activities that you create will inherit from Androids `Activity` class.  Here are [the docs](http://developer.android.com/reference/android/app/Activity.html) for that class.

```java
// LoginActivity.java
public Class LoginActivity extends Activity {
}
```


#### The Activity Lifecycle

- onCreate()
- onStart()
- onRestart()  
- onResume()
	- Now the app is running
- onResume()
- onPause()
	- Maybe someone called and we need to switch to the phone
- onStop()
	- Returns to the onRestart 
- onRestart()
- onDestroy()

Every Activity is also a Context.  Activity extends Context.

```java
public class ChapmanZoo extends Activity {
	private TextView tv;
	
	@Override
	protected void onCreate(bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		tv = new TextView(this);
		tv.setText("Welcome to the Zoo!");
		setContentView(tv);
	}
}
```
### The Android Manifest

>**Definition**: An xml file that has all data about the app.  

### Logging

Best thing to learn early on is how to do smart logging.

```java
private static string TAG = "ChapmanZoo";

Log.e(TAG, "Message to Log");
```

Learn more about [the Log class](http://developer.android.com/reference/android/util/Log.html).


### Widgets

Widget
: Anything that you can interact with in an activity like button, text field, text box...

Take for example, a button.  A button is simply a class in Java that extends `TextView` which extends `View`.  You can create a button using `Button b = new Button(this); // this being the Activity context`  If you wanted to set the text of this new button you created, you can call `b.setText("OK!");`  For a full example,

```java
public class SampleScreenActivity extends Activity {
	Button b;
	
	@override
	onCreate() {
		b = new Button(this);
		b.setText("OK!");
	}
}
```

You can also define a view in XML.  Doing it this way is called declarative, rather than programatic (like above).  Everything you can do programmatically, you can also do with XML.  And, you can access everything you need in the XML.  Here is an example of setting the text of a button using xml.

```xml
<Button
	android:id="@+id/my_button"
	android:layout_width="wrap_content"
	android:layout_height="wrap_content"
	android:text="OK!" />
```

> If you have a simple static GUI, just use XML.  However, if you have dynamic content in your Activity, then you will need to do things programatically.