package org.zhongwen.weather.util;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import net.tsz.afinal.FinalHttp;
import net.tsz.afinal.http.AjaxCallBack;
import org.json.JSONObject;
import org.zhongwen.weather.MyApp;
import org.zhongwen.weather.entity.ThisWeather;
import org.zhongwen.weather.entity.WeatherEntity;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
/**
 * 获取和解析天气数据
 * @author zw
 */
public class API {
	private final String TAG = "API";
	private Context activity;
	private FinalHttp fh;
	private SharedPreferencesUtil mSharedPreferencesUtil;
	public String def_weather_key = "def_weather";
	
	public String[] weekArray={"周日","周一","周二","周三","周四","周五","周六"};
	//public 	static List<String> tempList = new ArrayList<String>(); // 未来五天温度（第一个是今天）
	//public 	static List<String> weatherList = new ArrayList<String>();// 未来五天天气（第一个是今天）
	public String week="星期一";
	public String shared_name="def_weather_data";
	
	public int SS=0;
	public List<WeatherEntity> rs=new ArrayList<WeatherEntity>();
	public ThisWeather tWeather=new ThisWeather();
	public Type type = new TypeToken<List<WeatherEntity>>(){}.getType();
	public int currWendu=20;

	public API(Context activity) {
		this.activity = activity;
		fh=new FinalHttp();
		fh.configTimeout(200);
		mSharedPreferencesUtil = new SharedPreferencesUtil(activity);
		
	}
	
	/**
	 * 请求API
	 * 
	 * Date         Author      Version     Description
	 * -----------------------------------------------------------------
	 * 2014-5-7    zw
	 */
	public void getData(final String cityId, final Handler hd) {
		
		String URI = "http://wthrcdn.etouch.cn/weather_mini?citykey="+cityId;
		final Message msg = new Message();
		fh.get(URI, new AjaxCallBack<Object>() {
			@Override
			public void onSuccess(Object t) {
				super.onSuccess(t);
				System.out.println("------+++-----+++---------"+t.toString());
				mSharedPreferencesUtil.sharedPreferencesStringStore(shared_name, "def_weather", t.toString());
				parseJson(t.toString());
				msg.what = 0;
				hd.sendMessage(msg);
			}

			@Override
			public void onFailure(Throwable t, int errorNo, String strMsg) {
				super.onFailure(t, errorNo, strMsg);
				msg.what = -1;
				msg.arg1 = errorNo;
				parseJson(mSharedPreferencesUtil.getStringSharedPreferences(shared_name, "def_weather"));
				hd.sendMessage(msg);
			}
			
		});
	}

	/**
	 *  数据解析
	 * Date         Author      Version     Description
	 * -----------------------------------------------------------------
	 * 2014-5-7    zw
	 */
	public void parseJson(String strResult) {
		try {
			MyApp.rs.clear();
			Gson gson=new Gson();
			Type type = new TypeToken<List<WeatherEntity>>(){}.getType();
			JSONObject jsonObj = new JSONObject(strResult.replace("℃", "°").replaceAll("(高温 )","").replace("低温 ", "")).getJSONObject("data");
			MyApp.SS=jsonObj.getInt("wendu");
			List<WeatherEntity> rs=gson.fromJson(jsonObj.getString("forecast"), type);
			MyApp.rs.addAll(rs);
			Log.i(TAG, "---------rs size-----" + MyApp.rs.size());
			MyApp.tWeather.setWendu(jsonObj.getString("wendu"));
			MyApp.tWeather.setRefreshTime(getTime());
			MyApp.tWeather.setDateandweek(getDate());
			MyApp.tWeather.setAfterdays(getAfterDays(5));
			MyApp.tWeather.setAfterlowandhigh(simpleW());
			MyApp.tWeather.setCity(jsonObj.getString("city"));
			Log.i(TAG, "-----city"+ jsonObj.getString("city"));
			
		}catch(Exception e){
			e.printStackTrace();
		}

	}

	/**
	 * ---------------------------------utils----------------------------------
	 */
	
	// 获取更新日期 并转换为（X月X日 周X）
	public String getDate() {
		SimpleDateFormat sdf = new SimpleDateFormat("MM月dd日 EEE", Locale.CHINA);
		String date = sdf.format(new Date());
		return date;
	}

	// 获取更新时间 并转换为 （小时：分钟 更新）
	public String getTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.CHINA);
		String time = sdf.format(new java.util.Date()) + " " + "更新";
		return time;
	}
	
	/**
	 * 获取当前日期是星期几
	 */
	public String[] getAfterDays(int daySize){
		//获取当天是这周的第几天
	    Calendar cal = Calendar.getInstance();
	    Date curDate = new Date(System.currentTimeMillis());
	    cal.setTime(curDate);
	    int w = cal.get(Calendar.DAY_OF_WEEK) - 1;
	    Log.i(TAG,"--------w----------" + w);
	    if (w < 0){
	        w = 0;
	    }
	    //获取今后x天的星期名称
	    return getweeks(MyApp.weekArray[w],daySize);
	}
	
	public String[] getweeks(String currWeedDay,int daySize){
		String[] weeks=new String[daySize];
		int i = 0;
	 	for( i=0;i<MyApp.weekArray.length;i++){
    		if(MyApp.weekArray[i]==currWeedDay){
    			break;
    		}
    	}
		for(int j=0;j<daySize;j++){
			if(i>6){
				i=0;
			}
			weeks[j]=MyApp.weekArray[i];
			i++;
		}
		return weeks;
	}
	
	/**
	 * 未来几天简单天气信息
	 */
	public String[]  simpleW(){
		String[] lowandhighs=new String[MyApp.rs.size()];
		for(int i=0;i<MyApp.rs.size();i++){
			lowandhighs[i]=MyApp.rs.get(i).getLow()+"~"+MyApp.rs.get(i).getHigh();
		}
		return lowandhighs;
	}
	
	
}
