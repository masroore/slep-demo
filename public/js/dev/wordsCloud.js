$(function(){
    var mediaqueryList1 = window.matchMedia("(max-width: 320px)");
    var mediaqueryList2 = window.matchMedia("(max-width: 425px)");
    var mediaqueryList3 = window.matchMedia("(max-width: 768px)");
    var mediaqueryList4 = window.matchMedia("(max-width: 1024px)");
    var mediaqueryList5 = window.matchMedia("(max-width: 1200px)");

    media_query_lists=[mediaqueryList1,mediaqueryList2,mediaqueryList3,mediaqueryList4,mediaqueryList5]
    media_query_lists.forEach(item => {
        item.addEventListener("change", () => {
            instancia.refresh()
        });
    })
})

var instancia //nube actual

/*Administración de la nube de palabras*/
//Función que filtra y agrega palabras al arreglo words
function stringToWordsToWordsArray(word){
    arrayWord=word.split(" ");
    Object.values(arrayWord).forEach(function callback(obj, i, data) {
        if((obj.length>3)&&
        (!obj.includes('http'))&&
        (!obj.includes('@'))&&
        (!obj.includes('www'))&&
        (!obj.includes('#'))&&
        (!obj.includes('&'))&&
        (!/\d/.test(obj)))
        {
            cleanWord = obj.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            cleanWord = cleanWord.replace(/\W/g, '')
            if(cleanWord!=""){ 
                words.push(cleanWord);
            }
        }
    })
}
//Función que transforma un arreglo de palabras en un arreglo de objetos {word: string, size: random (por ahora)}
function llenarArray(arrayWords){
    array=[]
    //console.log(typeof arrayWords.body)
    typeof arrayWords.body == 'string'?(
        Object.values(arrayWords.body.split(" ")).forEach(function callback(obj, i, data) {
            object = obj.slice(1,-1)
            if(object.split(",")[0].length>3){array.push({word: object.split(",")[0],size: object.split(",")[1]})}
        }),
        array.sort((a, b) => b.size - a.size),
        max=56,
        Object.values(array.slice(0,26)).forEach(function callback(obj, i, data) {
            obj.size=max  
            i==0?max-=10:max-="1.5"   
        }),
        instancia=wordscloud(array.slice(0,26))
    ):wordscloud([])
}
//Función que llama a la api de la nube de palabras
function wordsTEST(words_array){
    //$("#wordscloud").empty();
    currentwc!=''?$('.current_wordcloud').remove():null
    if(document.getElementById('loadingWordcloud')!=null){ldnWC.removeAttribute("hidden")}

    words_data=''
    words_array.slice(0,1500).forEach(element => {words_data+=element+' ';});

    if(window.location.href.indexOf("informe") != -1){
        url_request='/words'
        tokken=document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }else{
        url_request='/tables/words'
        tokken="mnt5AmLAnrXUPZbWb8gXt8Ohtb9wPdD1xEiVILb8"
    }

    $.ajax({                                  
        url: url_request,       
        type: 'post',
        //dataType: 'json',
        data: {
            _token : tokken,
            words_data : words_data
        },
        beforeSend: function () {
            //console.log('Loading Screen On');
        },
        complete: function () {
            if(document.getElementById('loadingWordcloud')!=null){ldnWC.setAttribute("hidden","hidden")}
            //console.log('Loading Screen Off');
            //hideLoading();
        },
        success: function (response) {
            //console.log('Palabras evaluadas');
            llenarArray(response)
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                console.log('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                console.log('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
            console.log('Internal Server Error [500].')
            } else if (exception === 'parsererror') {
                console.log('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                console.log('Time out error.');
            } else if (exception === 'abort') {
                console.log('Ajax request aborted.');
            } else {
            console.log('Uncaught Error.\n' + jqXHR.responseText);
            }
        },
    }); 
}
var currentwc='';
var layout='';
//Función que dibuja la nube en el documento
function wordscloud(array){
    //console.log(array)
    var colors = ["#4638c2","#b00","#00aced","#f9b115"/*,"#2eb85c"*/,"#517fa4","#dc4f19","#19b591","#3b5998"]

    var colors_up=["#b00","#00aced","#f9b115","#2eb85c","#dc4f19","#19b591"]
    var colors_down=["#4638c2","#517fa4","#3b5998"]
    // List of words
    var myWords = array.slice(0, 25);
    // set the dimensions and margins of the graph
    var set_margen;

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = $('#wordscloud').width(),
        height = $('#wordscloud').height();

    // append the svg object to the body of the page
    svg = d3.select("#wordscloud").append("svg")
        .attr("class","current_wordcloud")
        .attr("width", /*width + margin.left + margin.right*/"100%")
        .attr("height", /*height + margin.top + margin.bottom*/"100%")
        .append("g")
        //.attr("transform",
          //  "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here

    layout = d3.layout.cloud()

        .size([width, height])
        .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
        .padding(1)        //space between words
        .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })      // font size of words
        .fontStyle("normal")
        .on("end", draw)

    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            //.attr("transform", "scale(x, y)")
        .append("g")
            .attr("style", "transform:translate(50%,50%)")
            //.attr("transform", "translate(" + layout.size()[0]/2 + "," + layout.size()[1]/2 + ")")
            //.attr("transform", "scale(x, y)")
            .selectAll("text").data(words)

        .enter()
            .append("text")
                .style("font-size", function(d) { return d.size; })
                .style("fill", function(d) { return d.size >= 30 ? colors[Math.floor(Math.random() * colors.length)] : colors[Math.floor(Math.random() * colors.length)];})//colors[Math.floor(Math.random() * colors.length)])
                .attr("text-anchor", "middle")
                
                .attr("class", "word_of_wordscloud")
                
                .style("font-family", "Impact,Impact2")
                .text(function(d) { return d.text; })
            .transition()
                .duration(1000)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
                .style("fill-opacity", function(d) { return d.size >= 35 ? 1 : d.size >= 30 ? 0.8 : d.size >= 20 ? 0.5 : 0.35;})

        currentwc=svg
        $("#wordscloud").fadeIn(1000);
    }  

    return{
        refresh: function() {
            $('.current_wordcloud').remove()
            wordscloud(array)
        }
    }
}
var myWords = [
    {word: "Anx",size: 30},
    {word: "Liberat",size: 36},
    {word: "Lumini",size: 26},
    {word: "Intra",size: 16},
    {word: "Outer",size: 20},
    {word: "Leather",size: 22},
    {word: "Sickness",size: 31},
    {word: "Mind",size: 14},
    {word: "Illns",size: 23},
    {word: "Huh",size: 13},
    {word: "Work",size: 11},
    {word: "Labelity",size: 21},
]
function wordscloud2(array){

    //Construct the word cloud's SVG element
    var svg = d3.select("#wordscloud").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .attr("transform", "translate(250,250)");

    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d) { return d.size >= 30 ? colors[Math.floor(Math.random() * colors.length)] : colors[Math.floor(Math.random() * colors.length)];})//colors[Math.floor(Math.random() * colors.length)])
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }
    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }
}



/*
function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(250,250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

//Some sample data - http://en.wikiquote.org/wiki/Opening_lines
var words = [
    "You don't know about me without you have read a book called The Adventures of Tom Sawyer but that ain't no matter.",
    "The boy with fair hair lowered himself down the last few feet of rock and began to pick his way toward the lagoon.",
    "When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
    "It was inevitable: the scent of bitter almonds always reminded him of the fate of unrequited love."
]

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    return words[i]
            .replace(/[!\.,:;\?]/g, '')
            .split(' ')
            .map(function(d) {
                return {text: d, size: 10 + Math.random() * 60};
            })
}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, i) {
    i = i || 0;

    vis.update(getWords(i ++ % words.length))
    setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('body');

//Start cycling through the demo data
showNewWords(myWordCloud);

*/