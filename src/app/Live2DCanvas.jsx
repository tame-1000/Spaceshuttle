import React, { useEffect, useRef } from "react";
import {
  CubismFramework,
  LogLevel,
  Option,
} from "../cubismSDK/Framework/src/live2dcubismframework";
import { CubismModelSettingJson } from "../cubismSDK/Framework/src/cubismmodelsettingjson";
import { LAppModel } from "../cubismSDK/Demo/src/lappmodel";
import { LAppPal } from "../cubismSDK/Demo/src/lapppal";
import { CubismMatrix44 } from "../cubismSDK/Framework/src/math/cubismmatrix44";

const resourcesPath = "../../assets";
const modelDir = ["tanuki_facerig", "20210622toki"];

let model = null;

export const Live2DCanvas = ({ params }) => {
  const canvasRef = useRef(null);

  console.log(params);

  useEffect(() => {
    if (canvasRef.current) {
      const f = async () => {
        // WebGLコンテキストの初期化
        const gl = canvasRef.current.getContext("webgl");

        if (gl === null) return alert("WebGL未対応のブラウザです。");

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // フレームバッファを用意
        const frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

        // modelDirのindex．
        // 後から，Movie→FaceTracker→Live2DCanvasの順にして，indexをpropsで受け取るようにする
        const index = 1;

        let cubismOption = new Option();

        // prepare for Cubism Framework API.
        cubismOption.logFunction = LAppPal.printMessage;
        cubismOption.loggingLevel = LogLevel.LogLevel_Info;
        CubismFramework.startUp(cubismOption);

        // initialize cubism
        CubismFramework.initialize();

        let modelPath = resourcesPath + "/" + modelDir[index] + "/";
        let modelJsonName = modelDir[index] + ".model3.json";

        /**
         * .model3.jsonファイルを読み込む
         */

        const model3JsonArrayBuffer = await loadAsArrayBufferAsync(
          modelPath + modelJsonName
        ).catch((error) => {
          console.log(error);
          return null;
        });

        if (model3JsonArrayBuffer === null) {
          console.log("model3JsonArrayBuffer is null.");
          return;
        }

        /**
         * ModelSettingオブジェクトを作成
         */

        const modelSetting = new CubismModelSettingJson(
          model3JsonArrayBuffer,
          model3JsonArrayBuffer.byteLength
        );

        /**
         * Live2Dモデルの表示に必要なファイルのパスを設定から取得する
         */

        // .moc3
        const moc3FilePath = `${modelPath}${modelSetting.getModelFileName()}`;

        // テクスチャ
        const textureFilePathes = [];
        const textureCount = modelSetting.getTextureCount();
        for (let i = 0; i < textureCount; i++) {
          const textureFilePath = `${modelPath}${modelSetting.getTextureFileName(
            i
          )}`;
          textureFilePathes.push(textureFilePath);
        }
        if (textureFilePathes.length === 0) {
          console.log("textureFilePathes.length === 0");
          return;
        }

        // .physics3.json
        // const physics3FilePath = `${resourcesDir}${modelSetting.getPhysicsFileName()}`;

        /**
         * ファイル、テクスチャをまとめてロード
         */
        const [
          moc3ArrayBuffer,
          textures,
          // pose3ArrayBuffer,
          // motionArrayBuffers,
          // physics3ArrayBuffer,
        ] = await Promise.all([
          loadAsArrayBufferAsync(moc3FilePath), // モデルファイル
          Promise.all(textureFilePathes.map((path) => createTexture(path, gl))), // テクスチャ
          // loadAsArrayBufferAsync(pose3FilePath),   // ポーズファイル
          // Promise.all(motionMetaDataArr.map(meta => loadAsArrayBufferAsync(meta.path))), // モーションファイル
          // loadAsArrayBufferAsync(physics3FilePath), // 物理演算ファイル
        ]);

        if (moc3ArrayBuffer === null) {
          console.log("moc3ArrayBuffer is null.");
          return;
        }

        /**
         * Live2Dモデルの作成と設定
         */

        model = new LAppModel();
        // モデルデータをロード
        model.loadModel(moc3ArrayBuffer);

        // レンダラの作成（bindTextureより先にやっておく）
        model.createRenderer();
        // テクスチャをレンダラに設定
        textures.forEach((texture, index) => {
          model.getRenderer().bindTexture(index, texture);
        });
        // そのほかレンダラの設定
        model.getRenderer().setIsPremultipliedAlpha(true);
        model.getRenderer().startUp(gl);
        // 物理演算設定
        // model.loadPhysics(physics3ArrayBuffer, physics3ArrayBuffer.byteLength);

        /**
         * Live2Dモデルのサイズ調整
         */

        const projectionMatrix = new CubismMatrix44();

        // NOTE: modelMatrixは、モデルのユニット単位での幅と高さが1×1に収まるように縮めようとしている？
        const modelMatrix = model.getModelMatrix();
        projectionMatrix.loadIdentity();

        // モデルが良い感じの大きさになるように拡大・縮小
        const scale = 4;
        projectionMatrix.scaleRelative(scale, scale);

        modelMatrix.centerY(0.5);

        let canvas = canvasRef.current;

        // NOTE: HTMLキャンバスのclientWidth、clientHeightが変わってもwidthとheightは変わらないので、自分で更新する
        // NOTE: スマートフォン向けにdevicePixelRatioを考慮しないとモデルがぼやける
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;

        // NOTE:
        // 1×1にしたモデルを、キャンバスの縦横比になるように引き延ばそうとする
        // 高さを調整してモデルを正しく表示するには、高さを canvas.width/canvas.height 倍する
        // 幅を調整してモデルを正しく表示するには、幅を canvas.height / canvas.width 倍する
        const canvasRatio = canvas.height / canvas.width;
        if (1 < canvasRatio) {
          // モデルが横にはみ出る時は、HTMLキャンバスの幅で合わせる
          projectionMatrix.scale(1, canvas.width / canvas.height);
        } else {
          // モデルが上にはみ出る時は、HTMLキャンバスの高さで合わせる（スマホのランドスケープモードとか）
          projectionMatrix.scale(canvas.height / canvas.width, 1);
        }

        // モデルが良い感じの大きさになるように拡大・縮小
        projectionMatrix.scaleRelative(scale, scale);

        projectionMatrix.multiplyByMatrix(modelMatrix);
        model.getRenderer().setMvpMatrix(projectionMatrix);

        // フレームバッファとビューポートを、フレームワーク設定
        let viewport = [
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        ];

        model.getRenderer().setRenderState(frameBuffer, viewport);

        // 頂点の更新
        model.getModel().update();

        // モデルの描画
        model.getRenderer().drawModel();
      };
      f();

      return () => {
        CubismFramework.dispose();
      };
    }
  }, []);

  useEffect(() => {
    let gl = canvasRef.current.getContext("webgl");
    // Canvasをクリアする
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(params);

    if (model && params != {}) {
      setParams(model, params);

      // 頂点の更新
      model.getModel().update();

      // モデルの描画
      model.getRenderer().drawModel();
    }
  }, [params]);

  return <canvas ref={canvasRef} width={120} height={90}></canvas>;
};

const setParams = (model, params) => {
  if (model && params) {
    let cubismModel = model.getModel();

    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamAngleX"),
      params["PARAM_ANGLE_X"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamAngleY"),
      params["PARAM_ANGLE_Y"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamAngleZ"),
      params["PARAM_ANGLE_Z"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamEyeBallX"),
      params["PARAM_EYE_BALL_X"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamEyeBallY"),
      params["PARAM_EYE_BALL_Y"]
    );

    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamBrowLY"),
      params["PARAM_BROW_L_Y"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamBrowRY"),
      params["PARAM_BROW_R_Y"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamMouthOpenY"),
      params["PARAM_MOUTH_OPEN_Y"]
    );
    cubismModel.setParameterValueById(
      CubismFramework.getIdManager().getId("ParamMouthOpenY"),
      params["PARAM_MOUTH_FORM"]
    );
  }
};

/**
 * テクスチャを生成する
 * @param path テクスチャのパス
 * @param gl WebGLコンテキスト
 */
async function createTexture(path, gl) {
  return new Promise((resolve, reject) => {
    // データのオンロードをトリガーにする
    const img = new Image();
    img.onload = () => {
      // テクスチャオブジェクトの作成
      const tex = gl.createTexture();

      // テクスチャを選択
      gl.bindTexture(gl.TEXTURE_2D, tex);

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // 乗算済みアルファ方式を使用する
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

      // テクスチャにピクセルを書き込む
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // ミップマップを生成
      gl.generateMipmap(gl.TEXTURE_2D);

      return resolve(tex);
    };

    img.onerror = (error) => console.log(`${error}`);

    img.src = path;
  });
}

/**
 * ファイルをArrayBufferとしてロードする
 * @param path ファイルのパス
 */
async function loadAsArrayBufferAsync(path) {
  const response = await fetch(path).catch((error) => {
    throw new Error(`Network error: ${error}`);
  });

  if (!response.ok) {
    throw new Error(`Failed to get "${path}".`);
  }

  const buffer = await response.arrayBuffer().catch(() => {
    throw new Error(`Failed to load "${path}" as ArrayBuffer.`);
  });

  return buffer;
}
