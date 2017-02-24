const path = require('path')
// F:\05-work\02-codePackage\10BasicalNode\06-Node基础-第6天-2016年10月24日-{封装render渲染函数、使用Express.js、静态资源服务
// 、路由系统、中间件、mysql数据库}\album-expressMyTry02\uploads
// console.log(path.join(__dirname,'uploads'))
// F:\05-work\02-codePackage\10BasicalNode\06-Node基础-第6天-2016年10月24日-{封装render渲染函数、使用Express.js、静态资源服务
// 、路由系统、中间件、mysql数据库}\album-expressMyTry02
// console.log(__dirname)
module.exports = {
	port: 3000,
	host: '127.0.0.1',
	//这是绝对路径
	uploadDir: path.join(__dirname,'uploads'),
	viewPath: path.join(__dirname,'views'),
	//这个也没有用上
	viewExt: '.html'
}