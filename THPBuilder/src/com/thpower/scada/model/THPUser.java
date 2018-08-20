package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2017年11月14日 下午3:33:51
* 类说明
*/
public class THPUser {
	
	private long userId;
	private long userRootId;
	private String userEmail;	
	private String userName;
	private String userPassword;	
	private int userAge;
	private int userSex;
	private String userNote;
	public long getUserId() {
		return userId;
	}
	public void setUserId(long userId) {
		this.userId = userId;
	}
	public long getUserRootId() {
		return userRootId;
	}
	public void setUserRootId(long userRootId) {
		this.userRootId = userRootId;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserPassword() {
		return userPassword;
	}
	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}
	public int getUserAge() {
		return userAge;
	}
	public void setUserAge(int userAge) {
		this.userAge = userAge;
	}
	public int getUserSex() {
		return userSex;
	}
	public void setUserSex(int userSex) {
		this.userSex = userSex;
	}
	public String getUserNote() {
		return userNote;
	}
	public void setUserNote(String userNote) {
		this.userNote = userNote;
	}
	
	
	@Override
	public String toString() {
		return "THPUser [userId=" + userId + ", userRootId=" + userRootId + ", userEmail=" + userEmail + ", userName="
				+ userName + ", userPassword=" + userPassword + ", userAge=" + userAge + ", userSex=" + userSex
				+ ", userNote=" + userNote + "]";
	}
	
	

}
