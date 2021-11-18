import React, { useEffect } from "react";
import {
  CubismFramework,
  LogLevel,
  Option,
} from "../cubismSDK/Framework/src/live2dcubismframework";
import { CubismModelSettingJson } from "../cubismSDK/Framework/src/cubismmodelsettingjson";
import { LAppModel } from "../cubismSDK/Demo/src/lappmodel";
import { LAppPal } from "../cubismSDK/Demo/src/lapppal";

const resourcesPath = "../../public/resources";
const modelDir = ["Haru", "Hiyori", "Mark", "Natori", "Rice"];

export const Live2DCanvas = () => {
  // modelDirのindex．
  // 後から，Movie→FaceTracker→Live2DCanvasの順にして，indexをpropsで受け取るようにする
  const index = 0;

  let cubismOption = new Option();

  // prepare for Cubism Framework API.
  cubismOption.logFunction = LAppPal.printMessage;
  cubismOption.loggingLevel = LogLevel.LogLevel_Info;
  CubismFramework.startUp(cubismOption);

  // initialize cubism
  CubismFramework.initialize();

  // TypeScript
  // const dir: string = "example/";
  // const fileName: string = "example.model3.json";
  // const path: string = dir + fileName;

  let modelPath = resourcesPath + modelDir[index] + "/";
  let modelJsonName = modelDir[index] + ".model3.json";

  let cubismLappmodel = new LAppModel();
  cubismLappmodel.loadAssets(modelPath, modelJsonName);

  useEffect(() => {
    return () => {
      CubismFramework.dispose();
    };
  }, []);

  // const dir: string = "example/";
  // const fileName: string = "example.model3.json";
  // const path: string = dir + fileName;

  // fetch(path).then(
  //     (response) =>
  //     {
  //         return response.arrayBuffer();
  //     }
  // ).then(
  //     (arrayBuffer) =>
  //     {
  //         let buffer: ArrayBuffer = arrayBuffer;
  //         let size = buffer.byteLength;
  //         let setting: ICubismModelSetting = new CubismModelSettingJson(buffer, size);
  //         deleteBuffer(buffer, path);
  // // 省略
  //     }
  return <canvas></canvas>;
};
