var React = require('react');
var ReactDOM = require('react-dom')
import {Editor, EditorState,RichUtils,Draft,convertToRaw,convertFromRaw,ContentState,convertFromHTML,CompositeDecorator} from 'draft-js';

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function(character){
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
}

const Link = function(props){
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url}>
        {props.children}
      </a>
    );
};

export const decorator = new CompositeDecorator(
    [/*
        {
        strategy: findLinkEntities,
        component: Link,
        }*/
    ]
)
        

