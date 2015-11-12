package com.colin;

import java.net.ServerSocket;
import java.net.Socket;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * Application Lifecycle Listener implementation class WeChatListener
 *
 */
@WebListener
public class StartListener implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public StartListener() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent arg0) {
        // TODO Auto-generated method stub
    	try {
			@SuppressWarnings("resource")
			ServerSocket ss = new ServerSocket(12345);
			while (true) {
				Socket s = ss.accept();
				System.out.println(s);
				new Thread(new TcpServer(s)).start();
			}
			// ss.close();
		} catch (Exception e) {
			e.printStackTrace();
		}	
    }

    /**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent arg0) {
        // TODO Auto-generated method stub
    }
	
}
