package org.zhongwen.weather.util;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.lmw.weather.R;
import org.zhongwen.weather.adapter.GalleryAdapter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import android.view.View;
import android.widget.*;

public class RecommendClothDialog extends AlertDialog implements DialogInterface.OnClickListener,View.OnClickListener{

	private Context mContext;
	private View mView;
	private Gallery mGallery;
	
	private SharedPreferencesUtil mSharedPreferencesUtil;
	private static List<HashMap<String, String>> dataSourceList = new ArrayList<HashMap<String, String>>();
	private HashMap<String, String> itemHashMap;
	private Gson gson = new Gson();
	private Type type_list = new TypeToken<List<HashMap<String, String>>>(){}.getType();

	public RecommendClothDialog(Context context,String Gender) {
		super(context);
		mContext = context;
//		GetData();
		GenerateData(Gender);
		buildDialogContent(context);
	}
	
	
	@SuppressWarnings("deprecation")
	public int buildDialogContent(Context context) {
		this.setTitle(R.string.dialog_title);
		mView = this.getLayoutInflater().inflate(R.layout.recommend_cloth,null);
		mGallery = (Gallery)mView.findViewById(R.id.gallery1);
		GalleryAdapter mGalleryAdapter = new GalleryAdapter(context,dataSourceList);
		mGallery.setAdapter(mGalleryAdapter);
		this.setView(mView);
    	
        this.setInverseBackgroundForced(true);
        this.setButton(BUTTON_POSITIVE, context.getText(R.string.submit_confirm), this);
        this.setButton(BUTTON_NEGATIVE, context.getText(R.string.submit_cancel), this);  

		return 0;
	}

//	public void GetData()
//	{
//		if (mSharedPreferencesUtil.getStringSharedPreferences("clothes",
//				"listdata") != null) {
//			dataSourceList = gson.fromJson(mSharedPreferencesUtil.
//					getStringSharedPreferences("clothes", "listdata"),type_list);
//		} else {
//			GenerateData();
//		}
//	}
	
	public void GenerateData(String Gender) {
		switch(Gender)
		{
		case "women":
			GenerateWomenData();
			break;
		case "men":
			GenerateMenData();
			break;
		
		}

	}
	
	private void GenerateWomenData()
	{
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
	
	private void GenerateMenData()
	{
		if (dataSourceList != null) {
			dataSourceList.clear();
		}
		for (int i = 0; i < 5; i++) {

			itemHashMap = new HashMap<String, String>();
			if (i == 0) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_man1));
				dataSourceList.add(itemHashMap);
			} else if (i == 1) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_man2));
				dataSourceList.add(itemHashMap);
			} else if (i == 2) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_man3));
				dataSourceList.add(itemHashMap);
			} else if (i == 3) {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_man4));
				dataSourceList.add(itemHashMap);
			} else {
				itemHashMap.put("item_image",
						String.valueOf(R.drawable.spring_man5));
				dataSourceList.add(itemHashMap);
			}
		}
	}
	
	@Override
	public void onClick(View v) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onClick(DialogInterface dialog, int which) {
		switch (which) {
        case BUTTON_POSITIVE:
            //handler save        
            break;
//        case BUTTON_NEGATIVE:
//            //Don't need to do anything
//            break;
        default:
        }		
		
	}

}
