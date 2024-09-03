-DOINGS 
    validate a input string; Password

-RESPONSIBILITIES/KNOWINGS && EXAMPLES UNDER KNOWINGS
    password is bw 5 to 15 char long
    ("mom") not valid
    ("mom555") is valid

    containes at least one digit
    ("mommy") not valid
    ("mommy1) is valid 

    containes at least 1 upper case letter
    ("mommy12") not valid
    ("Mommy1") is valid

    Return an object containing a boolean result and an errors key that — when provided with an invalid password — contains an error message or type for all errors in occurrence. There can be multiple errors at a single time.

