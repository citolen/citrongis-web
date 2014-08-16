console.log('interface script');

this.myvar = 'toto';

this.myfunc = function () {
    console.log('my click');
};

this.coffee_result = this.CoffeeScript.run('console.log "Hello from coffee-script in citronGIS bitch!"\n\
times = (a, b) -> a * b\n\
return times(2, 5)');

