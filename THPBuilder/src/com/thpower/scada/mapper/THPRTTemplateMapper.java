package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPRTTemplate;

/**
* @author admin
* @version 创建时间：2018年8月13日 下午11:04:13
* 类说明
*/
public interface THPRTTemplateMapper {
	
	public List<THPRTTemplate>  getAllTemplates();

	public List<THPRTTemplate>  getTemplatesByProId(long proid);	

	///////////////////////////////////////////////////////
	THPRTTemplate select(long templateId);
	 
	int insert(THPRTTemplate template);
	
	int update(THPRTTemplate template);
	
	int delete(long templateId);

}
