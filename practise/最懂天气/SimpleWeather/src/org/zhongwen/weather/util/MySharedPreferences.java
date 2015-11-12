package org.zhongwen.weather.util;

import org.zhongwen.weather.MyApp;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

public class MySharedPreferences {
	/**
	 * 读取对应的键值
	 * @param key
	 * @return String
	 */
	public static int readMessage(Context acivity,String key, int value) {
		//获得当前的SharedPreferences对象
		SharedPreferences message = acivity.getSharedPreferences(MyApp.shared_name,Activity.MODE_PRIVATE);
		//获取消息
		int tmp = message.getInt(key, value);
		return tmp;
	}
	/**
	 * 将键值对写入配置文件
	 * @param key
	 * @param value
	 */
	public static void writeMessage(Context context,String key, String value) {
		//创建一个SharedPreferences对象
		SharedPreferences message = context.getSharedPreferences(MyApp.shared_name,Activity.MODE_PRIVATE);
		//编辑SharedPreferences对象
		SharedPreferences.Editor editor = message.edit();
		//插入一个数据
		editor.putString(key, value);
		//提交数据
		editor.commit();
	}
	public static String readMessage(Context acivity,String key, String value) {
		SharedPreferences message = acivity.getSharedPreferences(MyApp.shared_name,Activity.MODE_PRIVATE);
		String text = message.getString(key, value);
		return text;
	}
	
}