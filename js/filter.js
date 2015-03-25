/**
 * Created by khancode on 3/24/2015.
 */

//$.getScript("js/index.js", function(){
//
//    console.log("Script loaded and executed.");
//    // here you can use anything you defined in the loaded script
//
//    setSelector();
//
//});

$filter = new Filter();

function Filter() {
    this.setSelector = function() {

        $(".legend").hover(
            function(){
                var $this = $(this).find("rect");
                $this.data('fill', $this.css('fill')).css('fill', '#F0F0F0');
            },
            function(){
                var $this = $(this).find("rect");
                $this.css('fill', $this.data('fill'));
            }
        );

        $(".legend").click(function () {
            //alert('it worked');

            var category = $(this).find("text").text();
            print(category);

            $stacked_bar_chart.removeFarm();
            $bar_chart.farm(category);
        });
    }
};


/* Convenience of printing to console */
this.print = function(str) {
    console.log(str);
};