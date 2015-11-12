package org.zhongwen.weather.widget;

import org.zhongwen.weather.MyApp;
import org.zhongwen.weather.util.API;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.util.Log;

public class ExampleAppWidgetService extends Service {
	
	private static final String TAG="ExampleAppWidgetService"; 

	// 更新 widget 的广播对应的action
	private final String ACTION_UPDATE_ALL = "org.lmw.weather.UPDATE";
	// 周期性更新 widget 的周期
	private static final int UPDATE_TIME = 5000;
	// 周期性更新 widget 的线程
	private UpdateThread mUpdateThread;
	private Context mContext;
	// 更新周期的计数
	private int count=0;  	

	API dataUtil; 
	private Handler hd;
	@Override
	public void onCreate() {
		
		// 创建并开启线程UpdateThread
		mUpdateThread = new UpdateThread();
		mUpdateThread.start();
		
		mContext = this.getApplicationContext();

		dataUtil=new API(this);
		hd=initHandler();
		super.onCreate();
	}
	
	@Override
	public void onDestroy(){
		// 中断线程，即结束线程。
        if (mUpdateThread != null) {
        	mUpdateThread.interrupt();
        }
        
		super.onDestroy();
	}
	
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	/*
	 * 服务开始时，即调用startService()时，onStartCommand()被执行。
	 * onStartCommand() 这里的主要作用：
	 * (01) 将 appWidgetIds 添加到队列sAppWidgetIds中
	 * (02) 启动线程
	 */
	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		Log.d(TAG, "onStartCommand");		
		super.onStartCommand(intent, flags, startId);
		
	    return START_STICKY;
	}
	
    private class UpdateThread extends Thread {
        @Override
        public void run() {
            super.run();
            try {
	            count = 0;
	            while (true) {
	            	Log.d(TAG, "run ... count:"+count);
	            	count++;
	        		Intent updateIntent=new Intent(ACTION_UPDATE_ALL);
	        		updateIntent.putExtra("wendu", count+"°");
	        		mContext.sendBroadcast(updateIntent);
	                Thread.sleep(UPDATE_TIME);
	            } 
            } catch (InterruptedException e) {
            	// 将 InterruptedException 定义在while循环之外，意味着抛出 InterruptedException 异常时，终止线程。
                e.printStackTrace();
            }
        }
    }
    
    public Handler initHandler(){
    	return new Handler(){
    		@Override
    		public void handleMessage(Message msg) {
    			super.handleMessage(msg);
    			if(msg.what==0){
	        		Intent updateIntent=new Intent(ACTION_UPDATE_ALL);
//	        		updateIntent.putExtra("wendu", MyApp.tWeather.getWendu());
	        		updateIntent.putExtra("wendu", MyApp.currWendu);
	        		mContext.sendBroadcast(updateIntent);
    			}else{
    				
    			}
    		}
    	};
    }
    
}
