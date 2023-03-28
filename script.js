/** ***********************************
 * VARIABLES
 * ***********************************/

var graphe = new WeightedGraph();
var graph = {
    nodes: [],
    edges: []
};
var radio = 'p';
var s = new sigma();

var isPause = false;
var isOneStep = false;

/** ***********************************
 * FUNCTIONS
 * ***********************************/

/**
 * Called on Prim radio button click. Update dropdown.
 */
function onPrimClick(){
    radio = 'p';
    document.getElementById("pseudo-code").innerHTML = '';
    $(function(){
        $("#pseudo-code").load("pseudo-code-prim.html");
    });
}

/**
 * Called on Dijkstra radio button click. Update dropdown.
 */
function onDijkstraClick(){
    radio = 'd';
    document.getElementById("pseudo-code").innerHTML = '';
    $(function(){
        $("#pseudo-code").load("pseudo-code-djikstra.html");
    });
}

/**
 * Display the priority queue in a table.
 * @param {*} queue The priority queue items.
 */
function createQueue(queue){
    var a = '<tbody><tr>';
    for(elem in queue){
        var name = Object.keys(graphe.adjacencyList)[queue[elem].element]
        a+= "<td>"+name+"</td>";
    }
    a+="</tr><tr>"
    for(elem in queue){
        a+= "<td>"+queue[elem].priority+"</td>";
    }

    a+="</tr></tbody>";
    var qc = document.getElementById("queue-container");
    console.log(qc);
    qc.innerHTML = a;
}

/**
 * Called on start button click.
 */
function onStartClick(){
    document.getElementById("playBtn").disabled = true;
    document.getElementById("pauseBtn").disabled = false;
    document.getElementById("fBtn").disabled = true;
    document.getElementById("bBtn").disabled = true;
    
    if(!isPause)  
    {
        resetGraph();
        disableEnableParams(true);
        
        if(radio === 'p') graphe.Prim();
        if(radio === 'd') graphe.Dijkstra(0);
    }
    else {
        isPause = false;
    }
}

/**
 * Called on pause button click.
 */
async function onPauseClick(){
    isPause = true;

    document.getElementById("pauseBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;

    document.getElementById("fBtn").disabled = false;
    document.getElementById("bBtn").disabled = false;
}

/**
 * Called on step backward click.
 */
function onBackwardClick(){
    if(graphe.mementos.length !== 0)
    {
        graphe.undo();
    }
}

/**
 * Called on step forward click.
 */
function onForwardClick(){
    if(graphe.redoMemento.length !== 0)
    {
        graphe.redo();
    } else
    {
        isOneStep = true;
        isPause = false;
    }
}

/**
 * Disable or enable the params inputs.
 * @param {*} disable True if the params inputs should be disabled.
 */
function disableEnableParams(disable)
{ 
    var params = document.getElementsByClassName("btnParam");
    for(var i = 0; i < params.length; i++)
    {
        params[i].disabled = disable;
    }
}

/**
 * Reset the graph.
 */
function resetGraph()
{
    s.graph.nodes().forEach(n => {
        n.color = 'lightgrey'
    });

    s.graph.edges().forEach(e => {
        e.color = 'lightgrey';
        e.size = 2;
        e.label = e.label;
    });
}

/**
 * Called on table update. Update datas.
 */
function onInputChange(){
    var table = document.getElementById("data-table");
    var rowCount = table.rows.length;
    var datas = [];

    for(i = 1; i < rowCount-1; i++)
    {
        var rowCells = table.rows.item(i).cells;
        var sommet1 = rowCells.item(1).getElementsByTagName("input")[0].value;
        var sommet2 = rowCells.item(2).getElementsByTagName("input")[0].value;
        var poids = rowCells.item(3).getElementsByTagName("input")[0].value;

        if((sommet1 !== "" || sommet2 !== "") && sommet1 !== sommet2)
        {
            if(poids === "") poids = "0";
            var data = [sommet1, sommet2, poids]
            datas.push(data);
        }
    }

    createVisualGraph(datas);
    createGraph(datas);
}

/**
 * Add a new row to the data table.
 */
function addRow(){
    var table = document.getElementById("data-table");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount-1);

    var cell1 = row.insertCell(0);
    var button = `<button class="btn btn-primary btnParam" onclick="deleteRow(this)"><b>-</b></button>`;
    cell1.innerHTML = button;

    var cell2 = row.insertCell(1);
    var input = `<input type="text" class="form-control btnParam" placeholder="" aria-label="" aria-describedby="basic-addon2" oninput="onInputChange()" value="">`;
    cell2.innerHTML = input;

    var cell3 = row.insertCell(2);
    cell3.innerHTML = input;

    var nInput = `<input type="number" class="form-control btnParam" placeholder="" aria-label="" aria-describedby="basic-addon2" oninput="onInputChange()" value="">`
    var cell4 = row.insertCell(3);
    cell4.innerHTML = input;
}

/**
 * Delete a row from the data table.
 * @param {*} t 
 */
function deleteRow(t){
    try {
        var row = t.parentNode.parentNode;
        document.getElementById("data-table").deleteRow(row.rowIndex);
        onInputChange();
        }catch(e) {
            alert(e);
        }
}

/**
 * Create a new Sigma JS graph.
 * @param {*} datas The nodes and edges for the graph.
 */
function createVisualGraph(datas) {
    document.getElementById('sigma-container').innerHTML = '';

    // Initialise sigma:
    s = new sigma(
        {
        renderer: {
            container: document.getElementById('sigma-container'),
            type: sigma.renderers.canvas
        },
        settings: {
            edgeLabelSize: 'proportional',
            minEdgeSize: 1,
            maxEdgeSize: 3,
            minNodeSize: 3,
        }
        }
    );

    graph = {
        nodes: [],
        edges: []
    };

    var pushed = [];

    for(const item of datas){
        if(item[0]!==""){
            if(!pushed.includes(item[0])){
                    graph.nodes.push({
                        id: item[0],
                        label: item[0],
                        x: Math.random(),
                        y: Math.random(),
                        size: 3,
                        color: 'lightgrey' // white
                    });
                pushed.push(item[0]);
                }
        }

        if(item[1]!==""){
            if(!pushed.includes(item[1])){
                graph.nodes.push({
                    id: item[1],
                    label: item[1],
                    x: Math.random(),
                    y: Math.random(),
                    size: 3,
                    color: 'lightgrey'
                })
            }
            pushed.push(item[1]);
        }
    }

    for(const item of datas){
        if(item[0]!=="" && item[1]!==""){
            graph.edges.push({
                id: 'e'+item[0]+item[1],
                source: item[0],
                target: item[1],
                label: (item[2] === "" ? "0" : item[2].toString()),
                color: 'lightgrey',
                type:'line',
                size: 1
            });
        }

    }
  
    s.graph.read(graph);
    s.refresh();

    s.startForceAtlas2();
    window.setTimeout(function() {s.killForceAtlas2()}, 1000);  
} 

/**
 * Create a weighted graph with datas.
 * @param {*} datas The nodes and edges for the graph.
 */
function createGraph(datas)
{
    graphe = new WeightedGraph();
    for(const data in datas)
    {
        var s1 = datas[data][0];
        var s2 = datas[data][1];
        var a = datas[data][2];
        if(s1 !== '') graphe.addVertex(s1);
        if(s2 !== '') graphe.addVertex(s2);
        if(s1 !== '' && s2 !== '' && a !== '')
        {
            graphe.addEdge(s1, s2, a);
        };
    }
}