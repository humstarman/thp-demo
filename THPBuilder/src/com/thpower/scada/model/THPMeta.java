package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2017年11月15日 下午4:14:25
* 类说明
* 保存
* 许继文件格式
*/
public class THPMeta {
	
	private long metaId;
	private String metaName;
	private String metaContent;
	private String metaLabel;
	
	public long getMetaId() {
		return metaId;
	}
	public void setMetaId(long metaId) {
		this.metaId = metaId;
	}
	public String getMetaName() {
		return metaName;
	}
	public void setMetaName(String metaName) {
		this.metaName = metaName;
	}
	public String getMetaContent() {
		return metaContent;
	}
	public void setMetaContent(String metaContent) {
		this.metaContent = metaContent;
	}
	public String getMetaLabel() {
		return metaLabel;
	}
	public void setMetaLabel(String metaLabel) {
		this.metaLabel = metaLabel;
	}
	
	@Override
	public String toString() {
		return "THPMeta [metaId=" + metaId + ", metaName=" + metaName + ", metaContent=" + metaContent + ", metaLabel="
				+ metaLabel + "]";
	}
	
	
}
