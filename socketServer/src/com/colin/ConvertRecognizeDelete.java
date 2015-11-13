package com.colin;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;

import com.iflytek.cloud.speech.RecognizerListener;
import com.iflytek.cloud.speech.RecognizerResult;
import com.iflytek.cloud.speech.Setting;
import com.iflytek.cloud.speech.SpeechConstant;
import com.iflytek.cloud.speech.SpeechError;
import com.iflytek.cloud.speech.SpeechRecognizer;
import com.iflytek.cloud.speech.SpeechUtility;

public class ConvertRecognizeDelete implements Runnable{

	public String filename=null;
	private static final String APPID = "55c74c18";
	private static final String LIB_NAME_32="LIB_NAME_32";
	private static StringBuffer mResult = new StringBuffer();
	public long qian;
	public long hou;
	public ConvertRecognizeDelete(String filename) {
		super();
		Setting.setShowLog( false );
		SpeechUtility.createUtility("appid=" + APPID+",lib_name_32="+LIB_NAME_32);
		this.filename = filename;
	}
	
	@Override
	public void run() {
		// TODO Auto-generated method stub
		System.out.println("-------------------------->开始转换文件:");
		convertToWave(filename+".spx",filename+".wav");
		System.out.println("-------------------------->文件转换完成!");
		System.out.println("-------------------------->开始语音识别:");
		try {
			Thread.sleep(300);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Recognize(filename+".wav");
	}
	
	/************************************以下是函数部分*************************************/
	
	//听写
	private void Recognize(String filename) {
		if (SpeechRecognizer.getRecognizer() == null)
			SpeechRecognizer.createRecognizer();
		qian=System.currentTimeMillis();
		RecognizePcmfileByte(filename);
	}
	
	//自动化测试注意要点 如果直接从音频文件识别，需要模拟真实的语速，防止音频队列的阻塞
	public void RecognizePcmfileByte(String filename) {
		// 1、读取音频文件
		FileInputStream fis = null;
		byte[] voiceBuffer = null;
		try {
			fis = new FileInputStream(new File(filename));
			voiceBuffer = new byte[fis.available()];
			fis.read(voiceBuffer);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (null != fis) {
					fis.close();
					fis = null;
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		// 2、音频流听写
		if (0 == voiceBuffer.length) {
			mResult.append("no audio avaible!");
		} else {
			SpeechRecognizer recognizer = SpeechRecognizer.getRecognizer();
			recognizer.setParameter(SpeechConstant.DOMAIN, "iat");
			recognizer.setParameter(SpeechConstant.LANGUAGE, "zh_cn");
			recognizer.setParameter(SpeechConstant.AUDIO_SOURCE, "-1");
			recognizer.setParameter( SpeechConstant.RESULT_TYPE, "plain" );
			recognizer.startListening(recListener);
			ArrayList<byte[]> buffers = splitBuffer(voiceBuffer,
					voiceBuffer.length, 4800);
			for (int i = 0; i < buffers.size(); i++) {
				// 每次写入msc数据4.8k，相当于150ms语音数据
				recognizer.writeAudio(buffers.get(i), 0, buffers.get(i).length);
				try {
					Thread.sleep(150);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
			recognizer.stopListening();
		}
	}

	//将直接缓冲区按照固定大小进行分割成数组
	public ArrayList<byte[]> splitBuffer(byte[] buffer, int length, int spsize) {
		ArrayList<byte[]> array = new ArrayList<byte[]>();
		if (spsize <= 0 || length <= 0 || buffer == null
				|| buffer.length < length)
			return array;
		int size = 0;
		while (size < length) {
			int left = length - size;
			if (spsize < left) {
				byte[] sdata = new byte[spsize];
				System.arraycopy(buffer, size, sdata, 0, spsize);
				array.add(sdata);
				size += spsize; 
			} else {
				byte[] sdata = new byte[left];
				System.arraycopy(buffer, size, sdata, 0, left);
				array.add(sdata);
				size += left;
			}
		}
		return array;
	}

	//听写监听器
	private RecognizerListener recListener = new RecognizerListener() {

		public void onBeginOfSpeech() {
			System.out.println("onBeginOfSpeech enter");
			System.out.println("*************开始录音*************");
		}

		public void onEndOfSpeech() {
		}

		public void onVolumeChanged(int volume) {
		}

		public void onResult(RecognizerResult result, boolean islast) {
			mResult.append(result.getResultString());
			
			if( islast ){
				hou=System.currentTimeMillis();
				long peroid= hou-qian;
				System.out.println("period="+peroid);
				System.out.println("-------------------------->讯飞结果=" + mResult.toString());
				mResult.delete(0, mResult.length());
				deleteFile(filename);
			}
		}

		public void onError(SpeechError error) {
			System.out.println("*************" + error.getErrorCode()+ "*************");
		}

		public void onEvent(int eventType, int arg1, int agr2, String msg) {
		}

	};

	//删除文件
	private void deleteFile(String filename){
		File file_spx = new File(filename+".spx");  
		File file_wav = new File(filename+".wav");  
		if (file_spx.exists()){
			if(file_spx.delete()){
				System.out.println("删除文件" + filename +".spx" + "成功!");  
			}
		}
		if (file_wav.exists()){
			if(file_wav.delete()){
				System.out.println("删除文件" + filename +".wav" + "成功!");  
			}
		}
	}
	
	//把接收到的speex文件解码为Ϊwav
	private void convertToWave(String filename_spx,String filename_wav){
		Runtime runtime=Runtime.getRuntime();
		try{
			runtime.exec("ffmpeg.exe -i "+filename_spx+" "+filename_wav);
		}catch(Exception e){
			System.out.println("Error!");
		}
	}

}
