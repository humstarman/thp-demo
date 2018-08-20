package com.thpower.scada.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thpower.scada.mapper.THPMenuMapper;
import com.thpower.scada.mapper.THPProjectMapper;
import com.thpower.scada.model.THPMenu;
import com.thpower.scada.model.THPProject;
import com.thpower.scada.util.COMUtil;
import com.thpower.scada.util.FTPUtil;

/**
* @author admin
* @version 创建时间：2017年11月14日 下午4:33:39
* 类说明
*/

@Controller
public class THPMenuController {
	
	@Autowired
	private THPMenuMapper _menuMapper;
	
	@Autowired 
	private THPProjectMapper _proMapper;
	
	
	@RequestMapping("/createMenu")
	public void createMenu(@RequestParam("proid") long proid, @RequestParam("menuname") String menuname,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		
        Map<String,Object> map = new HashMap<String,Object>();
        
        THPProject project = _proMapper.select(proid);	
        
		THPMenu menu = new THPMenu();
    	
		try
		{		
	    	menu.setMenuParentId(0);
	    	menu.setMenuProId(project.getProId());
	    	menu.setMenuName(menuname);
	    	menu.setMenuType(project.getProType());
	    	menu.setMenuIndex(1);
	    	menu.setMenuIsFolder("0");
	    	menu.setMenuIsVisable("1");
	    	menu.setMenuIsEnable("1");
	    	menu.setMenuIsDelete("0");
	    	menu.setMenuPath(menuname+ ".xml");
	    	String menuContent = "<mxfile><mxGraphModel><root><mxCell id=\"0\"/><mxCell id=\"1\" parent=\"0\"/></root></mxGraphModel></mxfile>";
	    	menu.setMenuContent(menuContent);
	    	menu.setMenuNote("");
	    	menu.setMenuCreateTime(COMUtil.getStringDate());
	    	menu.setMenuModifyTime(COMUtil.getStringDate());
	    	
	    	_menuMapper.insert(menu); 
	    	
	    	//insert返回带id的menu

	        Map<String, Object> mappp = new HashMap<String, Object>();
	    	
	    	List<Map<String,Object>> listp=new ArrayList<Map<String,Object>>();  

        	Map<String,Object> mapff = new HashMap<String,Object>();
        
        	mapff.put("appId", menu.getMenuId());        
	        mapff.put("appName", menu.getMenuName());        
	        mapff.put("appType", menu.getMenuType());
	        mapff.put("appIndex", menu.getMenuIndex());
	        mapff.put("appRoot", menu.getMenuContent());
	        mapff.put("appCurrent", "0");
	        mapff.put("typeFloor", "elefloor");

	        listp.add(mapff); 
	        
	        mappp.put("menu", listp);
	    	
	    	//默认页    	
	        map.put("success", 1);  
	        map.put("diagram", mappp); 	
    	
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
	
	@RequestMapping("/renameMenu")
	public void renameMenu(@RequestParam("menuid") long menuid, @RequestParam("menuname") String menuname,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		

        Map<String,Object> map = new HashMap<String,Object>();
        
		THPMenu menu = _menuMapper.select(menuid);	
		
		try
		{
			menu.setMenuName(menuname);
			menu.setMenuModifyTime(COMUtil.getStringDate());
			
			_menuMapper.update(menu); 
			
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
	
	@RequestMapping("/deleteMenu")
	public void deleteMenu(@RequestParam("menuid") long menuid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
		response.setCharacterEncoding("utf-8");
		
		
		Map<String,Object> map = new HashMap<String,Object>();		
		
		try
		{			
			_menuMapper.delete(menuid); 
			
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
	
	
	@RequestMapping("/getMenu")
	public void getMenu(@RequestParam("menuid") long id,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		

        Map<String,Object> map = new HashMap<String,Object>();
        
		THPMenu menu = _menuMapper.select(id);	

		
        map.put("menu", menu);

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
	
	@RequestMapping("/ValidteMenu")
	public void ValidteMenu(@RequestParam("menuname") String menuname,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{

		//System.out.println("coming in ...");
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        	
        StringBuffer result = new StringBuffer("");
        
        THPMenu menu = _menuMapper.validateMenuName(menuname);
        
        String menu_num = (menu==null) ? "0" : "1";
        
        //System.out.println(menu_num);
        
        result.append(menu_num);	
        
		// 向前台的页面输出结果
		PrintWriter out = response.getWriter();

		out.write(result.toString());
		out.flush();
		out.close();
	}	
	
	@RequestMapping("/newDBFile")
	public void newDBFile(@RequestParam("menuname") String menuname,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
		THPMenu menu = new THPMenu();
		
		menu.setMenuId(0);
		menu.setMenuName(menuname);
		menu.setMenuParentId(0);
		menu.setMenuProId(1);
		menu.setMenuIndex(100);
		menu.setMenuIsFolder("0");
		menu.setMenuIsVisable("1");
		menu.setMenuIsEnable("1");
		menu.setMenuIsDelete("0");
		menu.setMenuPath(menuname+".xml");
		menu.setMenuContent("");
		menu.setMenuNote("");
		menu.setMenuCreateTime(COMUtil.getStringDate());
		menu.setMenuModifyTime(COMUtil.getStringDate());
		
		int menu_num = _menuMapper.insert(menu);

        //StringBuffer result = new StringBuffer("");       
        
		//记录menu		  
                	 
        //获取  
        //result.append(menu_num);  
       
		//System.out.println(menu.toString());
		
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(menu);
       
		
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
         
        out.write(jsonlist);
        out.flush();
        out.close();         
	}

	@RequestMapping("/getFromDBFileContent")
	public void getFromDBFileContent(@RequestParam("menuid") long menuid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
		THPMenu menu = _menuMapper.select(menuid);		
		
		//model.addAttribute("singlemenu",menu);
		
        StringBuffer result = new StringBuffer("");         
                	 
        //获取文件信息  
        result.append(menu.getMenuContent());                 	 
		
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
         
        out.write(result.toString());
        out.flush();
        out.close();         
	}
	
	@RequestMapping("/saveToDBFileContent")
	@ResponseBody
	public void saveToDBFileContent(@RequestBody THPMenu menu,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//response.setContentType("text/html;charset=utf-8");        
        //response.setCharacterEncoding("utf-8");

		//modify
		if(true)
		{	
			_menuMapper.insert(menu);
			
		}
		/*
		else
		{
			_menuMapper.updateMenuContent(menu);
		}
		*/

		//model.addAttribute("singlemenu", menu);	
		
        StringBuffer result = new StringBuffer("");	
               
        result.append("1");	
               
		// 向前台的页面输出结果
		PrintWriter out = response.getWriter();

		out.write(result.toString());
		out.flush();
		out.close();
	}
	
	@RequestMapping("/saveASToDBFileContent")
	@ResponseBody
	public void saveASToDBFileContent(@RequestBody THPMenu menu,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//response.setContentType("text/html;charset=utf-8");        
        //response.setCharacterEncoding("utf-8");
		System.out.println("coming in ....");
		
		_menuMapper.insert(menu);

		//model.addAttribute("singlemenu", menu);
		
        StringBuffer result = new StringBuffer("");	
               
        result.append("1");	
               
		// 向前台的页面输出结果
		PrintWriter out = response.getWriter();

		out.write(result.toString());
		out.flush();
		out.close();
	}

	@RequestMapping("/getFTPFilePath")
	public String getFTPFilePath(@RequestParam("menuid") long menuid,
			HttpServletRequest request, HttpServletResponse response, 
			Model model
			) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
		THPMenu menu = _menuMapper.select(menuid);	
		
		model.addAttribute("singlemenu",menu);	
		
		return "showXmlFile";
	}
	
	@RequestMapping("/getFromFTPFileContent")
	public void getFromFTPFileContent(@RequestParam("menuid") long menuid,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
		THPMenu menu = _menuMapper.select(menuid);		
		model.addAttribute("singlemenu",menu);
		
        String strPath = menu.getMenuName();
        StringBuffer result = new StringBuffer("");	        
                	
        //远程下载        
		String xmlContent = FTPUtil.retrieveFileContent("120.92.89.125", 21, "thpcloud", "1qaz2wsx", "0/NEWProject/", "xxx.xml");

        //获取文件信息  
        result.append(xmlContent);                 	 
		
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
         
        out.write(result.toString());
        out.flush();
        out.close();         
	}
	
	@RequestMapping("/saveToFTPFileContent")
	@ResponseBody
	public void saveToFTPFileContent(@RequestBody THPMenu menu,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		//response.setContentType("text/html;charset=utf-8");        
        //response.setCharacterEncoding("utf-8");
		
		String strPath = "";
		//THPMenu menu = new THPMenu();
		
		//need modify
		if(true)
		{			
			_menuMapper.insert(menu);
			
		}
		/*
		else
		{
			//menu = _menuMapper.selectXmlFileById(id);	
			strPath = menu.getMenuName();
		}
		*/

		//model.addAttribute("singlemenu", menu);	
		
        StringBuffer result = new StringBuffer("");	
        	
    	//文件保存
        //ServletContext context = request.getSession().getServletContext();
        //HttpSession session =request.getSession(); 
        String xml= menu.getMenuContent();
        xml= URLDecoder.decode(xml, "UTF-8");

		System.out.println(strPath);
		InputStream isis =new   ByteArrayInputStream(xml.getBytes()); 
		
		//远程上传
		FTPUtil.storeFile("120.92.89.125", 21, "thpcloud", "1qaz2wsx", "0/NEWProject/", "xxx.xml", isis);
               
        result.append("1");	
               
         //向前台的页面输出结果
         PrintWriter out = response.getWriter();
         
         out.write(result.toString());
         out.flush();
         out.close();
	}
	
	
	private String saveToLocalFile(String strPath, String xml) throws IOException{
		
		RandomAccessFile randomAccessFile = new RandomAccessFile(strPath, "rw");
        randomAccessFile.seek(0);
        randomAccessFile.setLength(0);
        randomAccessFile.write(xml.getBytes());
        randomAccessFile.close();
        
        return "success";
        
	}
	
	@RequestMapping("/getFromLocalFile")
	public void getFromLocalFile(@RequestParam("filepath") String filepath,
			HttpServletRequest request, HttpServletResponse response,
			Model model) throws IOException{
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
        /*
        Map result = new HashMap();
        Part part = null; // servlet3.0的文件上传新办法  
        String     jsonp = request.getParameter("jsonpcallback"), type = request.getParameter("type");  
         
        try {  
        	
        }
           if (type != null) {  
               part = request.getPart("fileUpload"+type); // 参数为<input type='file' name='参数名' />       
            }else {  
               part = request.getPart("fileUpload");   
           }  
           // 获取文件名  
           String header = part.getHeader("content-disposition"), fileName = getFileName(header),  
                 path = filePath + File.separator + fileName;  
              
            File file = new File(filePath); // 建立目录  
            if (!file.exists()) {  
               file.mkdirs();  
            }  
              
           //part.write(path); weblogic下用part.write()无法写到指定的路径，它一定会搞到域里面。所以用流来写。从part中获取，不能从request获取  
           InputStream is = part.getInputStream();  
           FileOutputStream fos = new FileOutputStream(path);  
            byte[] b = new byte[1024];  
              int i = 0;  
              while ((i = is.read(b)) > -1) {  
                 fos.write(b, 0, i);  
         }  
              */

        
        /////////////////////////////////////////////////////////////////////////////////////////////
        /*
         *本地文件 
         *D:\THPBuilder\xml\test.xml
         *blob:http://localhost:8080/94dc6c66-b15f-4706-a4a2-e87dc8534294
         **/ 		        
        StringBuffer result = new StringBuffer(""); 
        
        //获取文件信息
        //result.append(filecontent);
        
		//File file = new File(fileurl);

		//System.out.println("isfile: " + file.isFile() + ",  exists: " + file.exists() + " , path: " + file.getPath()) ;
		/*
		if(file.isFile()){ 

			System.out.println("started ... ");
			
			//开始读取
			BufferedReader reader = new BufferedReader(new FileReader(new File(fileurl)));
			String tempString = null;
			// 一次读入一行，直到读入null为文件结束
		    while ((tempString = reader.readLine()) != null){
		        result.append(tempString);
		    }

			System.out.println("ended ... ");
			
		    reader.close();            	 
		 }
		 */
		
		System.out.println(result.toString());
		
        //向前台的页面输出结果
        PrintWriter out = response.getWriter();
         
        out.write(result.toString());
        out.flush();
        out.close();
       
        
        /*        	
     	//文件保存
     	String xml= request.getParameter("xmldata");          	
     	xml= URLDecoder.decode(xml, "UTF-8");
     	             
        RandomAccessFile randomAccessFile = new RandomAccessFile(strPath, "rw");
        randomAccessFile.seek(0);
        randomAccessFile.setLength(0);
        randomAccessFile.write(xml.getBytes());
        randomAccessFile.close();	                       
      */     
        
        ///////////////////////////////////////////////////////////////////////////////////////////
        /*
         *File 网络文件路径格式 
         *http://localhost:8080/THPBuilder/xml/test.xml
         */
        /*
		int HttpResult; // 服务器返回的状态          
		String ee = new String();
		try
		{
			URL url = new URL(strUrl); 
			URLConnection urlconn = url.openConnection(); // 试图连接并取得返回状态码
			urlconn.connect();
			
			//HTTP方式
			//HttpURLConnection httpconn = (HttpURLConnection) url.openConnection();
			//FTP方式
			//URLConnection conn = url.openConnection();
			HttpURLConnection httpconn =(HttpURLConnection)urlconn;			
			HttpResult = httpconn.getResponseCode(); 
			if(HttpResult != HttpURLConnection.HTTP_OK) // 不等于HTTP_OK说明连接不成功                 
			{
				System.out.print("无法连接到"); 
			}else 
			{
				//int filesize = urlconn.getContentLength(); // 取数据长度        
				
				InputStreamReader isReader = new  InputStreamReader(urlconn.getInputStream());      
				BufferedReader reader = new BufferedReader(isReader);        
				StringBuffer buffer = new StringBuffer();               
				String line; // 用来保存每行读取的内容        
				line = reader.readLine(); // 读取第一行      
				while (line != null) { // 如果 line 为空说明读完了     
					buffer.append(line); // 将读到的内容添加到 buffer 中           
					buffer.append(" "); // 添加换行符           
					line = reader.readLine(); // 读取下一行        
				} 
				//System.out.print(buffer.toString());         
				ee = buffer.toString();	
			}
		}catch (FileNotFoundException e)
		{    
			e.printStackTrace();  
		}
		 */ 

		
		//return ee; 
	}
	
}
