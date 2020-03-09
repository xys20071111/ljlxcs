<template>
    <div class="child">
        <iframe :id="id" :name="id" :src="iurl" class="ifr" v-if="show"></iframe>
        <!-- <div class="ifr-loading" v-if="showLading"></div> -->
    </div>
</template>

<script>
export default {
    name: 'iframepage',
    props:['url','id','image','name'],
    data () { 
        return {
            show:true,
            showLading:true
        }
    },
    computed:{
        iurl(){
            if(this.url.indexOf('?') !== -1){
                return `${this.url}&name=${this.name?this.name:''}&image=${this.image?this.image:'fa-file-text-o'}`;
            }else{
                return `${this.url}?name=${this.name?this.name:''}&image=${this.image?this.image:'fa-file-text-o'}`;
            }
        }
    },
    methods:{
        f5load(){
            const iframe = window.document.getElementById(this.id);
            if(iframe){
                iframe.contentWindow.location.reload(true);
            }
        }
    },
    mounted(){
        let that = this;
        const iframe = window.document.getElementById(this.id);
        if(iframe){
            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function() {
                    //$('#tab-'+that.id).find('i').css('visibility','hidden');
                    //document.getElementById('tab-'+that.id).children[0].children[0].style.display = 'none';
                    that.$store.commit('hideTabLoading',that.id);
                });
            } else {
                iframe.onload = function() {
                    //$('#tab-'+that.id).find('i').css('visibility','hidden');
                    //document.getElementById('tab-'+that.id).children[0].children[0].style.display = 'none';
                    that.$store.commit('hideTabLoading',that.id);
                };
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .child{position: absolute;left:0;right:0;top:0;bottom:0;}
    .ifr{border:0;width:100%;height:100%;}
    .ifr-loading{position: absolute;z-index:2;left:50%;top:50%;
        transform: translate(-50%,-50%);
        width:200px;
        height:80px;
        background:url(/static/images/ifr_loading.gif) center center no-repeat;
        background-color:rgba(0,0,0,.6);
        border-radius: 10px;
    }
</style>
