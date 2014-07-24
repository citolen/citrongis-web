//
//
//  CitronGIS first app
//
//

var MyApp = (function() {
    /* private member */
    var my_private_member = 1;

    /* private function */
    var my_private_function = function () {
        console.log('call my private func');
    }

    return ({
        /* public member */
        my_public_member: 5,

        /* public function */
        my_public_function: function () {
            console.log('call my public function');
            my_private_function();
        }
    });
})();

MyApp.my_public_function();
