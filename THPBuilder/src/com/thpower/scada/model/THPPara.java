package com.thpower.scada.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* @author admin
* @version 创建时间：2018年5月3日 下午6:21:39
* 类说明
*/
public class THPPara {	
	
	private long paraId;
	private String paraCode;
	private String paraType;
	private int paraIndex; 
	private String paraName;
	private String paraDescription;
	private String paraValue;
	private String paraIsValid; 
	private String paraNote;
	public long getParaId() {
		return paraId;
	}
	public void setParaId(long paraId) {
		this.paraId = paraId;
	}
	public String getParaCode() {
		return paraCode;
	}
	public void setParaCode(String paraCode) {
		this.paraCode = paraCode;
	}
	public String getParaType() {
		return paraType;
	}
	public void setParaType(String paraType) {
		this.paraType = paraType;
	}
	public int getParaIndex() {
		return paraIndex;
	}
	public void setParaIndex(int paraIndex) {
		this.paraIndex = paraIndex;
	}
	public String getParaName() {
		return paraName;
	}
	public void setParaName(String paraName) {
		this.paraName = paraName;
	}
	public String getParaDescription() {
		return paraDescription;
	}
	public void setParaDescription(String paraDescription) {
		this.paraDescription = paraDescription;
	}
	public String getParaValue() {
		return paraValue;
	}
	public void setParaValue(String paraValue) {
		this.paraValue = paraValue;
	}
	public String getParaIsValid() {
		return paraIsValid;
	}
	public void setParaIsValid(String paraIsValid) {
		this.paraIsValid = paraIsValid;
	}
	public String getParaNote() {
		return paraNote;
	}
	public void setParaNote(String paraNote) {
		this.paraNote = paraNote;
	}
	@Override
	public String toString() {
		return "THPPara [paraId=" + paraId + ", paraCode=" + paraCode + ", paraType=" + paraType + ", paraIndex="
				+ paraIndex + ", paraName=" + paraName + ", paraDescription=" + paraDescription + ", paraValue="
				+ paraValue + ", paraIsValid=" + paraIsValid + ", paraNote=" + paraNote + "]";
	}			

}
