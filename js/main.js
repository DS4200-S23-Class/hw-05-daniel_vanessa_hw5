// Set information for vis height/width/margins
const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 600;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set multiplication factors for scatter plot
const SCATTER_FACTOR = 50;
const Y_FIX = 10;

// Set vis height/width
// const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
// const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Build frame of scatterplot
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
            .attr("cx", (d) => { return (parseInt(d.x) * SCATTER_FACTOR) + MARGINS.left; })
            .attr("cy", (d) => { return ((Y_FIX - parseInt(d.y)) * SCATTER_FACTOR) + MARGINS.top; })
            .attr("r", 15);
      
    addEventHandler();

});

// Build frame of barchart
const FRAME2 = d3.select("#barchart")
                  .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame");

let xScale = d3.scaleBand().range([0, VIS_WIDTH]).padding(0.4);
let yScale = d3.scaleLinear().range([VIS_HEIGHT, 0]);

let g = FRAME2.append("g").attr("transform", "translate("+100+","+100+")");

d3.csv("data/bar-data.csv").then((data) => {

    xScale.domain(data.map(function(d){return d.category;}));
    yScale.domain([0, d3.max(data, function(d){return d.amount;})]);

    g.append("g") .attr('transform', 'translate(0,'+VIS_HEIGHT+ ')').call(d3.axisBottom(xScale));

    g.append('g').call(d3.axisLeft(yScale).ticks(10));

    g.selectAll(" bar")
        .data(data)
        .enter ().append("rect")
        .attr("class", "bar")
        .attr("x", function(d){ return xScale(d.category);})
        .attr("y", function (d){ return yScale(d.amount);})
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){ return VIS_HEIGHT - yScale(d.amount);});
});

// create button function to add a new point
function newPoint() {
  let x_coordinate = document.getElementById("x-coordinate").value;
  let y_coordinate = document.getElementById("y-coordinate").value;

  FRAME1.append("circle")
          .attr("class", "point")
          .attr("cx", (x_coordinate * SCATTER_FACTOR) + MARGINS.left)
          .attr("cy", ((Y_FIX - y_coordinate) * SCATTER_FACTOR) + MARGINS.top)
          .attr("r", 15);

  addEventHandler();
};

// mouseover function for adding highlight
function pointMouseover(event, d) {
  d3.select(this).attr("class", "highlight");
};

// mouseout function for removing highlight
function pointMouseout(event, d) {
  d3.select(this).attr("class", "point");
};

// click function (does not work properly yet!!)
function pointClick(event, d) {
  const clicked = d3.select(this);
  const clicked_x = (clicked.attr("cx") - MARGINS.left) / SCATTER_FACTOR;
  const clicked_y = Y_FIX - ((clicked.attr("cy") - MARGINS.top) / SCATTER_FACTOR);

  // update last clicked point
  d3.select("#coordinates").text("Last point clicked: (" + clicked_x + "," + clicked_y + ")")

  // add/remove border
  if (clicked.style("stroke") == "black") {
    clicked.style("stroke", "none");
  } else {
    clicked.style("stroke-width", 3);
    clicked.style("stroke", "black");
  };
  
  /* if (clicked.classed("selected")) {
      clicked.classed("selected", false);
      d3.select("#coordinates").text("Last point clicked:");
      clicked.attr("stroke", null);
  } else {
      clicked.classed("selected", true);
      d3.select("#coordinates").text("Last point clicked: " + `(${d.x}, ${d.y})`);
      clicked.attr("stroke", "black").attr("stroke-width", 2);
    } */
};

// function to add event handlers to points
function addEventHandler() {
  FRAME1.selectAll(".point")
      .on("mouseover", pointMouseover)
      .on("mouseout", pointMouseout)
      .on("click", pointClick);
};