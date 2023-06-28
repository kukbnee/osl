/* eslint-disable */
import axios from "axios";
console.log('delfino.vue created');
const init = ()=> {
    if(delfino.load) {
        return Promise.resolve();
    } else {
        return new Promise((resolve, reject)=> {
            setTimeout(()=> {
                init().then(resolve);
            }, 500);
        })
    }
}
axios.defaults.withCredentials = true;
if(typeof global.$Delfino === 'undefined') {
    const baseUrl = '/wizvera/delfino/';
    const scriptUrl = {
        jquery: baseUrl + 'jquery/jquery-1.11.2.min.js',
        config: baseUrl + 'delfino_config.js',
        internal: baseUrl + 'delfino_internal.nomin.js',
        delfino: baseUrl + 'delfino.js',
        customJs: baseUrl + 'delfino_site.js',
    };

    const loadScript = (url, key)=> {
        return axios({
            method: 'GET',
            cors: true,
            url,
            responseType: "script",
            headers: {
                'Access-Control-Allow-Origin' : true
            }
        }).then((res)=> {
            return { js: res.data, name: key };
        });
    }

    let loadPrms = [];
    for(var key in scriptUrl) {
        loadPrms.push(loadScript(scriptUrl[key], key));
    }

    Promise.all(loadPrms).then((res)=> {
        res.map((target)=> {
            const _eval = global.eval;
            if(target) console.log(target.name + ' load start');
            if(target) _eval(target.js);
        });
        delfino.load = true;
        global.$Delfino = delfino.Delfino = global.Delfino;
        global.$DelfinoConfig = delfino.DelfinoConfig = global.DelfinoConfig;
        console.log('delfino load end');
    }).catch((err)=> {
        // debugger;
    });
} else {
    delfino.load = true;
    delfino.Delfino = global.$Delfino;
    delfino.DelfinoConfig = global.$DelfinoConfig;
    console.log('delfino load end from else');
}

let delfino = {
    init: init,
    load: false,
    Delfino: global.Delfino,
    DelfinoConfig: global.DelfinoConfig
}
console.log('delfino.vue done');

export default delfino;
