# Documentation

## `function myFunc(int one, String two, Object... three)`

This is an exemplary description and there should be no line break before this line.

But in front of this line, there should be a line break because we interpret the double newline in the source as one.

The single p-tag should force this to be preceded by a line break as well.

Wrapping in p-tags with closing tag should be possible, too, and make no difference to the single p-tag ...

Except for this text which will have a line break before, of course.

 * **Parameters:**
   * `one` — the first parameter (type is always inferred)
   * `two` — the second parameter (type is always inferred)
   * `three` — the third parameter (type is always inferred)

     second line for third parameter
 * **Returns:** some arbitrary return value (with inferred type)
 * **Author:**
   * John Doe (john.doe@example.org)
   * Jane Doe (@jane)
 * **License:** GPL
 * **Since:** 1.0
 * **See also:** otherFunc

## `public class MyClass`

You can document classes as well (and docs may have wrong indentation)

## `private static Object boringFunc()`

The description may even be single-line and followed by a blank line

## `String privateVariable = ""`

 * **Private**
