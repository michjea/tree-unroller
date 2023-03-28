/**
 * Class representing w weighted graph.
 */
class WeightedGraph 
{
    /**
     * Constructor
     */
    constructor()
    {
        this.adjacencyList = {};
        this.tabVisited = [];
        this.tabRencontred = [];
        this.chemin = [];
        this.priorityQueue = null;
        this.mementos = [];
        this.redoMemento = [];
    }
    
    /**
     * Sleep function. 
     * @param {*} ms The number of ms to sleep.
     * @returns A Promise.
     */
    async sleep(ms) {
        return new Promise((resolve, reject) => {setTimeout(resolve, ms)});
    }

    /**
     * Add a new vertex to the graphe.
     * @param {*} vertex The vertex to add.
     */
    addVertex(vertex){
        if(!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }

    /**
     * Add a new edge to the graphe.
     * @param {*} vertex1 The vertex source.
     * @param {*} vertex2 The vertex destination.
     * @param {*} weight The weigth of the edge between.
     */
    addEdge(vertex1, vertex2, weight)
    {
        this.adjacencyList[vertex1].push({node: vertex2, weight: weight});
        this.adjacencyList[vertex2].push({node: vertex1, weight: weight});
    }

    /**
     * Start the Prim algorithm.
     */
    async Prim()
    {
        this.tabVisited = [];
        this.tabRencontred = [];

        for(var i = 0; i < Object.keys(this.adjacencyList).length; i++)
        {
            this.tabVisited.push(false);
            this.tabRencontred.push(false);
        }

        for(const sommet in this.adjacencyList)
        {
            await this.visiterLeSommet(sommet);
        }
        this.atEnd();
    }

    /**
     * Start visiterLeSommet part of Prim algorithm.
     * @param {*} sommet 
     */
    async visiterLeSommet(sommet)
    {
        var sommetIndex = Object.keys(this.adjacencyList).indexOf(sommet);

        if(!this.tabVisited[sommetIndex])
        {
            this.priorityQueue = new PriorityQueue();
            this.priorityQueue.enqueue(sommetIndex, 1);
            
            await this.stage1(sommet);
            
            var sommetCourant = null;
            while(!this.priorityQueue.isEmpty())
            {
                var old = null;
                if(sommetCourant !== null) old = Object.keys(this.adjacencyList)[sommetCourant.element];
                sommetCourant = this.priorityQueue.dequeue();
                var char = Object.keys(this.adjacencyList)[sommetCourant.element];
                
                await this.stage2(char, old);

                this.tabVisited[sommetCourant.element] = true;
                this.tabRencontred[sommetCourant.element] = true;

                console.log("P " +char + " " + sommetCourant.priority);
                
                var length = Object.keys(this.adjacencyList[char]).length;

                for(var i = 0; i < length; i++)
                {
                    var voisinChar = this.adjacencyList[char][i].node;
                    var voisinIndex = Object.keys(this.adjacencyList).indexOf(voisinChar);

                    if(!this.tabVisited[voisinIndex])
                    {
                        var prio = this.adjacencyList[char][i].weight;
                        
                        if(!this.tabRencontred[voisinIndex])
                        {
                            this.priorityQueue.enqueue(voisinIndex, prio);
                            this.chemin[voisinChar] = char;
                            
                            await this.stage1(voisinChar);

                            this.tabRencontred[voisinIndex] = true;
                        } else 
                        {
                            var lastPrio = this.priorityQueue.items.find(a => a.element === voisinIndex).priority;
                            
                            if(prio < lastPrio)
                            {
                                for(var j = 0; j < this.priorityQueue.items.length; j++)
                                {
                                    if (this.priorityQueue.items[j].element === voisinIndex)
                                    {
                                        this.priorityQueue.diminuerPriorite(j, prio);
                                    }
                                }
                                this.chemin[voisinChar] = char;
                                await this.stage3();
                            }
                        }
                    }
                }
            }
        
        }
    }

    /**
     * Start the Dijkstra algorithm.
     * @param {*} start Start node. By default 0.
     */
     Dijkstra(start){
        this.tabVisited = [];
        this.tabRencontred = [];

        for(var i = 0; i < Object.keys(this.adjacencyList).length; i++){
            this.tabVisited.push(false);
            this.tabRencontred.push(false);
        }
        this.visiterPriorite(start);
    }

    /**
     * Start the visiterPriorite part of Dijkstra algorithm.
     * @param {*} sommetCourant Start node. By default 0.
     */
    async visiterPriorite(sommetCourant) {
        if(!this.tabVisited[sommetCourant])
        {
            this.priorityQueue = new PriorityQueue();
            this.priorityQueue.enqueue(sommetCourant, 0);
            var csChar = Object.keys(this.adjacencyList)[sommetCourant];

            // Stage 1 -> first node is added to queue
            await this.stage1(csChar);

            while(!this.priorityQueue.isEmpty())
            {
                var old = Object.keys(this.adjacencyList)[sommetCourant.element];

                sommetCourant = this.priorityQueue.dequeue(); // ->
                var char = Object.keys(this.adjacencyList)[sommetCourant.element];
                
                // Stage 2 -> Node is currently visited
                await this.stage2(char, old);

                this.tabVisited[sommetCourant.element] = true;
                this.tabRencontred[sommetCourant.element] = true;
                
                var length = Object.keys(this.adjacencyList[char]).length;

                for(var i = 0; i < length; i++)
                {
                    var voisinChar = this.adjacencyList[char][i].node;
                    var voisinIndex = Object.keys(this.adjacencyList).indexOf(voisinChar);

                    if(!this.tabVisited[voisinIndex])
                    {
                        var prio = parseInt(sommetCourant.priority) + parseInt(this.adjacencyList[char][i].weight);
                        
                        if(!this.tabRencontred[voisinIndex])
                        {
                            this.priorityQueue.enqueue(voisinIndex, prio); // ->
                            this.chemin[voisinChar] = char;
                            
                            // Stage 1 -> Node is added to the queue
                            await this.stage1(voisinChar);

                            this.tabRencontred[voisinIndex] = true;
                        } else 
                        {
                            var lastPrio = this.priorityQueue.items.find(a => a.element === voisinIndex).priority;

                            if(prio < lastPrio)
                            {
                                for(var j = 0; j <this.priorityQueue.items.length; j++)
                                {
                                    if (this.priorityQueue.items[j].element === voisinIndex)
                                    {
                                        this.priorityQueue.diminuerPriorite(j, prio);
                                    }
                                }
                                this.chemin[voisinChar] = char;
                                
                                // Stage 3 -> Node priority is modified
                                await this.stage3();
                            }
                        }
                    }
                }
            }
        }
        this.atEnd();
    }

    /**
     * Start stage. Empty the redo array before continuing the algorithm.
     */
    async stageStart()
    {
        if(!isPause && !isOneStep){
            while(this.redoMemento.length !== 0){
                this.redo();
                await this.sleep(500);
            }
        }
    }

    /**
     * First stage. Change priority queue added node color to orange.
     * @param {*} char The node id.
     */
    async stage1(char){
        await this.stageStart();
        s.graph.nodes().forEach(n => {
            if(n.id === char)
            {
                n.color = "orange";
            }
        });
        await this.stageEnd();
    }

    /**
     * Second stage. Change visited node color to green. Change currently visiting node color to red. Draw a path between visited nodes.
     * @param {*} char The current node id.
     * @param {*} old The old node id.
     */
    async stage2(char, old){
        await this.stageStart();
        s.graph.nodes().forEach(n => {
            if(n.id === char)
            {
                n.color = "red";
            }
            if(n.id === old)
            {
                n.color = "green";
            }
        });
        
        if(this.chemin[char])
        {
            s.graph.edges().forEach(e => {
                e.label = e.label;
                if((e.source === char && e.target === this.chemin[char]) || (e.target === char && e.source === this.chemin[char]))
                {
                    e.size = 3;
                    e.color = 'black';
                }
            });
        }
        await this.stageEnd();
    }

    /**
     * Third stage. Just update the priority queue.
     */
    async stage3(){ 
        await this.stageStart();
        await this.stageEnd();
    }

    /**
     * End stage. Refresh Sigma JS graphe. Save state in memento array. Sleep soms ms or indefinitely if pause.
     */
    async stageEnd(){
        s.refresh();
        if(this.priorityQueue !== null) createQueue(this.priorityQueue.items);

        this.saveGraphAndQueue();

        if(!isPause && !isOneStep){
            await this.sleep(500);
        } else {
            if(isOneStep) {
                isPause = true
                isOneStep = false;
            };
            while(isPause){
                await this.sleep(100);
            }
        }
    }

    /**
     * Called at the end of algorithm. Reset some inputs and variables.
     */
    atEnd(){
        document.getElementById("pauseBtn").disabled = true;
        document.getElementById("playBtn").disabled = false;
        document.getElementById("bBtn").disabled = true;
        document.getElementById("fBtn").disabled = true;
        disableEnableParams(false);
        isPause = false;
    }

    /**
     * Save the graph and priority queue in memento array
     */
    saveGraphAndQueue()
    {
        var graph_ = {
            nodes : [],
            edges : []
        };
        graph_.nodes = s.graph.nodes();
        graph_.edges = s.graph.edges();
        var copy = JSON.parse(JSON.stringify(graph_));
        var memento = [copy, this.priorityQueue.items.slice()];
        this.mementos.push(memento);
    }

    /**
     * Deep copy of graph array and priority queue.
     * @param {*} m The graph to deep copy.
     * @returns An array containing a copy of graph array and priority queue.
     */
    deepCopy(m)
    {
        var graph_ = {
            nodes : [],
            edges : []
        };
        graph_.nodes = m[0].nodes.slice();
        graph_.edges = m[0].edges.slice();
        var copy = JSON.parse(JSON.stringify(graph_));
        var r = [copy, m[1].slice()];
        return r;
    }

    /**
     * Step backward function.
     */
    undo()
    {
        var currentMemento;
        currentMemento = this.mementos.pop()
        this.redoMemento.push(JSON.parse(JSON.stringify(this.deepCopy(currentMemento))));
        
        var lastMemento = this.mementos.pop();
        this.mementos.push(lastMemento);

        s.graph.nodes().forEach(function(n, i){
            for (const [key, value] of Object.entries(n)) {
                if(key !== "id") n[key] = lastMemento[0].nodes[i][key];
            }
        });
        s.graph.edges().forEach(function(e, j){
            for (const [key, value] of Object.entries(e)) {
                if(key !== "id" && key != "source" && key != "target") e[key] = lastMemento[0].edges[j][key];
            }
        });
        s.refresh();
        createQueue(lastMemento[1]);
    }

    /**
     * Step forward function.
     */
    redo()
    {
        var nextMemento = this.redoMemento.pop();
        this.mementos.push(JSON.parse(JSON.stringify(this.deepCopy(nextMemento))));
        
        s.graph.nodes().forEach(function(n, i){
            for (const [key, value] of Object.entries(n)) {
                if(key !== "id") n[key] = nextMemento[0].nodes[i][key];
            }
        });
        s.graph.edges().forEach(function(e, j){
            for (const [key, value] of Object.entries(e)) {
                if(key !== "id" && key != "source" && key != "target") e[key] = nextMemento[0].edges[j][key];
            }
        });
        s.refresh();
        createQueue(nextMemento[1]);
    }
}

/**
 * Class representing a priority queue element.
 */
class QElement {
    constructor(element, priority){
        this.element = element;
        this.priority = priority;
    }
}

/**
 * Class representing a priority queue.
 */
class PriorityQueue 
{
    /**
     * Constructor
     */
    constructor(){
        this.items = [];
    }
    
    /**
     * Lower the priority of an element.
     * @param {*} i The index of the element to lower the priority to.
     * @param {*} priority The new priority.
     */
    diminuerPriorite(i, priority){
        if(priority > this.items[i].priority){
            console.log("error, new priority greater than last one");
        }
        this.items[i].priority = priority;

        var iSur2 = i/2;

        while(i > 1 && this.items[iSur2].priority > this.items[i].priority){
            var temp = this.items[i];
            this.items[i] = this.items[iSur2];
            this.items[iSur2] = temp;
            i = i/2;
            iSur2 = i/2;
        }
    }

    /**
     * Enque a new element.
     * @param {*} element The element to be added.
     * @param {*} priority The element priority.
     */
    enqueue(element, priority)
    {
        var qElement = new QElement(element, priority);
        var contain = false;
    
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.items.push(qElement);
        }
    }

    /**
     * Dequeue first element.
     * @returns The dequeud element.
     */
    dequeue()
    {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    /**
     * First element.
     * @returns The first element
     */
    front()
    {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    /**
     * Rear function. Unused.
     * @returns 
     */
    rear()
    {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }

    /**
     * Returns if queue is empty.
     * @returns If queue is empty.
     */
    isEmpty()
    {
        return this.items.length == 0;
    }
}