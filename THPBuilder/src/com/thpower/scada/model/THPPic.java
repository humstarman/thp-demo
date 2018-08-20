package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2017年11月15日 下午4:14:25
* 类说明
* 保存
* 许继文件格式
*/
public class THPPic {
	
	private long picId;
	private String picName;
	private String picUrl;
	private String picContent;

	public long getpicId() {
		return picId;
	}
	public void setpicId(long picId) {
		this.picId = picId;
	}
	public String getpicName() {
		return picName;
	}
	public void setpicName(String picName) {
		this.picName = picName;
	}	
	public String getpicUrl() {
		return picUrl;
	}
	public void setpicUrl(String picUrl) {
		this.picUrl = picUrl;
	}
	public String getpicContent() {
		return picContent;
	}
	public void setpicContent(String picContent) {
		this.picContent = picContent;
	}
	
	@Override
	public String toString() {
		return "THPPic [picId=" + picId + ", picName=" + picName + ", picUrl=" + picUrl + ", picContent=" + picContent
				+ "]";
	}
	
	
}
