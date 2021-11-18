import React from "react";

export const Live2DCanvas=()=>{
    // TypeScript
    let cubismOption = null;

    // prepare for Cubism Framework API.
    cubismOption.logFunction = LAppPal.printMessage;
    cubismOption.loggingLevel = LogLevel.LogLevel_Info;
    CubismFramework.startUp(cubismOption);
    
    return (
        <canvas></canvas>
    )
}