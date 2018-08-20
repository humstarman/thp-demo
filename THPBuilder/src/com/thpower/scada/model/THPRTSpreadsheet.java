package com.thpower.scada.model;

/**
* @author admin
* @version 创建时间：2018年8月13日 下午10:57:19
* 类说明
*/
public class THPRTSpreadsheet {

	private long sheetId;
	private long proId;
	private String sheetKey;
	private String sheetType;
	private String sheetName;
	private String sheetStats;
	private String sheetStartTime;
	private String sheetEndTime;
	private String sheetContent;
	private String sheetCreateTime;
	public long getSheetId() {
		return sheetId;
	}
	public void setSheetId(long sheetId) {
		this.sheetId = sheetId;
	}
	public long getProId() {
		return proId;
	}
	public void setProId(long proId) {
		this.proId = proId;
	}
	public String getSheetKey() {
		return sheetKey;
	}
	public void setSheetKey(String sheetKey) {
		this.sheetKey = sheetKey;
	}
	public String getSheetType() {
		return sheetType;
	}
	public void setSheetType(String sheetType) {
		this.sheetType = sheetType;
	}
	public String getSheetName() {
		return sheetName;
	}
	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}
	public String getSheetStats() {
		return sheetStats;
	}
	public void setSheetStats(String sheetStats) {
		this.sheetStats = sheetStats;
	}
	public String getSheetStartTime() {
		return sheetStartTime;
	}
	public void setSheetStartTime(String sheetStartTime) {
		this.sheetStartTime = sheetStartTime;
	}
	public String getSheetEndTime() {
		return sheetEndTime;
	}
	public void setSheetEndTime(String sheetEndTime) {
		this.sheetEndTime = sheetEndTime;
	}
	public String getSheetContent() {
		return sheetContent;
	}
	public void setSheetContent(String sheetContent) {
		this.sheetContent = sheetContent;
	}
	public String getSheetCreateTime() {
		return sheetCreateTime;
	}
	public void setSheetCreateTime(String sheetCreateTime) {
		this.sheetCreateTime = sheetCreateTime;
	}
	@Override
	public String toString() {
		return "THPRTSpreadsheet [sheetId=" + sheetId + ", proId=" + proId + ", sheetKey=" + sheetKey + ", sheetType="
				+ sheetType + ", sheetName=" + sheetName + ", sheetStats=" + sheetStats + ", sheetStartTime="
				+ sheetStartTime + ", sheetEndTime=" + sheetEndTime + ", sheetContent=" + sheetContent
				+ ", sheetCreateTime=" + sheetCreateTime + "]";
	}
	
	
	
}
