package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPProject;

/**
* @author admin
* @version 创建时间：2017年12月7日 上午11:38:30
* 类说明
*/
public interface THPProjectMapper {
	
	public THPProject getProjectById(long proId);	

	public List<THPProject> getProjectsByUserId(long proUserId);	

	///////////////////////////////////////////////////////
	THPProject select(long proId);
	 
	void insert(THPProject project);
	
	void update(THPProject project);
	
	void delete(long proId);
	    

}
