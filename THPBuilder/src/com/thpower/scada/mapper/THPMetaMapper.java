package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPMeta;

/**
* @author admin
* @version 创建时间：2017年11月15日 下午5:47:57
* 类说明
*/
public interface THPMetaMapper {
	
	public List<THPMeta>  getMetas();	

	public List<THPMeta>  getMetasByLabel(String metaLabel);	

	int updateMetaLabel(THPMeta meta);
	
	int updateMetaContent(THPMeta meta);	
	
	THPMeta select(long metaid);
	 
	int insert(THPMeta meta);
	
	int update(THPMeta meta);	
	
	int delete(long metaid);

}
