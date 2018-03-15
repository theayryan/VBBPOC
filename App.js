/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import Camera from 'react-native-camera';
import renderIf from './renderIf'
import Dimensions from 'Dimensions';
import Gestures from 'react-native-easy-gestures';
const {width, height} = Dimensions.get('window');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var image1 = require('./assets/tv3_masked.png');
var image2 = require('./assets/wallclock.png');
var image3 = require('./assets/tv200_masked.png');

const images = {
  one: image1,
  two: image2,
  three: image3
}

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.camera = null;

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.temp,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      isRecording: false,
      showControls:true,
      imageCaptured: false,
    };
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then((data) => {
          console.log(data)
          this.setState({
            showControls: false,
            imageCaptured: true,
            image: data
          });
        })
        .catch(err => console.error(err));
    }
  }

  startRecording = () => {
    if (this.camera) {
      this.camera.capture({mode: Camera.constants.CaptureMode.video})
          .then((data) => console.log(data))
          .catch(err => console.error(err));
      this.setState({
        isRecording: true
      });
    }
  }

  stopRecording = () => {
    if (this.camera) {
      this.camera.stopCapture();
      this.setState({
        isRecording: false
      });
    }
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_flash_off_white.png');
    }

    return icon;
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.imageCaptured) {

    }
  }

  handleBackButtonClick() {
    if (this.state.showControls === false) {
      this.setState({
        showControls: true,
        imageCaptured: false,
        image: null
      });
    } else {
      BackHandler.exitApp();
    }
    return true;
  }

  switchImage = (imagePath) => {
    this.setState({
      overlayImage: imagePath
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated
          hidden
        />
        {
          renderIf(this.state.showControls)(
            <Camera
              ref={(cam) => {
                this.camera = cam;
              }}
              style={styles.preview}
              aspect={this.state.camera.aspect}
              captureTarget={this.state.camera.captureTarget}
              type={this.state.camera.type}
              flashMode={this.state.camera.flashMode}
              onFocusChanged={() => {}}
              onZoomChanged={() => {}}
              defaultTouchToFocus
              mirrorImage={false}
            />
          )
        }
        {
          renderIf(this.state.showControls)(
            <View style={[styles.overlay, styles.topOverlay]}>
                <TouchableOpacity
                  style={styles.typeButton}
                  onPress={this.switchType}
                >
                  <Image
                      source={this.typeIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flashButton}
                  onPress={this.switchFlash}
                >
                  <Image
                      source={this.flashIcon}
                  />
                </TouchableOpacity>
            </View>
          )
        }
        {
          renderIf(this.state.showControls)(
            <View style={[styles.overlay, styles.bottomOverlay]}>
              {
                !this.state.isRecording
                &&
                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={this.takePicture}
                >
                  <Image
                      source={require('./assets/ic_photo_camera_36pt.png')}
                  />
                </TouchableOpacity>
                ||
                null
              }
            </View>
            )
        }
        {
          this.state.image != null
          &&
          renderIf(this.state.imageCaptured)(
            <View style={styles.preview}>
              <Image
                source={{uri: this.state.image.path}}
                resizeMode='contain'
                style={{
                  flex: 1,
                  width: width,
                  height: height,
                  resizeMode: 'cover'
                }}
              />
            </View>
          )          
        }
        {
          this.state.overlayImage != null
          &&
          <View
          style={{
            position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
          }}>
            <Gestures>
              <Image
                source={this.state.overlayImage}
                resizeMode='contain'
                style={{
                  flex: 1,
                  width: width,
                  height: height,
                  resizeMode: 'contain'
                }}
              />
            </Gestures>
          </View>
        }
        {
          renderIf(this.state.showControls)(
            <View style={styles.sideOverlay}>
              <TouchableOpacity
                onPress={this.switchImage.bind(this, images.one)}  
              >
                <Image
                  source={require('./assets/tv3_masked.png')}
                  resizeMode='contain'
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: 'contain',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.switchImage.bind(this, images.two)}
              >
                <Image
                  source={require('./assets/wallclock.png')}
                  resizeMode='contain'
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: 'contain',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.switchImage.bind(this, images.three)}
              >
                <Image
                  source={require('./assets/tv200_masked.png')}
                  resizeMode='contain'
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: 'contain',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                  }}
                />
              </TouchableOpacity>    
            </View>
          ) 
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideOverlay: {
    position: 'absolute',
    flexDirection: 'column',
    left: 0,
    top: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});