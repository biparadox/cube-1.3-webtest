
/*   

=============================================================================== 

WResize is the jQuery plugin for fixing the IE window resize bug 

............................................................................... 

Copyright 2007 / Andrea Ercolino 

------------------------------------------------------------------------------- 

LICENSE: http://www.opensource.org/licenses/mit-license.php 

WEBSITE: http://noteslog.com/ 

=============================================================================== 

*/

(function($) {

    $.fn.wresize = function(f) {

        version = '1.1';

        wresize = { fired: false, width: 0 };

 

        function resizeOnce() {


 

            return true;

        }

 

        function handleWResize(e) {

            if (resizeOnce()) {

                return f.apply(this, [e]);

            }

        }

 

        this.each(function() {

            if (this == window) {

                $(this).resize(handleWResize);

            }

            else {

                $(this).resize(f);

            }

        });

 

        return this;

    };

 

})(jQuery);