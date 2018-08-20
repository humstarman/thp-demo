package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPPic;

/**
* @author admin
* @version 创建时间：2017年11月15日 下午5:47:57
* 类说明
*/
public interface THPPicMapper {
	
	public List<THPPic>  getMultiPics();

	public List<THPPic>  getPics();
	
	public THPPic selectByURL(String picurl);
	
	int updatePicContent(THPPic pic);	
	
	THPPic select(long picid);
	 
	int insert(THPPic pic);
	
	int update(THPPic pic);	
	
	int delete(long picid);

}
