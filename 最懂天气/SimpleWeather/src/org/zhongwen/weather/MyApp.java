package org.zhongwen.weather;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import org.zhongwen.weather.entity.ThisWeather;
import org.zhongwen.weather.entity.WeatherEntity;

import com.google.gson.reflect.TypeToken;

import android.app.Activity;
import android.app.Application;
import android.content.SharedPreferences;

public class MyApp extends Application {
	public static String currCityId="101020100";
		
	public static String[] weekArray={"周日","周一","周二","周三","周四","周五","周六"};
	//public 	static List<String> tempList = new ArrayList<String>(); // 未来五天温度（第一个是今天）
	//public 	static List<String> weatherList = new ArrayList<String>();// 未来五天天气（第一个是今天）
	public static String week="星期一";
	public static String shared_name="def_weather_data";
	
	public static int SS=0;
	public static List<WeatherEntity> rs=new ArrayList<WeatherEntity>();
	public static ThisWeather tWeather=new ThisWeather();
	public static Type type = new TypeToken<List<WeatherEntity>>(){}.getType();
	public static int currWendu=20;
	public SharedPreferences sp;
	@Override
	public void onCreate() {
		super.onCreate();
		sp=getSharedPreferences(shared_name, Activity.MODE_PRIVATE);
	}
}
