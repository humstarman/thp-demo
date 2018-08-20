package com.thpower.scada.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.disk.DiskFileItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thpower.scada.mapper.THPParaMapper;
import com.thpower.scada.mapper.THPPicMapper;
import com.thpower.scada.model.THPPic;
import com.thpower.scada.util.Base64Util;
import com.thpower.scada.util.PropertyUtil;

/**
* @author admin
* @version 创建时间：2018年5月3日 上午10:31:10
* 类说明
*/

@Controller
public class THPPicController {

	@Autowired
	private THPPicMapper _picMapper;	

	@Autowired
	THPParaMapper _paraMapper;	
	
	@RequestMapping("/uploadPic")
	public void uploadPic(@RequestParam(value="file") MultipartFile file,
	HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{
		HashMap<String, String> map=new HashMap<String, String>();
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
		
		String result="";
		
		try
		{
			//Single File
			result = uploadFile(file, map);
			
			if(result=="")
			{
		        THPPic pic = new THPPic();
		        
				//ok
				pic.setpicName(map.get("name"));
				pic.setpicUrl(map.get("url"));
				pic.setpicContent(map.get("content"));	
				
				_picMapper.insert(pic);		

		        map.put("success", "1");  
			}else
			{
		        map.put("success", "0");  
			}
			
		}catch(IOException e){
			
			e.printStackTrace();
			
			map.put("msg", "上传失败");
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
	
	@RequestMapping("/uploadMultiPics")
	public void uploadMultiPics(@RequestParam("mfile") MultipartFile[] mfile,
	HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
        
		//这里mfile可以接受前台的文件，可以是一个，也可以是多个，这正是MultipartFile强大的地方。
		
		//建一个Map便于返回json
		HashMap<String, String> map=new HashMap<String, String>();	

		String result="";
        
		if (mfile != null && mfile.length > 0) 
		{
			//判断使用有文件上传
			for (int i = 0; i < mfile.length; i++) 
			{
				//循环上传（多文件上传）
				try 
				{
					//Multi File					
					result = uploadFile(mfile[i], map);	
					
					if(result=="")
					{
				        THPPic pic = new THPPic();
				        
						//ok
						pic.setpicName(map.get("name"));
						pic.setpicUrl(map.get("url"));
						pic.setpicContent(map.get("content"));	
						
						_picMapper.insert(pic);		

				        map.put("success", "1");  
					}else
					{
				        map.put("success", "0");  
					}
					
				} catch (Exception e) 
				{
					e.printStackTrace();
					
					map.put("msg", "上传失败");
				}
			}
		}

        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(map);

        //map只包含最后一个图片文件的相关信息
        
		 //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();    
		
	}
	
	/**
	 * 文件保存
	 * @author admin
	 * Last_update 2018年5月3日上午11:53:33
	 * @param partFile
	 * @param rootPath
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	public String uploadFile(MultipartFile partFile, HashMap<String, String> map) 
			throws IllegalStateException, IOException 
	{
        String result = "";
        
        if (partFile != null 
        		&& partFile.getOriginalFilename() != null 
        		&& partFile.getOriginalFilename().length() > 0) 
        {

    		String rootPath = PropertyUtil.getProperty("PicDiskUrl", "defaultValue");   // D:\\pics\\
    		String prefixPath = PropertyUtil.getProperty("PicPrefix", "defaultValue");  // pics
            String fileOriginalName = partFile.getOriginalFilename();
    		
    		//图片文件服务器路径
    		//System.out.println(rootPath);   
    		//System.out.println(prefixPath);    		
    		//图片文件原始名称
    		//System.out.println(fileOriginalName);    		
    		
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            
            //图片文件服务器路径
            String filePath = String.format("%04d", year) +String.format("%02d", month)  + "/";
			String type = fileOriginalName.substring(fileOriginalName.lastIndexOf(".")+1, fileOriginalName.length()).toLowerCase();
			String fileNewName = UUID.randomUUID()+ "." + type;
            
            File dir = new File(rootPath+filePath);
            if (!dir.isDirectory())
                dir.mkdir();
            
    		//System.out.println(type);
    		//System.out.println(fileNewName);    
    		
			//截取文件后缀判断是否是一张图片
			if((type.equals("png"))
					||(type.equals("jpg"))||(type.equals("jpeg"))
					||(type.equals("gif"))||(type.equals("bmp"))
					||(type.equals("icon"))
					||(type.equals("svg")))
			{
				byte [] bytesfile =partFile.getBytes();
				int length = bytesfile.length;
		        InputStream inputStream = new ByteArrayInputStream(bytesfile); 
				
				if (!((length / 1000) > 5120)) {
					
					//上传服务器
					partFile.transferTo(new File(rootPath + filePath, fileNewName));

					//			        
					map.put("name", fileOriginalName);
					map.put("url", "/"+ prefixPath+"/"+filePath+fileNewName);
					map.put("content", Base64Util.base64Encode(inputStream, type));					

				}else{
					result = fileOriginalName+":图片过大";
				}
				
			}else
			{
				result = "亲,只能上传图片!";
			}
			
        }
        
        return result; 
    }
	
	/**
	 * 返回ID Name URL Content
	 * @author admin
	 * Last_update 2018年5月5日上午12:22:45
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */
	@RequestMapping("/getMultiPics")
	public void getMultiPics(HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");        
       
        List<THPPic> pics=_picMapper.getMultiPics(); 

        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(pics);

        //map只包含最后一个图片文件的相关信息
        
		 //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();    
		
	}
	
	/**
	 * 只返回ID & url
	 * @author admin
	 * Last_update 2018年5月5日上午12:21:58
	 * @param request
	 * @param response
	 * @param model
	 * @throws IOException
	 */
	@RequestMapping("/getPics")
	public void getPics(HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");        
       
        List<THPPic> pics=_picMapper.getPics(); 
        
        ObjectMapper mapper = new ObjectMapper();
        String jsonlist = mapper.writeValueAsString(pics);

        //map只包含最后一个图片文件的相关信息
        
		 //向前台的页面输出结果
        PrintWriter out = response.getWriter();
		
        out.write(jsonlist);
        out.flush();
        out.close();    
		
	}	
	

	@RequestMapping("/findPics")
	public void findPics(HttpServletRequest request, HttpServletResponse response, 
	Model model	) throws IOException
	{
		HashMap<String, String> map=new HashMap<String, String>();
		
		response.setContentType("text/html;charset=utf-8");        
        response.setCharacterEncoding("utf-8");
				
		try
		{
			//System.out.println(System.getProperty("os.name"));
			//System.out.println(PropertyUtil.getSystem());
			
			String rootPath = PropertyUtil.getProperty("PicDiskUrl", "defaultValue");   // D:\\pics\\			
			//System.out.println(rootPath);
			
			if(readfile(rootPath))
			{
		        map.put("success", "1");  
			}else
			{
		        map.put("success", "0");  
			}
			
		}catch(IOException e){			
			e.printStackTrace();
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

   public boolean readfile(String filepath) throws FileNotFoundException, IOException 
   {
       try 
       {
           File file = new File(filepath);
           if (!file.isDirectory()) {
               //System.out.println("文件");
               
			   //System.out.println("path=" + file.getPath());
			   //System.out.println("absolutepath=" + file.getAbsolutePath());
			   //System.out.println("name=" + file.getName());

			   updatemysql(file.getPath(), file.getName());

		   } else if (file.isDirectory()) {
	           //System.out.println("文件夹");
	           
			   String[] filelist = file.list();
			   for (int i = 0; i < filelist.length; i++) {
		           File readfile = new File(filepath + "\\" + filelist[i]);
				   if (!readfile.isDirectory()) {
					   //System.out.println("文件");
					   
			           //System.out.println("path=" + readfile.getPath());
			           //System.out.println("absolutepath=" + readfile.getAbsolutePath());
			           //System.out.println("name=" + readfile.getName());
					   
					   updatemysql(readfile.getPath(), readfile.getName());
		
				   	} else if (readfile.isDirectory()) {
				   		readfile(filepath + "\\" + filelist[i]);
		            }
		        }
		
		    }
		
	   } catch (FileNotFoundException e) {
		   System.out.println("readfile()   Exception:" + e.getMessage());
       }
       
       return true;
    }
   
   public void updatemysql(String filepath, String filename)throws FileNotFoundException, IOException
   {
		// D:\pics\  ---> /pics/
		// \        ---> /	
	   String type = filepath.substring(filepath.lastIndexOf(".")+1, filepath.length()).toLowerCase();
	   
		//截取文件后缀判断是否是一张图片
		if((type.equals("png"))
				||(type.equals("jpg"))||(type.equals("jpeg"))
				||(type.equals("gif"))||(type.equals("bmp"))
				||(type.equals("icon"))
				||(type.equals("svg")))
		{
			String rootPath = PropertyUtil.getProperty("PicDiskUrl", "defaultValue");   // D:\\pics\\
			String prefixPath = PropertyUtil.getProperty("PicPrefix", "defaultValue");  // pics
	
			prefixPath = "/"+ prefixPath+ "/";
			
			System.out.println(filepath);
			
			String fileurl = filepath.replace(rootPath, prefixPath);
			
			fileurl=fileurl.replace("\\", "/");
	
			System.out.println(fileurl);
						
			THPPic pic = _picMapper.selectByURL(fileurl);
			
			if(pic == null)
			{
				pic = new THPPic();
				pic.setpicName(filename);
				pic.setpicUrl(fileurl);
				
				File file = new File(filepath);				
				InputStream inputStream = new FileInputStream(file);
				
				pic.setpicContent(Base64Util.base64Encode(inputStream, type));
				
				int nrow = _picMapper.insert(pic);
				
				System.out.println("Add: "+ fileurl);
			}else
			{
				System.out.println("exist: "+ fileurl);
				
			}
			
		}
		
   }
}
