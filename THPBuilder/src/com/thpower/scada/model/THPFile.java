package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2017年11月15日 下午4:14:25
* 类说明
* 保存
* 许继文件格式
*/
public class THPFile {
	
	private long fileId;
	private String fileName;
	private String fileContent;

	public long getFileId() {
		return fileId;
	}
	public void setFileId(long fileId) {
		this.fileId = fileId;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFileContent() {
		return fileContent;
	}
	public void setFileContent(String fileContent) {
		this.fileContent = fileContent;
	}
	
	@Override
	public String toString() {
		return "THPFile [fileId=" + fileId + ", fileName=" + fileName + ", fileContent=" + fileContent + "]";
	}
	
}
