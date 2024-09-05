DESCRIPTION
    Create a boolean calculator that takes a boolean expression (as a string) and evaluates it to compute the correct output boolean result

RESPONSIBILITIES
    -Turns "TRUE" to true
    -Turns "FALSE" to false
    -Turns "NOT TRUE" to false
    -Turns "NOT FALSE" to true
    -Turns "TRUE AND FALSE" to false
    -Turns "TRUE AND TRUE" to true
    -Knows the order of precendence is "NOT" then "AND" then "OR"
    -Knows to evaluate the expressions in parathensis first

EXAMPLES
    -"TRUE" -> true
    -"FALSE" -> false
    -"NOT TRUE" -> false
    -"NOT FALSE" -> true
    -"TRUE AND FALSE" -> false
    -"TRUE AND TRUE" -> true
    -"(TRUE OR TRUE OR TRUE) AND FALSE" -> false 
    -"NOT (TRUE AND TRUE)" -> false