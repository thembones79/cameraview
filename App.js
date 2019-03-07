import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    cameraPermission: null
  };

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA).then(({ status }) =>
      this.setState({
        cameraPermission: status === "granted"
      })
    );
  }

  render() {
    const { cameraPermission } = this.state;

    return (
      <View style={styles.container}>
        {cameraPermission === null ? (
          <Text>Waiting for permission...</Text>
        ) : cameraPermission === false ? (
          <Text>Permission denied</Text>
        ) : (
          <Autoshoot />
        )}
      </View>
    );
  }
}

const PHOTO_INTERVAL = 30000;
const FOCUS_TIME = 3000;

class Autoshoot extends React.Component {
  state = {
    photo: null
  };

  componentDidMount() {
    this.countdown = setTimeout(this.takePicture, PHOTO_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  takePicture = () => {
    this.camera
      .takePictureAsync({
        quality: 0.1,
        base64: true,
        exif: false
      })
      .then(photo => {
        this.setState({ photo });

        // in 27 seconds, turn the camera back on
        setTimeout(() => {
          clearPhoto();
        }, PHOTO_INTERVAL - FOCUS_TIME);

        // in 30 seconds, take the naxt picture
        setTimeout(this.takePicture, PHOTO_INTERVAL);
      });
  };

  clearPhoto = () => {
    this.setState({ photo: null });
  };

  render() {
    const { photo } = this.state;
    return (
      <View style={{ flex: 1, width: "100%" }}>
        {photo ? (
          <ImageBackground style={{ flex: 1 }} source={{ uri: photo.uri }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={this.clearPhoto} />
          </ImageBackground>
        ) : (
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            ref={cam => (this.camera = cam)}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={this.takePicture} />
          </Camera>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
