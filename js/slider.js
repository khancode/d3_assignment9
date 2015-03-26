/**
 * Created by khancode on 3/26/2015.
 */

$slider = new Slider();
$slider.init();

function Slider() {

    this.init = function() {
        d3.select('#slider4')
            .call(d3.slider()
                .axis(true)

                .min(0).max(2100).step(5)
            .on("slide", function(evt, value) {
                d3.select('#slider4text').text('$' + value);
            })
                .value(2100));
    }
}