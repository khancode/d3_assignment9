/**
 * Created by khancode on 3/24/2015.
 */


d3_formatValuePrefixes();

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
labelPadding = 200;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#FF3300", "#5ad75a", "#28a428"]);
// #FF3300 red, #5ad75a light green, #28a428 dark green

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", labelPadding + height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("Movies.csv", function(error, data) {

    var newData = Array();

    for (d in data)
    {
        newData.push([]);
        newData[d]['Movie'] = data[d]['Movie'];
        newData[d]['Production Budget $'] = data[d]['Production Budget $'];
        newData[d]['Domestic Gross $'] = data[d]['Domestic Gross $'];
        newData[d]['Worldwide Gross $'] = data[d]['Worldwide Gross $'];
    }

    // Replace the data array with a subdata array that only
    // holds Production Budget $, Domestic Gross $, and
    // Worldwide Gross $ values.
    data = newData;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Movie"; }));

    data.forEach(function(d) {
        var y0 = 0;
        d.money = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
        d.total = d.money[d.money.length - 1].y1;
    });

    data.sort(function(a, b) { return b.total - a.total; });

    x.domain(data.map(function(d) { return d.Movie; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]);

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
        .attr("transform", function(d) { return "translate(" + x(d.Movie) + ",0)"; });

    movie.selectAll("rect")
        .data(function(d) { return d.money; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

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
        .text(function(d) { return d; });

});

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
    text.each(function() {
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