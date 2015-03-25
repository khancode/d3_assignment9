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

$filter = new NewFilter();

function NewFilter() {
    var _this = this; // 'this' ref is stored because .change() changes 'this' ref value.
    _this.checkedArr = [];

    this.setCheckboxListener = function() {

        $(".category_checkbox").change(function() {
            onChangeListener($(this));
        });
    };

    function onChangeListener(checkBox) {
        var category = checkBox.val();

        if (checkBox.is(':checked')) {
            console.log('Added: ' + category);
            _this.checkedArr.push(category)
        }
        else {
            console.log('Removed: ' + category);
            _this.checkedArr.splice( $.inArray(category, _this.checkedArr), 1 );
        }

        console.log("checkedArr: " + _this.checkedArr);

        $stacked_bar_chart.removeFarm();
        $bar_chart.farm(category);
    }
}

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
            console.log(category);

            $stacked_bar_chart.removeFarm();
            $bar_chart.farm(category);
        });
    }
}
