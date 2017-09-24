import React, {Component} from 'react';
import "./stylesheets/App.css"
import 'antd/dist/antd.css'; // or antd/lib/button/style/css for css format file
import Results from "./Results"
import { Input, Select } from 'antd';
const Search = Input.Search;
const Option = Select.Option;

const electron = window.require('electron'); // little trick to import electron in react
const ipcRenderer = electron.ipcRenderer;

const Store = electron.remote.require('electron-store');
const store = new Store();

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
        this.save = this.save.bind(this)

        const loadedLinks = store.get('links')
        this.state = {
            query:"",
            linkSelected:"",
            typeSelected:"generic",
            tagsSelected:[],
            links: loadedLinks ? loadedLinks : []
        }

    }

    save(){
        ipcRenderer.sendSync('save', this.state.links)
    }

    render() {
        console.log(this.state.tagsSelected)
        return <div>
            <Search
                placeholder="input search text"
                style={{ width: 200 }}
                onChange={e => this.setState({query:e.target.value})}
              />
              <button onClick={this.save}>SAVE </button>
             <Input
                  placeholder="input link"
                  style={{ width: 200 }}
                  onChange={e => this.setState({linkSelected:e.target.value})}
                />
            <Select value={this.state.typeSelected} style={{ width: 80 }} onChange={(value)=>this.setState({typeSelected: value})}>
              <Option value="generic">generic</Option>
              <Option value="book"> book</Option>
              <Option value="article"> article</Option>
              <Option value="course"> course</Option>
              <Option value="wiki"> wiki</Option>
              <Option value="repo"> repo</Option>
              <Option value="list"> list</Option>
              <Option value="video"> video</Option>
              <Option value="paper"> paper</Option>
              <Option value="podcast"> podcast</Option>
              <Option value="quora"> quora</Option>
              <Option value="stack-ex"> stack-ex</Option>
              <Option value="stack-ov"> stack-ov</Option>
              <Option value="image"> image</Option>
            </Select>
            <Input
                 placeholder="tags"
                 style={{ width: 200 }}
                 onChange={e => this.setState({tagsSelected:e.target.value.split(',').map(item => ({text:item.trim()}))})}
               />
            <button onClick={()=>{
                const newLinks = [...this.state.links,{
                    tags:this.state.tagsSelected,
                    type:this.state.typeSelected,
                    link:this.state.linkSelected}
                ]
                this.setState({links:newLinks})
                store.set('links',newLinks)
                }}>ADD LINK </button>
            <Results links={search(this.state.links, this.state.query)} />
        </div>
    }
}

export default App;
