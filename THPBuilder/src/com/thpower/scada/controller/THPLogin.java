package com.thpower.scada.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thpower.scada.mapper.THPProjectMapper;
import com.thpower.scada.mapper.THPUserMapper;
import com.thpower.scada.model.THPProject;
import com.thpower.scada.model.THPUser;
import com.thpower.scada.util.MemoryDataUtil;

/**
* @author admin
* @version 创建时间：2017年12月5日 上午10:42:59
* 类说明
*/
@Controller
public class THPLogin {

	@Autowired
	private THPProjectMapper _proMapper;
	
	@Autowired
	private THPUserMapper _userMapper;
	
	//@RequestParam("userid") long userid,
	@RequestMapping("/get_recent")
	public void get_recent(@CookieValue(name="userid", defaultValue="0") Integer userid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
        List<THPProject> projectlist = _proMapper.getProjectsByUserId(userid);
                
        Map<String,Object> map = new HashMap<String,Object>();
       
        List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
        
        for(THPProject project : projectlist)
        {
	        Map<String,Object> mapdata1 = new HashMap<String,Object>();
	        mapdata1.put("id", project.getProId());
	        mapdata1.put("name", project.getProName());
	        mapdata1.put("type", project.getProType());
	        dataList.add(mapdata1);
        } 
        
        map.put("data", dataList);

        map.put("total", dataList.size());
		
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);
       
		//System.out.println(jsonlist);
		
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
         
        out.write(jsonlist);
        out.flush();
        out.close();         
	}
	

	@RequestMapping("/to_login")
	public void to_login(HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
        String userEmail =request.getParameter("email");
        String userPassword =request.getParameter("password");
        
        String sid = request.getSession().getId();
        
        String sessionid = MemoryDataUtil.getSessionIDMap().get(userEmail);
        
        //System.out.println(sid + "," + sessionid);
        
        //如果用户名存在放心（即登录放行） 
        if(sid.equals(sessionid)){
        	//return ;        	
        }else{ 
        	//如果请求的sessionID和此账号Map中存放的sessionID不一致，跳转到登陆页
        	//判断如果是异步请求，设置响应头 sessionstatus为timeout，自动跳转，否则重定向
        	if(request.getHeader("x-requested-with")!=null
        			&& request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest"))
        	{ 
        		
        		response.setHeader("sessionstatus","timeout");        		
        		//return false;
        		
        	}else{
        		
        		//String indexurl=request.getContextPath()+"/login.do";        		
        		//response.sendRedirect(indexurl);
        		
        		//return false;
        	}
        }
        
        /*
        Map<String,String> parmMap=new HashMap<String,String>();
        Map<String,String[]> mapp= request.getParameterMap();  
        //参数名称  
        Set<String> key=mapp.keySet();        
        //参数迭代器  
        Iterator<String> iterator = key.iterator();  
        while(iterator.hasNext()){  
            String k=iterator.next();  
             parmMap.put(k, mapp.get(k)[0]);  
        }          
        System.out.println("parmMap====="+parmMap.toString()); 
        */ 
        
        List<THPUser> users = _userMapper.login(userEmail, userPassword);
        
        Map<String,Object> map = new HashMap<String,Object>();
        
        if(users.size() == 0)
        {        
        	map.put("username", "");
	        map.put("email", "");
	        map.put("id", 0);
	        map.put("is_login", false);
	        map.put("head_portrait", "static/icons/person-avatar.png");
	        map.put("secure_digest", "33fe11a0100d39ca8926708344f14882f157d63c");
	        map.put("signuptime", 0);      
	        map.put("success", 0);      
	        map.put("url", "index.html");
        }else
        {
        	THPUser user = users.get(0);
	        map.put("username", user.getUserName());
	        map.put("email", user.getUserEmail());
	        map.put("id", user.getUserId());
	        map.put("is_login", true);
	        map.put("head_portrait", "static/icons/person-avatar.png");
	        map.put("secure_digest", "33fe11a0100d39ca8926708344f14882f157d63c");
	        map.put("signuptime", 1505265550); 
	        map.put("success", 1);    
	        map.put("url", "main.html"); 
	        
	        Integer userid = (int) user.getUserId();
	        
            Cookie id = new Cookie("userid", userid.toString());
           
            //id.setHttpOnly(true);
            id.setMaxAge(60*60*24);
            id.setPath("/");
            
            response.addCookie(id);
            
            Integer loginstatus = 1;
            Cookie status = new Cookie("loginstatus", loginstatus.toString());

            //status.setHttpOnly(true);
            //cookie: 24 hours
            status.setMaxAge(60*60*24);
            status.setPath("/");
            
            response.addCookie(status);
            
            String sessionID = request.getRequestedSessionId();
            //////String userEmail = user.getUserEmail();
            
            if (!MemoryDataUtil.getSessionIDMap().containsKey(userEmail)) 
            { 
            	//不存在，首次登陆，放入Map
            	MemoryDataUtil.getSessionIDMap().put(userEmail, sessionID);
            	
            }else if(MemoryDataUtil.getSessionIDMap().containsKey(user) 
            		&& !StringUtils.equals(sessionID, MemoryDataUtil.getSessionIDMap().get(userEmail)))
            {
            	MemoryDataUtil.getSessionIDMap().remove(userEmail);
            	MemoryDataUtil.getSessionIDMap().put(userEmail, sessionID);
            }
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
	
	@RequestMapping("/to_editor")
	public String to_editor(@CookieValue(name="userid", defaultValue="0") Integer userid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
//        Map<String,Object> map = new HashMap<String,Object>();
//       
//        map.put("type", "grid");
//        map.put("id", "1");
//		
//        ObjectMapper mapper = new ObjectMapper();
//        String jsonlist = mapper.writeValueAsString(map);
//       
//		//System.out.println(jsonlist);
//        
//        
//		
//        //向前台的页面输出结果
//        PrintWriter out = response.getWriter();
//         
//        out.write(jsonlist);
//        out.flush();
//        out.close();        
        
       return "redirect: editor.html";
        
	}
	
	@RequestMapping("/to_main")
	public String to_main(@CookieValue(name="userid", defaultValue="0") Integer userid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
//        Map<String,Object> map = new HashMap<String,Object>();
//        map.put("username", "thpower");
//        map.put("email", "wuguanhui@thpower.com");
//        map.put("id", 118);
//        map.put("is_login", true);
//        map.put("head_portrait", "main/images/person-avatar.png");
//        map.put("secure_digest", "33fe11a0100d39ca8926708344f14882f157d63c");
//        map.put("signuptime", 1505265550); 
//		
//        ObjectMapper mapper = new ObjectMapper();
//        String jsonlist = mapper.writeValueAsString(map);
//       
//		//System.out.println(jsonlist);
//		
//        //向前台的页面输出结果
//        PrintWriter out = response.getWriter();
//         
//        out.write(jsonlist);
//        out.flush();
//        out.close();
        
        return "redirect: main.html";
	}
	
	
	@RequestMapping("/to_logout")
	public String to_logout(@CookieValue(name="userid", defaultValue="0") Integer userid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
//        Map<String,Object> map = new HashMap<String,Object>();
//        map.put("username", "thpower");
//        map.put("email", "wuguanhui@thpower.com");
//        map.put("id", 118);
//        map.put("is_login", true);
//        map.put("head_portrait", "static/icons/person-avatar.png");
//        map.put("secure_digest", "33fe11a0100d39ca8926708344f14882f157d63c");
//        map.put("signuptime", 1505265550); 
//		
//        ObjectMapper mapper = new ObjectMapper();
//        String jsonlist = mapper.writeValueAsString(map);
//       
//		//System.out.println(jsonlist);
//		
//        //向前台的页面输出结果
//        PrintWriter out = response.getWriter();
//         
//        out.write(jsonlist);
//        out.flush();
//        out.close();           
       
        Cookie[] cookies = request.getCookies(); 
        
        for(Cookie cookie : cookies)
        {
        	if(cookie.getName().contains("userid") || cookie.getName().contains("loginstatus"))
        	{
        		cookie.setValue(null);
        		cookie.setMaxAge(0);
        		cookie.setPath("/"); 
        		
                response.addCookie(cookie);        		
        	}        	
        }      

        return "redirect: index.html";
        
        
	}	
	
	@RequestMapping("/login_status")
	public void login_status(@CookieValue(name="loginstatus", defaultValue="0") Integer loginstatus,
			@CookieValue(name="userid", defaultValue="0") Integer userid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
        //System.out.println(loginstatus + ", " + userid);
                
        if(userid==null)
        {
        	userid = 0;        
        }
        
        THPUser user = _userMapper.select(userid);        

        Map<String,Object> map = new HashMap<String,Object>();
        
        if (user ==null)
        {
        	map.put("email", "");
            map.put("username", "");
            map.put("id", userid);
            map.put("is_login", false);
            map.put("head_portrait", "");
            map.put("secure_digest", "");
            map.put("signuptime", 0);     
            map.put("href", "index.html");     
            
            
        }else
        {
        	map.put("email", user.getUserEmail());
            map.put("username", user.getUserName());
            map.put("id", user.getUserId());
            map.put("is_login", true);
            map.put("head_portrait", "static/icons/person-avatar.png");
            map.put("secure_digest", "33fe11a0100d39ca8926708344f14882f157d63c");
            map.put("signuptime", 1505265550); 
            map.put("href", "main.html");     
            
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
	
	@RequestMapping("/to_register")
	public String to_register(HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//System.out.println("coming in ... ");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
//        Map<String,Object> map = new HashMap<String,Object>();
//       
//        map.put("type", "grid");
//        map.put("id", "1");
//		
//        ObjectMapper mapper = new ObjectMapper();
//        String jsonlist = mapper.writeValueAsString(map);
//       
//		//System.out.println(jsonlist);
//        
//        
//		
//        //向前台的页面输出结果
//        PrintWriter out = response.getWriter();
//         
//        out.write(jsonlist);
//        out.flush();
//        out.close();        
        
       return "redirect: index.html";
        
	}
	

}
