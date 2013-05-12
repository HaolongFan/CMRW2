$.work = function(data) {
    
    var action = data.action;

    var args = data.args;
    
    var def = $.Deferred(function(dfd) {
 
        if (window.Worker&&args.url!=null) {
            var worker = new Worker(args.url);

            worker.addEventListener('message', function(event) {
                //Resolve the Deferred when the Web Worker completes
                def.resolve(event.data);
                var current_time = new Date().getTime();
                console.log("web worker end: "+args.index + " - "+ (current_time - args.start_time));
            }, false);
 
            worker.addEventListener('error', function(event) {
                //Reject the Deferred if the Web Worker has an error
                def.reject(item);
            }, false);
            
            console.log("web worker start: "+args.index);
            
            //Start the worker
            worker.postMessage({
                action: action.toString(),
                args: args
            });
        } else {
            //If the browser doesn't support workers then execute synchronously.
            //This is done in a setTimeout to give the browser a chance to execute
            //other stuff before starting the hard work.
             console.log("web worker start: "+args.index);
            setTimeout(function(){
                try {
                    var result = action(args);
                    dfd.resolve(result);
                    var current_time = new Date().getTime();
                    console.log("web worker end: "+args.index + " - "+ (current_time - args.start_time));
                } catch(e) {
                    dfd.reject(e);
                }
            }, 0);
        }
    });
 
    //Return the promise to do this work at some point
    return def.promise();
};



var Task = {

  url:"Content/js/worker.js",
  
  works: [],
  
  results: [],
  
  task: null,

  init:function(){
  
     var from = parseInt($("#from").val()), to = parseInt($("#to").val()), mapNumber = parseInt($("#map").val());
     
     var option = $("#method").val();
     
     this.works.length = 0;
     this.results.length = 0;
     this.task = findTriangularNumber;
   
   if($("#result").hasClass("hidden"))
   {
      $("progress").toggleClass("hidden");
   }
   else
   {
      $("progress, #result").toggleClass("hidden");    
   }

   
     switch(option)
     { 
        case "ui_thread": this.findWithUIThread(from,to); break;
        case "mapreduce_thread": this.findWithMapReduceUIThread(from,to,mapNumber); break;
        case "webworker": this.findWithWebWorker(from,to); break;
        case "cmrw2": this.findWithCMRW2(from,to,mapNumber); break;
        default:break;
     }
     
   
  },
  
  changeTask: function(){
    
    var task = $("#task").val();
 
     $("h3").text($("#task option:selected").text()); 
       
     switch(task)
     {
        case "triangular": this.task = findTriangularNumber; break;
        case "prime": this.task = findPrimes; break;
        default:break;
     }
     
  
  },
  
  find: function(index, url, from, to, action){
   
   var start_time = new Date().getTime();
    
   return $.work({action: this.task, args:{from:from,to:to, url:url, index: index, start_time: start_time}}).then(function(data) {
        
        action(data, start_time);
           
    }).fail(function(data){
        console.log("fail");
    });
  },
  
  output: function(data, start_time){
      
         $("#total").text(data.length);
         var current_time = new Date().getTime();
         $("#time").text(current_time - start_time);
         $("#output").text(data.join(", "));
         $("progress, #result").toggleClass("hidden");         
  
  },
  
  findWithUIThread: function(from, to)
  {
     this.find("UI Thread", null, from, to, this.output);
  },
  
  findWithMapReduceUIThread: function(from, to,number)
  {
     var start_time = new Date().getTime();

     
     for(var i=0; i < number; i ++)
     {
        var work_from = parseInt(from + i * (to - from)/number);
        var work_to = parseInt(from + (i + 1) * (to - from)/number);
        
        this.works.push(this.find("MapReduce with UI Thread - " + i, null, work_from, work_to, function(data){
           
           Task.results = Task.results.concat(data);
        
        }));
     }
     

     //Use $.when to be notified when they're all complete (join)
     $.when.apply(null, this.works).done(function(result){
        //success - do something with result1 and result2
        Task.output(Task.results, start_time);
        Task.works.length = 0;
        Task.results.length = 0;
        
     }).fail(function(event){
        //exception occurred! look at the event argument.
     });
  },
  
  findWithWebWorker: function(from, to)
  {
     this.find("Web Worker", this.url, from,to, this.output);
  },
  
  findWithCMRW2: function(from, to, number)
  {
     var start_time = new Date().getTime();

     for(var i=0; i < number; i ++)
     {
        var work_from = parseInt(from + i * (to - from)/number);
        var work_to = parseInt(from + (i + 1) * (to - from)/number);
        
        this.works.push(this.find("CMRW2 - " + i, this.url, work_from, work_to, function(data){
           
           Task.results = Task.results.concat(data);
        
        }));
     }
     
     
     //Use $.when to be notified when they're all complete (join)
     $.when.apply(null, this.works).done(function(result){
        //success - do something with result1 and result2
        
        Task.output(Task.results, start_time);
        Task.works.length = 0;
        Task.results.length = 0;
        
     }).fail(function(event){
        //exception occurred! look at the event argument.
     });
  }

}

var findTriangularNumber = function (args) {
    var result = [], current = args.from;
    while (current < args.to) {         
       var t = (Math.sqrt(8 * current + 1) - 1)/2;
       if(t% 1 === 0)
       {
          result.push(current);
       }
       
       current++;
    }
    return result;
}




//Define a function to be run in the worker.
//Note that this function will not be run in the window context,
//and therefore cannot see any global vars!
//Anything this function uses must be passed to it through its args object.
var findPrimes = function (args) {
    var divisor, isPrime, result = [],
        current = args.from;
    while (current < args.to) {         
        divisor = parseInt(current / 2, 10);         
        isPrime = true;         
        while (divisor > 1) {
            if (current % divisor === 0) {
                isPrime = false;
                divisor = 0;
            } else {
                divisor -= 1;
            }
        }
        if (isPrime) {
            result.push(current);
        }
        current += 1;
    }
    return result;
}

