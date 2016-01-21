var mongodb = require('./db');

function Comment(activityId, mix, minute, comment) {
  this.activityId=activityId;
  this.mix = mix;
  this.minute = minute;
  // this.title = title;
  this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback) {
  var mix = this.mix,
      minute = this.minute,
      comment = this.comment,
      activityId = this.activityId;
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
      console.log("comment_acitivityId="+activityId);
      console.log("comment_topic_user_id=" + mix);
      console.log("comment_topic_time.minute" + minute);
      //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
      collection.update({
        "activityId":activityId,
        "mix": mix,
        "time.minute": minute,
      }, {
        $push: {"comments": comment}
      } , function (err) {
          console.log("tijiaobaocuo=" + err);
          mongodb.close();
          if (err) {
            console.log("comment_err==" + err);
            return callback(err);
          }
          callback(null);
      });   
    });
  });
};

//删除评论
Comment.rmvcmts = function(activityId, mix, minute, cmtmx, cmttm, callback) {
  console.log("rmvcmts11activityId=" + activityId);
  mongodb.open(function(err, db) {
      if(err) {
          mongodb.close();
          console.log("rmvcmts_open_err ==" + err);
          callback(err);
      }else {
          console.log("rmvcmts22");
          db.collection("posts", function(err, collection) {
              if(err) {
                  mongodb.close();
                  console.log("rmvcmts_collection_err=" + err);
                  callback(err);
              }else {
                  console.log("rmvcmts33");
                  collection.update({
                    "activityId" :activityId,
                    "mix" : mix,
                    "time.minute": minute,
                  },{
                    $pull:{"comments":{"mix":cmtmx , "time":cmttm}}
                  },function(err) {
                    if(err) {
                      mongodb.close();
                      console.log("rmvcmts_update_err==" + err);
                      callback(err);
                    }else{
                      console.log("rmvcmts44");
                      callback(null);
                    }
                  });
              }
          });
      }
  });

};