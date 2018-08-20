package com.thpower.scada.util;

import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

public class COMUtil {

	/**
	 * 获得随机UUID(不带“-”符号)
	 * @return
	 */
	public static String randomShortUUID(){
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
	/**
	 * 获得随机UUID
	 * @return
	 */
	public static String randomLongUUID(){
		return UUID.randomUUID().toString();
	}
	
	/**
	   * 获取现在日期与时间
	   * 
	   * @return 返回时间类型 yyyy-MM-dd HH:mm:ss
	   */
	public static Date getNowDate() {
	   Date currentTime = new Date();
	   SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	   String dateString = formatter.format(currentTime);
	   ParsePosition pos = new ParsePosition(8);
	   Date currentTime_2 = formatter.parse(dateString, pos);
	   return currentTime_2;
	}
	
	/**
	   * 获取现在日期与时间
	   * 
	   * @return返回字符串格式 yyyy-MM-dd HH:mm:ss
	   */
	public static String getStringDate() {
	   Date currentTime = new Date();
	   SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	   String dateString = formatter.format(currentTime);
	   return dateString;
	}
	
	/**
	   * 获取现在日期
	   * 
	   * @return 返回短时间字符串格式yyyy-MM-dd
	   */
	public static String getStringDateShort() {
	   Date currentTime = new Date();
	   SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	   String dateString = formatter.format(currentTime);
	   return dateString;
	}
	
	/**
	   * 获取时间 
	   * 
	   * @return 返回短时间字符串格式 小时:分;秒 HH:mm:ss
	   */
	public static String getStringTimeShort() {
	   SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
	   Date currentTime = new Date();
	   String dateString = formatter.format(currentTime);
	   return dateString;
	}
	
	//base64  
	public static String base64Encode(String data) {  
		return Base64.encodeBase64String(data.getBytes());  
	}  
	     
	public static String base64Encode(byte[] bytes) {  
		return Base64.encodeBase64String(bytes);  
	}  
	  
	public static byte[] base64Decode(String data) {  
	    return Base64.decodeBase64(data.getBytes());  
	}     
	      
	//MD5  
	public static String md5(String data) {  
		return DigestUtils.md5Hex(data);  
	}  
	   
	//sha1  
	public static String sha1(String data) {  
		return DigestUtils.sha1Hex(data);  
	}  
    
	//sha256Hex  
	public static String sha256Hex(String data) {  
		return DigestUtils.sha256Hex(data);  
	}  
	
	
	public static String getEncoding(String str) {      
	       String encode = "GB2312";      
	      try {      
	          if (str.equals(new String(str.getBytes(encode), encode))) {      //判断是不是GB2312
	               String s = encode;      
	              return s;      //是的话，返回“GB2312“，以下代码同理
	           }      
	       } catch (Exception exception) {      
	       }      
	       encode = "ISO-8859-1";      
	      try {      
	          if (str.equals(new String(str.getBytes(encode), encode))) {      //判断是不是ISO-8859-1
	               String s1 = encode;      
	              return s1;      
	           }      
	       } catch (Exception exception1) {      
	       }      
	       encode = "UTF-8";      
	      try {      
	          if (str.equals(new String(str.getBytes(encode), encode))) {   //判断是不是UTF-8
	               String s2 = encode;      
	              return s2;      
	           }      
	       } catch (Exception exception2) {      
	       }      
	       encode = "GBK";      
	      try {      
	          if (str.equals(new String(str.getBytes(encode), encode))) {      //判断是不是GBK
	               String s3 = encode;      
	              return s3;      
	           }      
	       } catch (Exception exception3) {      
	       }      
	      return "";    
	      //如果都不是，说明输入的内容不属于常见的编码格式。
	}
}
