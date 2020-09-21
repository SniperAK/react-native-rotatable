import React, {Component} from 'react';
import {
  View,
  PanResponder,
} from 'react-native';

const DirectionLeft  = 'left';
const DirectionRight = 'right';

export default class DirectionGesture extends Component{
  static defaultProps = {
    recognizeDistance:50,
    pressTime:200,
    onDirection:()=>{}
  }

  static DirectionLeft  = DirectionLeft;
  static DirectionRight = DirectionRight;

  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState)            => true,
      onStartShouldSetPanResponderCapture: (event, gestureState)     => true,
      onMoveShouldSetPanResponder: (event, gestureState)             => false,
      onMoveShouldSetPanResponderCapture: (event, gestureState)      => false,
      onPanResponderGrant: ({nativeEvent:{locationX}}, gestureState) => {
        this._startLocationX = locationX;
        this._startTime = Date.now();
      },
      onPanResponderMove: (event, gestureState)                      => false,
      onPanResponderRelease: ({nativeEvent:{locationX}}, gestureState)                   => {
        let distance = locationX - this._startLocationX;
        // console.log( Date.now() - this._startTime)
        if( Math.abs( distance ) > props.recognizeDistance && this.props.onDirection ){
           this.props.onDirection( distance > 0 ? DirectionRight : DirectionLeft, Math.abs( distance ) );
        }
        else if( Date.now() - this._startTime < this.props.pressTime ){
          this.props.onPress && this.props.onPress();
        }
      },
    });  
  }

  render() {
    const {style, children} = this.props;
    return (
      <View style={style} {...this.panResponder.panHandlers}>
        {children}
      </View>
    );
  }
}


