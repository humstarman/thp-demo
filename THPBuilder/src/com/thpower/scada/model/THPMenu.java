package com.thpower.scada.model;
/**
* @author admin
* @version 创建时间：2017年11月15日 下午4:14:25
* 类说明
*/
public class THPMenu {
	
	private long menuId;
	private long menuParentId;
	private long menuProId;
	private String menuName;
	private String menuType;
	private Integer menuIndex;
	private String menuIsFolder;
	private String menuIsVisable;
	private String menuIsEnable;
	private String menuIsDelete;
	private String menuPath;
	private String menuContent;
	private String menuNote;
	private String menuCreateTime;
	private String menuModifyTime;	

	public long getMenuId() {
		return menuId;
	}
	public void setMenuId(long menuId) {
		this.menuId = menuId;
	}
	public long getMenuParentId() {
		return menuParentId;
	}
	public void setMenuParentId(long menuParentId) {
		this.menuParentId = menuParentId;
	}
	public long getMenuProId() {
		return menuProId;
	}
	public void setMenuProId(long menuProId) {
		this.menuProId = menuProId;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public String getMenuType() {
		return menuType;
	}
	public void setMenuType(String menuType) {
		this.menuType = menuType;
	}
	public Integer getMenuIndex() {
		return menuIndex;
	}
	public void setMenuIndex(Integer menuIndex) {
		this.menuIndex = menuIndex;
	}
	public String getMenuIsFolder() {
		return menuIsFolder;
	}
	public void setMenuIsFolder(String menuIsFolder) {
		this.menuIsFolder = menuIsFolder;
	}
	public String getMenuIsVisable() {
		return menuIsVisable;
	}
	public void setMenuIsVisable(String menuIsVisable) {
		this.menuIsVisable = menuIsVisable;
	}
	public String getMenuIsEnable() {
		return menuIsEnable;
	}
	public String getMenuIsDelete() {
		return menuIsDelete;
	}
	public void setMenuIsDelete(String menuIsDelete) {
		this.menuIsDelete = menuIsDelete;
	}
	public void setMenuIsEnable(String menuIsEnable) {
		this.menuIsEnable = menuIsEnable;
	}
	public String getMenuPath() {
		return menuPath;
	}
	public void setMenuPath(String menuPath) {
		this.menuPath = menuPath;
	}
	public String getMenuContent() {
		return menuContent;
	}
	public void setMenuContent(String menuContent) {
		this.menuContent = menuContent;
	}
	public String getMenuNote() {
		return menuNote;
	}
	public void setMenuNote(String menuNote) {
		this.menuNote = menuNote;
	}
	public String getMenuCreateTime() {
		return menuCreateTime;
	}
	public void setMenuCreateTime(String menuCreateTime) {
		this.menuCreateTime = menuCreateTime;
	}
	public String getMenuModifyTime() {
		return menuModifyTime;
	}
	public void setMenuModifyTime(String menuModifyTime) {
		this.menuModifyTime = menuModifyTime;
	}
	
	@Override
	public String toString() {
		return "THPMenu [menuId=" + menuId + ", menuParentId=" + menuParentId + ", menuProId=" + menuProId
				+ ", menuName=" + menuName + ", menuType=" + menuType + ", menuIndex=" + menuIndex + ", menuIsFolder=" + menuIsFolder + ", menuIsVisable=" + menuIsVisable + ", menuIsEnable=" + menuIsEnable + ", menuIsDelete=" + menuIsDelete
				+ ", menuPath=" + menuPath + ", menuContent=" + menuContent + ", menuNote=" + menuNote + ", menuCreateTime=" + menuCreateTime + ", menuModifyTime=" + menuModifyTime + "]";
	}
	
}
