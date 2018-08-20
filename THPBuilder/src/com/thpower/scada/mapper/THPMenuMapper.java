package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPMenu;

/**
* @author admin
* @version 创建时间：2017年11月15日 下午5:47:57
* 类说明
*/
public interface THPMenuMapper {
	
	public List<THPMenu>  getMenusByProId(long proid);
	
	int updateMenuContent(THPMenu menu);
	
	//需要在相同工程的同级目录下是否有相同的名称，才算重复，否则正常。
	THPMenu validateMenuName(String menuname); 
	
	///////////////////////////////////////////////////////
	THPMenu select(long menuid);
	 
	int insert(THPMenu menu);
	
	int update(THPMenu menu);	
	
	int delete(long menuid);

}
