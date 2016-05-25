public class MyProgram {

    /**
     * This is an exemplary description
     * and there should be no line break before this line.
	 *
	 * But in front of this line, there should be a line break
	 * because we interpret the double newline in the source as one.
	 * <p>
	 * The single p-tag should force this to be preceded by a line
	 * break as well.
	 * <p>
	 * Wrapping in p-tags with closing tag should be possible, too,
	 * and make no difference to the single p-tag ...
	 * </p>
	 * Except for this text which will have a line break
	 * before, of course.
     *
     * @param  one    the first parameter (type is always inferred)
     * @param       two the second parameter (type is always inferred)
     * @param    three the third parameter (type is always inferred)
     *          second line for third parameter
     * @return some arbitrary return value (with inferred type)
     * @author John Doe (john.doe@example.org)
     * @author Jane Doe (@jane)
     * @license     GPL
	 * @since       1.0
	 * @see         otherFunc
     */
    function myFunc(int one,
                    String two,
                    Object... three) {
        // do something
    }

    /**
     * Comments that do not precede any function, class or variable are ignored
     */

    /**
   * You can document classes as well (and docs may have wrong indentation)
      */
    public class MyClass {

        // some members and methods

    }

    /** The description may even be single-line and followed by a blank line */

    private static Object boringFunc()
    {
        return null;
    }

    /** @private */ String privateVariable = "";

    public static void main(String[] args) {
        // because we always need this
    }

}
