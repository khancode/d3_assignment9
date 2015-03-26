/**
 * Created by khancode on 3/24/2015.
 */

$filter = new Filter();

function Filter() {
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
            _this.checkedArr.push(category);
        }
        else {
            console.log('Removed: ' + category);
            _this.checkedArr.splice( $.inArray(category, _this.checkedArr), 1 );
        }

        console.log("checkedArr: " + _this.checkedArr);

        $stacked_bar_chart.removeFarm();
        $stacked_bar_chart.farm(_this.checkedArr, -1);

    }
}
