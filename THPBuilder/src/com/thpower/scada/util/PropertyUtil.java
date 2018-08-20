package com.thpower.scada.util;
/**
* @author admin
* @version 创建时间：2018年5月3日 下午1:54:35
* 类说明
*/
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.util.Properties;

/**
 * Desc:properties文件获取工具类
 * Created by wuguanhui on 2018/5/3.
 */
public class PropertyUtil {
	
    private static final Logger logger = LoggerFactory.getLogger(PropertyUtil.class);
    private static final String linux = "Linux";
    
    private static Properties props;
    static{
        loadProps();
    }

    synchronized static private void loadProps(){
    	
        logger.info("开始加载properties文件内容.......");
        props = new Properties();
        InputStream in = null;
        try {
        	//第一种，通过类加载器进行获取properties文件流
            in = PropertyUtil.class.getClassLoader().getResourceAsStream("config.properties");
            //第二种，通过类进行获取properties文件流
            //in = PropertyUtil.class.getResourceAsStream("/config.properties");
            props.load(in);
            
        } catch (FileNotFoundException e) {
            logger.error("config.properties文件未找到");
        } catch (IOException e) {
            logger.error("出现IOException");
        } finally {
            try {
                if(null != in) {
                    in.close();
                }
            } catch (IOException e) {
                logger.error("config.properties文件流关闭出现异常");
            }
        }
        logger.info("加载properties文件内容完成...........");
        logger.info("properties文件内容：" + props);
    }

    public static String getProperty(String key){
        if(null == props) {
            loadProps();
        }
        
        return props.getProperty(getSystem()+key);
    }

    public static String getProperty(String key, String defaultValue) {
        if(null == props) {
            loadProps();
        }
        return props.getProperty(getSystem()+key, defaultValue);
    }
    
    public static String getSystem()
    {
		String os = System.getProperty("os.name"); 
		logger.info("os.name: " + os);
		
		if(!os.toLowerCase().startsWith("win")){  
			return linux;
		}
		
		return "";
		
    }
}
