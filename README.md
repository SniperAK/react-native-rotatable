# react-native-rotatable
React Native Rotatable Component


## install

- using npm 
``` 
npm install react-native-rotatable --save
```

- using yarn
```
yarn add react-native-rotatable
```


## useage

```javascript 
<DirectionGesture 
  style={{height:200}} 
  onDirection={( direction )=>{
    let {index} = this.state;
    index += ((direction == DirectionGesture.DirectionRight ) ? -1 : 1);
    this._rotateImageRef.rotateTo( index, direction );
  }} 
  onPress={()=>{
    
  }}
>
  <RotateImage 
    ref={r=>this._rotateImageRef=r}
    style={{height:200}}
    autoStart={true}
    sources={[
      require('image1')
      require('image2'),
    ]} 
    duration={10 * 1000}
    transitionDuration={300}
    transitionWillStart={(index)=>this.setState({index})}
  />
</DirectionGesture>
```