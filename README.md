# Treihadwyl Resource Manager

> Responsible for loading and getting resources, will cache where possible.

## Installation

The Resource Manager is self-registering so just `require` it to get access to it.

```
var rm = require( 'resource-manager' );
```

## Options

Options can be set via a function after the manager has been `required`.

```
rm.setOptions({
  caching: false
});
```

### Caching

_type_: `Boolean`

Controls whether the memory cache will be used to store get requests. When disabled a request will go out but the browser cache should handle it.


## API

### Texture Atlas

```
rm.get.atlas( 'path/to/file.json' )
  .then( someFunction )
  .catch( handleError );
```

Uses `PIXI.JsonLoader` to fetch the `json` file representing the texture atlas and returns it inside a promise all ready to use. There is some inbuild error handling so the `.catch` block is optional.
