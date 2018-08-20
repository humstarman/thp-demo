package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPFile;

/**
* @author admin
* @version 创建时间：2017年11月15日 下午5:47:57
* 类说明
*/
public interface THPFileMapper {
	
	public List<THPFile>  getFiles();
	
	int updateFileContent(THPFile file);	
	
	THPFile select(long fileid);
	 
	int insert(THPFile file);
	
	int update(THPFile file);	
	
	int delete(long fileid);

}
