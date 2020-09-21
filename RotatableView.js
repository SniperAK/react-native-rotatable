import React, {Component, Children} from 'react';
import {
  View, 
  Easing,
  Animated,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container:{
    position:'relative',
    overflow:'hidden',
  },
  wrapper:{
    ...StyleSheet.absoluteFill,
  }
})

const Direction = {
  Left:'left',
  Right:'right',
}

const Type = {
  SlideInOut:'slideInOut',
  FadeInOut:'fadeInOut',
}

export default class RotatableView extends Component {
  static Direction = Direction;
  static Type = Type;

  static defaultProps = {
    direction:Direction.Left,
    type:Type.SlideInOut,
    autoStart : false,
    duration: 10 * 1000, 
    transitionDuration:500,
    transitionWillStart:( index )=>{},
    transitionDidFinish:( index )=>{},
  }

  constructor( props ){
    super( props );
    this.state = {
      index:0
    }
    this._rotation = new Animated.Value(1);
  }
  componentDidMount(){
    this.props.autoStart && this.start();
  }

  componentWillUnmount(){
    this.stop();
  }

  get children(){
    return (this.props.children && Array.isArray(this.props.children) ) ? this.props.children : [this.props.children].filter(e=>e);
  }

  get count(){
    return this.children.length;
  }

  get isRotate(){
    return this._isRotate;
  }
  
  start(){
    this._rotate();
    this._isRotate = true;
  }
  
  stop(){
    this._isRotate = false;
    if( this._roateTimeoutRef ){
      this._roateTimeoutRef = clearTimeout(this._roateTimeoutRef);
      delete this._roateTimeoutRef;
    }
    if( this._rotateAnimated ){
      this._rotateAnimated.stop();
    }
  }

  _rotateAnimation({ direction, index } = {}){
    const {index: beforeIndex} = this.state;
    const {
      transitionDuration, 
      transitionWillStart, 
      transitionDidFinish,
    } = this.props; 
    const count = this.count;

    if( !direction ) direction = this.props.direction;
    if( typeof index == 'undefined' ) index = beforeIndex + (direction == Direction.left ? -1 : 1);
    
    index = (count + index) % count;
    
    transitionWillStart && transitionWillStart( index );
    this.setState({index, direction},()=>{
      this._rotation.setValue(0);
      this._rotateAnimated = Animated.timing( this._rotation,{
        toValue:1, 
        duration:transitionDuration,
        easing:Easing.inOut(Easing.ease),
        useNativeDriver:false,
      });
      this._rotateAnimated.start(()=>{
        this._rotateAnimated = null; 
        transitionDidFinish && transitionDidFinish( index );
        this._rotate();
      });
    });
  }

  _rotate(){
    this._roateTimeoutRef = setTimeout(()=>{
      this.stop();
      this._rotateAnimation();
    }, this.props.duration);
  }

  rotateTo( index, direction ){
    this.stop();
    this._rotateAnimation( {direction, index });
  }

  render(){
    const {style, type} = this.props;
    const {width, index:indexIn, direction} = this.state;
    const count = this.count;
    
    if( !width ) return <View style={[styles.container, style]} onLayout={({nativeEvent:{layout:{width}}})=>this.setState({width})} />
    
    const directionFactor = (direction == Direction.Right ? -1 : 1);
    
    const indexOut = (count + (indexIn - directionFactor)) % count;

    const transitionIn = type == Type.FadeInOut ? {
      opacity:this._rotation.interpolate({
        inputRange:[0,1],
        outputRange:[0,1],
      })
    } : {transform:[{
      translateX:this._rotation.interpolate({
        inputRange:[0,1],
        outputRange:[width * directionFactor, 0],
      })
    }]};

    const transitionOut = type == Type.FadeInOut ? {
      opacity:this._rotation.interpolate({
        inputRange:[0,1],
        outputRange:[1,0],
      })
    } : {transform:[{
      translateX:this._rotation.interpolate({
        inputRange:[0,0.3,1],
        outputRange:[0,0,-width * directionFactor],
      })
    }]};

    const transitionNone = {opacity:0, transform:[{translateX:width}]};

    let rotateContent = this.children.map((item, index)=>{
      let zIndex = -2, transition = transitionNone;
      if( index == indexIn ){
        zIndex = 0;
        transition = transitionIn;
      }
      else if( index == indexOut ){
        zIndex = -1; 
        transition = transitionOut;
      }
      return (
        <Animated.View key={index} style={[styles.wrapper, {zIndex}, transition]}>
          {item}
        </Animated.View>
      )
    })

    return (
      <View style={[styles.container, style]} onLayout={({nativeEvent:{layout:{width, height}}})=>this.setState({width, height})}>
        {rotateContent}
      </View>
    );
  }
}