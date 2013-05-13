<!DOCTYPE html>
<html>
  <head>
    <title>Client-side MapReduce with Web Workers</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!-- Bootstrap -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen"/>
    <link href="bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet" media="screen"/>
    <link href="content/css/style.css" rel="stylesheet" media="screen"/>
  </head>
  <body>
    <script src="http://code.jquery.com/jquery-2.0.0.min.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
    <div class="container">

      <div>
        <h1>Client-side MapReduce with Web Workers!</h1>
        <p class="lead">This is a model to assist system to run with large data set in parallel on the client side. We call it Client-side MapReduce with Web Workers (CMRW2). This model inherits the design philosophy from the server-side MapReduce and applies the client-side Web Worker technology. However, the implementation environment is different. Rather than server-side MapReduce that is executed on clustered servers and implemented in distributed systems [30], this CMRW2 runs in a single browser client. The goal of CMRW2 is to enhance the local capability for performing complex data- related tasks.</p>
      </div>

      </hr>
      
      <div class="row-fluid">
      <div id="settings" class="span6">
       <h3>Find Triangular Number</h3>
       
          <p><span>Task: </span>
                <select id="task" onchange="Task.changeTask()">
                  <option value="triangular">Find Triangular Number</option>
                  <option value="prime">Find Primes</option>
               </select> </p>
          <p><span>Method: </span><select id="method">
                  <option value="ui_thread">UI Thread</option>
                  <option value="mapreduce_thread">MapReduce with UI Thread</option>
                  <option value="webworker">Web Worker</option>
                  <option value="cmrw2">CMRW2</option>
               </select></p>
       <p><span>Data From: </span><input id="from" type="number" value="1"/></p>
       <p><span>Data To: </span><input id="to" type="number" value="1000000"/></p>
       <p><span>Number of Processes: </span><input id="map" type="number" value="10"/></p>
       <a class="btn btn-large btn-success" href="javascript:Task.init()">Start</a>
       <progress class="hidden"  max="100">
       </div>
       
       
       <div id="result" class="span4 hidden">
              
              <p>
                Total Found: <span id="total"></span>
              </p>
               <p>
                Total Time Cost: <span id="time"></span> millionseconds
              </p>
               <p>
                Results: <div id="output"></div>
              </p>
        </div>
     </div>

     <hr>
      <div class="footer">
        <p>&copy; Haolong Fan 2013</p>
      </div>
     </div>
      <script src="content/js/mapreduce.js"></script>
      <script src="content/js/home.js"></script>
  </body>
</html>