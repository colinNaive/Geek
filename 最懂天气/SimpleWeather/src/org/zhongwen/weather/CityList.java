package org.zhongwen.weather;

import java.util.List;
import java.util.Map;
import org.lmw.weather.R;
import org.zhongwen.weather.adapter.CitysAdapter;
import org.zhongwen.weather.util.DB;


import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;

/**
 * 地区列表界面
 * 
 * @author Dave
 * 
 */
public class CityList extends BaseActivity {
	private TextView provinceTV;
	private TextView cityTV;
	private ListView listView; // 数据显示列表
	private CitysAdapter adapter;
	private List<Map<String, String>> list;

	private int state = 0;
	private String city = "";
	private String id = "";

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.listcity);

		state = 0;
		provinceTV = (TextView) findViewById(R.id.provinceText);
		cityTV = (TextView) findViewById(R.id.cityText);
		listView = (ListView) findViewById(R.id.addresslist);
		list = DB.getProvince();
//		String[] from = new String[] { "address" };
//		int[] to = new int[] { android.R.id.text1 };
//		adapter = new SimpleAdapter(this, list,R.layout.item_citylist, from, to);
		
		adapter=new CitysAdapter(CityList.this, list);
		listView.setAdapter(adapter);
		listView.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> arg0, View arg1, int arg2,
					long arg3) {
				String temp = list.get(arg2).get("address");
				switch (state) {
				case 0: // 查询市
					getCity(temp);
					provinceTV.setText(temp + ">>");
					city = temp;
					state = 1;
					break;
				case 1: // 查询县（区）
					getCountry(temp);
					cityTV.setText(temp + ">>");
					state = 2;
					break;
				case 2: // 查询ID并返回数据
					getId(temp);
					// 返回id数据
					Intent intent = new Intent();
					intent.putExtra("cityId", id);
					intent.putExtra("cityName", temp);
					setResult(RESULT_OK, intent);
					finish();
					break;
				default:
					break;
				}
			}
		});
	}

	@Override
	public void finish() {
		super.finish();
		overridePendingTransition(R.anim.push_down_in, R.anim.push_down_out);
	}

	private void getProvince() {
		list.clear();
		list.addAll(DB.getProvince());
		adapter.notifyDataSetChanged();
	}

	private void getCity(String province) {
		list.clear();
		list.addAll(DB.getCity(province));
		adapter.notifyDataSetChanged();
	}

	private void getCountry(String city) {
		list.clear();
		list.addAll(DB.getCountry(city));
		adapter.notifyDataSetChanged();
	}

	private void getId(String country) {
		id = DB.getAddressId(country);
	}

	@Override
	public void onBackPressed() {
		switch (state) {
		case 0:
			setResult(RESULT_CANCELED);
			finish();
			break;
		case 1: // 显示省
			getProvince();
			provinceTV.setText("");
			cityTV.setText("");
			state = 0;
			break;
		case 2: // 显示市
			getCity(city);
			provinceTV.setText(city + ">>");
			cityTV.setText("");
			state = 1;
			break;
		default:
			break;
		}
	}
}
