(function() {
  'use strict';

  const hostname    = require("os").hostname(),
        port        = 9000,
        exitHook    = require('async-exit-hook'),
        nano        = require('nano'),
        http        = require('http');

  var couchdbHost = 'http://couchdb:5984/sfeirschool';
  if( process.argv.length == 3 ) {
    couchdbHost = 'http://' + process.argv[2] + ':5984/sfeirschool';
  }
  console.log( 'Using ' + couchdbHost + ' as couchdb url' );

  var sfeirschool = nano({
    url: couchdbHost,
    requestDefaults: { "timeout" : "2000" } // in miliseconds
  });

  http.createServer( handleRequest ).listen(port);
  console.log( new Date() + ': Server BACK running at http://' + hostname + ':' + port + '/');

  /* POST START INIT */

  // create container document with id=hostname and status "started"
  setTimeout( register, 2000, 'back', hostname );
  //register( 'back', hostname );

  exitHook( callback => {
    // get and update container document with status = "stopped"
    unregister( 'back', hostname, callback );
  });


  /* REQUEST HANDLE FUNCTION */

  function handleRequest(request, response) {

    const remote = request.url.split('/')[2];
    console.log( 'Back: got request '+ request.url );

    if( request.url.startsWith('/register/') ) {
        register( 'front', remote );
        response.writeHead( 200 );
        response.end();
        return;
    }

    if( request.url.startsWith('/unregister/') ) {
        unregister( 'front', remote, () => {
          response.writeHead( 200 );
          response.end();
        } );
        return;
    }

    if( !request.url.startsWith('/call/') ) {
      response.writeHead( 404 );
      response.end();
      return;
    }

    // create document type "call"
    recordCall( remote, hostname, (err, results) => {
      if( err ) {
        console.log( err );
        response.writeHead( 500 );
        response.end();
      } else {
        response.setHeader('Content-Type', 'application/json');
        response.end( JSON.stringify( results ) );
      }
    } );

  }; // end handleRequest

  function recordCall( remoteName, local, callback ) {
    sfeirschool.insert(
      { "type": "call", "front": remoteName, "back": local, "ts": new Date() },
      function( err ) {
        if( err ) {
          callback( err );
        } else {
          sfeirschool.view( 'calls', 'type', { "group_level": 1 }, function(err, body){
            if( err ) {
              callback( err );
            } else {
              const results = {};
              body.rows.forEach( res => {
                results[ res.key ] = res.value;
              });
              callback( null, results );
            }
          });
        }
    }); // end insert
  }

  function register( type, name ) {
    sfeirschool.insert(
      {
        "type": "container",
        "image": type,
        "name": name,
        "status" : "started"
      },
      type + '-' + name,
	  function( err ) {
		if( err ) {
			console.log( err );
		} else {
			console.log( `Registered ${type}-${name}` );
		}
	  }
    );
  }

  function unregister( type, name, callback ) {
    sfeirschool.get( type + '-' + name, (err, body) => {
      if( err ) {
		console.log( err );
        callback();
      } else {
        body.status = "stopped";
        sfeirschool.insert( body, () => {
          console.log( "Container back unregistered");
          callback();
        });
      }
    });
  }

})();
