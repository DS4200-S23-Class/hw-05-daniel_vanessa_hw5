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
      
    addEventHandler()    

});

// create button function to add a new point
function newPoint() {
  let x_coordinate = document.getElementById("x-coordinate");
  let y_coordinate = document.getElementById("y-coordinate");

  FRAME1.append("circle")
          .attr("class", "point")
          .attr("cx", (x_coordinate.value * SCATTER_FACTOR) + MARGINS.left)
          .attr("cy", ((Y_FIX - y_coordinate.value) * SCATTER_FACTOR) + MARGINS.top)
          .attr("r", 15);
  console.log(x_coordinate.value, y_coordinate.value)

  addEventHandler()
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
  if (clicked.classed("selected")) {
      clicked.classed("selected", false);
      d3.select("#coordinates").text("Last point clicked:");
      clicked.attr("stroke", null);
  } else {
      clicked.classed("selected", true);
      d3.select("#coordinates").text("Last point clicked: " + `(${d.x}, ${d.y})`);
      clicked.attr("stroke", "black").attr("stroke-width", 2);
    }
};

// function to add event handlers to points
function addEventHandler() {
  FRAME1.selectAll(".point")
      .on("mouseover", pointMouseover)
      .on("mouseout", pointMouseout)
      .on("click", pointClick);
};