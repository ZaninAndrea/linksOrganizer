import React, {Component} from 'react';
import "./stylesheets/App.css"
const electron = window.require('electron'); // little trick to import electron in react
const ipcRenderer = electron.ipcRenderer;

class Results extends Component {
    constructor(props) {
        super(props);
        ipcRenderer.on("linkPreviewReady", this.forceUpdate.bind(this))
    }

    render() {
        return <div>{this.props.links.map((x, idx) => <div key={x.link} dangerouslySetInnerHTML={{__html: ipcRenderer.sendSync('linkPreview', x.link, x.tags, x.type)}}/>)}</div>
    }
}

export default Results;
