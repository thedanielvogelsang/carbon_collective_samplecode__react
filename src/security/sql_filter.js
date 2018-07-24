// a javascript filter to protect sql injection attack vector
// ruby backend may have vulnerabilities so let's prevent any malicious code from making it out of the client
// SQL injection attacks have some standard components such as ' ; ', ' = ', ' " ' or ' ' ' characters, so we want
// to filter those out as necessary

function word_filter(str) {
    //This filter is used for sanitizing input on names and other text. It will not allow names with apostrophes but will allow hyphens.
    //Returns only the first substring if the string has spaces or other whitespace characters.
    var pattern = /[-a-zA-Z]*/;  //create a regular expression that matches only alphabetical and hyphen characters
    var sanitized_str = str.match(pattern); //wrap the regex wrapper over the unsanitary input
    return sanitized_str;
}

function num_filter(str) {
    //This filter is used for sanitizing numerical input. It only allows inputs of the form xxx or xxx.xxx where xxx is any number of digit characters
    var pattern = /[0-9]*\.?[0-9]*/; //this regex matches any amount of digits possibly followed by a single decimal point then any number of digits after
    var sanitized_input = str.match(pattern);
    return sanitized_input;
}

function email_filter(str) {
    //This filter finds only email patterns of the form provided by the W3C (World Wide Web Consortium)
    var pattern = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;
    var sanitized_input = str.match(pattern);
    return sanitized_input;
}

function password_filter(str) {
    //Returns whether or not the given string passes a check against malicious characters
    var result = false;
    var pattern = /[^\s.'"|;=+{}\\\*\./,<>]*/;
    var sanitized_input = str.match(pattern);
    if (sanitized_input == str) result = true;
    return result;
}
