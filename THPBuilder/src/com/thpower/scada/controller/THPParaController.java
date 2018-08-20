package com.thpower.scada.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
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
import com.thpower.scada.mapper.THPParaMapper;
import com.thpower.scada.model.THPPara;
import com.thpower.scada.util.COMUtil;

/**
* @author admin
* @version 创建时间：2018年5月3日 下午6:34:43
* 类说明
*/
@Controller
public class THPParaController {
	
	@Autowired
	THPParaMapper _paraMapper;	
	

	/**
	 * 返回参数的类别List
	 * @author admin
	 * Last_update 2018年5月4日下午3:11:15
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */
	@RequestMapping("/getTypes")
	public void getTypes(HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{        
        //System.out.println(paratype);        
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");	

		List<String> types = _paraMapper.getTypes();	
		
		try
		{		       
	        for(String paratype : types)
	        {
	        	if(!types.contains(paratype))
	        	{
	        		types.add(paratype);  	
	        	}
	        }      
			
		}catch(Exception e){
			
			e.printStackTrace();
		}		
		
		types.add("ALL");  			
		
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(types);
        
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
	@RequestMapping("/getParas")
	public void getParas(@RequestParam(value="paratype") String paratype,
	HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");	

		Map<String, Object> map=new HashMap<String, Object>();
		
		try
		{
			//datatable
			List<THPPara> paras = new ArrayList<THPPara>();
			
			if ( "ALL".equals(paratype))
			{
				paras = _paraMapper.getParas();	
			}else
			{
				paras = _paraMapper.getParasByType(paratype);
			}			
			
			//System.out.println(paras); 
			
			//total
			map.put("total", paras.size());
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
		       
	        for(THPPara para : paras)
	        {
	        	Map<String,Object> mapff = new HashMap<String,Object>();
	        
	        	mapff.put("paraId", para.getParaId());        
	        	mapff.put("paraCode", para.getParaCode());        
	        	mapff.put("paraName", para.getParaName());        
		        mapff.put("paraType", para.getParaType());
		        mapff.put("paraIndex", para.getParaIndex());
		        mapff.put("paraDescription", para.getParaDescription());
		        mapff.put("paraValue", para.getParaValue());
		        mapff.put("paraIsValid", para.getParaIsValid());
		        mapff.put("paraNote", para.getParaNote());

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
	@RequestMapping("/getParaValue")
	public void getParaValue(@RequestParam(value="paracode") String paracode,
	HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{			
		//System.out.println(paracode);
	
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");	

		Map<String, Object> map=new HashMap<String, Object>();
		
		try
		{
			String paravalue = _paraMapper.getParaValue(paracode);

			map.put("paracode", paracode );
			map.put("paravalue", paravalue );			     
			
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
	
	
	@RequestMapping("/insertPara")
	public void insertPara(THPPara para, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
        
		Map<String, Object> map=new HashMap<String, Object>();		
		
		try
		{
			//System.out.println(para);
			
			int nrow = _paraMapper.insert(para);

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
	
	
	@RequestMapping("/updatePara")
	public void updatePara(THPPara para, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	
        
		Map<String, Object> map=new HashMap<String, Object>();	
		
		try
		{		
			//System.out.println(para);
			
			int nrow = _paraMapper.update(para);

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
	
	
	@RequestMapping("/deletePara")
	public void deletePara(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		
		
		String paraId = request.getParameter("paraId");   
		
		Map<String, Object> map=new HashMap<String, Object>();	
		
		try
		{
			//System.out.println(para);
			
			int nrow = _paraMapper.delete(Long.parseLong(paraId));
			
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
