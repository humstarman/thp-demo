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
import com.thpower.scada.mapper.THPMetaMapper;
import com.thpower.scada.model.THPMeta;

/**
* @author admin
* @version 创建时间：2018年7月30日 下午2:49:21
* 类说明
*/
@Controller
public class THPMetaController {
	
	@Autowired
	THPMetaMapper _metaMapper;
	
	/**
	 * 返回所有参数
	 * @author admin
	 * Last_update 2018年5月4日下午3:11:49
	 * @param paratype
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */
	@RequestMapping("/getMetas")
	public void getMetas(HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");	

		Map<String, Object> map=new HashMap<String, Object>();
		
		try
		{
			//datatable
			List<THPMeta> metas = new ArrayList<THPMeta>();
			
			metas = _metaMapper.getMetas();				
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
		       
	        for(THPMeta meta : metas)
	        {
	        	Map<String,Object> mapff = new HashMap<String,Object>();
	        
	        	mapff.put("metaId", meta.getMetaId());            
	        	mapff.put("metaName", meta.getMetaName());        
		        mapff.put("metaContent", meta.getMetaContent());
		        mapff.put("metaLabel", meta.getMetaLabel());

		        listp.add(mapff);
	        }
	        
	        map.put("rows", listp);	        
			
		}catch(Exception e){
			
			e.printStackTrace();
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
	
	/**
	 * 返回所有参数
	 * @author admin
	 * Last_update 2018年5月4日下午3:11:49
	 * @param paratype
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */
	@RequestMapping("/getMetasByLabel")
	public void getMetasByLabel(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	

        String metaLabel = request.getParameter("metaLabel").toString();
        
		Map<String, Object> map=new HashMap<String, Object>();
		
		try
		{
			//datatable
			List<THPMeta> metas = new ArrayList<THPMeta>();
			
			metas = _metaMapper.getMetasByLabel(metaLabel);				
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
			
			for(THPMeta meta : metas)
			{
				Map<String,Object> mapff = new HashMap<String,Object>();
				
				mapff.put("metaId", meta.getMetaId());            
				mapff.put("metaName", meta.getMetaName());        
				mapff.put("metaContent", meta.getMetaContent());
				mapff.put("metaLabel", meta.getMetaLabel());
				
				listp.add(mapff);  	
			}
			
			map.put("rows", listp);	        
			
		}catch(Exception e){
			
			e.printStackTrace();
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
	
	@RequestMapping("/updateMetaLabel")
	public void updateMetaLabel(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	
        
		Map<String, Object> map=new HashMap<String, Object>();			

        String metaId = request.getParameter("metaId").toString();
        //String metaName = request.getParameter("metaName").toString();
        //String metaContent = request.getParameter("metaContent").toString();
        String metaLabel = request.getParameter("metaLabel").toString();
        
		try
		{		
			//System.out.println(para);
			
			THPMeta meta = _metaMapper.select(Long.parseLong(metaId));
			
			meta.setMetaLabel(metaLabel);

			//System.out.println(meta);			
			int nrow = _metaMapper.update(meta);

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
	
	@RequestMapping("/updateMetaContent")
	public void updateMetaContent(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	
        
		Map<String, Object> map=new HashMap<String, Object>();			

        String metaId = request.getParameter("metaId").toString();
        //String metaName = request.getParameter("metaName").toString();
        String metaContent = request.getParameter("metaContent").toString();
        //String metaLabel = request.getParameter("metaLabel").toString();
        
		try
		{		
			//System.out.println(para);
			
			THPMeta meta = _metaMapper.select(Long.parseLong(metaId));
			
			meta.setMetaContent(metaContent);

			//System.out.println(meta);			
			int nrow = _metaMapper.update(meta);

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
		
	@RequestMapping("/insertMeta")
	public void insertMeta(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
	
        String metaName = request.getParameter("metaName").toString();
        String metaContent = request.getParameter("metaContent").toString();
        String metaLabel = request.getParameter("metaLabel").toString();
        
        
		Map<String, Object> map=new HashMap<String, Object>();		
		
		try
		{			
			THPMeta meta = new THPMeta();
			meta.setMetaName(metaName);
			meta.setMetaContent(metaContent);
			meta.setMetaLabel(metaLabel);

			//System.out.println(meta);
			
			int nrow = _metaMapper.insert(meta);

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
	
	
	@RequestMapping("/updateMeta")
	public void updateMeta(THPMeta meta, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	
        
		Map<String, Object> map=new HashMap<String, Object>();	
		
		try
		{		
			//System.out.println(para);
			
			int nrow = _metaMapper.update(meta);

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
	
	
	@RequestMapping("/deleteMeta")
	public void deleteMeta(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		
		
		String metaId = request.getParameter("metaId");   
		
		Map<String, Object> map=new HashMap<String, Object>();	
		
		try
		{
			//System.out.println(para);
			
			int nrow = _metaMapper.delete(Long.parseLong(metaId));
			
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
	

}
