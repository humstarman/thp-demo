package com.thpower.scada.util;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.codec.binary.Base64;

/**
* @author admin
* @version 创建时间：2018年5月3日 下午4:07:05
* 类说明
* Java 8底下的java.util套件所提供的Base64类别绝对是首选！
* Java 8提供的Base64，要比sun.mis c套件提供的还要快至少11倍，比Apache Commons Codec提供的还要快至少3倍。
* 本工具选用Apache Commons Codec
*/
public class Base64Util {
	
	/**
	 * 图片的枚举类型
	 * 
	 * @author admin
	 * Last_update 2018年5月3日下午5:28:12
	 */
	public enum IMAGETYPE {  
		PNG, JPG, JPEG, GIF, BMP, ICON, SVG
	}
	
	public static String base64Scheme(String type)
	{
		if(type.toUpperCase().equals("PNG"))
		{
			return "data:image/png;base64,";
		}

		if(type.toUpperCase().equals("JPG"))
		{
			return "data:image/jpg;base64,";
		}
		

		if(type.toUpperCase().equals("JPEG"))
		{
			return "data:image/jpeg;base64,";
		}
		

		if(type.toUpperCase().equals("GIF"))
		{
			return "data:image/gif;base64,";
		}
		

		if(type.toUpperCase().equals("BMP"))
		{
			return "data:image/bmp;base64,";
		}		

		if(type.toUpperCase().equals("ICON"))
		{
			return "data:image/x-icon;base64,";
		}
		
		if(type.toUpperCase().equals("SVG"))
		{
			return "data:image/svg+xml;base64,";
		}
		
		return "data:image/jpeg;base64,";
	}
	
	/**
	* 对字节数组字符串进行Base64解码并生成图片
	* @param imgStr 图片数据
	* @param imgFilePath 保存图片全路径地址
	* @return
	*/
    public static boolean base64Decode(String imgStr, String path) 
    {
        if (imgStr == null)
            return false;

        try 
        {
        	// 解密
            byte[] b = Base64.decodeBase64(imgStr);
            
            // 处理数据
            for (int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {
                    b[i] += 256;
                }
            }
            
            OutputStream out = new FileOutputStream(path);
            out.write(b);
            out.flush();
            out.close();
            
            return true;
        } catch (Exception e) {
            return false;
        }        
    }
        
    /**
    * 将图片转换成Base64编码
    * @param imgFile 待处理图片
    * @return
    */
    public static String base64Encode(String imgFile, String imgType)  
    {
        if (imgFile == null)
            return "";
        
    	//将图片文件转化为字节数组字符串，并对其进行Base64编码处理  
        //String imgFile = "F:\\tupian\\a.jpg";//待处理的图片
        
        InputStream in = null;

        byte[] data = null;  
        //读取图片字节数组  
        try   
        {  
            in = new FileInputStream(imgFile);          
            data = new byte[in.available()];  
            in.read(data);  
            in.close();  
        }   
        catch (IOException e)   
        {  
            e.printStackTrace();  
        } 
        
        switch(imgType)
        {
        case "PNG":
        }
        
        //对字节数组Base64编码
        //返回Base64编码过的字节数组字符串        
        return new String(base64Scheme(imgType) + new String(Base64.encodeBase64(data)));
    }
    
    /**
     * 将图片转换成Base64编码
     * @param imgFile 待处理图片
     * @return
     */
     public static String base64Encode(InputStream inputFile, String imgType) 
     {
         if (inputFile == null)
             return "";
         
     	//将图片文件转化为字节数组字符串，并对其进行Base64编码处理  
         //String imgFile = "F:\\tupian\\a.jpg";//待处理的图片         
         //InputStream in = null;

         byte[] data = null;  
         //读取图片字节数组  
         try   
         {  
             //in = new FileInputStream(imgFile);          
             data = new byte[inputFile.available()];  
             inputFile.read(data);  
             inputFile.close();  
         }   
         catch (IOException e)   
         {  
             e.printStackTrace();  
         }  
         
         //对字节数组Base64编码
         //返回Base64编码过的字节数组字符串
         
         return new String(base64Scheme(imgType) + new String(Base64.encodeBase64(data)));
     }
   
}
