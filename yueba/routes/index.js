var crypto = require('crypto'),
    fs = require('fs'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');
  
  var isHide = false;
  
module.exports = function(app) {

  //初始化加载以及分页操作
  app.get('/', function (req, res) {
    var activityId=req.session.activity_id;
    var user = req.session.user;
    var page = "";
    var maxtTime = 0;
    
    //get到activity_id 和 user_id 设置session相关代码
    if(req.query.activity_id && req.query.user_id) {
      //查询是否已经 设置activity_id_session
      activityId = checkSavenSessionActivityId(req.session.activity_id, req.query.activity_id, req);
      //查询是否已经 设置user_session 
      console.log("userreeeee==" + user);
      console.log("zhixing1");
      if(req.session.user && req.session.user.user_id == req.query.user_id) {
          console.log("session_user.user_id=="+req.session.user.user_id);
          console.log("zhixing2");
          user = req.session.user;
      }else {
        console.log("zhixing4");
        Post.getUserDetail(req.query.user_id, function(err, _user) {
          if(err) {
            return res.redirect('back');
          }else {
            req.session.user = user = _user;
            console.log("usre.user_name=="+user.user_name);
            console.log("usre.user_id=="+user.user_id);
          }
        });
      }
    }
    //判断是否是第一页，并把请求的页数转换成 number 类型
    page = req.query.p ? parseInt(req.query.p) : 1;
    //上拉刷新需要的maxTime
    maxtTime = req.query.mt ? parseInt(req.query.mt) : req.query.mt;
    console.log("catch_max==" + maxtTime);
    //查询并返回第 page 页的 10 篇文章
    Post.getTen(activityId, maxtTime, page, function (err, posts, total, _maxTime, actResult, heads) {
          if (err) {
            console.log("err="+err);
            posts = [];
          } else {
          //上拉刷新部分代码
          if(page!=1){
            var response="";
            response = formResponse(activityId, user, posts);
            res.send(response);
            return;
          }
          var reMaxTime = _maxTime ? _maxTime : 0;
          res.render('index', {
            posts: posts,
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * 7 + posts.length) == total,
            user: user,
            group: heads,
            activityId: activityId,
            activity: actResult,
            topicsLength:posts.length,
            maxTime: reMaxTime
          });
        }
    });
  });

  app.post('/', function (req, res) {
    var activityId=req.session.activity_id;
    var user = req.session.user;

    //取消点赞
    if(req.body.minute && req.body.mix && req.body.cancel) {
      Post.zanCancel(req.body.mix, req.body.minute, activityId, user.user_id, 
        function(err) {

      });
      return;
    }

    //点赞
    if(req.body.minute && req.body.mix) {
      Post.zanSubmit(req.body.mix, req.body.minute, activityId, user.user_id, 
        function(err) {

      });
      return;
    }

    //修改activity表时间
    if(req.body.activityId && req.body.content) {
      Post.changeTime(req.body.activityId, req.body.content, 
        function(err) {

      });
      return;
    }
    
    //第一个参数为辅助查找字段
    var post = new Post(user.user_name+user.user_id, user.user_name, user.headimgurl, user.user_id, req.body.post, activityId);
    post.save(function (err) {
      if (err) {
        return res.redirect('back');
      }
      res.redirect('back');//发表成功跳转到主页
    });
  });
  
  /************************************控制代码是如何分块书写的？**********************************************/
  //从数据库拉取comments
  app.get('/u/:activityId/:mix/:minute/', function (req, res) {
    var activityId=req.session.activity_id;
    var user = req.session.user;
    console.log("get_comments_user_id=="+req.params.mix);
    Post.getOne(req.params.mix, req.params.minute, req.params.activityId, function (err, post) {
      if (err) {
        return res.redirect('back');
      }
      res.render('article', {
        post: post,
        user: user,
        activityId:req.params.activityId
      });
    });
  });

  //提交新的comments
  app.post('/u/:activityId/:mix/:minute', function (req, res) {
    var activityId=req.session.activity_id;
    var user = req.session.user;
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
               date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())+":"+
               (date.getSeconds() < 0 ? '0' + date.getSeconds() : date.getSeconds());
    var mix = user.user_name+user.user_id;
    var comment = {
        name: user.user_name,
        head: user.headimgurl,
        time: time,
        content: req.body.post,
        user_id: user.user_id,
        mix: mix,
        itime: date.getTime()
    };
    var newComment = new Comment(req.params.activityId, req.params.mix, req.params.minute, comment);
    newComment.save(function (err) {
      if (err) {
        return res.redirect('back');
      }
      res.redirect('back');
    });
  });

  app.use(function (req, res) {
    res.render("404");
  });

  //判断 session_user 是否存在：如果不存在，取得 session_user；如果存在，设置 session_user
  function checkSavenSessionActivityId(session_activityId, activity_id, req) {
    if(session_activityId == activity_id) {
      return session_activityId;
    }else {
      req.session.activity_id = activity_id;
      return activity_id;
    }
  }

  //测试程序
  function curTimeMinus() {
    var time1 = new Date().getTime();
    console.log("time1==" + time1);
    var time2 =  new Date().getTime();
    console.log("time2==" +time2);
    var result = time1 -time2;
    console.log("result==" + result);
  }
 
  //构成response
  function formResponse(activityId, user, posts) {
      var response="", zanSubmit ="", more = "", oneCmt = "";
      if (posts) {}else {
        return "";
      }
      posts.forEach(function(post,index){
             var con = "<div class='item'><div class='info_header'><div class='header_inner'>"
             + "<img class='author_icon _border ml' src='" + post.head + "'><div class='author_info'><p class='author'>"
             + post.name +"</p><p class='time'>"+post.time.minute+"</p></div></div><div class='pic_active'><div class='comment fr'>"

             var co="<img src='/images/comment.png' onClick='window.location.href=\&quot/u/" + activityId + "/" + post.mix + "/" + post.time.minute +"\&quot' >";
             con += co;

             var con_after = "<span class='com_count'>" + post.comments.length + "</span></div><div class='praise fr'>";
             con +=con_after;

             //点赞图标
             for(var i=0;i<post.zan.length;i++) {
                if(post.zan[i]==user.user_id) {
                   zanSubmit ="<img class='icon zanSubmit' clk='0' data-mix='" + post.mix + "' data-minute='"+post.time.minute+"' src='/images/zan_after.png'>";
                   break;
                }else if(i==post.zan.length-1) {
                   zanSubmit ="<img class='icon zanSubmit' clk='1' data-mix='" + post.mix + "' data-minute='"+post.time.minute+"' src='/images/zan_before.png'>";
                }
             }
             if (post.zan.length==0) {
                   zanSubmit ="<img class='icon zanSubmit' clk='1' data-mix='"+post.mix + "' data-minute='"+post.time.minute+"' src='/images/zan_before.png'>";
             }
             con += zanSubmit;
             
             var pra_after = "<span class='zan_count'>" + post.zan.length + "</span></div></div></div>";
             con += pra_after;

             //帖子内容
             con += ("<div class='post'>"+post.post+"</div>");
             //显示一条评论
             con += "<div class='one_comment'>";
             for (var i=0; i<post.comments.length; i++) {
                if (i == 0 && post.comments[i]) {
                  oneCmt += ("<p class='first_comment'>" + post.comments[i].content + "</p>");
                }else if(i <= 7 && post.comments[i].content) {
                  oneCmt += ("<p class = 'other_comment' style = 'display:none;margin-top:5px'>" + post.comments[i].content + "</p>");
                }else {
                  break;
                }
             }
             con += oneCmt;
             oneCmt = "";
             con += "</div>";
             //更多评论
             more = ("<p class='more_comments' data-href='/u/" + activityId + "/" + post.mix + "/" + post.time.minute +"'" +">");
             con += more;
             if(post.comments.length > 1) {
                var length_comments = post.comments.length-1;
                con += ("更多" + length_comments +"条回复");
             }
             con += "</p></div>"
             response += con;
      });
      return response;
  }
};
