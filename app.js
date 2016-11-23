const express = require('express')
const path = require('path')
const router = require('./router')
const config = require('./config')

//得到express实例对象
const app = express()

//配置静态资源服务
app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public'))
app.use('/uploads/', express.static('./uploads/'))

//配置模板引擎？用ejs
app.set('views/', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//加载路由系统
app
    .use(router)
    .listen(config.port, config.host, () => {
    	console.log(`server is running at ${config.port} `)
    	console.log(`	please visit http://${config.host}:${config.port}/`)	
    })
