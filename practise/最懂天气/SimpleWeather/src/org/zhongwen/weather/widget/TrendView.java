package org.zhongwen.weather.widget;
import java.util.ArrayList;
import java.util.List;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.util.AttributeSet;
import android.view.View;

@SuppressLint("ResourceAsColor")
public class TrendView extends View {
    private final int DAYCOUNT=5;
    private Paint mPoint;
    private Paint mPointPaint;
    private Paint mTextPaint;
    private Paint mLinePaint1;
    private Paint mLinePaint2;
    private Paint mbackLinePaint;
//    private int[] topTem = new int[DAYCOUNT];
    List<Integer> topTem = new ArrayList<Integer>(); 
//    List<Integer> lowTem = new ArrayList<Integer>(); 
//    private int[] lowTem = new int[DAYCOUNT];
    private int xx=3000;
    int max = 3000;
//    int min = 0;
    @SuppressWarnings("unused")
	private Context c;
    public TrendView(Context context) {
		super(context);
		this.c = context;
		init();
    }
    public TrendView(Context context, AttributeSet attr) {
	super(context, attr);
		this.c = context;
		init();
    }
    public void init() {
		mPoint = new Paint();
		mPoint.setAntiAlias(true);
		mPoint.setColor(Color.rgb(240, 80, 80));
		
		mbackLinePaint = new Paint();
		mbackLinePaint.setColor(Color.WHITE);
	
		mPointPaint = new Paint();
		mPointPaint.setAntiAlias(true);
		mPointPaint.setColor(Color.rgb(70, 170, 220));
		
		mLinePaint1 = new Paint();
		mLinePaint1.setColor(Color.rgb(240, 80, 80));//红色#f05050
		mLinePaint1.setAntiAlias(true);
		mLinePaint1.setStrokeWidth(5);
		mLinePaint1.setStyle(Style.STROKE);
		
		mLinePaint2 = new Paint();
		mLinePaint2.setColor(Color.rgb(70, 170, 220));//蓝色#46aadc
		mLinePaint2.setAntiAlias(true);
		mLinePaint2.setStrokeWidth(5);
		mLinePaint2.setStyle(Style.FILL);
	
		mTextPaint = new Paint();
		mTextPaint.setAntiAlias(true);
		mTextPaint.setColor(Color.WHITE);
		mTextPaint.setTextSize(30);

    }
    public void setData(Context context, List<Integer> topTem/*, List<Integer> lowTem*/,int[] topImg, int[] lowImg) {
		this.topTem = topTem;
//		this.lowTem = lowTem;
//		sortArray();
		
		invalidate();
    }
    
//    public void sortArray(){
//		//合并数组
//		int[] temp=new int[this.topTem.size + this.lowTem.length];
//		System.arraycopy(this.topTem, 0, temp, 0, this.topTem.length);
//		System.arraycopy(this.lowTem, 0, temp, this.topTem.length, this.lowTem.length);
//		//排序数组
//		max = min = temp[0];
//		for (int x = 0; x < temp.length; x++) {
//		    if (temp[x] > max) {
//			max = temp[x];
//		    }
//		    if (temp[x] < min) {
//			min = temp[x];
//		    }
//		}
//		xx=max-min;
//    }

    @Override
    protected void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		float[] pointx = new float[DAYCOUNT];
		float width = (float)getWidth();
		System.out.println("getheight="+getHeight());
		System.out.println("xx="+xx);
		float pointy = (float) ((float)(getHeight()-50)/(float)(xx+40));
		System.out.println("pointy="+pointy);
		pointx[0] = width / 8;
		for (int i = 1; i < DAYCOUNT; i++) {
		    pointx[i] = pointx[i - 1] + (width / DAYCOUNT);
		}
		
		//画线
		for (int i = 0; i < DAYCOUNT-1; i++) {
		    canvas.drawLine(pointx[i],(float)(pointy*(max-topTem.get(i)+10)+20),pointx[i+1], (float)(pointy*(max-topTem.get(i+1)+10)+20), mLinePaint1);
		}
		
		for (int i = 0; i < DAYCOUNT; i++) {
		    //画点
		    canvas.drawCircle(pointx[i],(float)(pointy*(max-topTem.get(i)+10)+20), 10, mPoint);
		    //显示温度信息
		    canvas.drawText(topTem.get(i)+"°",pointx[i]-20, (float)(pointy*(max-topTem.get(i)+10)+17), mTextPaint);
		}
	  
//		//画线
//		for (int i = 0; i < DAYCOUNT-1; i++) {
//		    canvas.drawLine(pointx[i],(float)(pointy*(max-lowTem.get(i)+10)+70),pointx[i+1],(float)(pointy*(max-lowTem.get(i+1)+10)+70), mLinePaint2);	
//		}
//		//画点和天气信息
//		for (int i = 0; i < DAYCOUNT; i++) {
//		    canvas.drawCircle(pointx[i],(float)(pointy*(max-lowTem.get(i)+10)+70), 10, mPointPaint);
//		    canvas.drawText(lowTem.get(i)+"°",pointx[i]-20, (float)(pointy*(max-lowTem.get(i)+10)+105), mTextPaint);
//		}
    }
    
}