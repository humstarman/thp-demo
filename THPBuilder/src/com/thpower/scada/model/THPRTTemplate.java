package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2018年8月13日 下午10:57:02
* 类说明
*/
public class THPRTTemplate {

	private long templateId;
	private long proId;
	private String templateKey;
	private String templateType;
	private String templateName;
	private String templateStats;
	private String templateStartTime;
	private String templateEndTime;
	private String templateContent;
	private String templateCreateTime;
	
	public long getTemplateId() {
		return templateId;
	}
	public void setTemplateId(long templateId) {
		this.templateId = templateId;
	}
	public long getProId() {
		return proId;
	}
	public void setProId(long proId) {
		this.proId = proId;
	}
	public String getTemplateKey() {
		return templateKey;
	}
	public void setTemplateKey(String templateKey) {
		this.templateKey = templateKey;
	}
	public String getTemplateType() {
		return templateType;
	}
	public void setTemplateType(String templateType) {
		this.templateType = templateType;
	}
	public String getTemplateName() {
		return templateName;
	}
	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}
	public String getTemplateStats() {
		return templateStats;
	}
	public void setTemplateStats(String templateStats) {
		this.templateStats = templateStats;
	}
	public String getTemplateStartTime() {
		return templateStartTime;
	}
	public void setTemplateStartTime(String templateStartTime) {
		this.templateStartTime = templateStartTime;
	}
	public String getTemplateEndTime() {
		return templateEndTime;
	}
	public void setTemplateEndTime(String templateEndTime) {
		this.templateEndTime = templateEndTime;
	}
	public String getTemplateContent() {
		return templateContent;
	}
	public void setTemplateContent(String templateContent) {
		this.templateContent = templateContent;
	}
	public String getTemplateCreateTime() {
		return templateCreateTime;
	}
	public void setTemplateCreateTime(String templateCreateTime) {
		this.templateCreateTime = templateCreateTime;
	}
	@Override
	public String toString() {
		return "THPRTTemplate [templateId=" + templateId + ", proId=" + proId + ", templateKey=" + templateKey
				+ ", templateType=" + templateType + ", templateName=" + templateName + ", templateStats="
				+ templateStats + ", templateStartTime=" + templateStartTime + ", templateEndTime=" + templateEndTime
				+ ", templateContent=" + templateContent + ", templateCreateTime=" + templateCreateTime + "]";
	}
	
	
	
	
	
	

}
