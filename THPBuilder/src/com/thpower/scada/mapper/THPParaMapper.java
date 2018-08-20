package com.thpower.scada.mapper;

import java.util.ArrayList;
import java.util.List;

import com.thpower.scada.model.THPPara;

/**
* @author admin
* @version 创建时间：2017年11月15日 下午5:47:57
* 类说明
*/
public interface THPParaMapper {
	
	public List<THPPara>  getParas();
	
	public List<THPPara>  getParasByType(String paratype);
	
	public String getParaValue(String paracode);
	
	public int updateParaValue(THPPara para);	
	
	public THPPara select(long paraid);
	 
	public int insert(THPPara para);
	
	public int update(THPPara para);	
	
	public int delete(long paraid);
	
	public List<String> getTypes();

}
