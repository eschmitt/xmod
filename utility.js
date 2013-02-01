;(function (window, exporter, undefined) {

  var utility = {} 
  
  //+ getFreeGlobal :: a -> b
    , getFreeGlobal = function(_window) {
        var free_global = typeof global == 'object' && global;
        if (free_global.global === free_global) {
          return free_global;
        }
        return _window;
      }

  //+ exposeFunctionsToEnvironment :: a -> IO
    , exposeFunctionsToEnvironment = function(env) {
        var f, namespace = this;
        env = env || window;
        for (f in namespace) {
          if (f !== 'expose' && namespace.hasOwnProperty(f)) {
            env[f] = namespace[f];
          }
        }
      }
  
  //+ noConflict :: String -> b -> f
    , noConflict = function(conflicting_lib, _window) {
        return function() {
          _window[conflicting_lib] = _window[conflicting_lib]
          return this;
        };
      }

  //+ exportModule :: String -> Module -> IO
    , exportModule = function(name, _module, _exporter) {
        var define_exists = typeof define == 'function'
          , has_amd_property = typeof define.amd == 'object' && define.amd
          , using_AMD_loader = define_exists && has_amd_property
          , module_exists = typeof module == 'object' && module
          , has_exports_property = module.exports == _exporter
          , using_nodejs_or_ringojs = module_exists && has_exports_property
          ;

        if (using_AMD_loader) {
          // Expose module to the global object even when an AMD loader
          // is present, in case this module was injected by a third-party
          // script and not intended to be loaded as module. The global
          // assignment can be reverted in the module via its
          // "noConflict()" method.
          window[name] = _module;

          // Define an anonymous AMD module
          define(function () { return _module; });
        }

        // Check for "exports" after "define", in case a build optimizer adds
        // an "exports" object.
        else if (_exporter) {
          if (using_nodejs_or_ringojs) {
            module.exports = _module;
          }
          // Narwhal or RingoJS v0.7.0-
          else {
            _exporter[name] = _module;
          }
        }
      }
    ;

  utility.expose = exposeFunctionsToEnvironment;
  utility.noConflict = noConflict;
  utility.export = exportModule;

  exportModule('utility', utility, exporter);

}( typeof window != 'undefined' ? window : {}
 , typeof exports == 'object' && exports
 ));
