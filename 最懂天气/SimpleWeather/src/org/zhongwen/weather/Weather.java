package org.zhongwen.weather;
import java.io.File;
import java.io.RandomAccessFile;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.simonvt.menudrawer.MenuDrawer;
import net.simonvt.menudrawer.Position;

import org.lmw.weather.R;
import org.zhongwen.weather.entity.ThisWeather;
import org.zhongwen.weather.entity.WeatherEntity;
import org.zhongwen.weather.util.API;
import org.zhongwen.weather.util.AppManager;
import org.zhongwen.weather.util.SharedPreferencesUtil;
import org.zhongwen.weather.util.WriteToSD;
import org.zhongwen.weather.widget.RobotoTextView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import android.app.AlertDialog;
import android.app.Service;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.os.Vibrator;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterView.OnItemLongClickListener;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;

public class Weather extends BaseActivity implements OnClickListener,OnItemClickListener,OnItemLongClickListener{
	private boolean isBack = false;		// 是否能够退出
	private long downTime;					// 上次按退出的时间
	private Vibrator mVibrator=null; // 声明一个振动器对象
	
	private MenuDrawer mMenuDrawer;
	private ImageButton trend;
	private ImageView refreshBtn;
	private TextView localCity;
	//天气内容
	private TextView wind;
	private TextView high_low;
	private TextView refreshDate;
	private TextView refreshTime;
	private TextView weather;
	private RobotoTextView wendu;
	//主页面未来四天简单天气
	private LinearLayout afterfive_layout;
	private TextView afterfive_weekday;
	private TextView afterfive_wendu;
	//左側菜單
	private ListView lv;
	private TextView toCityList;
	private SimpleAdapter sAdapter;
	private TextView version_btn;
	
	private boolean ISREFRESH=false;

	private static final int REQ_CITYLIST=99;
	private static final String TAG = "weather";
	private Handler hd;
	private API dataUtil;
	private SharedPreferencesUtil mSharedPreferencesUtil;
	private static List<HashMap<String, String>> dataSourceList = new ArrayList<HashMap<String, String>>();
	private HashMap<String, String> itemHashMap;
	private Gson gson = new Gson();
	private Type type_list = new TypeToken<List<HashMap<String, String>>>(){}.getType();
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		new WriteToSD(this);		//将城市列表写入数据库
		initMenu() ;					//初始化左侧菜单
		initView();						//初始化数据解析类，界面控件，消息接收器Handler
		changeSearchState();	 	//执行刷新界面（获取数据）
	}
	public void initMenu() {
		//获取屏幕宽度
		WindowManager wm = this.getWindowManager();
		int width = wm.getDefaultDisplay().getWidth();
		
		mMenuDrawer = MenuDrawer.attach(this, Position.LEFT);
		mMenuDrawer.setTouchMode(MenuDrawer.TOUCH_MODE_FULLSCREEN);
		mMenuDrawer.setContentView(R.layout.activity_weather);
		mMenuDrawer.setMenuView(R.layout.leftmenu);
		mMenuDrawer.setMenuSize(width/2);
	}
	

	public void initView(){
		dataUtil= new API(Weather.this);
		mSharedPreferencesUtil = new SharedPreferencesUtil(Weather.this);
		readMyCitys();
		hd=getHandler();
		//首页面title上的组件
		localCity=(TextView)findViewById(R.id.localcity);
		refreshBtn=(ImageView)findViewById(R.id.refresh);
		trend=(ImageButton)findViewById(R.id.trend);
		//左侧菜单界面组件
		toCityList=(TextView)findViewById(R.id.tocitylist);
		lv=(ListView)findViewById(R.id.addresList);
		version_btn=(TextView)findViewById(R.id.version_btn);
		String[] from = new String[]{"cityName"};
		int[] to = new int[]{R.id.left_item_val};
		sAdapter=new SimpleAdapter(Weather.this, mycitys, R.layout.item_leftmenu, from, to);
		lv.setAdapter(sAdapter);
		MyApp.currCityId=mycitys.get(0).get("cityId");
		
		version_btn.setOnClickListener(this);
		lv.setOnItemClickListener(this);
		lv.setOnItemLongClickListener(this);
		toCityList.setOnClickListener(this);
		trend.setOnClickListener(this);
		refreshBtn.setOnClickListener(this);
		localCity.setOnClickListener(this);
		//首页面上的组件
		wendu=(RobotoTextView)findViewById(R.id.wendu);
		wind=(TextView)findViewById(R.id.wind);
		high_low=(TextView)findViewById(R.id.high_low);
		refreshDate=(TextView)findViewById(R.id.refreshDate);
		refreshTime=(TextView)findViewById(R.id.refreshTime);
		weather=(TextView)findViewById(R.id.weather);
		afterfive_layout=(LinearLayout)findViewById(R.id.afterfive_layout);
//		version_btn.setText("检查更新 V"+ getCurrentVersion());
		version_btn.setText("最懂天气");
//		GetData();
//		int resource = Integer.parseInt(dataSourceList.get(0).get("item_image"));
//		Log.i(TAG, "---resource--" + resource);
//		this.findViewById(R.id.background).setBackgroundResource(resource);
	}
	
	public void GetData()
	{
//		if (mSharedPreferencesUtil.getStringSharedPreferences("clothes",
//				"listdata") != null) {
//			dataSourceList = gson.fromJson(mSharedPreferencesUtil.
//					getStringSharedPreferences("clothes", "listdata"),type_list);
//			Log.i(TAG, "---main--" + dataSourceList.toString());
//		} else {
//			GenerateData();
//		}
		if(mSharedPreferencesUtil.getStringSharedPreferences("clothes",
				"listdata") == null)
		{
			GenerateData();
		}
	}
	
	public void GenerateData() {
		if (dataSourceList != null) {
			dataSourceList.clear();
		}
		for (int i = 0; i < 5; i++) {

			itemHashMap = new HashMap<String, String>();
			if (i == 0) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_1));
				dataSourceList.add(itemHashMap);
			} else if (i == 1) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_2));
				dataSourceList.add(itemHashMap);
			} else if (i == 2) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_3));
				dataSourceList.add(itemHashMap);
			} else if (i == 3) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_4));
				dataSourceList.add(itemHashMap);
			} else {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_5));
				dataSourceList.add(itemHashMap);
			}
		}
	}
	//
	public void changeSearchState() {
		if(ISREFRESH){
			refreshBtn.clearAnimation();
			ISREFRESH=false;
		}else {
			getData();
//			dataUtil.parseJson(mSharedPreferencesUtil.getStringSharedPreferences("def_weather_data", "def_weather"));
			Animation anim = AnimationUtils.loadAnimation(this,R.anim.loading);
			refreshBtn.clearAnimation();
			refreshBtn.startAnimation(anim);
			ISREFRESH=true;
		}
	}
	
	public void getData(){
		dataUtil.getData(MyApp.currCityId, hd);
	}
	@Override
	public void onClick(View v) {
		if(v==trend){
		startActivity(new Intent(Weather.this, TrendWeek.class));
		}
		if(v==refreshBtn){
			changeSearchState();
		}
		if(v==localCity){
			mMenuDrawer.openMenu();
		}
		if(v==toCityList){
			mMenuDrawer.closeMenu();
			startActivityForResult(new Intent(Weather.this, CityList.class), REQ_CITYLIST);
			overridePendingTransition(R.anim.push_up_in, R.anim.push_up_out);
		}
		if(v==version_btn){
			showToast("最懂你的天气预报");
		}
	}
	//Activity跳转回调函数
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		//resultCode : RESULT_OK=-1
		//requestCode :自己定义的
		if(resultCode==RESULT_OK){
			if(requestCode==REQ_CITYLIST){
				MyApp.currCityId=data.getExtras().get("cityId").toString();
				localCity.setText(data.getExtras().get("cityName").toString());
				changeSearchState();
				
				//选择新的城市之后，封装到map添加到list转为json写入sharedprefence
				Map<String, String> map=new HashMap<String, String>();
				map.put("cityId", data.getExtras().get("cityId").toString());
				map.put("cityName",data.getExtras().get("cityName").toString());
				mycitys.add(map);
				
				writeMyCitys();
				sAdapter.notifyDataSetChanged();
			}
		}
	}
	//线程消息接收器
	public Handler getHandler(){
		return new Handler(){
			@Override
			public void handleMessage(Message msg) {
				super.handleMessage(msg);
				if(msg.what==0){
					 putData();
				}
				if(msg.what==1){
					int errorNo=msg.arg1;
					showToast("erroeNo----"+errorNo);
				}
			}
		};
	}
	
	//更新界面控件值
	public void putData(){
		ThisWeather tweather=MyApp.tWeather;
		WeatherEntity today=MyApp.rs.get(0);
    	localCity.setText(tweather.getCity());
    	weather.setText(today.getType());
    	wendu.setText(tweather.getWendu()+"°");
    	high_low.setText(today.getLow()+"~"+today.getHigh());
    	wind.setText(today.getFengxiang()+"\t"+today.getFengli());
    	refreshDate.setText(tweather.getDateandweek());
    	refreshTime.setText(tweather.getRefreshTime());
    	
		for(int i=0;i<5;i++){
			afterfive_weekday=(TextView)afterfive_layout.getChildAt(i).findViewById(R.id.after_weekday);
			afterfive_wendu=(TextView)afterfive_layout.getChildAt(i).findViewById(R.id.after_wendu);
			afterfive_weekday.setText(tweather.getAfterdays()[i]);
			afterfive_wendu.setText(MyApp.tWeather.getAfterlowandhigh()[i]);
		}
    	changeSearchState();
    	showToast("刷新完成");
	}

	
	//左侧菜单选择事件监听
	@Override
	public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
		mMenuDrawer.closeMenu();
		MyApp.currCityId=mycitys.get(arg2).get("cityId");
		changeSearchState();
	}
	//左侧菜单长按事件监听
	@Override
	public boolean onItemLongClick(AdapterView<?> arg0, View arg1, final int position,long arg3) {
		mVibrator = (Vibrator) getApplication().getSystemService(Service.VIBRATOR_SERVICE);
		mVibrator.vibrate(new long[] { 50, 50, 0, 0 }, -1);
		
		AlertDialog.Builder builder = new AlertDialog.Builder(Weather.this);
		builder.setIcon(android.R.drawable.ic_dialog_info);
		builder.setTitle("确定要删除吗");
		builder.setPositiveButton("确    认",
				new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
					dialog.dismiss();
					if(mycitys.size()==1){
					showToast("至少要保留一个城市");	
					}else{
					mycitys.remove(position);
					writeMyCitys();
					sAdapter.notifyDataSetChanged();
					MyApp.currCityId=mycitys.get(0).get("cityId");
					changeSearchState();
					}
					}
				});
				builder.setNegativeButton("取    消",
				new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						dialog.dismiss();
					}
				});
		builder.show();
		return false;
	}
	
	// 监听后退按钮
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			// 如果当前menu没有显示
			if (!isBack) {
				showToast("再按一次退出");
				downTime = event.getDownTime();
				isBack = true;
				return true;
			} else {
				if (event.getDownTime() - downTime <= 2000) {
					AppManager.getAppManager().AppExit(Weather.this);
				} else {
					showToast("再按一次退出");
					downTime = event.getDownTime();
					return true;
				}
			}
		}
		return super.onKeyDown(keyCode, event);
	}
	@Override
	protected void onDestroy() {
		if(mVibrator!=null){
		mVibrator.cancel();
		}
		super.onDestroy();
	}
	
}
