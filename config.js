const path = require('path')

module.exports = {
	port: 3000,
	host: '127.0.0.1',
	//这是绝对路径
	uploadDir: path.join(__dirname,'uploads'),
	viewPath: path.join(__dirname,'views'),
	//这个也没有用上
	viewExt: '.html'
}