package org.zhongwen.weather.entity;

/**
 * 首页上显示的信息
 * 
 * @author zw
 * 
 */
public class ThisWeather extends WeatherEntity {
	private String wendu;				//实时温度
	private String[] afterlowandhigh; 	//未来几天 低温~高温 ：{0°~10°,0°~10°,...}
	private String[] afterdays; 		//未来几天 星期 ：{周四，周五，...}
	private String dateandweek;  //今天的日期和星期 ：05月07日 周三
	private String refreshTime;		//刷新时间 :13:03 更新
	private String city;
	public String getWendu() {
		return wendu;
	}
	public void setWendu(String wendu) {
		this.wendu = wendu;
	}
	

	public String[] getAfterlowandhigh() {
		return afterlowandhigh;
	}
	public void setAfterlowandhigh(String[] afterlowandhigh) {
		this.afterlowandhigh = afterlowandhigh;
	}
	public String[] getAfterdays() {
		return afterdays;
	}
	public void setAfterdays(String[] afterdays) {
		this.afterdays = afterdays;
	}
	public String getDateandweek() {
		return dateandweek;
	}
	public void setDateandweek(String dateandweek) {
		this.dateandweek = dateandweek;
	}
	public String getRefreshTime() {
		return refreshTime;
	}
	public void setRefreshTime(String refreshTime) {
		this.refreshTime = refreshTime;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	
	
}
