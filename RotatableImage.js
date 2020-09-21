import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';

import RotateView from './RotateView';

const styles = StyleSheet.create({
  image:{
    ...StyleSheet.absoluteFill,
    width:'100%',
    height:'100%',
  }
})

export default class RotatableImage extends Component {
  static Direction = RotateView.Direction;
  static Type = RotateView.Type;

  static defaultProps = {
    ...RotateView.defaultProps,
    resizeMode:'cover',
    imageStyle:[],
    images:[],
  }

  constructor( props ){
    super( props );
    this.state = {
    }
  }

  get count(){
    return this.props.images.length;
  }

  get isRotate(){
    return this._rotateRef ? this._rotateRef.isRotate : false;
  }
  
  start(){
    this._rotateRef && this._rotateRef.start();
  }
  
  stop(){
    this._rotateRef && this._rotateRef.stop();
  }

  rotateTo( ...args ){
    this._rotateRef && this._rotateRef.rotateTo( ...args );
  }

  render(){
    const {sources, resizeMode, imageStyle} = this.props;
    return (
      <RotateView
        {...this.props}
        ref={r=>this._rotateRef=r}
      >
        {sources.map((source, index)=>{
          return (
            <Image 
              key={`image-${index}`}
              source={source} 
              style={[styles.image, imageStyle]} 
              resizeMode={resizeMode}
            />
          )
        })}
      </RotateView>
    )
  }
}
