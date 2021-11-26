
export let s_instance = null;

export class Live2DManager{

    /* クラスのインスタンスを返す */
    static getInstance(){
        if(s_instance==null){
            s_instance=new Live2DManager();
        }

        return s_instance
    }

    /* クラスのインスタンスを解放する */
    static releaseInstance(){
        if(s_instance!=null){
            s_instance=void 0;
        }

        s_instance=null;
    }

    /* 指定したno(番号)のモデルを返す */
    // getModel(no){
    //     if(no<)
    // }
}