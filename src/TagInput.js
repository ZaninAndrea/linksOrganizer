import React, {Component} from 'react';

class Results extends Component {
    render() {
        return <Input
                 placeholder="tags"
                 style={{ width: 200 }}
                 onChange={e => this.setState({tagsSelected:e.target.value.split(',').map(item => ({text:item.trim()}))})}
               />
    }
}

export default Results;
