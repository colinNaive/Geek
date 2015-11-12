package org.zhongwen.weather;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import org.lmw.weather.R;
import org.zhongwen.weather.util.RecommendClothDialog;
import org.zhongwen.weather.widget.TrendView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.Canvas;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

public class TrendWeek extends BaseActivity implements OnClickListener {

	private ImageButton home;
	private String[] afterWeekDays = {};
	private LinearLayout day_weather;
	private LinearLayout night_weather;
	private TrendView mTrendView;
	private static final int AFTERSIZE = 5;
	
	private Gson gson = new Gson();
	private Type type_list = new TypeToken<List<HashMap<String, String>>>(){}.getType();
	private ImageView mClothMan;
	private ImageView mClothWomen;
	private List<Integer> MaxTem = new ArrayList<Integer>(); 
	private List<Integer> MinTem = new ArrayList<Integer>(); 

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_trend);
		initView();
	}

	public void initView() {
		afterWeekDays = MyApp.tWeather.getAfterdays();

		System.out.println(new Gson().toJson(afterWeekDays));

		home = (ImageButton) findViewById(R.id.home);
		day_weather = (LinearLayout) findViewById(R.id.day_weather);
		night_weather = (LinearLayout) findViewById(R.id.night_weather);
		mTrendView = (TrendView) findViewById(R.id.trendView);
		mClothMan = (ImageView)findViewById(R.id.cloth_man);
		mClothWomen = (ImageView)findViewById(R.id.cloth_women);
		home.setOnClickListener(this);
		if (MyApp.rs.size() > 0) {
			initData();
		}
		
		mClothWomen.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				// TODO Auto-generated method stub
				RecommendClothDialog mRecommendClothDialog = new RecommendClothDialog(TrendWeek.this,"women");
				mRecommendClothDialog.show();
				
			}
		});
		
		mClothMan.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				RecommendClothDialog mRecommendClothDialog = new RecommendClothDialog(TrendWeek.this,"men");
				mRecommendClothDialog.show();
			}
		});
	}

	public void initData() {
//		int[] MaxTem = new int[AFTERSIZE];
		String[] dayWeather = new String[AFTERSIZE];
		String[] nightWeather = new String[AFTERSIZE];

		for (int i = 0; i < AFTERSIZE; i++) {
			MaxTem.add(Integer.parseInt(MyApp.rs.get(i).getHigh().replace("°", "")));
			MinTem.add(Integer.parseInt(MyApp.rs.get(i).getLow().replace("°", "")));
		}

		String[] afterDays = new String[AFTERSIZE];
		SimpleDateFormat sDateFormat = new SimpleDateFormat("dd/MM");
		Calendar now = Calendar.getInstance();
		now.setTime(new Date());
		// 今天之后五天的日期
		for (int i = 0; i < afterDays.length; i++) {
			now.add(Calendar.DATE, i + 1);
			afterDays[Math.abs(i)] = sDateFormat.format(now.getTime());
			now = Calendar.getInstance();
		}

		for (int i = 0; i < AFTERSIZE; i++) {
			if (MyApp.rs.get(i).getType().contains("转")) {
				dayWeather[i] = MyApp.rs.get(i).getType().split("转")[0];
				nightWeather[i] = MyApp.rs.get(i).getType().split("转")[1];
			} else {
				dayWeather[i] = MyApp.rs.get(i).getType();
				nightWeather[i] = MyApp.rs.get(i).getType();
			}
		}

		for (int i = 0; i < day_weather.getChildCount() + 1; i++) {
			if (i % 2 == 0) {
				TextView tv1 = (TextView) day_weather.getChildAt(i);
				TextView tv2 = (TextView) night_weather.getChildAt(i);

				tv1.setText(afterWeekDays[i / 2] + "\n\r" + dayWeather[i / 2]);
				tv2.setText(nightWeather[i / 2] + "\n\r" + afterDays[i / 2]);
			}
		}
		handler.post(r);
	}
	private Handler handler = new Handler();
	private Runnable r= new Runnable(){

		@Override
		public void run() {
			// TODO Auto-generated method stub
			 MaxTem.remove(0);  
			 MaxTem.add(new Random().nextInt(3000));  
			 mTrendView.setData(TrendWeek.this, MaxTem/*, MinTem*/, null, null);
			 handler.postDelayed(this, 1000);
		}
		
	};

	public static Bitmap createRepeater(int width, Bitmap src) {
		int count = 2;
		Bitmap bitmap = Bitmap.createBitmap(width, src.getHeight(), Config.ARGB_8888);
		Canvas canvas = new Canvas(bitmap);
		for (int idx = 0; idx < count; ++idx) {
			canvas.drawBitmap(src, 0, idx * src.getHeight(), null);
		}
		return bitmap;
	}

	@Override
	public void onClick(View v) {
		onBackPressed();
	}
}
