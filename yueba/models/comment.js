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
      // title = this.title,
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
        // "topics.title": title
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
