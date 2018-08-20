package com.thpower.scada.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thpower.scada.util.COMUtil;


/*
 *  SpringMVC Step 4 
    class
 *
*/
@Controller
public class HelloWorld {
	
	private static final String SUCCESS = "success";
		
	@RequestMapping("/helloworld")
	public String helloworld()
	{
		System.out.println("Hello World!");
		
		return "helloworld";
	}		
	
	@RequestMapping("/hellotoolbar")
	public String hellotoolbar()
	{
		System.out.println("hellotoolbar");
		
		return "hellotoolbar";
	}
		
	@RequestMapping("/saveok")
	public String saveok()
	{		
		return SUCCESS;
	}	
	
	@RequestMapping("/getGUID")
	public void getGUID(HttpServletRequest request, HttpServletResponse response, 
			Model model	) throws IOException
	{
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");	
		//System.out.println("guidvalue");
		
        Map map = new HashMap();
        
        map.put("guidvalue", COMUtil.randomLongUUID());
        		
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
