const proxy =require("http-proxy-middleware");

/* delfino선언부 start */
const axios = require('axios');
const https = require('https');
const bodyParser = require('body-parser');
const session = require('express-session');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

//개발 or 로컬
const signResultJsp        = "https://devwww.ibkbox.net/wizvera/delfinoG4/demo/signResultVpcg.jsp";
const delfinoNonceJsp      = "https://devwww.ibkbox.net/wizvera/delfinoG4/svc/delfino_nonce.jsp";
const delfinoServerTimeJsp = "https://devwww.ibkbox.net/wizvera/delfinoG4/svc/delfino_serverTime.jsp";
const vpcgAgentJsp         = "https://devwww.ibkbox.net/wizvera/delfinoG4/svc/delfino_vpcgAgent.jsp";
const delfinoCertRelayJsp  = "https://devwww.ibkbox.net/wizvera/delfinoG4/svc/delfino_certRelay.jsp";
const checkResultJsp       = "https://devwww.ibkbox.net/wizvera/delfinoG4/svc/delfino_checkResult.jsp";
const delfinoServiceJsp    = "https://devwww.ibkbox.net/wizvera/delfino4html/g10/svc/delfino4html.jsp";
 
 //운영
 const signResultUrl        = "/jsp/signResult";
 const delfinoNonceUrl      = "/jsp/delfinoNonce";
 const delfinoServerTimeUrl = "/jsp/delfinoServerTime";
 const vpcgAgentUrl         = "/jsp/delfinoVpcgAgent";
 const delfinoCertRelayUrl  = "/jsp/delfinoCertRelay"
 const checkResultUrl       = "/jsp/delfinoCheckResult";
 const delfinoServiceUrl    = "/jsp/delfinoService";
 
const setCookie = (req, headers)=> {
    if(headers['set-cookie']) {
        let cookie = headers['set-cookie'][0].split('; ');
        const hour = 600000;
        req.session.savedCookie = cookie[0];
    }
}

const setSearchStr = (url, search)=> {
    if(search && search.startsWith('?') && url.indexOf('?') > -1)
        search = search.replace('?', '&');
    return url + (search || '');
}
/* delfino선언부 end */
module.exports = function(app) {
  app.use(
    proxy.createProxyMiddleware("/api1", {
      // REACT_APP_MNB_API_URL
      //target: "http://localwww.ibkbox.net:8081",
      target: process.env.REACT_APP_MNB_API_URL,
      changeOrigin: true,
      secure: false,
      pathRewrite: {"^/api1": ""},
    }),
    proxy.createProxyMiddleware("/api2", {
      // REACT_APP_LRB_API_URL
      //target: "http://localwww.ibkbox.net:8088",
      target: process.env.REACT_APP_LRB_API_URL,
      changeOrigin: true,
      secure: false,
      pathRewrite: {"^/api2": ""},
    }),
    proxy.createProxyMiddleware("/api3", {
      // REACT_APP_IBK_OAP_URL
      //target: "https://devapi.ibkplatform.net:8443/",
      target: process.env.REACT_APP_IBK_OAP_URL,
      changeOrigin: true,
      pathRewrite: {"^/api3": ""},
    }),
    proxy.createProxyMiddleware("/api4", {
      target: "https://ibk.co.kr",
      changeOrigin: true,
      pathRewrite: {"^/api4": ""},
    }),
    proxy.createProxyMiddleware("/api5", {
      target: "https://dev-osl.ibkbox.net",
      changeOrigin: true,
      pathRewrite: {"^/api5": ""},
    })
  );

  /* delfino start */
  // console.log(app);
  app.use(session({
    secret: 'jsp-session',
    secure: true,
    // HttpOnly: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true,
    },
  }))

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const postHandler = (jspUrl, req, res, next) => {
    axios.defaults.withCredentials = true;

    let { method, url, body, data, params } = req;
    const { search } = req._parsedUrl;
    
    url = setSearchStr(jspUrl, search);

    let axiosOption = {
      url,
      method,
      withCredentials: false,
      httpsAgent: agent,
    }

    if (method === 'POST') {
      axiosOption.params = body;
    } else {
      axiosOption.body = body;
    }

    axiosOption.headers = axiosOption.headers || {};
    if (req.session.savedCookie) {
      axiosOption.headers.cookie += '; ' + (req.session.savedCookie || '');
    }

    axios(axiosOption).then((result) => {
      // console.log(result);
      setCookie(req, result.headers);
      // console.log('[VPCGTry]\n' + result.data);
      if (typeof result.data === 'object') res.write(JSON.stringify(result.data));
      else if (typeof result.data === 'string') res.write(result.data);
      else res.write(result.data.toString());
      res.end();
      // next();
    }).catch((err) => {
      res.end();
      console.log(err);
      // next();
    })
  };

  const getHandler = (jspUrl, req, res, next) => {
    axios.defaults.withCredentials = true;

    let { method, url } = req;
    const { search } = req._parsedUrl;

    url = setSearchStr(jspUrl, search);

    let headers = {};

    if (req.session.savedCookie) {
      headers.cookie += '; ' + (req.session.savedCookie || '');
    }

    axios({
      url,
      method,
      headers,
      httpsAgent: agent,
    }).then((result) => {
      console.log(jspUrl, ': ', result.data);
      setCookie(req, result.headers);
      res.write(typeof result.data === 'string' ? result.data : result.data.toString());
      res.end();
      next();
    }).catch((err) => {
      res.end();
      console.log(err);
      next();
    })
  }

  app.all(signResultUrl, (req, res, next) => {
    postHandler(signResultJsp, req, res, next);
  });

  app.all(checkResultUrl, (req, res, next) => {
    postHandler(checkResultJsp, req, res, next);
  });

  app.all(vpcgAgentUrl, (req, res, next) => {
    postHandler(vpcgAgentJsp, req, res, next);
  })

  app.all(delfinoCertRelayUrl, (req, res, next) => {
    postHandler(delfinoCertRelayJsp, req, res, next);
  });

  app.all(delfinoServiceUrl, (req, res, next) => {
    postHandler(delfinoServiceJsp, req, res, next);
  });

  app.get(delfinoNonceUrl, (req, res, next) => {
    console.log('delfino-nonce-url');
    getHandler(delfinoNonceJsp, req, res, next);
  });

  app.get(delfinoServerTimeUrl, (req, res, next) => {
    console.log('delfino-server-time-url');
    getHandler(delfinoServerTimeJsp, req, res, next);
  });
  app.listen(80);

  /* delfino end */
}
