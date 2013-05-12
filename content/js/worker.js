self.onmessage = function(event) {

    var action = self.getFunc(event.data.action);
 
    //Execute the newly-defined action and post result back to the callee
    self.postMessage(action(event.data.args));
    
    self.close();

}

//Gets a Function given an input function string.
self.getFunc = function (funcStr) {
    //Get the name of the argument. We know there is a single argument
    //in the worker function, between the first '(' and the first ')'.
    var argName = funcStr.substring(funcStr.indexOf("(") + 1, funcStr.indexOf(")"));
 
    //Now get the function body - between the first '{' and the last '}'.
    funcStr = funcStr.substring(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
 
    //Construct the new Function
    return new Function(argName, funcStr);
}