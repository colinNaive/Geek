var mongodb = require('./db'),
    markdown = require('markdown').markdown,
    settings = require('../settings'),
    ObjectId = require('mongodb').ObjectID;

function Post(mix, name, head, user_id, post, activityId) {
      this.mix = mix;
      this.activityId=activityId;
      this.name = name;
      this.head = head;
      this.user_id = user_id;
      this.post = post;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//修改result0的格式
function changeString(time) {
    var result="";
    result += time.substring(0,4);
    result += "年";
    result += time.substring(4,6);
    result += "月";
    result += time.substring(6,8);
    result += "日";
    return result;
};

//确定具体时间
function getconcrete(index) {
  switch(index) {
    case 0:
      return "上午";
    case 1:
      return "中午";
    case 2:
      return "下午";
    case 3:
      return "晚上";
    default:
      return "出错";
  }
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" +
      (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  }
  var itime = date.getTime();
  //要存入数据库的文档
  console.log("this.head===" + this.head);
  var topic = {
      activityId: this.activityId,
      name: this.name,
      head: this.head,
      itime:itime,
      mix: this.mix,
      user_id: this.user_id,
      time: time,
      post: this.post,
      comments: [],
      reprint_info: {},
      sex: "",
      pv: 0,
      zan:[]
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      console.log("err="+err);
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        console.log("insert_err_collection="+err);
        mongodb.close();
        return callback(err);
      }else{
        //将文档插入 posts下
        collection.insert(topic, function (err) {
            mongodb.close();
            if (err) {
              console.log("inesrt_err=" + err);
              return callback(err);
            }else{
              callback(null);
            }
        });
      }
    });
  });
};

//从 activity 表拉取 activity 基本信息：activityId、activityAdr、activityTime、activityName、group
Post.getTen =function(activityId, maxTime, page, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      console.log("getTen_open_err==" + err);
      return callback(err);
    }else if(page != 1) {
        console.log("jiejing_activity");
        //参数1:activity_id;参数2:page;参数3:actvity表查询到的基本信息;
        Post.getFromUser(db, activityId, maxTime, page, null, callback);
    }else{
      db.collection("activity",function(err, collection){
        if (err) {
          console.log("err_getTen_activity="+err);
          mongodb.close();
          return callback(err);
        }else{
           var objid=new ObjectId(activityId);
           collection.findOne({"_id":objid}, function(err, doc){
            if (err) {
              console.log("err_getTen_activity_find="+err);
              mongodb.close();
              return callback(err);
            }else {
              console.log("activity_id=111=" + activityId);
              if(doc) {}else {
                console.log("err_get_activity_doc=" + err);
                mongodb.close();
                return callback(err);
              }
              //转换日期类型
              if (doc.end && doc.result0 != "") {
                  var result0 = doc.result0;
                  console.log("result0=" + result0);
                  var localTime = changeString(result0);
                  console.log(" _activityTime = " + localTime);

                  if(doc.time && doc.time!="") {
                    var concreteTime = doc.time;
                  }else {
                    var checkList = doc.dateresult[result0].check;
                    var index = 0,concreteTime = "";
                    for(var i=0; i<checkList.length; i++) {
                        if(checkList[i] >= checkList[index]) {
                          index = i;
                          console.log("checkListi=" + i);
                          console.log("concreteTime=" + checkList[i]);
                        }
                    }
                    console.log("concreteIndex=" + index);
                    concreteTime = getconcrete(index);
                  }
              }else if(doc.result0 == "") {
                  var localTime = "没有人参加~";
                  var concreteTime = "";
              }else {
                  var localTime = "等待结果公布~";
                  concreteTime = "";
              }
              doc.result_date = localTime;
              doc.result_time = concreteTime;
              console.log("mmmaxtime==" + maxTime);
              //activity表查询完毕,去user表查询 
              //参数1:activity_id;参数2:page;参数3:actvity表查询到的基本信息;
              Post.getFromUser(db, activityId, maxTime, page, doc, callback);
            }
           });
        }
      });
    }
  });
};

//从user表查询user信息
Post.getFromUser =function(_db, _activityId, maxTime, _page, actResult, callback) {
  //user表获取user信息
  _db.collection("user",function(err, collection) {
      if (err) {
        console.log("err_getHeader_from_user="+err);
        mongodb.close();
        return callback(err);
      }else if(_page != 1) {
          //活动1:活动id;参数2:page;参数3:活动表查询结果;参数4:user表查询出来的头像url数组;
          console.log("jiejing_user");
          Post.queryPosts(_db, _activityId, maxTime, _page, null, null, callback);
      }else {
         console.log("find_user_id_heads===" + actResult.group);
         collection.find({
            "user_id" : {"$in": actResult.group}
         },{
            "headimgurl":1,"_id":0,
         }).toArray(function(err, heads) {
            if(err) {
              mongodb.close();
              console.log("err_getUser_toArray=="+err);
              return callback(err);
            }else {
                console.log("getUser_heads_doc==="+heads);
                if (heads) {
                  //活动1:活动id;参数2:page;参数3:活动表查询结果;参数4:user表查询出来的头像url数组;
                  console.log("activity_id=222=" + _activityId);
                  console.log("mmmaxtime===" + maxTime);
                  Post.queryPosts(_db, _activityId, maxTime, _page, actResult, heads, callback);
                }
            }
          });
      }
  });
};

//一次获取十篇文章(直接从数据库里读取十个，无查询条件)
Post.queryPosts = function(_db, _activityId, maxTime, _page, _actResult, _heads, callback) {
  //读取 posts 集合
  _db.collection('posts', function(err, collection) {
      if (err) {
        console.log("err_getTen_collection="+err);
        mongodb.close();
        return callback(err);
      }else{
        var query = {};
        if (_activityId) {
          query.activityId = _activityId;
        }
        console.log("mmmaxtime====" + maxTime);
        if (maxTime) {
          console.log("zhelimeijinlai");
          query.itime = {"$lte":maxTime};
        }
        console.log("activityidddd="+query.activityId);
        //使用 count 返回特定查询的文档数 total
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.count(query,function(err, total){
            console.log("totalmax==" + total);
            collection.find(query,{
                skip: (_page-1)*7,
                limit: 7,
            }).sort({
                itime: -1
            }).toArray(function(err, docs){
                  if (err) {
                    console.log("err_getTen_find="+err);
                    mongodb.close();
                    return callback(err);
                  }else{
                    console.log("dooccc=="+docs);
                    if(docs){
                        if (maxTime) {}else if(docs[0]) {
                          maxTime = docs[0].itime;
                          console.log("getMaxTime==" + maxTime);
                        }
                        console.log("mmmaxtime==" + maxTime);
                        callback(null, docs, total, maxTime, _actResult, _heads);
                    }
                  }
            });
        });
      }
  });
};


//获取一篇文章
Post.getOne = function(mix, minute, activityId, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      console.log("err="+err);
      return callback(err);
    }else {
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
          if (err) {
            console.log("err="+err);
            mongodb.close();
            return callback(err);
          }
          console.log("activityId_getOne=="+activityId + ";user_id_getOne==" + mix + ";minute_getOne==" + minute);
          //根据用户名、发表日期及文章名进行查询
          collection.findOne({
            "activityId":activityId,
            "mix": mix,
            "time.minute": minute,
            // "topics.title": title
          }, function (err, doc) {
            console.log("getOne_function=="+doc);
            if (err) {
              console.log("err="+err);
              mongodb.close();
              return callback(err);
            }
            if (doc) {
              console.log("getOne_doc=="+doc);
              //每访问 1 次，pv 值增加 1
              collection.update({
                "activityId": activityId,
                "mix": mix,
                "time.minute": minute,
              }, 
              {
                $inc: {"pv": 1}
              }, 
              function (err) {
                mongodb.close();
                if (err) {
                  console.log("err="+err);
                  return callback(err);
                }
              });
              callback(null, doc);//返回查询的一篇文章
            }
          });
        });
    }
  });
};

//点赞 user_id 为被赞; user 为赞
Post.zanSubmit = function(mix, minute, activityId, user, callback) {
  console.log("zanSubmit_w_use_id==" + mix);
  console.log("zanSubmit_w_minute==" + minute);
  console.log("zanSubmit_w_user==" + user);
  console.log("zanSubmit_w_activityId==" + activityId);
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      console.log("err="+err);
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        console.log("err="+err);
        mongodb.close();
        return callback(err);
      }
      //根据mix、发表日期进行update
      console.log("zanSubmit_mix===" + mix);
      console.log("zanSubmit_minute==" + minute);
      //点赞
      collection.update({
        "activityId":activityId,
        "time.minute": minute,
        "mix": mix,
      }, 
      {
        $addToSet: {"zan": user}
      }, 
      function (err) {
        mongodb.close();
        if (err) {
          console.log("err="+err);
          return callback(err);
        }
      });
      callback(null);//返回查询的一篇文章
    });
  });
};

//取消点赞
Post.zanCancel = function(_mix, _minute, _activityId, _user_id, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      mongodb.close();
      console.log("zan_cancel_open_err=" + err);
      return callback(err);
    }else {
      console.log("quxiaodianzan1");
      db.collection("posts",function(err, collection) {
          if(err) {
            mongodb.close();
            console.log("zan_cancel_collection_err=" + err);
            return callback(err);
          }else {
            console.log("quxiaodianzan2");
            collection.update({
              "activityId": _activityId,
              "mix": _mix,
              "time.minute": _minute
            },{
              $pull:{"zan" : _user_id}
            },function(err) {
                if(err) {
                    mongodb.close();
                    console.log("zan_cancel_pull_err=" + err);
                    return callback(err);
                }
            });
            console.log("quxiaodianzan3");
            callback(null);
          }
      });
    }
  });
};

//得到用户信息
Post.getUserDetail = function (user_id, callback) {
  console.log("detail")
  //打开数据库
  mongodb.open(function (err, db) {
    if(err) {
      console.log("err_getuserdetail_open="+err);
      mongodb.close();
      return callback(err);
    }else {
      console.log("success_read_user_start==");
      //读取user表
      db.collection('user', function (err, collection){
        if(err) {
          console.log("err_getuserdetail_collection="+err);
          mongodb.close();
          return callback(err);
        }else {
          collection.findOne({
            "user_id":user_id
          },{
            "user_name":1,
            "headimgurl":1,
            "user_id":1
          }, function(err, doc){
            if(err) {
              mongodb.close();
              console.log("err_getuserdetail_find="+err);
              return callback(err);
            }else {
              console.log("success_read_user_doc=="+doc);
              if(doc) {
                console.log("success_read_user");
                callback(null, doc);
              }
            }
          });
        }
      });
    }
  });
};

//修改activity表时间
Post.changeTime = function(_activityId, _content, callback) {
    mongodb.open(function(err, db){
        if(err) {
            console.log("changeTime_open_err ==" + err);
            mongodb.close();
            return callback(err);
        }else {
            db.collection("activity", function(err, collection){
                if(err) {
                  console.log("activity_changeTime_err==" + err);
                  mongodb.close();
                  return callback(err);
                }else {
                  var objid=new ObjectId(_activityId);
                  collection.update({
                    "_id": objid
                  },{
                    "$set":{"time":_content}
                  },function(err){
                     mongodb.close();
                     if(err) {
                        console.log("update_changeTime_err==" + err);
                        return callback(err);
                     }else {
                        callback(null);
                     }
                  });
                }
            });
        }
    });
}

//删帖
Post.remove = function(activityId, mix, minute, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //删除转载来的文章所在的文档
      collection.remove({
        "activityId": activityId,
        "mix": mix,
        "time.minute": minute
      }, {
        w: 1
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
