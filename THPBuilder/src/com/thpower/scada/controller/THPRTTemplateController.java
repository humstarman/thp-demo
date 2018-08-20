package com.thpower.scada.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thpower.scada.mapper.THPRTTemplateMapper;

import com.thpower.scada.model.THPRTTemplate;
import com.thpower.scada.util.MapUtil;

/**
* @author admin
* @version 创建时间：2018年8月14日 上午8:53:54
* 类说明
*/
@Controller
public class THPRTTemplateController {

	@Autowired
	private THPRTTemplateMapper _templateMapper;

	@RequestMapping("/getAllTemplates")
	public void getAllTemplates(HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");		

        Map<String,Object> map = new HashMap<String,Object>();        

        try
		{
        	List<THPRTTemplate> templates = _templateMapper.getAllTemplates();	 
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
			
			for(THPRTTemplate template : templates)
			{
				Map<String,Object> mapff = MapUtil.objectToMap(template);					
				
				listp.add(mapff);  	
			}
			
			map.put("rows", listp);	        
			
		}catch(Exception e){
			
			e.printStackTrace();
		}	
        

        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
        
        //StringBuffer result = new StringBuffer(""); 
        
        //result.append(jsonlist); 
        //System.out.println(jsonlist);
        
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();      
	}
	
	@RequestMapping("/getTemplatesByProId")
	public void getTemplatesByProId(@RequestParam("proid") long proid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");		

        Map<String,Object> map = new HashMap<String,Object>();        

        try
		{
        	List<THPRTTemplate> templates = _templateMapper.getTemplatesByProId(proid);	 
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
			
			for(THPRTTemplate template : templates)
			{
				Map<String,Object> mapff = MapUtil.objectToMap(template);					
				
				listp.add(mapff);  	
			}
			
			map.put("rows", listp);	        
			
		}catch(Exception e){
			
			e.printStackTrace();
		}	
        

        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
        
        //StringBuffer result = new StringBuffer(""); 
        
        //result.append(jsonlist); 
        //System.out.println(jsonlist);
        
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();      
	}
	
	
	@RequestMapping("/getTemplate")
	public void getTemplate(@RequestParam("templateid") long templateid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		

        Map<String,Object> map = new HashMap<String,Object>();
        
        THPRTTemplate template = _templateMapper.select(templateid);	

		
        map.put("template", template);

        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
        
        //StringBuffer result = new StringBuffer(""); 
        
        //result.append(jsonlist); 
        //System.out.println(jsonlist);
        
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();      
	}	
		
	@RequestMapping("/insertTemplate")
	public void insertTemplate(THPRTTemplate template, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");        
        
		Map<String, Object> map=new HashMap<String, Object>();		
		
		try
		{
			//System.out.println(template);
			
			int nrow = _templateMapper.insert(template);

			map.put("rows", nrow);
			
		}catch(Exception e){
			
			e.printStackTrace();
			map.put("errorMsg", e.getMessage());
		}	
		
		//map.put("success", "1");  
		
		ObjectMapper mapper = new ObjectMapper();
		String jsonlist = mapper.writeValueAsString(map);
		
		//System.out.println(jsonlist);
		
		//向前台的页面输出结果
		PrintWriter out = response.getWriter();
		
		out.write(jsonlist);
		out.flush();
		out.close(); 		
	}	
	
	@RequestMapping("/updateTemplate")
	public void updateTemplate(THPRTTemplate template, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	
        
		Map<String, Object> map=new HashMap<String, Object>();	
		
		try
		{		
			//System.out.println(para);
			
			int nrow = _templateMapper.update(template);

			map.put("rows", nrow);
			
		}catch(Exception e){
			
			e.printStackTrace();
			map.put("errorMsg", e.getMessage());
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
		
	@RequestMapping("/deleteTemplate")
	public void deleteTemplate(@RequestParam("templateid") long templateid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		
		
		Map<String,Object> map = new HashMap<String,Object>();		
		
		try
		{			
			_templateMapper.delete(templateid); 
			
			//默认页    	
			map.put("success", 1);  
			
		}catch (Exception ee)
		{
			ee.printStackTrace();
		}		
		
		ObjectMapper mapper = new ObjectMapper();
		String jsonlist = mapper.writeValueAsString(map);
		
		//向前台的页面输出结果
		PrintWriter out = response.getWriter();
		
		out.write(jsonlist);
		out.flush();
		out.close();      
		
	}	
	
	
}
