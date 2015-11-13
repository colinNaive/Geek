package com.colin;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;

public class BaiduRecognizeDelete implements Runnable{
	
	String filename=null;
	int size=0;
	String url="http://121.40.77.63/querydata/sample_voice/php/sample7.php";
	
	public BaiduRecognizeDelete(String filename,int size){
		this.filename=filename;
		this.size=size;
	}

	@Override
	public void run() {
		// TODO Auto-generated method stub
		//发送http post请求
		String result=sendPost(url,"filename="+filename);
		System.out.println("-------------------------->百度结果="+result);
		deleteFile(filename);
	}
	
	/********************************以下是函数部分*****************************************************/
	//发送http post请求
    private String sendPost(String url, String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            URLConnection conn = realUrl.openConnection();
            conn.setRequestProperty("Content-Length", "" + size);
            conn.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            out = new PrintWriter(conn.getOutputStream());
            out.print(param);
            out.flush();
            in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(),"utf-8"));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            System.out.println("发送 POST 请求出现异常!"+e);
            e.printStackTrace();
        }finally{
            try{
                if(out!=null){
                    out.close();
                }
                if(in!=null){
                    in.close();
                }
            }
            catch(IOException ex){
                ex.printStackTrace();
            }
        }
        return result;
    }    
    
    //删除文件
  	private void deleteFile(String filename){
  		File file_spx = new File(filename+".spx");  
  		if (file_spx.exists()){
  			if(file_spx.delete()){
  				System.out.println("删除文件" + filename +".spx" + "成功!");  
  			}else{
  				System.out.println("删除文件" + filename +".spx" + "失败!");  
  			}
  		}
  	}
}
