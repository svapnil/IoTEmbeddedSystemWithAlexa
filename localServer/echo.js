const http = require("http");

const hostname = "0.0.0.0";
const port = 3000; //this will be the port open on local computer, open port 3000 on ngrok

var localVehicleIP = 'http://10.137.112.119'; //this should be replaced during demonstration of
											  //the local IP that the car has been given at the time

const server = http.createServer((req, res) => {
  console.log(`\n${req.method} ${req.url}`); //print relevant info about website requested
  console.log(req.headers);
  console.log(req.url);

  //give path to the local vehicles IP
  http.get(localVehicleIP + req.url, function(res){
        var str = '';
        console.log('Response is '+ res.statusCode);

        res.on('data', function (chunk) {
               console.log('BODY: ' + chunk);
               str += chunk;
         });

        res.on('end', function () {
             console.log("end of the request");
        });

        //context.succeed('Blah');
      }).on('error', (e) => {
          console.error(e);
        });

  req.on("data", function(chunk) {
    console.log("BODY: " + chunk);
  });


  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://localhost:${port}/`);

});
