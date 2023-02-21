
const FRAME_HEIGHT = 15;
const FRAME_WIDTH = 15;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const FRAME1 = d3.select("#scatterplot")
                  .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame");


// Load the data from the CSV file
d3.csv("data/scatter-data.csv").then((data) => {


    // Create the scatterplot points
    FRAME1.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", "point")
            .attr("fill", "lightblue")
            .attr("cx", (d) => { return parseInt(d.x); })
            .attr("cy", (d) => { return parseInt(d.y); })
            .attr("r", 5)
        .on("mouseover", function() {
            d3.select(this).attr("fill", "yellow");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "lightblue");
        })
        .on("click", function(d) {
            const clicked = d3.select(this);
            if (clicked.classed("selected")) {
              clicked.classed("selected", false);
              d3.select("#coordinates").text("");
              clicked.attr("stroke", null);
            } else {
              clicked.classed("selected", true);
              d3.select("#coordinates").text(`(${d.x}, ${d.y})`);
              clicked.attr("stroke", "black").attr("stroke-width", 2);
            }
        });

});
