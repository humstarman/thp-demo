package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2017年12月7日 上午11:34:25
* 类说明
*/
public class THPProject {
	
	private long proId;
	private long proUserId;
	private String proName;
	private String proDescription;
	private String proType;
	private String proShared;
	private String proPath;
	private String proNote;
	private String proCreateTime;
	private String proModifyTime;
	public long getProId() {
		return proId;
	}
	public void setProId(long proId) {
		this.proId = proId;
	}
	public long getProUserId() {
		return proUserId;
	}
	public void setProUserId(long proUserId) {
		this.proUserId = proUserId;
	}
	public String getProName() {
		return proName;
	}
	public void setProName(String proName) {
		this.proName = proName;
	}
	public String getProDescription() {
		return proDescription;
	}
	public void setProDescription(String proDescription) {
		this.proDescription = proDescription;
	}
	public String getProType() {
		return proType;
	}
	public void setProType(String proType) {
		this.proType = proType;
	}
	public String getProShared() {
		return proShared;
	}
	public void setProShared(String proShared) {
		this.proShared = proShared;
	}
	public String getProPath() {
		return proPath;
	}
	public void setProPath(String proPath) {
		this.proPath = proPath;
	}
	public String getProNote() {
		return proNote;
	}
	public void setProNote(String proNote) {
		this.proNote = proNote;
	}
	public String getProCreateTime() {
		return proCreateTime;
	}
	public void setProCreateTime(String proCreateTime) {
		this.proCreateTime = proCreateTime;
	}
	public String getProModifyTime() {
		return proModifyTime;
	}
	public void setProModifyTime(String proModifyTime) {
		this.proModifyTime = proModifyTime;
	}
	
	@Override
	public String toString() {
		return "THPProjectMapper [proId=" + proId + ", proUserId=" + proUserId + ", proName=" + proName
				+ ", proDescription=" + proDescription + ", proType=" + proType + ", proShared=" + proShared + ", proPath=" + proPath
				+ ", proNote=" + proNote + ", proCreateTime=" + proCreateTime + ", proModifyTime=" + proModifyTime
				+ "]";
	}
	
	

}
