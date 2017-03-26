const fs = require('fs')
const config = require('./config.js')
const path = require('path')
const formidable = require('formidable')

/**
 * GET /
 * 
 */
exports.showIndex = (req, res) => {
    fs.readdir(config.uploadDir, (err, files) => {
        if (err) {
            throw err
        }

        let albums = []

        files.forEach(item => {
            const currentPath = path.join(config.uploadDir, item)
            if (fs.statSync(currentPath).isDirectory()) {
                albums.push(item)
            }
        })
        // console.log(albums)
            //渲染页面
        res.render('index', {
            albumNames: albums
        })
    })
}


//拿到查询字符串对象，遍历文件夹，render方法渲染album
/**
 * GET /album?albumName=xxx
 * <a href="/album?albumName=<%= albumName %>" class="thumbnail">
 */
// Try map
// var numbers = [1, 5, 10, 15];
// var roots = numbers.map(function(x){
//    return  x * 2;
// })
// console.log(roots)

exports.showAlbum = (req,res) => {
    const albumName = req.query.albumName
    const albumPath = path.join(config.uploadDir,albumName)


    fs.readdir(albumPath,(err,files) => {
        if(err) {
            throw err
        }
        files = files.map(fileName => {
            return `${albumName}/${fileName}`
        })
        res.render('album',{
            imgPaths: files,
            albumName: albumName
        })
    })
}

//读取文件夹内容，添加到数组中，写响应头，返回json字符串
/**
 * GET /getAlbums
 */
exports.getAlbums = (req, res) => {
    fs.readdir(config.uploadDir, (err, files) => {
        if (err) {
            throw err
        }

        // console.log(files)//得到一个含有文件夹名字的数组，
        let albumDir = []
        files.forEach(file => {
            const currentPath = path.join(config.uploadDir, file)
            if (fs.statSync(currentPath).isDirectory()) {
                albumDir.push(file)
            }
        })


        //要写响应头不然会出错
        res.writeHead(200, {
            'Content-type': 'text/plain; charset=utf-8'
        })

        res.end(JSON.stringify({
            albumDir: albumDir
        }))
    })
}

// 新建相册
// TODO
// get /add?albumName=xxx
// 直接在地址栏里输入
// http://localhost:3000/add?albumName=hahaa
// 也可以新建相册，这和form表单中直接点击新建相册的效果是一致的
exports.doAdd = (req, res) => {
    const albumName = req.query.albumName
    if(albumName.trim() === ''){
        return res.end('相册名称不能为空')
    }
    let albums = []
    fs.readdir(config.uploadDir,(err,files) => {
        if(err){
            throw err
        }
        files.forEach((item) => {
            const albumPath = path.join(config.uploadDir,item)
            if(fs.statSync(albumPath).isDirectory()){
                albums.push(albumPath)
            }
        })

        const dest = path.join(config.uploadDir,albumName)
        if(albums.some(album => {return album === dest})){
            return res.end('该相册名称已存在')
        }
        fs.mkdir(path.join(config.uploadDir,albumName),err => {
            if(err){
                throw err
            }
            res.redirect('/')
        })
    })
}


/**
 * 404
 */
//这个没有用上？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
exports.handle404 = ()=>{
    res.end('404 Not Found')
}

/**
 * GET /login
 */
exports.showLogin = (req,res)=>{
    res.render('login',{
        name: 'login'
    })
}


//这个也没有用上，是的？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
exports.doLogin = (req, res) => {
  // 使用Node接收解析表单 POST 提交的数据
  // 1. 监听 req 对象的 data 和 end 事件
  let body = ''
  req.on('data', data => {
    body += data
  })
  req.on('end', () => {
    // console.log(qstring.parse(body))
  })
}

/**
 * POST /album?albumName=xxx
 */
//解析查询字符串，formidable


// encodeURI 就是把请求地址转换成浏览器可以认识的字符串
// // http://www.w3school.com.cn
// console.log(encodeURI("http://www.w3school.com.cn"))
// // http://www.w3school.com.cn/My%20first/
// console.log(encodeURI("http://www.w3school.com.cn/My first/"))
// // ,/?:@&=+$#
// console.log(encodeURI(",/?:@&=+$#"))
// %E5%93%88%E5%93%88%20eng%20%E5%93%BC%E5%93%BC
// console.log(encodeURI("哈哈 eng 哼哼"))
exports.upload = (req, res) => {
    const albumName = req.query.albumName
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(config.uploadDir,albumName)
    form.keepExtensions = true
    form.maxFieldsSize = 5*1024*1024

    // console.log(1)

    form.parse(req,(err,fields,files) =>{
        if(err){
            throw err
        }
        // 浏览器在和服务器进行通信的时候是不能在url中包含汉字的，
        // 可能我们在浏览器地址栏能看见汉字，但是浏览器在发送请求url的时候，已经默认将url进行转码了。
        // 乔
        // console.log(albumName)
        // %E4%B9%94
        // console.log(encodeURI(albumName))
        res.redirect(`/album?albumName=${encodeURI(albumName)}`)
    })
}

exports.haha = (req,res)=>{
    const data = {hey: 1}
    res.json(data)
}



