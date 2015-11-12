package org.zhongwen.weather;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.zhongwen.weather.util.AppManager;
import org.zhongwen.weather.util.MySharedPreferences;

import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class BaseActivity extends Activity {
	public Toast mToast=null; 
	public int CurrentWeek=0;
	public List<Map<String, String>> mycitys=new ArrayList<Map<String, String>>();
	private String defMycitys="[{'cityId':'101020100','cityName':'上海'}]";
	private String shared_citysKey="citys";
	private Gson gson=new Gson();
	Type type_list=new TypeToken<List<Map<String, String>>>(){}.getType();
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        AppManager.getAppManager().addActivity(this);
	}
	
	public void showToast(String msg) {
		if (mToast == null) {
			mToast = Toast.makeText(getApplicationContext(), msg,
					Toast.LENGTH_SHORT);
		} else {
			mToast.setText(msg);
			mToast.setDuration(Toast.LENGTH_SHORT);
		}
		mToast.show();
	}
	
	
	public  void readMyCitys(){
		mycitys= gson.fromJson(MySharedPreferences.readMessage(this,shared_citysKey,defMycitys), type_list);
	}
	public void writeMyCitys(){
		MySharedPreferences.writeMessage(this,shared_citysKey, gson.toJson(mycitys));
	}
	
	
	

    /**
     * 获取当前客户端版本信息
     */
    public String getCurrentVersion() {
    	String curVersionName="1.0";
    	//int curVersionCode=1;
	try {
	    PackageInfo info = getPackageManager().getPackageInfo(getApplicationContext().getPackageName(), 0);
	    curVersionName = info.versionName;
	    //curVersionCode = info.versionCode;
	} catch (NameNotFoundException e) {
	    e.printStackTrace(System.err);
	}
	return curVersionName;
    }

	
	@Override
	protected void onDestroy() {
		super.onDestroy();
		
		//结束Activity&从堆栈中移除
		AppManager.getAppManager().finishActivity(this);
	}
}
