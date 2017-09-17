import React, {Component} from 'react';
import "./stylesheets/App.css"
import 'antd/dist/antd.css'; // or antd/lib/button/style/css for css format file
import Results from "./Results"
import { Input } from 'antd';

const Search = Input.Search;
const electron = window.require('electron'); // little trick to import electron in react
const ipcRenderer = electron.ipcRenderer;

String.prototype.fuzzyContains = function (s) {
    var hay = this.toLowerCase(),
        i = 0,
        n = -1,
        l;

    s = s.toLowerCase();
    for (; l = s[i++] ;){
        if (!~(n = hay.indexOf(l, n + 1))){
            return false;
        }
    }
    return true;
};

const search = (links, query) => links.filter(link =>
                                                link.link.fuzzyContains(query) ||
                                                link.tags.reduce((acc,tag) => tag.text.fuzzyContains(query) || acc, false))

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            query:"",
            links: [{
                tags: [{text:"math", color:"red"},{text:"game theory", color:"green"}],
                type: "interactive",
                link: "http://ncase.me/trust/"
            },{
                tags: [{text:"math", color:"red"},{text:"digital signal processing", color:"purple"}],
                type: "interactive",
                link: "https://jackschaedler.github.io/circles-sines-signals/"
            }]
        }

    }

    render() {
        return <div>
            <Search
                placeholder="input search text"
                style={{ width: 200 }}
                onChange={e => this.setState({query:e.target.value})}
              />
            <Results links={search(this.state.links, this.state.query)} />
        </div>
    }
}

export default App;
