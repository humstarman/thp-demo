package com.thpower.scada.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

/**
 * FTP服务器工具类
 * 
 * @author 褚为标
 * @version 1.0
 * @date 2013-11-18
 */
public class FTPUtil {
	
	/**
	 * 上传文件至FTP服务器
	 * 
	 * @param url
	 * 		服务器IP地址
	 * @param port
	 * 		服务器端口
	 * @param userName
	 * 		用户登录名
	 * @param password
	 * 		用户登录密码
	 * @param storePath
	 * 		服务器文件存储路径
	 * @param fileName
	 * 		服务器文件存储名称
	 * @param is
	 * 		文件输入流
	 * @return
	 * 		<b>true</b>：上传成功
	 * 		<br/>
	 * 		<b>false</b>：上传失败
	 */
	public static boolean storeFile (String url, int port, String userName, String password, String storePath, String fileName, InputStream is) {
		boolean result = false;
		FTPClient ftp = new FTPClient();
		try {
			// 连接至服务器，端口默认为21时，可直接通过URL连接
			ftp.connect(url ,port);
			// 登录服务器
			ftp.login(userName, password);
			// 判断返回码是否合法
			if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
				// 不合法时断开连接
				ftp.disconnect();
				// 结束程序
				return result;
			}
			// 设置文件操作目录
			ftp.changeWorkingDirectory(storePath);
			// 设置文件类型，二进制
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			// 设置缓冲区大小
			ftp.setBufferSize(3072);
			// 上传文件
			result = ftp.storeFile(fileName, is);
			// 关闭输入流
			is.close();
			// 登出服务器
			ftp.logout();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				// 判断输入流是否存在
				if (null != is) {
					// 关闭输入流
					is.close();
				}
				// 判断连接是否存在
				if (ftp.isConnected()) {
					// 断开连接
					ftp.disconnect();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	/**
	 * 从FTP服务器下载文件至本地
	 * 
	 * @param url
	 * 		服务器IP地址
	 * @param port
	 * 		服务器端口
	 * @param userName
	 * 		用户登录名
	 * @param password
	 * 		用户登录密码
	 * @param remotePath
	 * 		服务器文件存储路径
	 * @param fileName
	 * 		服务器文件存储名称
	 * @param localPath
	 * 		本地文件存储路径
	 * @return
	 * 		<b>true</b>：下载成功
	 * 		<br/>
	 * 		<b>false</b>：下载失败
	 */
	public static boolean retrieveFile (String url, int port, String userName, String password, String remotePath, String fileName, String localPath) {
		boolean result = false;
		FTPClient ftp = new FTPClient();
		OutputStream os = null;
		try {
			// 连接至服务器，端口默认为21时，可直接通过URL连接
			ftp.connect(url ,port);
			// 登录服务器
			ftp.login(userName, password);
			// 判断返回码是否合法
			if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
				// 不合法时断开连接
				ftp.disconnect();
				// 结束程序
				return result;
			}
			// 设置文件操作目录
			ftp.changeWorkingDirectory(remotePath);
			// 设置文件类型，二进制
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			// 设置缓冲区大小
			ftp.setBufferSize(3072);
			// 设置字符编码
			ftp.setControlEncoding("UTF-8");
			// 构造本地文件对象
			File localFile = new File(localPath + "/" + fileName);
			// 获取文件操作目录下所有文件名称
			String[] remoteNames = ftp.listNames();
			// 循环比对文件名称，判断是否含有当前要下载的文件名
			for (String remoteName: remoteNames) {
				if (fileName.equals(remoteName)) {
					result = true;
				}
			}
			// 文件名称比对成功时，进入下载流程
			if (result) {
				// 构造文件输出流
				os = new FileOutputStream(localFile);
				// 下载文件
				result = ftp.retrieveFile(fileName, os);
				// 关闭输出流
				os.close();
			}
			// 登出服务器
			ftp.logout();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				// 判断输出流是否存在
				if (null != os) {
					// 关闭输出流
					os.close();
				}
				// 判断连接是否存在
				if (ftp.isConnected()) {
					// 断开连接
					ftp.disconnect();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	/**
	 * 从FTP服务器下载文件至本地
	 * 
	 * @param url
	 * 		服务器IP地址
	 * @param port
	 * 		服务器端口
	 * @param userName
	 * 		用户登录名
	 * @param password
	 * 		用户登录密码
	 * @param remotePath
	 * 		服务器文件存储路径
	 * @param fileName
	 * 		服务器文件存储名称
	 * @param localPath
	 * 		本地文件存储路径
	 * @return
	 * 		<b>true</b>：下载成功
	 * 		<br/>
	 * 		<b>false</b>：下载失败
	 */
	public static String retrieveFileContent (String url, int port, String userName, String password, String remotePath, String fileName) {
		String result = "";
		boolean success = false;
		FTPClient ftp = new FTPClient();
		OutputStream os = null;
		try {
			// 连接至服务器，端口默认为21时，可直接通过URL连接
			ftp.connect(url ,port);
			// 登录服务器
			ftp.login(userName, password);
			// 判断返回码是否合法
			if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
				// 不合法时断开连接
				ftp.disconnect();
				// 结束程序
				return result;
			}
			// 设置文件操作目录
			ftp.changeWorkingDirectory(remotePath);
			// 设置文件类型，二进制
			ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
			// 设置缓冲区大小
			ftp.setBufferSize(3072);
			// 设置字符编码
			ftp.setControlEncoding("UTF-8");
			
			// 构造本地文件对象
			//File localFile = new File(localPath + "/" + fileName);
			// 获取文件操作目录下所有文件名称
			String[] remoteNames = ftp.listNames();
			// 循环比对文件名称，判断是否含有当前要下载的文件名
			for (String remoteName: remoteNames) {
				if (fileName.equals(remoteName)) {
					success = true;
				}
			}
			// 文件名称比对成功时，进入下载流程
			if (success) {
				// 构造文件输出流
				//os = new FileOutputStream(localFile);
				// 下载文件
				//result = ftp.retrieveFile(fileName, os);
				// 关闭输出流
				//os.close();
				
				InputStream isis = ftp.retrieveFileStream(fileName);
				ByteArrayOutputStream   baos   =   new   ByteArrayOutputStream(); 
				int   i=-1; 
				while((i=isis.read())!=-1){ 
					baos.write(i); 
				} 
				
				result = baos.toString();				
			}
			// 登出服务器
			ftp.logout();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				// 判断输出流是否存在
				if (null != os) {
					// 关闭输出流
					os.close();
				}
				// 判断连接是否存在
				if (ftp.isConnected()) {
					// 断开连接
					ftp.disconnect();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		return result;
	}
	
//	public static void main(String[] args) {
//		try {
//			FileInputStream fis = new FileInputStream(new File("D:/Soft Storage/软件工具箱/HTML_Help_WorkShop_1.3_XiaZaiBa.zip"));
//			System.out.println(storeFile("192.168.1.2", 21, "admin", "1", "C:/Documents and Settings/Administrator/桌面", RandomUUID.random() + ".zip", fis));
//		} catch (FileNotFoundException e) {
//			e.printStackTrace();
//		}
//		System.out.println(retrieveFile("192.168.1.2", 21, "admin", "1", "C:/Documents and Settings/Administrator/桌面", "ab86b6a3fbd14b94bdbac6b9aa971a99.zip", "C:/Users/Administrator/Desktop"));
//	}
	
}
