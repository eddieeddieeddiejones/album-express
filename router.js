const express = require('express')
const handler = require('./handlers.js')

//获取路由对象
const router = express.Router()

//设置路由
router
	.get('/',handler.showIndex)
	.get('/login',handler.showLogin)
	.get('/album',handler.showAlbum)
	.get('/add',handler.doAdd)
	.post('/album',handler.upload)
	.get('/getAlbums', handler.getAlbums)

module.exports = router