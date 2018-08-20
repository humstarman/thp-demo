package com.thpower.scada.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thpower.scada.mapper.THPFileMapper;
import com.thpower.scada.mapper.THPMenuMapper;
import com.thpower.scada.mapper.THPProjectMapper;
import com.thpower.scada.model.THPFile;
import com.thpower.scada.model.THPMenu;
import com.thpower.scada.model.THPProject;
import com.thpower.scada.util.COMUtil;

/**
* @author admin
* @version 创建时间：2017年12月7日 上午11:53:29
* 类说明
*/

@Controller
public class THPProjectController {
	
	@Autowired
	private THPProjectMapper _proMapper;
	
	@Autowired
	private THPMenuMapper _menuMapper;
	
	@Autowired
	private THPFileMapper _fileMapper;
	
	
	@RequestMapping("/createProject")
	public void createProject(HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");     

        String userId = "";
//        String userStatus = "";
        
        //form表单 提交 和  ajax 异步提交的解析方式不一样
        
//        String proName = new String(request.getParameter("proname").getBytes("iso-8859-1"), "utf-8");
//        String proDescription = new String(request.getParameter("prodescription").getBytes("iso-8859-1"), "utf-8");
//        String proType = new String(request.getParameter("protype").getBytes("iso-8859-1"), "utf-8");
        String proName = request.getParameter("proname").toString();
        String proDescription = request.getParameter("prodescription").toString();
        String proType = request.getParameter("protype").toString();
        
        
        Map<String,Object> map = new HashMap<String,Object>();
        
		Cookie[] cookies = request.getCookies(); 		
		
        for(Cookie cookie : cookies)
        {    		
        	if(cookie.getName().contains("userid"))
        	{
        		userId = cookie.getValue();     		
        	}      

//        	if(cookie.getName().contains("loginstatus"))
//        	{
//        		userStatus = cookie.getValue();     		
//        	}  
        }     

		
        if(userId=="")
        { 
	        map.put("success", 0);   
	        map.put("url", "main.html");       	
        }else
        {
        	THPProject project = new THPProject();
        	
        	project.setProUserId(Integer.parseInt(userId));
        	project.setProName(proName);
        	project.setProDescription(proDescription);
        	project.setProType(proType);
        	project.setProShared("0");
        	project.setProPath("");
        	project.setProNote("");
        	project.setProCreateTime(COMUtil.getStringDate());
        	project.setProModifyTime(COMUtil.getStringDate());
        	
        	_proMapper.insert(project);        	

        	//System.out.println(project.toString());
        	THPMenu menu = new THPMenu();
        	
        	menu.setMenuParentId(0);
        	menu.setMenuProId(project.getProId());
        	menu.setMenuName("新页面");
        	menu.setMenuType(project.getProType());
        	menu.setMenuIndex(1);
        	menu.setMenuIsFolder("0");
        	menu.setMenuIsVisable("1");
        	menu.setMenuIsEnable("1");
        	menu.setMenuIsDelete("0");
        	menu.setMenuPath("新页面.xml");
        	String menuContent = "<mxfile><mxGraphModel><root><mxCell id=\"0\"/><mxCell id=\"1\" parent=\"0\"/></root></mxGraphModel></mxfile>";
        	menu.setMenuContent(menuContent);
        	menu.setMenuNote("");
        	menu.setMenuCreateTime(COMUtil.getStringDate());
        	menu.setMenuModifyTime(COMUtil.getStringDate());
        	
        	_menuMapper.insert(menu);
        	
        	//默认页
        	
        	String newurl = "/THPBuilder/editor.html?proid="+project.getProId();
        	//String newurl ="main.html";
        	
	        map.put("success", 1);  
	        map.put("url", newurl); 
        }        
		
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
       
		//System.out.println(jsonlist);
		
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
         
        out.write(jsonlist);
        out.flush();
        out.close();         
	}
	
	/**
	 * projcet simple information
	 * @author admin
	 * Last_update 2017年12月7日上午11:59:47
	 * @param proid
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */
	@RequestMapping("/getProject")
	public void getProject(@RequestParam("proid") long proid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
        THPProject project = _proMapper.select(proid);	
		
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(project);
        
        //StringBuffer result = new StringBuffer(""); 
        
        //result.append(jsonlist); 
        
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();     
	}
	
	/**
	 * project infor and menus of project
	 * @author admin
	 * Last_update 2017年12月7日下午12:00:30
	 * @param id
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */	
	@RequestMapping("/loadProject")
	public void loadProject(@RequestParam(value="proid", required=true, defaultValue="-1") Long proid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
				
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
        THPProject project = _proMapper.getProjectById(proid);
        
        List<THPMenu> menus = _menuMapper.getMenusByProId(proid);
               
        
        Map<String,Object> map = new HashMap<String,Object>();
        //Map<String,Object> node = new HashMap<String,Object>();
        
        map.put("name", project.getProName()); 
        map.put("desc", project.getProDescription());
        map.put("owned", true);
        map.put("shared", true);   
        map.put("simuno", "");      
        map.put("status", 0);       
        map.put("msg", 0);  
        
        //电气元件
        map.put("component", "");  
        map.put("elecount", ""); //{Divider: 18, constant: 35, C: 7, D2T: 5, Add: 22},
        
        //控制元件
        map.put("ctrl", "");
        map.put("ctrlcount", 0);    //{Measure: 21},   
        
        //量测元件
        map.put("msr", "");
        map.put("msr_count", 0);
        map.put("simu_no", "");
        
        //仿真数据
        map.put("simuparam", "");  //{end: "2", step: "0.0001", _isSet: false, start: "0", 'switch': "0.001"},
        map.put("meters", 0); 
        
        //模块      
        map.put("module", 0);  
        map.put("modcount", 0); 
        map.put("dspgrp", 0);    
        
        map.put("modname", 0);  
        
        map.put("system", 0);     
        map.put("systemcount", 0);     
        map.put("systemname", 0);     
        map.put("layersParam", 0);    
        
        map.put("timeline", 0);     //{layersParam: {}}, 
        map.put("simuunique", "");  
        
        //node

        Map<String, Object> mappp = new HashMap<String, Object>();
        
        //String content = XMLHandler.createProjectXML();
        //mappp.put("count", "2");        
        List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
       
        for(THPMenu menu : menus)
        {
        	Map<String,Object> mapff = new HashMap<String,Object>();
        
        	mapff.put("appId", menu.getMenuId());        
	        mapff.put("appName", menu.getMenuName());        
	        mapff.put("appType", menu.getMenuType());
	        mapff.put("appIndex", menu.getMenuIndex());
	        mapff.put("appRoot", menu.getMenuContent());
	        mapff.put("appCurrent", "0");
	        mapff.put("typeFloor", "elefloor");

	        listp.add(mapff);  	
        }
                
        mappp.put("project", listp);
        
        map.put("diagram", mappp);
        
        

        

        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
        
        //StringBuffer result = new StringBuffer(""); 
        
        //result.append(jsonlist); 
        
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();      	     
	}
	
	
	@RequestMapping("/saveProject")
	public void saveProject(HttpServletRequest request, HttpServletResponse response, 
			Model model ) throws IOException{
				
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
        //Map ,request.getParameterMap();
        //key, String
        //value, String []
        Map params = request.getParameterMap();        
        
//        Iterator  entries = params.entrySet().iterator();
//        String name="";
//        String value="";
//        
//        while(entries.hasNext()){
//        	Map.Entry entry = (Map.Entry) entries.next();
//        	name = (String) entry.getKey();        	
//        	Object valueObj = entry.getValue();
//        	if(valueObj instanceof String[]){
//        		String[] values = (String[])valueObj;
//        		for(int i=0;i<values.length;i++){
//        			value = values[i] + ",";
//        		}        	
//        		
//        		value = values.length + " : " +value.substring(0, value.length()-1);
//        		
//        	 }else{
//        	    value = valueObj.toString();
//        	 }
//
//        	System.out.println(name+ " : " + value);        	
//        }          
        
        String proId = "";        
        //String proName ="";        
        //String proDescription = "";
        String proDiagram = "";
        
        Object obj = new Object();
        
        obj = params.get("id");   
        if (obj instanceof String[]) 	proId = ((String[])obj)[0].toString();
        
        //obj =params.get("name");        
        //if (obj instanceof String[]) 	proName = ((String[])obj)[0].toString();
        
        //obj = params.get("desc");
        //if (obj instanceof String[]) 	proDescription = ((String[])obj)[0].toString();
        
        obj = params.get("diagram");
        if (obj instanceof String[]) 	proDiagram = ((String[])obj)[0].toString();
        
//        System.out.println(proId);
//        System.out.println(proName);
//        System.out.println(proDescription);
//        System.out.println(proDiagram);    
        
        String menuId="";
        String menuName="";
        String menuType="";
        String menuIndex="";   
        String menuContent="";
        
        String fileContent="";
        
        //String menuCreateTime = COMUtil.getStringDate();
        String menuModifyTime = COMUtil.getStringDate();
        
        Map<String,Object> map = new HashMap<String,Object>();  
        
        try {
        	
			Document xml = DocumentHelper.parseText(proDiagram);
			
			Element root = xml.getRootElement();
			
//			System.out.println(root.attributes().size() + ": " + root.elements().size());
//			
//			//attributes
//			List attrList = root.attributes();
//			for(int i=0; i<attrList.size(); i++)
//			{			
//				Attribute item = (Attribute)attrList.get(i);
//			    System.out.println(item.getName() + "=" + item.getValue());
//			}
			
			//childs
			List childList = root.elements();
			
			for(int i=0; i<childList.size(); i++)
			{	
				Element item = (Element) childList.get(i);
				
				//System.out.println(item.getPath() + ": " + item.asXML());
				menuContent = item.asXML();
				
				//System.out.println(menuContent);
				
				Element xmlmx = item.element("mxGraphModel");
				
				menuId = xmlmx.attributeValue("appId");
				menuName = xmlmx.attributeValue("appName");
				menuType = xmlmx.attributeValue("appType");
				menuIndex = xmlmx.attributeValue("appIndex");
				
				///////////////////////////////////////////////////////////////////////
				//写入数据库
							
				THPMenu menu = _menuMapper.select(Integer.parseInt(menuId));
				
				if(menu != null)
				{			
					//update old		
					menu.setMenuId(Integer.parseInt(menuId));
					menu.setMenuProId(Integer.parseInt(proId));
					menu.setMenuName(menuName);
					menu.setMenuType(menuType);
					menu.setMenuIndex(Integer.parseInt(menuIndex));
					menu.setMenuContent(menuContent);
					menu.setMenuModifyTime(menuModifyTime);
					
					_menuMapper.update(menu);					        
				}
				/*else
				{
					//insert New	
					menu = new THPMenu();
					
					//menu.setMenuId(Integer.parseInt(menuId));
					menu.setMenuProId(Integer.parseInt(proId));
					menu.setMenuName(menuName);
					menu.setMenuType(menuType);
					menu.setMenuIndex(Integer.parseInt(menuIndex));
					menu.setMenuContent(menuContent);
					menu.setMenuModifyTime(menuModifyTime);
					
					_menuMapper.insert(menu);	
					
				}*/
				
				///////////////////////////////////////////////////////////////////////
				//update  XJ
				
				/*THPFile file = _fileMapper.select(Integer.parseInt(menuId));
				
				fileContent = AnalyzeToXJ(xmlmx);
						
				if(file != null)
				{			
					//update old		
					file.setFileId(Integer.parseInt(menuId));
					file.setFileName(menuName);
					file.setFileContent(fileContent);					
					
					_fileMapper.update(file);	
					
				}
				else
				{
					//insert New	
					file = new THPFile();
						
					file.setFileId(Integer.parseInt(menuId));
					file.setFileName(menuName);
					file.setFileContent(fileContent);
					
					_fileMapper.insert(file);						
				}*/
				
			}
			
			map.put("msg", "保存成功！");  
	        map.put("msgtype", "info");
	        map.put("status", "1");
	        
			
		} catch (DocumentException e) {
			
			// TODO Auto-generated catch block
			e.printStackTrace();
			
			map.put("msg", "保存失败！");  
	        map.put("msgtype", "error");
	        map.put("status", "0");
		}       
        
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
        
        //StringBuffer result = new StringBuffer(""); 
        
        //result.append(jsonlist); 
        
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();      	     
	}
	
	
	/*
	@SuppressWarnings("deprecation")
	private String AnalyzeToXJ(Element xmlmx)
	{
		String fileContent="";		

		Document xjdoc = DocumentHelper.createDocument();		
		xjdoc.addDocType("xml",null, null);		
		Element root= xjdoc.addElement("page");
		root.addAttribute("version", "0.1");
		
		//xmlet : mxGraphModel
		//xj: view
		Element view = root.addElement("dsViewItem", "e8k");	
		//不能通过addAttribute,addNamespce 添加 xmlns
		//view.addAttribute("xmlns", "e8k");
		view.addAttribute("pageName", "");
		//view.addAttribute("rect", "0,0,1920,1080");
		view.addAttribute("rect", "0,0,"+ xmlmx.attributeValue("pageWidth") + ","+ xmlmx.attributeValue("pageHeight"));
		String background = xmlmx.attributeValue("background");
		StringBuilder  sb = new StringBuilder (background);
		sb.insert(1, "ff");
		background = sb.toString();
		view.addAttribute("color", background);
		view.addAttribute("foregroundColor", "#ffffffff");
		view.addAttribute("border", "true");
		view.addAttribute("grid", "0");
		view.addAttribute("timer", "5000");
		
		
		//xmlrt: root
		//Element xmlrt=xmlet.element("root");
		List cellList = xmlmx.element("root").elements();
		
		for(int i=0; i<cellList.size(); i++)
		{
			Element xmlcl = (Element) cellList.get(i);
					
			//遥测
			if(xmlcl.getName().equals("mxCell"))
			{				
				String style = xmlcl.attributeValue("style");
				style = (style==null)? "": style.substring(0, style.indexOf(";"));
				
				if(style.equals("text"))
				{
					Element xmltg = xmlcl.element("mxGeometry");	
					
					Element yaoche = root.addElement("遥测量","常用.xml");
					//yaoche.addAttribute("xmlns", "常用.xml");
					yaoche.addAttribute("layer", "1");
					yaoche.addAttribute("position", "0,0");
					//yaoche.addAttribute("rect", "-1796.69,-1542.06,120.197,38.3021");
					String rect = xmltg.attributeValue("x") + "," +xmltg.attributeValue("y") + "," +xmltg.attributeValue("width") + "," +xmltg.attributeValue("height") ;
					yaoche.addAttribute("rect", rect);
					yaoche.addAttribute("brushColor", "#ffff0000");
					yaoche.addAttribute("penColor", "#ff00ff00");
					yaoche.addAttribute("alignment", "4");
					yaoche.addAttribute("text", "0.00");
					yaoche.addAttribute("font", "Sans Serif,24,-1,5,50,0,0,0,0,0");
					yaoche.addAttribute("recordId", xmlcl.attributeValue("recordId"));
					yaoche.addAttribute("tableName", xmlcl.attributeValue("tableName"));
					
					String valueChange = xmlcl.attributeValue("valueChange");
					valueChange = StringEscapeUtils.unescapeHtml(valueChange);
					yaoche.addAttribute("valueChange", valueChange);					
				}
				
			}
			
			//Text
//			if(xmlcl.getName().equals("mxCell"))
//			{
//				String style = xmlcl.attributeValue("style");
//								
//				style = (style==null)? "": style.substring(0, style.indexOf(";"));
//				
//				if(style.equals("text"))
//				{				
//					Element xmltg = xmlcl.element("mxGeometry");	
//					
//					Element textitem = root.addElement("dsTextItem");
//					textitem.addAttribute("xmlns", "e8k");
//					textitem.addAttribute("layer", "1");
//					textitem.addAttribute("position", "0,0");
//					//textitem.addAttribute("rect", "-1796.69,-1542.06,120.197,38.3021");
//					String rect = xmltg.attributeValue("x") + "," +xmltg.attributeValue("y") + "," +xmltg.attributeValue("width") + "," +xmltg.attributeValue("height") ;
//					textitem.addAttribute("rect", rect);
//					textitem.addAttribute("brushStyle", "1");
//					textitem.addAttribute("brushColor", "#ffff0000");
//					textitem.addAttribute("penColor", "#ff00ff00");
//					textitem.addAttribute("alignment", "4");
//					textitem.addAttribute("text", "0.00");
//					textitem.addAttribute("font", "Sans Serif,24,-1,5,50,0,0,0,0,0");
//					textitem.addAttribute("recordId", xmlcl.attributeValue("recordId"));
//					textitem.addAttribute("tableName", xmlcl.attributeValue("tableName"));
//					
//					String valueChange = xmlcl.attributeValue("valueChange");
//					valueChange = StringEscapeUtils.unescapeHtml(valueChange);
//					textitem.addAttribute("valueChange", valueChange);
//					
//				}
//			}
		}
		
		
		fileContent =xjdoc.asXML();
		//fileContent =formatXml(xjdoc, "UTF-8", false);
		
		//System.out.println(fileContent);
		
		return fileContent;		
	}
	*/
	
	
    /** 
     * 格式化XML文档 
     * 
     * @param document xml文档 
     * @param charset    字符串的编码 
     * @param istrans    是否对属性和元素值进行转义
     * @return 格式化后XML字符串 
     */ 
    public static String formatXml(Document document, String charset, boolean istrans) { 
        OutputFormat format = OutputFormat.createPrettyPrint(); 
        format.setEncoding(charset); 
        StringWriter sw = new StringWriter(); 
        XMLWriter xw = new XMLWriter(sw, format); 
        xw.setEscapeText(istrans); 
        try { 
                xw.write(document); 
                xw.flush(); 
                xw.close(); 
        } catch (IOException e) { 
                System.out.println("格式化XML文档发生异常，请检查！"); 
                e.printStackTrace(); 
        }
        
        return sw.toString(); 
} 
    

}
