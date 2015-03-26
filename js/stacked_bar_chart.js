/**
 * Created by rockg_000 on 3/24/2015.
 */


$stacked_bar_chart = new StackedBarChart();

function StackedBarChart() {

    _this = this;
    _this.categoriesArr = null;

    this.farm = function(categoriesArr, maxVal)
    {
        _this.categoriesArr = categoriesArr;

        d3_formatValuePrefixes();

        var margin = {top: 20, right: 20, bottom: 30, left: 60},
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
        labelPadding = 200;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var colorCode = [];
        colorCode['Production Budget $'] = "#FF3300";
        colorCode['Domestic Gross $'] = "#5ad75a";
        colorCode['Worldwide Gross $'] = "#28a428";

        var colorArr = [];
        if (categoriesArr.length == 0) {
            colorArr = ["#FF3300", "#5ad75a", "#28a428"];
        }
        else {
            for (var c in categoriesArr) {
                var category = categoriesArr[c];
                colorArr.push(colorCode[category]);
            }
        }

        var color = d3.scale.ordinal()
            .range(colorArr);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        if (categoriesArr.length == 0) {
            categoriesArr = ['Production Budget $', 'Domestic Gross $', 'Worldwide Gross $'];
        }

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                var toolTipText = ""; //"<strong>Money: $</strong> <span style='color:green'>";
                for (var c in categoriesArr) {
                    var category = categoriesArr[c];
                    toolTipText += '<strong>'+category+'</strong>' + "<span style='color:"+colorCode[category]+"'>" + d[category] + '</span><br>';
                }

                return toolTipText;
            });

        var svg = d3.select("#viz_container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", labelPadding + height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.call(tip);

        d3.csv("Movies.csv", function (error, data) {

            var newData = new Array();

            for (var d in data) {
                newData.push([]);
                var sum = 0;
                var arr = [];
                arr['Movie'] = data[d]['Movie'];
                var arrCats = []; // holds categories of arr
                for (var c in categoriesArr) {
                    var category = categoriesArr[c];
                    arrCats[category] = data[d][category];

                    sum += parseInt(data[d][category]);
                }

                // Money filter. -1 is sentinel value for no max.
                if (maxVal == -1 || sum <= maxVal) {
                    for (var catName in arrCats)
                        arr[catName] = arrCats[catName];
                }
                else {
                    for (var catName in arrCats)
                        arr[catName] = 0;
                }

                newData[d] = arr;
            }

            if ($slider.getMaxVal() == null) {
                // Find max value
                var maxValueFound = 0;
                for (var d in newData) {
                    var sum = 0;
                    for (var c in categoriesArr) {
                        var category = categoriesArr[c];
                        //console.log('val: ' + newData[d][category]);
                        sum += parseInt(newData[d][category]);
                    }
                    if (sum > maxValueFound)
                        maxValueFound = newData[d][category];
                }

                console.log('maxValueFound: ' + maxValueFound);

                $slider.init(maxValueFound);
            }

            // Replace the data array with a subdata array that only
            // holds Production Budget $, Domestic Gross $, and
            // Worldwide Gross $ values.
            data = newData;

            /* DEBUG purposes */
            //for (d in data){
            //    console.log('d('+d+'): ');
            //    console.log('\tMovie: ' + data[d]['Movie']);
            //    console.log('\tWorldwide Gross $: ' + data[d]['Worldwide Gross $'])
            //}

            color.domain(d3.keys(data[0]).filter(function (key) {
                return key !== "Movie";
            }));

            data.forEach(function (d) {
                var y0 = 0;
                d.money = color.domain().map(function (name) {
                    return {name: name, y0: y0, y1: y0 += +d[name]};
                });
                d.total = d.money[d.money.length - 1].y1;
            });

            data.sort(function (a, b) {
                return b.total - a.total;
            });

            x.domain(data.map(function (d) {
                return d.Movie;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.total;
            })]);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrap, x.rangeBand());

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var movie = svg.selectAll(".movies")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function (d) {
                    return "translate(" + x(d.Movie) + ",0)";
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            movie.selectAll("rect")
                .data(function (d) {
                    return d.money;
                })
                .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function (d) {
                    return y(d.y1);
                })
                .attr("height", function (d) {
                    return y(d.y0) - y(d.y1);
                })
                .style("fill", function (d) {
                    return color(d.name);
                });

            var legend = svg.selectAll(".legend")
                .data(color.domain().slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

            // Set filter for stacked bar chart
            //$filter.setSelector();

        });
    };

    this.removeFarm = function() {
        d3.select('svg').remove();
    };

    /**
     * Private functions
     */

    function d3_formatValuePrefixes()
    {
        // Change D3's SI prefix to more business friendly units
        //      K = thousands
        //      M = millions
        //      B = billions
        //      T = trillion
        //      P = quadrillion
        //      E = quintillion
        // small decimals are handled with e-n formatting.
        var d3_formatPrefixes = ["e-24","e-21","e-18","e-15","e-12","e-9","e-6","e-3","","K","M","B","T","P","E","Z","Y"].map(d3_formatPrefix);

        // Override d3's formatPrefix function
        d3.formatPrefix = function(value, precision) {
            var i = 0;
            if (value) {
                if (value < 0) {
                    value *= -1;
                }
                if (precision) {
                    value = d3.round(value, d3_format_precision(value, precision));
                }
                i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
                i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
            }
            return d3_formatPrefixes[8 + i / 3];
        };
    }

    function d3_formatPrefix(d, i) {
        var k = Math.pow(10, Math.abs(8 - i) * 3);
        return {
            scale: i > 8 ? function(d) { return d / k; } : function(d) { return d * k; },
            symbol: d
        };
    }

    function d3_format_precision(x, p) {
        return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
    }

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0, //0,
                lineHeight = 1.1, //1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}
