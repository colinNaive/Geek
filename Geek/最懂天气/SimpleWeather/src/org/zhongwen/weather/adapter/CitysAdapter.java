package org.zhongwen.weather.adapter;

import java.util.List;
import java.util.Map;

import org.lmw.weather.R;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class CitysAdapter extends BaseAdapter {

	protected Context mContext;
	protected LayoutInflater inflater;
	protected List<Map<String, String>> rs;

	public CitysAdapter(Context context,List<Map<String, String>> rs) {
		this.mContext = context;
		this.inflater = LayoutInflater.from(context);
		this.rs = rs;
	}
	@Override
	public int getCount() {
		return rs.size();
	}
	@Override
	public Object getItem(int position) {
		return rs.get(position);
	}
	@Override
	public long getItemId(int position) {
		return position;
	}
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View v = inflater.inflate(R.layout.item_citylist, null);
		TextView cityName = (TextView) v.findViewById(R.id.text1);
		cityName.setText(rs.get(position).get("address"));
		return v;
	}
}
