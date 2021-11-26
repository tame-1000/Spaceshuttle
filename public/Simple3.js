// JavaScriptで発生したエラーを取得
window.onerror = function (msg, url, line, col, error) {
  var errmsg = "file:" + url + "<br>line:" + line + " " + msg;
  // Simple3.myerror(errmsg);
};

var Simple3 = function (canvasid, id) {
  this.L2D_X = document.getElementById("L2D_X" + "_" + canvasid);
  this.L2D_Y = document.getElementById("L2D_Y" + "_" + canvasid);
  this.L2D_Z = document.getElementById("L2D_Z" + "_" + canvasid);
  //   this.el = document.getElementById("el"+"_"+canvasid);
  //   this.er = document.getElementById("er"+"_"+canvasid);

  this.ml = document.getElementById("ml" + "_" + canvasid);
  this.mr = document.getElementById("mr" + "_" + canvasid);
  this.mo = document.getElementById("mo" + "_" + canvasid);

  /*
   * Live2Dモデルのインスタンス
   */
  this.live2DModel = null;

  /*
   * アニメーションを停止するためのID
   */
  this.requestID = null;

  /*
   * モデルのロードが完了したら true
   */
  this.loadLive2DCompleted = false;

  /*
   * モデルの初期化が完了したら true
   */
  this.initLive2DCompleted = false;

  /*
   * WebGL Image型オブジェクトの配列
   */
  this.loadedImages = [];

  var MODEL_DEF = [
    {
      type: "Live2D Model Setting",
      name: "Corinne",
      model: "../../assets/Corinne/Corinne.moc",
      textures: [
        "../../assets/Corinne/Corinne.2048/texture_00.png",
        "../../assets/Corinne/Corinne.2048/texture_01.png",
      ],
    },
    {
      type: "Live2D Model Setting",
      name: "mida",
      model: "../../assets/mida/mida.moc",
      textures: ["../../assets/mida/mida.2048/texture_00.png"],
    },
  ];

  this.modelDef = MODEL_DEF[id];
  this.modelId = id;

  // Live2Dの初期化
  Live2D.init();

  // canvasオブジェクトを取得
  this.canvas = document.getElementById("glcanvas"+"_"+canvasid);
  this.canvasId = canvasid;
  this.canvas.width = 200;
  this.canvas.height = 200;
  // コンテキストを失ったとき

  var self = this;
  this.canvas.addEventListener(
    "webglcontextlost",
    function (e) {
      self.myerror("context lost");
      self.loadLive2DCompleted = false;
      self.initLive2DCompleted = false;

      var cancelAnimationFrame =
        window.cancelAnimationFrame || window.mozCancelAnimationFrame;
      cancelAnimationFrame(self.requestID); //アニメーションを停止

      e.preventDefault();
    },
    false
  );

  // コンテキストが復元されたとき
  this.canvas.addEventListener(
    "webglcontextrestored",
    function (e) {
      self.myerror("webglcontext restored");
      self.initLoop(self.canvas);
    },
    false
  );

  // Init and start Loop
  this.initLoop(this.canvas);
};

/*
 * WebGLコンテキストを取得・初期化。
 * Live2Dの初期化、描画ループを開始。
 */
Simple3.prototype.initLoop = function (canvas /*HTML5 canvasオブジェクト*/) {
  //------------ WebGLの初期化 ------------

  // WebGLのコンテキストを取得する
  var para = {
    premultipliedAlpha: true,
    //        alpha : false
  };
  var gl = this.getWebGLContext(canvas, para);
  if (!gl) {
    this.myerror("Failed to create WebGL context.");
    return;
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  //------------ Live2Dの初期化 ------------

  var that = this;

  // mocファイルからLive2Dモデルのインスタンスを生成
  this.loadBytes(that.modelDef.model, function (buf) {
    that.live2DModel = Live2DModelWebGL.loadModel(buf);
  });

  // テクスチャの読み込み
  var loadCount = 0;
  for (var i = 0; i < that.modelDef.textures.length; i++) {
    (function (tno) {
      // 即時関数で i の値を tno に固定する（onerror用)
      that.loadedImages[tno] = new Image();
      that.loadedImages[tno].src = that.modelDef.textures[tno];
      var self = that;
      that.loadedImages[tno].onload = function () {
        if (++loadCount === self.modelDef.textures.length) {
          that.loadLive2DCompleted = true; //全て読み終わった
        }
      };
      that.loadedImages[tno].onerror = function () {
        // Simple.myerror("Failed to load image : " + that.modelDef.textures[tno]);
      };
    })(i);
  }

  //------------ 描画ループ ------------

  (function tick() {
    that.draw(gl, that); // 1回分描画

    var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    that.requestID = requestAnimationFrame(tick, that.canvas); // 一定時間後に自身を呼び出す
  })();
};

Simple3.prototype.draw = function (gl /*WebGLコンテキスト*/, that) {
  // Canvasをクリアする
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Live2D初期化
  if (!that.live2DModel || !that.loadLive2DCompleted) return; //ロードが完了していないので何もしないで返る

  // ロード完了後に初回のみ初期化する
  if (!that.initLive2DCompleted) {
    that.initLive2DCompleted = true;

    // 画像からWebGLテクスチャを生成し、モデルに登録
    for (var i = 0; i < that.loadedImages.length; i++) {
      //Image型オブジェクトからテクスチャを生成
      var texName = that.createTexture(gl, that.loadedImages[i]);

      that.live2DModel.setTexture(i, texName); //モデルにテクスチャをセット
    }

    // テクスチャの元画像の参照をクリア
    that.loadedImages = null;

    // OpenGLのコンテキストをセット
    that.live2DModel.setGL(gl);

    //        // 表示位置を指定するための行列を定義する
    var s = that.modelscale / that.live2DModel.getCanvasWidth(); //canvasの横幅を-1..1区間に収める
    var matrix4x4 = [
      s,
      0,
      0,
      0,
      0,
      -s,
      0,
      0,
      0,
      0,
      1,
      0,
      -that.modelscale / 2,
      that.modelscale / 2,
      0,
      1,
    ];
    that.live2DModel.setMatrix(matrix4x4);
  }

  // 描画してるLive2Dモデルのサイズを取得
  var height = that.live2DModel.getCanvasHeight();
  var width = that.live2DModel.getCanvasWidth();
  // Live2D用の行列定義
  var mmat = new L2DModelMatrix(width, height);

  // サイズ(幅)
  mmat.setWidth(2.5);

  // ポジション(X, Y)
  mmat.setCenterPosition(0.0, -0.9);

  // if (that.modelId == 2) {
  //   mmat.setWidth(5.5);
  //   mmat.setCenterPosition(that.posX.value, that.posY.value - 1.7);
  // }

  // 配列をセット
  that.live2DModel.setMatrix(mmat.getArray());

  that.live2DModel.setParamFloat("PARAM_ANGLE_X", that.L2D_X.value);
  that.live2DModel.setParamFloat("PARAM_ANGLE_Y", that.L2D_Y.value);
  that.live2DModel.setParamFloat("PARAM_ANGLE_Z", that.L2D_Z.value);
  // that.live2DModel.setParamFloat("PARAM_EYE_BALL_X", that.el.value);
  // that.live2DModel.setParamFloat("PARAM_EYE_BALL_Y", that.er.value);

  that.live2DModel.setParamFloat("PARAM_BROW_L_Y", that.ml.value);
  that.live2DModel.setParamFloat("PARAM_BROW_R_Y", that.mr.value);
  that.live2DModel.setParamFloat("PARAM_MOUTH_OPEN_Y", that.mo.value);

  // Live2Dモデルを更新して描画
  that.live2DModel.update(); // 現在のパラメータに合わせて頂点等を計算
  that.live2DModel.draw(); // 描画
};

/*
 * WebGLのコンテキストを取得する
 */
Simple3.prototype.getWebGLContext = function (
  canvas /*HTML5 canvasオブジェクト*/
) {
  var NAMES = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];

  var param = {
    alpha: true,
    premultipliedAlpha: true,
  };

  for (var i = 0; i < NAMES.length; i++) {
    try {
      var ctx = canvas.getContext(NAMES[i], param);
      if (ctx) return ctx;
    } catch (e) {}
  }
  return null;
};

/*
 * Image型オブジェクトからテクスチャを生成
 */
Simple3.prototype.createTexture = function (
  gl /*WebGLコンテキスト*/,
  image /*WebGL Image*/
) {
  var texture = gl.createTexture(); //テクスチャオブジェクトを作成する
  if (!texture) {
    mylog("Failed to generate gl texture name.");
    return -1;
  }

  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); //imageを上下反転
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );

  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
};

/*
 * ファイルをバイト配列としてロードする
 */
Simple3.prototype.loadBytes = function (path, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", path, true);
  request.responseType = "arraybuffer";
  request.onload = function () {
    switch (request.status) {
      case 200:
        callback(request.response);
        break;
      default:
        this.myerror("Failed to load (" + request.status + ") : " + path);
        break;
    }
  };

  request.send(null);
};

/*
 * 画面ログを出力
 */
Simple3.prototype.mylog = function (msg /*string*/) {
  var myconsole = document.getElementById("myconsole");
  myconsole.innerHTML = myconsole.innerHTML;
  console.log(msg);
};

/*
 * 画面エラーを出力
 */
Simple3.prototype.myerror = function (msg /*string*/) {
  console.error(msg);
  this.mylog("<span style='color:red'>" + msg + "</span>");
};
