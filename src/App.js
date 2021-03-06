import React, { useRef, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
// import * as cocossd from "@tensorflow-models/coco-ssd";
// import { loadGraphModel } from "@tensorflow/tfjs-converter";
import Webcam from "react-webcam";
// 2. TODO - Import drawing utility here
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network

    // const net = await tf.loadGraphModel(
    //   "file://../models/bruiseduck-detector/model.json"
    // );

    // const net = await tf.loadGraphModel(
    //   "../models/bruiseduck-detector/model.json"
    // );

    // const net = await tf.loadGraphModel(
    //   "http://localhost:8888/api/v2/model.json"
    // );

    // const net = await cocossd.load();

    // https://raw.githubusercontent.com/saeung2532/bruiseduck/main/models/bruiseduck-detector/model.json

    // https://raw.githubusercontent.com/hugozanini/TFJS-object-detection/master/models/kangaroo-detector/model.json

    // https://tensorflow-detection.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json

    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json

    const net = await tf.loadGraphModel(
      // "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"
      // "https://raw.githubusercontent.com/saeung2532/bruiseduck/main/models/detection_v4/model.json"
      // "https://raw.githubusercontent.com/saeung2532/bruiseduck/main/models/detection_v5/model.json"
      // "https://raw.githubusercontent.com/saeung2532/bruiseduck/main/models/detection_v6/model.json"
      "https://raw.githubusercontent.com/saeung2532/bruiseduck/main/models/detection_v7/model.json"
      // "https://raw.githubusercontent.com/saeung2532/bruiseduck/main/models/detection_v8/model.json"
    );

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video);
      // console.log(img);

      const resized = tf.image.resizeBilinear(img, [640, 480]);
      // console.log(resized);

      const casted = resized.cast("int32");
      // console.log(casted);

      const expanded = casted.expandDims(0);
      // console.log(expanded);

      const obj = await net.executeAsync(expanded);
      // console.log(obj);
      // 'detection_boxes,detection_classes,detection_features,detection_multiclass_scores,detection_scores,num_detections,raw_detection_boxes,raw_detection_scores'

      // obj.forEach((t) => t.print()); // log out the data of all tensors
      // const data = [];
      // for (let i = 0; i < obj.length; i++) {
      //   console.log(obj[i].dataSync());
      //   data.push(obj[i].dataSync()); // get the data
      // }

      const boxes = await obj[0].array();
      const classes = await obj[1].array();
      const features = await obj[2].array();
      const scores = await obj[3].array();
      const obj5 = await obj[4].array();
      const obj6 = await obj[5].array();
      const obj7 = await obj[6].array();
      const obj8 = await obj[7].array();

      // const boxes = await obj[0].array();
      // const classes = await obj[1].array();
      // const features = await obj[2].array();
      // const multiclass_scores = await obj[3].array();
      // const scores = await obj[4].array();

      // console.log(boxes[0]);
      // console.log(classes[0]);
      // console.log(features[0]);
      // console.log(multiclass_scores[0]);
      // console.log(scores[0]);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx);
      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          features[0],
          scores[0],
          obj5[0],
          obj6[0],
          obj7[0],
          obj8[0],
          0.5,
          videoWidth,
          videoHeight,
          ctx
        );
      });

      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
