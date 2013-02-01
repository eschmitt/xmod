;(function (window) {

  var expose = function(env) {
    var f, namespace = this;
    env = env || window;
    for (f in namespace) {
      if (f !== 'expose' && namespace.hasOwnProperty(fn)) {
        env[f] = namespace[f];
      }
    }
  };

  

}(this));
