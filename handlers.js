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

exports.showAlbum = (req, res) => {
    const albumName = req.query.albumName
    const albumPath = path.join(config.uploadDir, albumName)

    fs.readdir(albumPath, (err, files) => {
        if (err) {
            throw err
        }
        // console.log(files)
        files = files.map(fileName => fileName = `${albumName}/${fileName}`)
            // 为什么这么写是错的？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
            /*files = files.map(file=>{ 
                file = `${albumName}/${file}`
            })*/
            // console.log(files)
            //渲染页面，并且将渲染好的html字符串发送给客户端
        res.render('album', {
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

/**
 * GET /add?albumName=xxx
 */
//拿到请求字符串，为空，响应一句话，遍历文件夹，如果有了，响应一句话，fs.mkdir新建文件夹，成功后跳转到首页
exports.doAdd = (req, res) => {
    const albumName = req.query.albumName
    if (albumName.trim() === '') {
        return res.end('相册名称不能为空')
    }
    let albums = []
        // const albumPath = path.join(config.uploadDir,albumName)
    fs.readdir(config.uploadDir, (err, files) => {
        if (err) {
            throw err
        }
        files.forEach((item) => {
            const albumPath = path.join(config.uploadDir, item)
            console.log(albumPath)
            console.log(fs.statSync(albumPath))  //一个对象
            console.log(fs.statSync(albumPath).isDirectory())//true
            if (fs.statSync(albumPath).isDirectory()) {
                albums.push(albumPath)
            }
        })
    })
    const dest = path.join(config.uploadDir,albumName)
    console.log(albums)
    // console.log(albums.find(album => { album === albumName }))
    //添加重名文件夹会出错，办法没有找到？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
    if (albums.some(album => { return album === dest })) {
        return res.end('该相册名称已存在')
    }
    fs.mkdir(path.join(config.uploadDir, albumName), err => {
        if(err){
            throw err
        }
        //重新定位到首页
        res.redirect('/')
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
exports.upload = (req,res)=>{
    const albumName = req.query.albumName

    const form = new formidable.IncomingForm()
    // console.log(path.join(config.uploadDir,albumName))
    form.uploadDir = path.join(config.uploadDir,albumName)
    form.keepExtensions = true
    form.maxFieldsSize = 5 * 1024 * 1024

    form.parse(req, (err, fields, files) => {
      if(err){
        throw err
      }
      res.redirect(`/album?albumName=${encodeURI(albumName)}`)
    });
}



