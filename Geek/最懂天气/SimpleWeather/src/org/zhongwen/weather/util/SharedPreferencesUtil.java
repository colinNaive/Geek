package org.zhongwen.weather.util;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;


/**
 * SharedPreferencesUtil
 * 
 * @author ZhongWen 2014/11/02
 *
 */
public class SharedPreferencesUtil {
	
	private Context mContext;

	public SharedPreferencesUtil(Context context)
	{
		this.mContext = context;
	}
	
	@SuppressWarnings("deprecation")
	@SuppressLint("WorldWriteableFiles")
	public SharedPreferences sharedPreferences(String className) {
		SharedPreferences sp = mContext.getSharedPreferences(className,
				Context.MODE_WORLD_WRITEABLE);
		return sp;
	}

	/**
	 * sharedPreferencesBooleanStore
	 * 
	 * @param className String Name
	 * @param type String
	 * @param value boolean true or false
	 */
	public void sharedPreferencesBooleanStore(String className,String type,Boolean value) {
		Editor editor = sharedPreferences(className).edit();
		try {
			editor.putBoolean(type, value);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		editor.commit();
	}
	
	/**
	 * sharedPreferencesStringStore
	 * @param className String Name
	 * @param type String 
	 * @param value boolean
	 */
	public void sharedPreferencesStringStore(String className,String type,String value) {
		Editor editor = sharedPreferences(className).edit();
		try {
			editor.putString(type, value);
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		editor.commit();
	}
	
	/**
	 * getBooleanSharedPreferences
	 * @param className
	 * @param type
	 * @return value false when is not exist
	 */
	public boolean getBooleanSharedPreferences(String className,String type) {
		boolean value = false;
		try {
			value = sharedPreferences(className).getBoolean(type, false);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return value;
	}
	
	/**
	 * getStringSharedPreferences
	 * @param className
	 * @param type
	 * @return value
	 */
	public String getStringSharedPreferences(String className,String type) {
		String value = null;
		try {
			value = sharedPreferences(className).getString(type, null);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return value;
	}
	
	/**
	 * clearData
	 * @param className String name
	 */
	public void clearData(String className)
	{
		Editor editor = sharedPreferences(className).edit();; 
		editor.clear().commit();
	}

}
