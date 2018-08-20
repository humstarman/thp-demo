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
import com.thpower.scada.mapper.THPRTSpreadsheetMapper;
import com.thpower.scada.model.THPRTSpreadsheet;
import com.thpower.scada.model.THPRTTemplate;
import com.thpower.scada.util.MapUtil;

/**
* @author admin
* @version 创建时间：2018年8月14日 上午9:11:47
* 类说明
*/
@Controller
public class THPRTSpreadsheetController {	

	@Autowired
	private THPRTSpreadsheetMapper _sheetMapper;
	
	@RequestMapping("/getAllSheets")
	public void getAllSheets(HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		

        Map<String,Object> map = new HashMap<String,Object>();
        
        try
		{
        	List<THPRTSpreadsheet> sheets = _sheetMapper.getAllSheets();	 
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
			
			for(THPRTSpreadsheet sheet : sheets)
			{
				Map<String,Object> mapff = MapUtil.objectToMap(sheet);	
				
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
	
	@RequestMapping("/getSheetsByProId")
	public void getSheetsByProId(@RequestParam("proid") long proid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");		

        Map<String,Object> map = new HashMap<String,Object>();        

        try
		{
        	List<THPRTSpreadsheet> sheets = _sheetMapper.getSheetsByProId(proid);	 
			
			//rows
			List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  
			
			for(THPRTSpreadsheet sheet : sheets)
			{
				Map<String,Object> mapff = MapUtil.objectToMap(sheet);	
				
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
	
	
	@RequestMapping("/getSheet")
	public void getSheet(@RequestParam("sheetid") long sheetid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		

        Map<String,Object> map = new HashMap<String,Object>();
        
        THPRTSpreadsheet sheet = _sheetMapper.select(sheetid);
        
        map.put("sheet", sheet);

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
		
	@RequestMapping("/insertSheet")
	public void insertSheet(THPRTSpreadsheet sheet, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");        
        
		Map<String, Object> map=new HashMap<String, Object>();		
		
		try
		{
			//System.out.println(sheet);
			
			int nrow = _sheetMapper.insert(sheet);

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
	
	@RequestMapping("/updateSheet")
	public void updateSheet(THPRTSpreadsheet sheet, HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{	
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");	
        
		Map<String, Object> map=new HashMap<String, Object>();	
		
		try
		{		
			//System.out.println(para);
			
			int nrow = _sheetMapper.update(sheet);

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
		
	@RequestMapping("/deleteSheet")
	public void deleteSheet(@RequestParam("sheetid") long sheetid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		
		
		Map<String,Object> map = new HashMap<String,Object>();		
		
		try
		{			
			_sheetMapper.delete(sheetid); 
			
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
