d3.csv("./data/SgNumbers.csv").then(function(data) {

    data.forEach(function(d) {
        let category;
        if(+d.AirQuality<50 && d.WaterPollution>50) {
            category = "worstCities"; 
        } else if (+d.AirQuality>50 && d.WaterPollution<50) {
            category = "bestCities";
        } else {
            category = "moderateCities";
        }
        d.category = category;
    });

    console.log(data);

    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = {top: 50, left: 100, right: 50, bottom: 150};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    console.log(data);

    let filtered_data = data.filter(function(d) {
            return d.Country === 'United States of America'; 
    });    
    
        console.log(filtered_data);

    /* Determine min and max values */

    let AirQuality = {
        min: d3.min(filtered_data, function(d) {return +d.AirQuality;}),
        max: d3.max(filtered_data, function(d) {return +d.AirQuality;})
    }

    let WaterPollution = {
        min: d3.min(filtered_data, function(d) {return +d.WaterPollution;}),
        max: d3.max(filtered_data, function(d) {return +d.WaterPollution;})
    }

    /*
    CREATE SCALES

    Use the computed min and max values to create scales for
    our scatter plot:

    `xScale` will convert Air Quality to horizontal position;

    `yScale` will convert Water Pollution to vertical position;

    */

    const xScale = d3.scaleLinear()
        .domain([AirQuality.min, AirQuality.max])
        .range([margin.left, width-margin.right]); 

    const yScale = d3.scaleLinear()
        .domain([WaterPollution.min, WaterPollution.max])
        .range([height-margin.bottom, margin.top]); 

    /* Draw Axes */

    const xAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform", `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale));

    //Draw colored rectangles for water quality 

    const terribleWater = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", yScale(100))
        .attr("width", (width) - margin.left - margin.right)
        .attr("height", yScale(80)-yScale(100))
        .attr("fill", "#99130A")
        .attr("opacity", 0.5);

    const badWater = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", yScale(80))
        .attr("width", (width) - margin.left - margin.right)
        .attr("height", yScale(60)-yScale(80))
        .attr("fill", "#D31B0D")
        .attr("opacity", 0.5);

    const moderateWater = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", yScale(60))
        .attr("width", (width) - margin.left - margin.right)
        .attr("height", yScale(40)-yScale(60))
        .attr("fill", "#a48443")
        .attr("opacity", 0.5);

    const goodWater = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", yScale(40))
        .attr("width", (width) - margin.left - margin.right)
        .attr("height", yScale(20)-yScale(40))
        .attr("fill", "#6d8538")
        .attr("opacity", 0.5);

    const bestWater = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", yScale(20))
        .attr("width", (width) - margin.left - margin.right)
        .attr("height", yScale(0)-yScale(20))
        .attr("fill", "#79c153")
        .attr("opacity", 0.5);

    
    /* Draw colored rectangles for air quality 

    const bestAir = svg.append("rect")
        .attr("x", xScale(80))
        .attr("y", margin.top)
        .attr("width", xScale(100)-xScale(80))
        .attr("height", (height) - margin.top - margin.bottom)
        .attr("fill", "#79c153")
        .attr("opacity", 0.5);

    const goodAir = svg.append("rect")
        .attr("x", xScale(60))
        .attr("y", margin.top)
        .attr("width", xScale(80)-xScale(60))
        .attr("height", (height) - margin.top - margin.bottom)
        .attr("fill", "#6d8538")
        .attr("opacity", 0.5);

    const moderateAir = svg.append("rect")
        .attr("x", xScale(40))
        .attr("y", margin.top)
        .attr("width", xScale(60)-xScale(40))
        .attr("height", (height) - margin.top - margin.bottom)
        .attr("fill", "#a48443")
        .attr("opacity", 0.5);

    const badAir = svg.append("rect")
        .attr("x", xScale(20))
        .attr("y", margin.top)
        .attr("width", xScale(40)-xScale(20))
        .attr("height", (height) - margin.top - margin.bottom)
        .attr("fill", "#D31B0D")
        .attr("opacity", 0.5);

    const worstAir = svg.append("rect")
        .attr("x", xScale(0))
        .attr("y", margin.top)
        .attr("width", xScale(20)-xScale(0))
        .attr("height", (height) - margin.top - margin.bottom)
        .attr("fill", "#99130A")
        .attr("opacity", 0.5);

    */

    /* Draw points */

    const points = svg.selectAll("circle")
    .data(filtered_data)
    .enter()
    .append("circle")
        .attr("cx", function(d) {return xScale(d.AirQuality ); })
        .attr("cy", function(d) {return yScale(d.WaterPollution); })
        .attr("r", 8)   
        .attr("fill", "#38062B")
        .attr("opacity", 0.2);


    /* AXES LABELS */

    svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2 + 25)
        .attr("y", height - 100)
        .attr("text-anchor","middle")
        .text("Air Quality");

    svg.append("text")
        .attr("class","axisLabel")
        .attr("x", -height/2 + 45)
        .attr("y", 50)
        .attr("text-anchor","middle")
        .attr("transform","rotate(-90)")
        .text("Water Pollution");

    /*TOOLTIP*/ 

    const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");

    points.on("mouseover", function (e,d) {

        console.log(d);

        let cx = +d3.select(this).attr("cx");
        let cy = +d3.select(this).attr("cy");

        tooltip.style("visibility", "visible")
        .style("left", `${cx}px`)
        .style("top", `${cy}px`)
        .html(`<b>City</b>: ${d.City}<br> <b>Region</b>: ${d.Region}`);

        d3.select(this)
            .attr("stroke", "#EBEBEB")
            .attr("stroke-width", 5);

    }).on("mouseout", function (){

        tooltip.style("visibility", "hidden");

        d3.select(this)
            .attr("stroke", "none")
            .attr("stroke-width", 0);
        })

    /* FILTER BY CHECKBOX 
    
    Create checkboxes by categories: worst, best, and moderate. 

    worst = highest overall pollution 

    best = lowest overall pollution 

    moderate = moderate pollution levels 

    */

    d3.selectAll(".pollution--level").on("click", function(){
        let thisLevel = d3.select(this).property("value");
        let isChecked = d3.select(this).property("checked");

        let selection = points.filter(function(d){
            return d.category === thisLevel; 
        });

        if(isChecked == true) {
            selection.attr("opacity", 0.5)
                .attr("pointer-events", "all");
        } else {
            selection.attr("opacity", 0)
                .attr("pointer-events", "none");
        } 
    })
});

