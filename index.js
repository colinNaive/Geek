var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');
  
  var isHide = false;
  
module.exports = function(app) {

  var activityId="test";
  var user = {
    name:"colin",
    head:"http://www.shqinlu.com/73745bceffd75a7e5a1203d9f0e9fe44?s=48"
  }

  //初始化加载以及分页操作
  app.get('/', function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 10 篇文章
    Post.getTen(activityId, page, function (err, doc, total) {
        if (err) {
          console.log("err="+err);
          posts = [];
        } else {
          //得到全部每篇帖子的前8条评论
          var commentJson=[];
          var eleLength=[];
          var length;
          doc.topics.forEach(function(topic,index){
              //取出每个帖子的前8条评论
              length=topic.comments.length<8?topic.comments.length:8;
              for(var i=0;i<length;i++){
                  console.log("comment="+topic.comments[i].content);
                  commentJson.push(topic.comments[i].content);
              }
              eleLength.push(length);
          });
          //上拉刷新部分代码
          if(page!=1){
            var response="", zanSubmit ="", more = "", oneCmt = "";
            doc.topics.forEach(function(topic,index){
                   var con = "<div class='item'><div class='info_header'><div style='float:left;overflow:hidden;height:40px'>"
                   + "<img class='author_icon' src='/images/lufei.jpg'><div class='author_info'><p class='author'>"
                   + topic.name+"</p><p class='time'>"+topic.time.minute+"</p></div></div>"
                   //评论图标
                   var co="<img class='icon' src='/images/lufei.jpg' onClick='window.location.href=\&quot/u/" + activityId + "/" + topic.name + "/" + topic.time.minute +"\&quot' >";
                   con += co;
                   //点赞图标
                   for(var i=0;i<topic.zan.length;i++) {
                      if(topic.zan[i]==user.name) {
                         zanSubmit ="<img class='icon zanSubmit' data-minute='"+topic.time.minute+"' src='/images/favicon.ico'>";
                         break;
                      }else if(i==topic.zan.length) {
                         zanSubmit ="<img class='icon zanSubmit' data-minute='"+topic.time.minute+"' src='/images/lufei.jpg'>";
                      }
                   }
                   if (topic.zan.length==0) {
                         zanSubmit ="<img class='icon zanSubmit' data-minute='"+topic.time.minute+"' src='/images/lufei.jpg'>";
                   }
                   zanSubmit += "</div>";
                   con += zanSubmit;
                   //帖子内容
                   con += ("<div class='post'>"+topic.post+"</div>");
                   //显示一条评论
                   con += "<div class='one_comment'>";
                   for (var i=0; i<topic.comments.length; i++) {
                      if (i == 0 && topic.comments[i]) {
                        oneCmt += ("<p>" + topic.comments[i].content + "</p>");
                      }else if(i <= 7 && topic.comments[i].content) {
                        oneCmt += ("<p class = 'other_comment' style = 'display:none'>" + topic.comments[i].content + "</p>");
                      }else {
                        break;
                      }
                   }
                   con += oneCmt;
                   con += "</div>";
                   //更多评论
                   more = ("<p class='more_comments' data-href='/u/" + activityId + "/" + topic.name + "/" + topic.time.minute +"'" +">");
                   con += more;
                   if(topic.comments.length > 1) {
                      var length_comments = topic.comments.length-1;
                      con += ("更多" + length_comments +"条回复");
                   }
                   con += "</p></div>"
                   response += con;
            });
            res.render('index',{
              commentJson:commentJson,
              eleLength:eleLength,
            });
            res.send(response);
            return;
          }
            res.render('index', {
            posts: doc.topics,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 7 + doc.topics.length) == total,
            user: user,
            group: doc.group,
            activityAdr:doc.activityAdr,
            activityName:doc.activityName,
            activityId:doc.activityId,
            activityTime:doc.activityTime,
            commentJson:commentJson,
            eleLength:eleLength,
            topicsLength:doc.topics.length
            //isHide: req.session.isHide,
            // success: req.flash('success').toString(),
            // error: req.flash('error').toString()
          });
        }
    });
  });

  // app.get('/post', checkLogin);
  app.get('/post', function (req, res) {
    res.render('post', {
      title: '发表',
      user: user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  // app.post('/post', checkLogin);
  app.post('/', function (req, res) {
    if(req.body.minute) {
      Post.zanSubmit(user.name, req.body.minute, activityId, 
        function(err) {

      });
      return;

    }
    var post = new Post(user.name, user.head, req.body.post, activityId);
    post.save(function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      // req.flash('success', '发布成功!');
      res.redirect('/');//发表成功跳转到主页
    });
  });
  
  /*app.get('/links', function (req, res) {
    res.render('links', {
      title: '成员列表',
      user: user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });*/

  app.get('/u/:name', function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //检查用户是否存在
    User.get(req.params.name, function (err, user) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      if (!user) {
        req.flash('error', '用户不存在!'); 
        return res.redirect('/');
      }
      //查询并返回该用户第 page 页的 10 篇文章
      Post.getTen(user.name, page, function (err, posts, total) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('/');
        }
        res.render('user', {
          title: user.name,
          posts: posts,
          page: page,
          isFirstPage: (page - 1) == 0,
          isLastPage: ((page - 1) * 10 + posts.length) == total,
          user: user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    }); 
  });
  /************************************控制代码是如何分块书写的？**********************************************/
  //从数据库拉取comments
  app.get('/u/:activityId/:name/:minute/', function (req, res) {
    Post.getOne(req.params.name, req.params.minute, req.params.activityId, function (err, post) {
      if (err) {
        // req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('article', {
        // title: req.params.title,
        post: post,
        user: user,
        // success: req.flash('success').toString(),
        // error: req.flash('error').toString()
      });
    });
  });

  //提交新的comments
  app.post('/u/:activityId/:name/:minute', function (req, res) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+":"+
               (date.getSeconds() < 0 ? '0' + date.getSeconds() : date.getSeconds());
    var md5 = crypto.createHash('md5'),
        user_name = md5.update(user.name).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + user_name + "?s=48"; 
    var comment = {
        name: user.name,
        head: head,
        // email: req.body.email,
        // website: req.body.website,
        time: time,
        content: req.body.post
    };
    var newComment = new Comment(req.params.activityId, req.params.name, req.params.minute, comment);
    newComment.save(function (err) {
      if (err) {
        // req.flash('error', err); 
        return res.redirect('back');
      }
      // req.flash('success', '留言成功!');
      res.redirect('back');
    });
  });

  app.use(function (req, res) {
    res.render("404");
  });

  // app.get('/remove/:name/:day/:title', checkLogin);
  /*app.get('/remove/:name/:day/:title', function (req, res) {
    // var currentUser = req.session.user;
    Post.remove(user.name, req.params.day, req.params.title, function (err) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', '删除成功!');
      res.redirect('/');
    });
  });*/

  // app.get('/reprint/:name/:day/:title', checkLogin);
  /*app.get('/reprint/:name/:day/:title', function (req, res) {
    Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      var reprint_from = {name: post.name, day: post.time.day, title: post.title},
          reprint_to = {name: user.name, head: user.head};
      Post.reprint(reprint_from, reprint_to, function (err, post) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('back');
        }
        req.flash('success', '转载成功!');
        var url = encodeURI('/u/' + post.name + '/' + post.time.day + '/' + post.title);
        res.redirect(url);
      });
    });
  });*/

  // app.get('/edit/:name/:day/:title', checkLogin);
/*  app.get('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      res.render('edit', {
        title: '编辑',
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });*/

  /*app.post('/edit/:name/:day/:title', checkLogin);
  app.post('/edit/:name/:day/:title', function (req, res) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
      var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
      if (err) {
        req.flash('error', err); 
        return res.redirect(url);//出错！返回文章页
      }
      req.flash('success', '修改成功!');
      res.redirect(url);//成功！返回文章页
    });
  });*/

/*app.get('/archive', function (req, res) {
    Post.getArchive(function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('archive', {
        title: '存档',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });*/

 /*app.get('/members', function (req, res) {
      User.getMembers(function (err, posts) {
        if (err) {
          req.flash('error', err); 
          return res.redirect('/');
        }
        res.render('members', {
          title: '用户列表',
          posts: posts,
          user: req.session.user,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        });
      });
    });*/


  /*app.get('/members', function (req, res) {
    
    User.getAll(function (err, user) {
          if (err) {
            req.flash('error', '用户不存在!'); 
            posts = [];
          }
    User.get("lj", function (err, posts) {
        if (!user) {
          req.flash('error', '用户不存在!'); 
          return res.redirect('/');//用户不存在则跳转到登录页
        } 
      res.render('members', {
        title: '成员列表',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });     
    });

    });*/
      
  /*app.get('/reg', checkNotLogin);
  app.get('/reg', function (req, res) {
    res.render('reg', {
      title: '注册',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });*/

  // app.post('/reg', checkNotLogin);

 /* app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致!'); 
      return res.redirect('/reg');//返回主册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在 
    User.get(newUser.name, function (err, user) {
      if (user) {
        req.flash('error', '用户已存在!');
        return res.redirect('/reg');//返回注册页
      }
      //如果不存在则新增用户
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');//注册失败返回主册页
        }
        req.session.user23 = user;//用户信息存入 session
        req.flash('success', '注册成功!');
        res.redirect('/');//注册成功后返回主页
      });
    });
  });*/

  /*app.get('/login', checkNotLogin);
  app.get('/login', function (req, res) {
    res.render('login', {
      title: '登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    }); 
  });*/

  // app.post('/login', checkNotLogin);

  /*app.post('/login', function (req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function (err, user) {
      if (!user) {
        req.flash('error', '用户不存在!'); 
        return res.redirect('/login');//用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        req.flash('error', '密码错误!'); 
        return res.redirect('/login');//密码错误则跳转到登录页
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.flash('success', '登陆成功!');
      res.redirect('/');//登陆成功后跳转到主页
    });
  });*/

  /*app.get('/logout', checkLogin);
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');//登出成功后跳转到主页
  });

  app.get('/upload', checkLogin);
  app.get('/upload', function (req, res) {
    res.render('upload', {
      title: '文件上传',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/upload', checkLogin);
  app.post('/upload', function (req, res) {
    req.flash('success', '文件上传成功!');
    res.redirect('/upload');
  });*/

/*app.get('/tags', function (req, res) {
    Post.getTags(function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('tags', {
        title: '标签',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });*/

  /*app.get('/tags/:tag', function (req, res) {
    Post.getTag(req.params.tag, function (err, posts) {
      if (err) {
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('tag', {
        title: 'TAG:' + req.params.tag,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });*/

  /*app.get('/search', function (req, res) {
    Post.search(req.query.keyword, function (err, posts) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('/');
      }
      res.render('search', {
        title: "SEARCH:" + req.query.keyword,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });*/

 /* function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录!'); 
      res.redirect('/login');
    }
    next();
  }*/

  /*function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登录!'); 
      res.redirect('back');//返回之前的页面
    }
    next();
  }*/
};
