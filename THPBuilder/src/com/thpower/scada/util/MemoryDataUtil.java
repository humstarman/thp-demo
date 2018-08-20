package com.thpower.scada.util;

import java.util.HashMap;
import java.util.Map;

/**
* @author admin
* @version 创建时间：2017年12月12日 下午2:14:18
* 类说明
* 存放静态数据，并初始化
*/
public class MemoryDataUtil {
	
	private static Map<String, String> sessionIDMap = new HashMap<String,String>();
	
	public static Map<String, String> getSessionIDMap() {
		return sessionIDMap;
	}
	
	public static void setSessionIDMap(Map<String, String> sessionIDMap) {
		MemoryDataUtil.sessionIDMap = sessionIDMap;
	}
	
}
