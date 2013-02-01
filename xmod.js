;(function (window, exporter, undefined) {

  var xmod = {} 
  
  //+ getFreeGlobal :: a -> b
    , getFreeGlobal = function(_window) {
        var env_global = global
          , free_global = typeof env_global == 'object' && env_global;
        if (free_global.global === free_global) {
          return free_global;
        }
        return _window;
      }

//TODO omit noConflict and getFreeGlobal from exposure to env
  //+ exposeFunctionsToEnvironment :: a -> IO
    , exposeFunctionsToEnvironment = function(env) {
        var f, win, mod = this;
        win = getFreeGlobal(window);
        env = env || win;
        for (f in mod) {
          if (f !== 'expose' && mod.hasOwnProperty(f)) {
            env[f] = mod[f];
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
        console.log('inside exportModule()');
        console.log('module name: ' name);
        console.log('========= module ========');
        console.dir(module)
        var define_exists = typeof define == 'function'
          , has_amd_property = define_exists ? typeof define.amd == 'object' && define.amd : false
          , using_AMD_loader = define_exists && has_amd_property
          , env_module = module
          , env_module_exists = typeof env_module == 'object' && env_module
          , has_exports_property = env_module_exists ? env_module.exports == _exporter : false
          , using_nodejs_or_ringojs = env_module_exists && has_exports_property
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

  xmod.getFreeGlobal = getFreeGlobal;
  xmod.expose = exposeFunctionsToEnvironment;
  xmod.noConflict = noConflict;
  xmod.exportModule = exportModule;

  exportModule('xmod', xmod, exporter);

}( typeof window != 'undefined' ? window : {}
 , typeof exports == 'object' && exports
 ));
