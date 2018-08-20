package com.thpower.scada.mapper;

import java.util.List;

import com.thpower.scada.model.THPRTSpreadsheet;

/**
* @author admin
* @version 创建时间：2018年8月13日 下午11:03:58
* 类说明
*/
public interface THPRTSpreadsheetMapper {
	
	public List<THPRTSpreadsheet>  getAllSheets();

	public List<THPRTSpreadsheet>  getSheetsByProId(long proid);
	
	///////////////////////////////////////////////////////
	THPRTSpreadsheet select(long sheetId);
	 
	int insert(THPRTSpreadsheet sheet);
	
	int update(THPRTSpreadsheet sheet);
	
	int delete(long sheetId);

}
