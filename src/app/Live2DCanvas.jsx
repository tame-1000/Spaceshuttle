import React, { useEffect } from "react";
import { CubismFramework, Option } from "../cubismSDK/Framework/src/live2dcubismframework";
import { LAppPal } from "../cubismSDK/Demo/src/lapppal";

const resourcesPath = "../../public/resources";
const modelDir = ['Haru', 'Hiyori', 'Mark', 'Natori', 'Rice']; 

export const Live2DCanvas=()=>{
    let cubismOption = new Option();

    // prepare for Cubism Framework API.
    cubismOption.logFunction = LAppPal.printMessage
    cubismOption.loggingLevel = LogLevel.LogLevel_Info;
    CubismFramework.startUp(cubismOption);

    // initialize cubism
    CubismFramework.initialize();
    
    // useEffect(()=>{
    //     return (

    //     )
    // },[])

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
    return (
        <canvas></canvas>
    )
}