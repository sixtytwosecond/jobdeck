var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table,Loader,Dimmer} from 'semantic-ui-react'

import Main from "./containers/Main.js"
import {Reducers} from "./reducers/Reducers.js"
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const store = createStore(Reducers)

var App = React.createClass({ 
    render: function(){  
        return(
            <Provider store={store}>
                <Main/>
            </Provider>
        )
       
    }
});

ReactDOM.render(React.createElement(App), document.getElementById('main'));
