/**
 * Created by khancode on 3/26/2015.
 */

$slider = new Slider();
//$slider.init(5000000);

function Slider() {

    _this = this;
    _this.maxVal = null;

    this.init = function(maxVal) {
        _this.maxVal = maxVal;

        d3.select('#slider4text').text('Movies <= $' + _this.maxVal);

        d3.select('#slider4').append("div").attr("id", "sliderComponent")
            .call(d3.slider()
                .axis(true)
                .min(0).max(_this.maxVal).step(5)
            .on("slide", function(evt, value) {
                _this.maxVal = value;
                d3.select('#slider4text').text('Movies <= $' + value);

                $stacked_bar_chart.removeFarm();
                $stacked_bar_chart.farm($stacked_bar_chart.categoriesArr, value);
            })
            .value(_this.maxVal));
    };

    this.remove = function() {
        d3.select("#sliderComponent").remove();
    }

    this.getMaxVal = function() { return _this.maxVal; }
}