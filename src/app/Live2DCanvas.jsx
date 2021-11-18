import React from "react";
import { Live2DCubismFramework } from "../cubismSDK/Framework/src/live2dcubismframework";

export const Live2DCanvas=()=>{
    Live2DCubismFramework.CubismFramework.startUp();
    
    return (
        <canvas></canvas>
    )
}