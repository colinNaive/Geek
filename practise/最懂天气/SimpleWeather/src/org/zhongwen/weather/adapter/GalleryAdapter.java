package org.zhongwen.weather.adapter;

import java.util.HashMap;
import java.util.List;

import org.zhongwen.weather.util.SharedPreferencesUtil;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

public class GalleryAdapter extends BaseAdapter{
	
	private List<HashMap<String, String>> list;
	private LayoutInflater mInflater;
	private SharedPreferencesUtil mSharedPreferencesUtil;
	private ImageView ImageView;
	private Context context;

	public GalleryAdapter(Context context, List<HashMap<String, String>> list){
		this.list = list;
		this.context = context;
		mInflater = LayoutInflater.from(context);
		mSharedPreferencesUtil = new SharedPreferencesUtil(context);
	}

	@Override
	public int getCount() {
		// TODO Auto-generated method stub
		return list.size();
	}

	@Override
	public HashMap<String, String> getItem(int position) {
		return list.get(position);
	}

	@Override
	public long getItemId(int position) {
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		ImageView mImageView = new ImageView(context);
		mImageView.setImageResource(Integer.parseInt(list.get(position).get("item_image")));
		return mImageView;
	}

}
