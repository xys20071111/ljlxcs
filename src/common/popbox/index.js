import Vue from 'vue';
import PopBox from './PopBox';
const Pop = Vue.extend(PopBox);

class HPopBox {
    constructor(){
        this.popObj = null;
    }
    showDialog({vnode,width}){
        this.popObj = new Pop({
            el:document.createElement('div'),
            data:function(){
                return {
                    width:width?width:'50%'
                }
            }
        });
        this.popObj.$slots.default = vnode;
        document.body.appendChild(this.popObj.$el);
        Vue.nextTick(() => {
            this.popObj.visible = true;
        });
        return this.popObj;
    }
    closeDialog(){
        this.popObj.visible = false;
        this.popObj.$el.parentNode.removeChild(this.popObj.$el);
    }
}

export default function showDialog(vnode){
    const pop = new HPopBox();
    pop.showDialog(vnode);
    return pop;
}
