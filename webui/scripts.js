(function( window ){

  window.onload = function(){
    bindClick( 'refresh-button', refresh );
    bindClick( 'toggle-button', toggleRefresh );

    refresh();
  }

  /* global variable */
  var autoRefresh = false;

  function refresh(){

    doGetJSON( '/api' )
    .then( json => {
      loadContainers( json, 'frontList', 0 );
      loadContainers( json, 'backList', 1 );
    })
    .catch( err => {
      console.warn( err );
      errorMsg( err );
    });

    if( autoRefresh ) {
      setTimeout(refresh, 500);
    }
  }

  function toggleRefresh( ) {
    autoRefresh = !autoRefresh;
    if( autoRefresh ) {
      refresh();
      this.value = 'Disable autorefresh';
    } else {
      this.value = 'Enable autorefresh';
    }
  }

  function bindClick( buttonId, fun ) {
    window.document.getElementById( buttonId ).onclick = fun;
  }

  function loadContainers( json, listId, index ) {
    const list = document.getElementById( listId );
    const map = getMap( json, index );
    const total = map.get('total');

    const items = [];
    for( var [k,v] of map ) {
      if( k === 'total') {
        continue;
      }
      items.push( createContainerItem( k, v, total ) );
    }
    if( items.length > 0 ) {
      //remove previous items
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      // add new items
      items.forEach( item => {
        list.appendChild( item );
      });
    }
  }

  function createContainerItem( containerId, count, total ) {
    const percent = Math.round( count / total * 100 );

    const item = document.createElement('li');
    item.classList.add('container-item');

    const itemText = document.createElement('h3');
    itemText.textContent = containerId + ' - ' + percent + '% (' + count + '/' + total + ')';
    item.appendChild( itemText );

    const itemProgress = document.createElement('progress');
    itemProgress.max = 100;
    itemProgress.value = percent;
    item.appendChild(itemProgress);

    return item;
  }

  function getKeys( object ) {
    const keys = [];
    for( prop in object ) {
      keys.push( prop );
    };
    return keys;
  }

  function getMap( object, index ) {
    const map = new Map();
    let total = 0;
    for( const prop in object ) {
      const id = prop.split('/')[ index ];
      const value = object[ prop ];
      map.set( id, (map.get( id ) || 0) + value    );
      total += value;
    };
    map.set( 'total', total );
    return map;
  }

  function doGetJSON( url, callback ){
    return new Promise( function( resolve, reject ) {
      const req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if( this.readyState == 4 && this.status == 200 ) {
          resolve( JSON.parse( req.response ) );
        } else if( this.readyState == 4 ) {
          reject( this.status );
        }
      };
      req.open( 'GET', url );
      req.send();
    });
  }

  function errorMsg( msg ){
    const msgBloc = document.getElementById( 'message' );
    msgBloc.innerHTML = msg;
    msgBloc.style.display = 'initial';
    setTimeout( cleanMsg, 10000 );
  }

  function cleanMsg( msg ) {
    const msgBloc = document.getElementById( 'message' );
    msgBloc.style.display = 'none';
    msgBloc.innerHTML = '';
  }
})( window );
