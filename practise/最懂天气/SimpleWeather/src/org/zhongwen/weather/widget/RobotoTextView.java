package org.zhongwen.weather.widget;
import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.TextView;

public class RobotoTextView extends TextView {

	public RobotoTextView(Context context, AttributeSet attrs) {
		super(context, attrs);
		this.setTypeface(settingTypeface("Roboto-Thin.ttf", context)); 
	}
	
	public static Typeface settingTypeface(String ttfName,Context c){
		AssetManager mAssetManager=c.getAssets();
		Typeface tf=Typeface.createFromAsset(mAssetManager, "ttfs/"+ttfName);
		return tf;
	}
}
