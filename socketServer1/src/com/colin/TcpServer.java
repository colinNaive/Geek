package com.colin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;

public class TcpServer implements Runnable {
	
	Socket socket;
	String rcvString=null;
	FileOutputStream fileOutputStream=null;
	int size=3481;

	public TcpServer(Socket socket) {
		super();
		this.socket = socket;
	}
	
	@Override
	public void run() {
		try {
			InputStream inputStream = socket.getInputStream();
//			OutputStream outputStream = socket.getOutputStream();
//			BufferedReader bufferedReader = new BufferedReader(
//					new InputStreamReader(inputStream));
//			DataOutputStream dataOutputStream = new DataOutputStream(
//					outputStream);
			while (true) {
				boolean finish=readAndSaveAndConvert(inputStream);
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
	
	/*********************************�����Ǻ�������**********************************************/
	//�߶���д
	private boolean readAndSaveAndConvert(InputStream inputStream){
		try {
			System.out.println("��ʼ�������ļ�:");
			String filename ="d:\\audio\\"+System.currentTimeMillis();
			fileOutputStream = getFileOutputStream(filename+".spx");
			System.out.println("���ļ�����Ϊ:"+filename+".spx");
			System.out.println("��ʼ�����ļ�:");
			boolean finish=readAndWrite(inputStream, fileOutputStream);
			fileOutputStream.close();
			System.out.println("�ļ��ѽ��ղ�����!");
			if(finish){
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
	
	// �߶���д��ֱ����ȡ size ���ֽڡ�
	private boolean readAndWrite(InputStream is, FileOutputStream os){
		byte[] buffer = new byte[size];
		int count = 0;
		while (count < size) {
			int n;
			try {
				n = is.read(buffer);//����������ʽ���ض�ȡ���ֽ���
				// ����û�п��� n = -1 �����
				if(n==-1) return false;
				System.out.println("nnnnnnnnnnnnnnnnnnnnn="+n);
				os.write(buffer, 0, n);
				count += n;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return true;
	}
	
	// �����ļ������������
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
}