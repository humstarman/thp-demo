package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPUser;

/**
* @author admin
* @version 创建时间：2017年11月14日 下午3:56:19
* 类说明
*/
public interface THPUserMapper {

	public List<THPUser> login(String userEmail, String userPassword);
	
	public THPUser getUserById(long userId);
	
	public THPUser getUserByEmail(String userEmail);

	public List<THPUser> getUsersByRootId(long userRootId);	

	///////////////////////////////////////////////////////
	THPUser select(long userId);
	 
	int insert(THPUser user);
	
	int update(THPUser user);
	
	int delete(long userId);
	    
	
}
