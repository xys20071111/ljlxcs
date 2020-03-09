import config from '../config.js';
import lodash from 'lodash';

//获取树中指定id的结点对象
const getNodeOfTree = (tree,id) => {
    let node = lodash.find(tree,{menuid:id});
    if(!node){
        for(let i=0;i<tree.length;i++){
            if(tree[i].children && tree[i].children.length>0){
                let cnode = getNodeOfTree(tree[i].children,id);
                if(cnode){
                    node = cnode; 
                    break;
                }
            }
        }
    }
    return node;
};
//获取树中指定id文件夹的结点对象
const getNodeOfTree2 = (tree,idName) => {
    let node = lodash.find(tree,{idName:idName});
    // let node = null;
    // for(let i=0;i<tree.length;i++){
    //     if(tree[i].idName===idName && 'isopen' in tree[i]){
    //         node = tree[i];
    //     }
    // }
    if(!node){
        for(let i=0;i<tree.length;i++){
            if(tree[i].children && tree[i].children.length>0){
                let cnode = getNodeOfTree2(tree[i].children,idName);
                if(cnode){
                    node = cnode;
                    break;
                }
            }
        }
    }
    return node;
};
//获取树中指定id的父结点
const getParentNodeOfTree = (tree,id,parent) => {
    let p = null;
    for(let i=0;i<tree.length;i++){
        if(tree[i].id === id){
            p = parent;
            break;
        }else{
            if(tree[i].children && tree[i].children.length>0){
                p = getParentNodeOfTree(tree[i].children,id,tree[i]);
                if(p != null || p != undefined){
                    break;
                }
            }
        }
    }

    return p;
};
//根据指定id找到其绝对路径
const getFullPathOfTree = (tree,id,path) => {
    if(!path) path = [];
    let node = getNodeOfTree(tree,id);
    if(node){
        path.push(node);
        let parent = getParentNodeOfTree(tree,id);
        if(parent){
            getFullPathOfTree(tree,parent.id,path);
        }
    }
    return path;
};

//生成唯一标识符
const getUuid = () => {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    //return uuid;
};

//初始业务菜单
const initMenuTree = (tree,i,favorate,oldTree) => {
    let level = i?i:1;
    tree.forEach(item=>{
        item.level = level;
        item.id = '' + item.id;
        item.menuid = '' + item.id;
        item.favorate = (favorate.includes(''+item.id) && item.uri!=='#');
        item.idName = getUuid();
        if(item.image){

        }else{
            item.image = null;
        }
        if(item.children && item.children.length>0){
            item.isopen = item.open===1;
            let oldItem = getNodeOfTree2(oldTree,item.idName);
            if(oldItem){
                item.isopen = oldItem.isopen;
            }
            item.isUrl = false;
            initMenuTree(item.children,level+1,favorate,oldTree);
        }
    });
};


//转换团队菜单至指定格式
const turnTeamList = async (self,list) => {
    let menuAry = [];
    for(let i in list){
        let aTeam = await self.$get(config.access + '/getteaminfo',{teamid:list[i].teamid});
        if(aTeam.result === 0 && aTeam.data){
            let tInfo = aTeam.data;
            menuAry.push({
                id:'group' +  tInfo.teamid,
                name: tInfo.name,
                uri:'/group/#/oneteam/'+tInfo.teamid,
                hasChild:true,
                loaded:false,
                loading:false,
                image:'fa-users',
                isopen:false,
                isUrl:true,
                childrend:[]
            });
        }
    }
    return menuAry;
};
//转换团队菜单至指定格式
const turnChildTeamList = async (self,list) => {
    let menuAry = [];
    for(let i in list){
        let aTeam = await self.$get(config.access + '/getteaminfo',{teamid:list[i]});
        if(aTeam.result === 0 && aTeam.data){
            let tInfo = aTeam.data;
            menuAry.push({
                id:'group' +  tInfo.teamid,
                name: tInfo.name,
                uri:'/group/#/oneteam/'+tInfo.teamid,
                hasChild:true,
                loaded:false,
                loading:false,
                image:'fa-users',
                isopen:false,
                isUrl:true,
                childrend:[]
            });
        }
    }
    return menuAry;
};

//树结点示例说明
const tempNode = {
    id:'111',
    //idName:'xxxx', //唯一标识符，自造
    name:'示例',
    image:'',
    uri:'xxx', //iframe内调用的地址
    isopen:true, //是否展开
    isUrl:false, //父级结点是否链接
    level:2
};


const changeUrl = (state,id) => {
    let curTab = lodash.find(state.openedViewNodes,{id:id});
    if(curTab){
        let purl = 'id='+curTab.id+'&name='+encodeURI(curTab.name)+'&uri='+encodeURI(curTab.uri)+'&image='+encodeURI(curTab.image);
        history.pushState({},'tab','/#/?'+purl);
    }
};
const saveSysStatus = (state) => {
    //打开的标签页存入本地缓存
    let tabs = [];
    state.openedViewNodes.forEach(tab=>{
        if(tab.id !== undefined){
            tabs.push({
                id:tab.id,
                name:tab.name,
                uri:tab.uri,
                image:tab.image
            })
        }
    });
    localStorage.setItem('pagetabs',JSON.stringify({views:tabs,activeNodeName:state.activeNodeName,curItemNodeId:state.curItemNodeId}));
};
export default {
    state:{
        userid:'',
        userinfo:null,
        teamids:[], //当前用户所在团队列表

        loginPhones:["18618405905"],//登录过的手机号码

        menuTree:[], //业务菜单
        favorateTree:[],//我的收藏菜单
        myGroupTree:[], //我的团队
        groupTree:[], //团队管理菜单
        sideTree:[],//在side上显示的菜单集合，变化的
        curItemType:1, //当前处于的版块 1 我的收藏 2 业务菜单 3 团队管理 4 系统管理

        curItemNodeId:'', //大版块处于业务菜单时的某个菜单id


        openedViewNodes:[],//已经打开了的结点集合
        activeNodeName:'',//激活状态的结点的idName名称
        tabLog:[],  //高亮的tab记录

        viewHistory:[],//结点访问历史
        allEndNodes:[],//所有终极结点集合,供快捷搜索
        logoLoading:false, //logo的加载状态

        showSideOnce:false
    },
    mutations:{
        xUserId(state,val){
            state.userid = val;
        },
        //修改用户信息
        xUserInfo(state,val){
            state.userinfo = val;
        },
        //清空用户信息
        xClear(state){
            state.userid = '';
            state.userinfo = null;
            state.teamids = [];
            state.menuTree = [];
            state.curItemNodeId = '';
            state.openedViewNodes = [];
            state.activeNodeName = '';
        },
        //修改用户所在团队信息
        xUserTeams(state,val){
            state.teamids = val;
        },
        //存储登录账号
        xLoginPhones(state,val){
            let ary = [];
            val.forEach(item=>{
                if(item){
                    ary.push(item);
                }
            });
            state.loginPhones = ary;
        },
        //修改大菜单当前项
        xCurItemType(state,val){
            state.curItemType = val;
        },
        xFavorateTree(state,val){
            state.favorateTree = val;
        },
        //存储树菜单
        xPath(state,val){
            state.menuTree = val;
        },

        //修改终极结点
        xAllEndNodes(state,val){
            state.allEndNodes = val;
            //从本地获取历史记录
            let historyLog = localStorage.getItem('viewhistory');
            if(historyLog){
                let logAry = JSON.parse(historyLog)
                state.viewHistory = logAry.history;
            }
        },
        //改变菜单状态
        xPathOnStatus(state,nodeid){
            state.curItemNodeId = nodeid;
            state.showSideOnce = true;
            saveSysStatus(state);
        },
        //非固定菜单状态下隐藏菜单
        xShowSideOnce(state,val){
            state.showSideOnce = false;
        },
        //有子级菜单的结点展开或关闭
        xNodeExpand(state,idName){
            let type = ['','favorateTree','menuTree','groupTree','systemTree'];
            let node = getNodeOfTree2(state.menuTree,idName);
            console.log(node);
            if(node){
                node.isopen = !node.isopen;
            }
        },
        //打开一个标签页面 ,isFormInner是否是从页面内部发起打开新页面，是，则在当前标签紧邻之后打开
        openNewView(state,item){
            let obj = Object.assign({},item);
            obj.key = getUuid();
            obj.showLoading = true;
            let oldView = lodash.find(state.openedViewNodes,{id:item.id});
            let oldView2 = lodash.find(state.openedViewNodes,{uri:item.uri});
            if(oldView){
                state.activeNodeName = item.id;
            }else if(oldView2){
                state.activeNodeName = oldView2.id;
            }else{
                //state.openedViewNodes.push(obj);
                state.openedViewNodes.unshift(obj);
                state.activeNodeName = obj.id;

                saveSysStatus(state);
            }
            changeUrl(state,state.activeNodeName);

        },
        pushHighLigthTab(state,id){
            state.tabLog.push(id);
        },
        //关闭loading
        hideTabLoading(state,id){
              let idx = lodash.findIndex(state.openedViewNodes,{id:id});
              let obj = Object.assign({},state.openedViewNodes[idx]);
              obj.showLoading = false;
              if(obj){
                  state.openedViewNodes.splice(idx,1,obj);
              }
        },
        //显示loading
        showTabLoading(state,id){
            let idx = lodash.findIndex(state.openedViewNodes,{id:id});
            let obj = Object.assign({},state.openedViewNodes[idx]);
            obj.showLoading = true;
            if(obj){
                state.openedViewNodes.splice(idx,1,obj);
            }
        },
        initView(state,tabs){
            state.openedViewNodes = [];
            //tabs.views.reverse();
            // for(let val of tabs.views){
            //     this.commit('openNewView',val);
            // }
            for(let i=tabs.views.length-1;i>=0;i--){
                this.commit('openNewView',tabs.views[i]);
            }

            // state.openedViewNodes = tabs.views;
            // state.activeNodeName = tabs.activeNodeName;
            changeUrl(state,state.activeNodeName);
        },
        //修改当前标签页的tab名称
        editCurTabName(state,val){
            let idx = lodash.findIndex(state.openedViewNodes,{id:state.activeNodeName});
            let obj = Object.assign({},state.openedViewNodes[idx]);
            obj.name = val;
            state.openedViewNodes.splice(idx,1,obj);
        },

        //激活指定名称tab
        activeTab(state,name){
            state.activeNodeName = name;
            changeUrl(state,name);
        },
        //关闭tabview
        closeTabView(state,name){
            let index = lodash.findIndex(state.openedViewNodes,{id:name});
            //首先删除tab高亮记录里的id
            let newAry = [];
            state.tabLog.forEach(item=>{
                if(item !== name){
                    newAry.push(item);
                }
            });
            state.tabLog = newAry;

            if(newAry.length>0){
                state.activeNodeName = newAry[newAry.length-1];
            }else{
                if(state.activeNodeName === name){
                    if(index>0){
                        state.activeNodeName = state.openedViewNodes[index-1].id;
                    }else if(state.openedViewNodes.length>1){
                        state.activeNodeName = state.openedViewNodes[index+1].id;
                    }else{
                        state.activeNodeName = '';
                    }
                }
            }


            state.openedViewNodes.splice(index,1);
            //打开的标签页存入本地缓存
            let tabs = state.openedViewNodes.map(tab=>{
                return {
                    id:tab.id,
                    name:tab.name,
                    uri:tab.uri
                }
            });
            localStorage.setItem('pagetabs',JSON.stringify({views:tabs}));
            changeUrl(state,state.activeNodeName);
        },
        //关闭所有
        closeAllTabView(state,val){
            state.openedViewNodes.splice(0);
            state.activeNodeName = "";
            //打开的标签页存入本地缓存
            let tabs = state.openedViewNodes.map(tab=>{
                return {
                    id:tab.id,
                    name:tab.name,
                    uri:tab.uri
                }
            });
            localStorage.setItem('pagetabs',JSON.stringify({views:tabs}));
        },
        //logo加载状态切换
        xLogoLoading(state,val){
            state.logoLoading = val;
        },

        //追加团队菜单
        xGroupMenu(state,val){
            state.groupTree = val;
        },
        //指定团队结点添加子列表
        appendGroupChild(state,{teamid,list}){
            let node = getNodeOfTree(state.groupTree,'group'+teamid);
            node.children = list;
            node.loaded = true;
            if(list.length===0){
                node.hasChild = false;
            }
        },
        //我的团队列表信息
        xMyGroupMenu(state,val){
            state.myGroupTree = val;
        },
        //修改指定结点为加载状态
        xMenuNodeToBeLoading(state,{menu,teamid,loadingStatus}){
            let tree = lodash.cloneDeep(state[menu]);
            let node = getNodeOfTree(tree,teamid);
            node.loading = loadingStatus;
            state[menu] = tree;
        }
    },
    actions:{
        //获取用户信息
        async getUserInfo({dispatch,commit},{self,cb}){
            let token = sessionStorage.getItem('token');
            //let token = cookie.get('token');
            if(token){
                let userid =JSON.parse(token).userid;
                commit('xUserId',userid);
                let msg = await self.$get(config.user + '/getuserinfo',{userid:userid});
                if(msg.result === 0){
                    commit('xUserInfo',msg.data);
                    dispatch('getUserTeams',{self,cb});
                }
                dispatch('getMenu',{self,cb:()=>{
                    dispatch('getMyFavorate',{self,cb});
                    dispatch('getGroupsMenu',{self,cb});
                }});
            }
        },

        //获取当前用户所在团队列表
        async getUserTeams({dispatch,commit,state},{self,cb}){
            let msg = await self.$get(config.access + '/getuserteams',{userid:state.userid});
            if(msg.result === 0){
                commit('xUserTeams',msg.data);
            }
        },

        //获取我的收藏菜单
        async getMyFavorate({commit,state},{self,cb}){
            // let msg = await self.$get('http://localhost:3000/getfavorate');
            // if(msg.result === 0){
            //     //initMenuTree(msg.data);
            //     let fAry = [];
            //     msg.data.forEach(item=>{
            //          let existNode = lodash.find(state.allEndNodes,{id:''+item});
            //          if(existNode){
            //              fAry.push(existNode);
            //          }
            //     });
            //
            //     commit('xFavorateTree',fAry);
            // }
        },

        //获取业务菜单
        async getMenu({commit,state},{self,cb}){
            //let msg = await self.$get('http://localhost:3000/getpath');
            let fav = await self.$get(config.access + '/getusercollectlist');
            if(fav.result === 0){
                commit('xFavorateTree',fav.data);
            }

            let msg = await self.$get(config.access + '/getusermenus',{user_id:state.userinfo.userid});

            //let msg = await self.$get('http://test.hovis.cn/tree.json');
            if(msg.result === 0 && msg.data && msg.data.tree){
                let tree = JSON.parse(msg.data.tree);
                initMenuTree(tree,1,state.favorateTree,state.menuTree); //初始化菜单
                commit('xPath',tree);
                //设第一项为默认项
                if(tree && tree.length>0 && state.curItemNodeId === ''){
                    commit('xPathOnStatus',tree[0].id);
                }

                if(typeof(cb) === 'function') cb();
            }
        },

        //获取团队菜单
        async getGroupsMenu({commit,state},{self,cb,params}){
            //let msg = await self.$get('http://localhost:3000/getuserteams');
            let msg = await self.$get(config.access + '/getuserteams');
            if(msg.result === 0){
                let teamIds = msg.data;
                let adminTeamIds = [];
                teamIds.forEach(item=>{
                    if(item.type === 1){
                        adminTeamIds.push(item);
                    }
                });
                let menuAry = await turnTeamList(self,adminTeamIds);
                commit('xGroupMenu',menuAry);
            }
        },

        //获取当前用户的团队列表
        async getMyGroupsMenu({commit,state},{self,cb,params}){
            //
            let msg = await self.$get(config.access + '/getuserteams');
            if(msg.result === 0){
                let teamIds = msg.data;
                let menuAry = await turnTeamList(self,teamIds);
                commit('xMyGroupMenu',menuAry);
            }
        },

        //获取指定团队子团队
        async getChildGroup({commit},{self,cb,params}){
            let msg = await self.$get(config.access + '/getteamlist',{parentid:params.teamid});
            if(msg.result === 0){
                let teamIds = msg.data;
                let menuAry = await turnChildTeamList(self,teamIds);
                commit('appendGroupChild',{teamid:params.teamid,list:menuAry});
                if(typeof(cb) === 'function') cb();
            }
        }

    }
}
