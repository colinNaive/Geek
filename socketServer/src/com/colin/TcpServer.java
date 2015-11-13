package com.colin;

import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class TcpServer implements Runnable {
	
	Socket socket;
	String rcvString=null;
	FileOutputStream fileOutputStream=null;
	FileOutputStream fileOutputStreamBaidu=null;
	int size=2414;

	public TcpServer(Socket socket) {
		super();
		this.socket = socket;
	}
	
	@Override
	public void run() {
		try {
			InputStream inputStream = socket.getInputStream();
			OutputStream outputStream = socket.getOutputStream();
			DataOutputStream dataOutputStream = new DataOutputStream(
					outputStream);
			while (true) {
				boolean finish=readAndSaveAndConvert(inputStream,dataOutputStream);
				if(!finish){
					inputStream.close();
					break;
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println(e);
		}
	}
	
	/*********************************以下是函数部分**********************************************/
	//边读边写
	private boolean readAndSaveAndConvert(InputStream inputStream,DataOutputStream dataOutputStream){
		try {
			System.out.println("开始命名新文件:");
			String filename ="d:\\Website\\htdocs\\querydata\\audio\\"+System.currentTimeMillis();
			fileOutputStream = getFileOutputStream(filename+".spx");
			fileOutputStreamBaidu = getFileOutputStream(filename+"_baidu.spx");
			System.out.println("新文件命名为:"+filename+".spx");
			System.out.println("开始接收文件:");
			boolean finish=readAndWrite(inputStream, fileOutputStream,fileOutputStreamBaidu);
			fileOutputStream.close();
			fileOutputStreamBaidu.close();
			System.out.println("文件已接收并保存!");
			if(finish){
				//百度语音识别
				new Thread(new BaiduRecognizeDelete(filename+"_baidu",size)).start();
				//科大讯飞识别
				new Thread(new ConvertRecognizeDelete(filename)).start();
			}else{
				socket.close();
				return false;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return true;
	}
	
	
	//数组分割成n/20份，每份加4个元素头
	private byte[] processAry(byte[] ary, int subSize, int preSize) {
		//按subsize分成count等份
		int count = ary.length / subSize;
		
		//定义一个长度为(count等份*preSize+原数组长度)的数组
		byte[] arrParent = new byte[ary.length+preSize*count];
		
		//每一份加4个元素的头
		for (int i = 0; i < count; i++) {
			int index = i * subSize;
			int index_= i * (subSize+preSize);
			byte[] arrChild= new byte[subSize+preSize];
			arrChild[0]=0x14;
			arrChild[1]=0x00;
			arrChild[2]=0x00;
			arrChild[3]=0x00;
			int j = 4;
			while (j < (subSize+preSize) && index < ary.length) {
				arrChild[j]=ary[index++];
				j++;
			}
			System.arraycopy(arrChild, 0, arrParent, index_, subSize+preSize);
		}
		return arrParent;
	}
	
	//数据分段
	private OggPart processOgg(int size){
		OggPart oggPart = new OggPart();
		size=size-1268;
		int loopTimes=size/1077;//取整
		int restDataLength=size%1077;//取余
		restDataLength=(restDataLength-27)/21;
		oggPart.setLoopTimes(loopTimes);
		oggPart.setRestDataLength(restDataLength);
		return oggPart;
	}	
	
	// 创建文件并返回输出流
	private FileOutputStream getFileOutputStream(String path){
		File file = new File(path);
		FileOutputStream fos = null;
		if (!file.exists()) { 
			try {
				file.createNewFile();
				fos=new FileOutputStream(file);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return fos;
	}
	
	// 边读边写，直到读取size个字符------备份
	private boolean readAndWrite(InputStream is, FileOutputStream os,FileOutputStream osb){
		
		byte[] buffer_baidu_ogg = new byte[1000];
		byte[] buffer_baidu_frame = new byte[1200];
		
		//第一块
		try {
			int count = 1268;  
			byte[] buffer = new byte[count];  
			int readCount = 0; // 已经成功读取的字节的个数  
			while (readCount < count) {  
			    readCount += is.read(buffer, readCount, count - readCount);  
			}  
			System.arraycopy(buffer, 268, buffer_baidu_ogg, 0, 1000);//去掉文件头
			System.arraycopy(processAry(buffer_baidu_ogg, 20, 4), 0, buffer_baidu_frame, 0, 24*50);//帧数据改成24字节
			os.write(buffer, 0, 1268);
			osb.write(buffer_baidu_frame, 0, 24*50);
			System.out.println("读取第一部分n="+readCount);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//把语音数据分块
				OggPart oggPart=processOgg(size);
				int loopTimes=oggPart.getLoopTimes();
				int restDataLength=oggPart.getRestDataLength();
		
		//第二块
		for(int i=0;i<loopTimes;i++){
			try {
				int count = 1077;  
				byte[] buffer = new byte[count];  
				int readCount = 0; // 已经成功读取的字节的个数  
				while (readCount < count) {  
				    readCount += is.read(buffer, readCount, count - readCount);  
				}  
				System.arraycopy(buffer, 77, buffer_baidu_ogg, 0, 1000);//去掉ogg头
				System.arraycopy(processAry(buffer_baidu_ogg, 20, 4), 0, buffer_baidu_frame, 0, 24*50);//帧数据改成24字节
				os.write(buffer, 0, 1077);
				osb.write(buffer_baidu_frame, 0, 24*50);
				System.out.println("读取第二部分n="+readCount);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		//第三块
		try {
			int count = 27+restDataLength+20*restDataLength;  
			byte[] buffer = new byte[count];  
			int readCount = 0; // 已经成功读取的字节的个数  
			while (readCount < count) {  
			    readCount += is.read(buffer, readCount, count - readCount);  
			}  
			System.arraycopy(buffer, 27+restDataLength, buffer_baidu_ogg, 0, 20*restDataLength);//去掉ogg头
			System.arraycopy(processAry(buffer_baidu_ogg, 20, 4), 0, buffer_baidu_frame, 0, 24*20*restDataLength);//帧数据改成24字节
			os.write(buffer,0,restDataLength*20);
			osb.write(buffer_baidu_frame, 0, restDataLength*24);
			System.out.println("读取第三部分n="+readCount);
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		return true;
	}
}