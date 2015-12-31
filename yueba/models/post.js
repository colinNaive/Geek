var mongodb = require('./db'),
    markdown = require('markdown').markdown,
    settings = require('../settings'),
    ObjectId = require('mongodb').ObjectID;

function Post(name, head, post, activityId) {
      this.activityId=activityId;
      this.name = name;
      this.head = head;
      // this.title = title;
      this.post = post;
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
  //要存入数据库的文档
  var topic = {
      name: this.name,
      head: this.head,
      time: time,
      // title:this.title,
      // tags: this.tags,
      post: this.post,
      comments: [],
      reprint_info: {},
      pv: 0
  };
  var activityId=this.activityId;
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.authenticate(settings.user, settings.psw, function(err, authdb) {
       if (err) {
          return callback(err);
       }
       //读取 posts 集合
      db.collection('posts', function (err, collection) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        console.log("activityId="+activityId);
        //将文档插入 posts 中 activityid 下 topic 中
        collection.update({
          "activityId": activityId
        }, {
          $push: {"topics": topic},
          $inc:{"count": 1}
        } , function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
            callback(null);
        });
      });
    });
  });
};

//一次获取十篇文章(直接从数据库里读取十个，无查询条件)
Post.getTen = function(activityId, page, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.authenticate(settings.user, settings.psw, function(err, authdb) {
       if (err) {
          return callback(err);
       }
      //读取 posts 集合
      db.collection('posts', function (err, collection) {
          if (err) {
            mongodb.close();
            return callback(err);
          }
          var query = {};
          if (activityId) {
            query.activityId = activityId;
          }
          //使用 count 返回特定查询的文档数 total
          //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
          collection.findOne(query,{
            "topics":{
              $slice:[(page-1)*5,5]
            }
          },
            function(err, doc){
                if (err) {
                  console.log("err="+err);
                  mongodb.close();
                  return callback(err);
                }
                if(doc){
                    doc.topics.forEach(function (topic) {
                      topic.post = markdown.toHTML(topic.post);
                    }); 
                    callback(null, doc, doc.count);
                }else{
                  //如果posts数据库什么都没有
                  //初始化 posts 表，从 activity 表拉取 activity 基本信息：activityId、activityAdr、activityTime、activityName、group
                  db.collection("activity",function(err, collection){
                    if (err) {
                      console.log("err="+err);
                      mongodb.close();
                      return callback(err);
                    } 
                    collection.findOne({"_id":ObjectId("567a41d3972b0ea51e414dcf")}, function(err, doc){
                      if (err) {
                        mongodb.close();
                        return callback(err);
                      }
                      if (doc) {
                        //activityId、activityAdr、activityTime、activityName、group
                        var init = {
                            activityId: activityId,
                            activityAdr: doc.location,
                            activityTime: doc.start_time,
                            activityName: doc.activity_name,
                            group: doc.group,
                            topics: []
                        };
                        db.collection("posts",function(err, collection){
                          if (err) {
                            mongodb.close();
                            return callback(err);
                          }
                          collection.insert(init,{
                            safe:true
                          },function(err,result){
                            mongodb.close();
                            if (err) {
                              return callback(err);
                            }
                            callback(null, init, 0);
                          });
                        });
                      }
                    });
                  });
                }
          });
      });
  });
  });
};

function writeObj(obj){ 
 var description = ""; 
 for(var i in obj){ 
  var property=obj[i]; 
  description+=i+" = "+property+"\n"; 
 } 
 console.log("result="+description); 
} 

//暂时没用到
//初始化 posts 表，从 activity 表拉取 activity 基本信息：activityId、activityAdr、activityTime、activityName、group
Post.initPosts = function(activityId){
  db.collection("activity",function(err, collection){
    if (err) {
      mongodb.close();
      return callback(err);
    }
    collection.findOne({"activityId":activityId}, function(err, doc){
      if (err) {
        mongodb.close();
        return callback(err);
      }
      if (doc) {
        db.collection("posts",function(err, collection){
          if (err) {
            mongodb.close();
            return callback(err);
          }
          collection.insert(doc,{
            safe:true
          },function(err,result){
            mongodb.close();
            if (err) {
              return callback(err);
            }
            callback(null, result, total);
          });
        });
      }
    });
  });
}

//获取一篇文章
Post.getOne = function(name, minute, activityId, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.authenticate(settings.user, settings.psw, function(err, authdb) {
       if (err) {
          return callback(err);
       }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
          if (err) {
            mongodb.close();
            return callback(err);
          }
          //根据用户名、发表日期及文章名进行查询
          collection.findOne({
            "activityId":activityId,
            "topics.name": name,
            "topics.time.minute": minute,
            // "topics.title": title
          }, function (err, doc) {
            if (err) {
              mongodb.close();
              return callback(err);
            }
            if (doc) {
              //每访问 1 次，pv 值增加 1
              collection.update({
                "topics.name": name,
                "topics.time.minute": minute,
                // "topics.title": title
              }, 
              {
                $inc: {"topics.$.pv": 1}
              }, 
              function (err) {
                mongodb.close();
                if (err) {
                  return callback(err);
                }
              });
              var topicItem;
              //解析 markdown 为 html
              doc.topics.forEach(function(topic){
                  if (topic.name==name&&topic.time.minute==minute/*&&topic.title==title*/) {
                      topic.post=markdown.toHTML(topic.post);
                      topic.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                      });
                      topicItem=topic;
                  }
              });
              callback(null, topicItem);//返回查询的一篇文章
            }
          });
        });
    });
  });
};

//点赞
Post.zanSubmit = function(name, minute, activityId, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.authenticate(settings.user, settings.psw, function(err, authdb) {
       if (err) {
          return callback(err);
       }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
          if (err) {
            mongodb.close();
            return callback(err);
          }
          //根据用户名、发表日期及文章名进行查询
          collection.findOne({
            "activityId":activityId,
            "topics.name": name,
            "topics.time.minute": minute,
            // "topics.title": title
          }, function (err, doc) {
            if (err) {
              mongodb.close();
              return callback(err);
            }
            if (doc) {
              //点赞
              collection.update({
                "topics.name": name,
                "topics.time.minute": minute,
              }, 
              {
                $push: {"topics.$.zan": name}
              }, 
              function (err) {
                mongodb.close();
                if (err) {
                  return callback(err);
                }
              });
              //解析 markdown 为 html
              doc.topics.forEach(function(topic){
                  if (topic.name==name&&topic.time.minute==minute) {
                      topic.post=markdown.toHTML(topic.post);
                      topic.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                      });
                      topicItem=topic;
                  }
              });
              callback(null, topicItem);//返回查询的一篇文章
            }
          });
        });
    });
  });
};

//更新一篇文章及其相关信息
/*Post.update = function(name, day, post, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //更新文章内容
      collection.update({
        "name": name,
        "time.day": day,
        // "title": title
      }, {
        $set: {post: post}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};*/

//删除一篇文章
/*Post.remove = function(name, day, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询要删除的文档
      collection.findOne({
        "name": name,
        "time.day": day,
        // "title": title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        //如果有 reprint_from，即该文章是转载来的，先保存下来 reprint_from
        var reprint_from = "";
        if (doc.reprint_info.reprint_from) {
          reprint_from = doc.reprint_info.reprint_from;
        }
        if (reprint_from != "") {
          //更新原文章所在文档的 reprint_to
          collection.update({
            "name": reprint_from.name,
            "time.day": reprint_from.day,
            // "title": reprint_from.title
          }, {
            $pull: {
              "reprint_info.reprint_to": {
                "name": name,
                "day": day,
                // "title": title
            }}
          }, function (err) {
            if (err) {
              mongodb.close();
              return callback(err);
            }
          });
        }

        //删除转载来的文章所在的文档
        collection.remove({
          "name": name,
          "time.day": day,
          // "title": title
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
  });
};*/

//返回所有文章存档信息
/*Post.getArchive = function(callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //返回只包含 name、time、title 属性的文档组成的存档数组
      collection.find({}, {
        "name": 1,
        "time": 1,
        // "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};*/

//返回原始发表的内容（markdown 格式）
/*Post.edit = function(name, day, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        // "title": title
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//返回查询的一篇文章（markdown 格式）
      });
    });
  });
};*/

//返回所有标签
/*Post.getTags = function(callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //distinct 用来找出给定键的所有不同值
      collection.distinct("tags", function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};*/

//返回含有特定标签的所有文章
/*Post.getTag = function(tag, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询所有 tags 数组内包含 tag 的文档
      //并返回只含有 name、time、title 组成的数组
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};*/

//返回通过标题关键字查询的所有文章信息
Post.search = function(keyword, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "title": pattern
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
         return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};

//转载一篇文章
Post.reprint = function(reprint_from, reprint_to, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //找到被转载的文章的原文档
      collection.findOne({
        "name": reprint_from.name,
        "time.day": reprint_from.day,
        "title": reprint_from.title
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }

        var date = new Date();
        var time = {
            date: date,
            year : date.getFullYear(),
            month : date.getFullYear() + "-" + (date.getMonth() + 1),
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        }

        delete doc._id;//注意要删掉原来的 _id

        doc.name = reprint_to.name;
        doc.head = reprint_to.head;
        doc.time = time;
        doc.title = (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" + doc.title;
        doc.comments = [];
        doc.reprint_info = {"reprint_from": reprint_from};
        doc.pv = 0;

        //更新被转载的原文档的 reprint_info 内的 reprint_to
        collection.update({
          "name": reprint_from.name,
          "time.day": reprint_from.day,
          "title": reprint_from.title
        }, {
          $push: {
            "reprint_info.reprint_to": {
              "name": doc.name,
              "day": time.day,
              "title": doc.title
          }}
        }, function (err) {
          if (err) {
            mongodb.close();
            return callback(err);
          }
        });

        //将转载生成的副本修改后存入数据库，并返回存储后的文档
        collection.insert(doc, {
          safe: true
        }, function (err, post) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(err, post[0]);
        });
      });
    });
  });
};