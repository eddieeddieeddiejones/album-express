# album
express搭建的简单相册，功能有查看相册内图片，新建相册文件夹，上传图片

### 开始
- 项目文件夹`album-express`下命令行`npm install` 安装依赖项
- 项目文件夹`album-express`下命令行运行node app.js
- 浏览器打开http://127.0.0.1:3000/  
    查看效果

### 项目用到的技术
- bootstrap搭建前端页面
- node写后台程序
- express框架搭建http服务
- 后台ejs模板引擎渲染后台模板文件
- 处理图片上传提交用了formidable中间件

### 效果
- 新建相册  
![新建相册](http://oh2ncn0ir.bkt.clouddn.com/mkdir.gif)
- 查看相册内容  
![查看相册内容](http://oh2ncn0ir.bkt.clouddn.com/seecontent.gif)
- 上传图片  
!![查看相册内容](http://oh2ncn0ir.bkt.clouddn.com/uploadimg.gif)




### 代码解析
#### 首页相册列表展示
    1. 设置路由，router.get
    2. 取得文件夹数组，render方法渲染静态模板,并发送给浏览器
        ```js
            /**
             * GET /
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
                    console.log(albums)
                        //渲染页面
                    res.render('index', {
                        albumNames: albums
                    })
                })
            }

            // index.ejs
            <div class="container">
              <div class="row">
                  <% albumNames.forEach(function(albumName){%>
                      <div class="col-xs-6 col-md-3">
                        
                        <a href="/album?albumName=<%= albumName %>" class="thumbnail">
                          <img src="/public/img/icon.png" alt="">
                        </a>
                        <div class="caption">
                          <h3><%= albumName %></h3>
                        </div>
                      </div>
                  <% }) %>
              </div>
            </div>
        ```

    
#### 新建相册
    1. req.query拿到查询字符串的值
    2. 判断是否为空
    3. fs.readdir取得服务器端文件夹内容，判断新建的文件夹名字是否与服务器端的文件夹重名
    4. fs.mkdir新建文件夹
    5. res.redirect('/')跳转到首页
    ```html
        /**
         * GET /add?albumName=xxx
         */
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
                        //这里代码有bug，没有解决    
                        albums.push(albumPath)
                    }
                })
            })
            const dest = path.join(config.uploadDir,albumName)
            console.log(albums)
            // console.log(albums.find(album => { album === albumName }))
            //添加重名文件夹会出错，办法没有找到？？？？？？？？？？？？？？？
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
        

        <!-- album.ejs -->
        <form action="/add" method="get">
              <input type="text" class="form-control" name="albumName" placeholder="请输入相册名称">
            <button type="submit" class="btn btn-success">点击添加</button>
        </form>
    ```
#### 相册页面图片展示
    1. req.query取得查询字符串的值
    2. path.join转成绝对路径
    3. fs.readdir()读取文件夹内容，得到文件夹名称是一个数组，
    4. res.render()
    ```js
        /**
         * GET /album?albumName=xxx
         * index.ejs
         * <a href="/album?albumName=<%= albumName %>" class="thumbnail">
         */
        exports.showAlbum = (req, res) => {
            const albumName = req.query.albumName
            const albumPath = path.join(config.uploadDir, albumName)

            fs.readdir(albumPath, (err, files) => {
                if (err) {
                    throw err
                }
                console.log(files)
                files = files.map(fileName => fileName = `${albumName}/${fileName}`)
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

        <!-- index.ejs -->
        <a href="/album?albumName=<%= albumName %>" class="thumbnail">
    ```
    
#### 上传图片到指定相册
    1. 解析取得查询字符串，req.query
    2. formidable中间件，处理复杂表单提交
    3. res.redirect()重定向，注意用encodeURI进行URI编码
    ```js
        /**
         * POST /album?albumName=xxx
         */
        //解析查询字符串，formidable
        exports.upload = (req,res)=>{
            const albumName = req.query.albumName

            const form = new formidable.IncomingForm()
            console.log(path.join(config.uploadDir,albumName))
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

        <!-- 
          有文件的表单提交：
            1. method="post" 必须
            2. 将表单的 enctype="multipart/form-data"
            3. file类型的input也必须有 name 属性
         -->
        <form action="/album?albumName=<%= albumName %>" method="post" enctype="multipart/form-data">
              <input type="file" name="image" class="form-control" multiple="multiple">
            <button type="submit" class="btn btn-success">点击上传</button>
        </form>
    ```

#### 表单注意事项
-  有文件的表单提交 method 必须是 post
-  必须显式的将表单的 envtype 属性设置为 multipart/form‐data
-  同样的，file 类型的 input 元素也必须有 name 属性
- 处理复杂表单提交用formidable中间件


#### 流程解析
- app.js，node入口文件，
    实例express，app.use,express.static配置静态资源
    app.set配置模板引擎，后端模板引擎用的是ejs
    app.listen 定义服务器地址端口，开启服务器
- router.js设置路由
    express.Router()获取路由对象
    router.get设置路由
- handlers.js，编写具体的路由处理函数
    fs.readdir读取文件夹内容
    res.render渲染模板文件，并且将渲染好的html字符串发送给浏览器
    req.query得到查询字符串的值
    JSON.stringify(obj)将json对象转换成json字符串
    res.writeHead()写响应头
    res.end()
    res.redirect()网页重定位
- config.js
    配置host、port、以及允许访问的文件夹地址（用绝对路径）

#### 问题
- node 什么情况下要写响应头res.writeHead()?  
    因为默认情况下，使用.writeHead方法写入响应头后，允许使用.write方法写入任意长度的响应体数据，并使用.end方法结束一个响应。


    
    



