package com.thpower.scada.util;


import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.List;


import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;
import org.xml.sax.InputSource;

/**
* @author admin
* @version 创建时间：2017年12月7日 下午3:06:28
* 类说明
*/
public class XMLHandler {

   public XMLHandler() {
       // TODO Auto-generated constructor stub
   }

   public static String createProjectXML(){
	   
       String strXML = null;
       
       //int id=0;
       
       Document document = DocumentHelper.createDocument();
       
       Element mxfile = document.addElement("mxfile");

       Element mgmodel = mxfile.addElement("mxGraphModel");
       mgmodel.addAttribute("appName", "国科机房监控工程");
       mgmodel.addAttribute("appType", "EMTP");
       mgmodel.addAttribute("typeFloor", "eleFloor");
       mgmodel.addAttribute("isSelect", "1");
       mgmodel.addAttribute("dx", "2503");
       mgmodel.addAttribute("dy", "767");
       mgmodel.addAttribute("grid", "1");
       mgmodel.addAttribute("gridSize", "10");
       mgmodel.addAttribute("guides", "1");
       mgmodel.addAttribute("flod", "1");
       mgmodel.addAttribute("page", "1");

       Element root = mgmodel.addElement("root");
       
       Element cella = root.addElement("mxcell");
       cella.addAttribute("id",  "0");
       
       //String  parent = String.valueOf(id);     
       Element cellb = root.addElement("mxcell");
       cellb.addAttribute("id", "1");
       cellb.addAttribute("parent", "0");
       cellb.addAttribute("visible", "0");       

       Element cellp1 = root.addElement("mxcell");
       cellp1.addAttribute("parent", "1");
       cellp1.addAttribute("id", "2");
       cellp1.addAttribute("visible", "0");      
       cellp1.addAttribute("value", "光伏");   
       cellp1.addAttribute("style", "verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=#FFFFFF;image;image=../static/graphEditor/stencils/chartIcon/solar-panel-in-sunlight-icon.svg");
       cellp1.addAttribute("editorName", "Demo");
       
       Element mxgy1 = cellp1.addElement("mxGeometry");
       mxgy1.addAttribute("dx", "557.8");
       mxgy1.addAttribute("dy", "86");
       mxgy1.addAttribute("width", "128");
       mxgy1.addAttribute("height", "1288");
       mxgy1.addAttribute("as", "geometry");
       
       Element cellc1 = root.addElement("mxcell");
       cellc1.addAttribute("parent", "2");
       cellc1.addAttribute("id", "3");
       cellc1.addAttribute("visible", "0");      
       cellc1.addAttribute("value", "EEEEF");    
       
       Element mxgy11 = cellc1.addElement("mxGeometry");
       mxgy11.addAttribute("relative", "1");
       mxgy11.addAttribute("width", "10");
       mxgy11.addAttribute("height", "16");
       mxgy11.addAttribute("as", "geometry");
        
       
       Element cellp2 = root.addElement("mxcell");
       cellp2.addAttribute("parent", "1");
       cellp2.addAttribute("id", "4");
       cellp2.addAttribute("visible", "0");      
       cellp2.addAttribute("value", "风能");    
       
       Element mxgy2 = cellp2.addElement("mxGeometry");
       mxgy2.addAttribute("dx", "557.8");
       mxgy2.addAttribute("dy", "86");
       mxgy2.addAttribute("width", "128");
       mxgy2.addAttribute("height", "1288");
       mxgy2.addAttribute("as", "geometry");
       
       /*
       Element cellp3 = root.addElement("mxcell");
       cellp3.addAttribute("parent", parent);
       cellp3.addAttribute("id", String.valueOf(id++));
       cellp3.addAttribute("visible", "0");      
       cellp3.addAttribute("value", "燃气");    
       
       Element mxgy3 = cellp1.addElement("mxGeometry");
       mxgy3.addAttribute("dx", "557.8");
       mxgy3.addAttribute("dy", "86");
       mxgy3.addAttribute("width", "128");
       mxgy3.addAttribute("height", "1288");
       mxgy3.addAttribute("as", "geometry");
       */
       
       
       //Element root = mgmodel.addElement("root");
       

       //--------
       StringWriter strWtr = new StringWriter();
       OutputFormat format = OutputFormat.createPrettyPrint();
       format.setEncoding("UTF-8");
       
       XMLWriter xmlWriter =new XMLWriter(strWtr, format);
       
       try {
           xmlWriter.write(document);
       } catch (IOException e1) {
           // TODO Auto-generated catch block
           e1.printStackTrace();
       }
       
       strXML = strWtr.toString();
       //--------

       //-------
       //strXML=document.asXML();
       //------

       //-------------
       /*
       File file = new File("TelePhone.xml");  
       if (file.exists()) {  
           file.delete();  
       }  
       try {
           file.createNewFile();
           XMLWriter out = new XMLWriter(new FileWriter(file));  
           out.write(document);  
           out.flush();  
           out.close();
       } catch (IOException e) {
           // TODO Auto-generated catch block
           e.printStackTrace();
       }
       */
       //--------------

       return strXML;
   }

   public static void parserXML(String strXML){
       SAXReader reader = new SAXReader();
       StringReader sr = new StringReader(strXML);
       InputSource is = new InputSource(sr);
       try {
           Document document = reader.read(is);

           Element root = document.getRootElement();

           //get element
           List<Element> phoneList = root.elements("TelePhone");
           List<Element> typeList = phoneList.get(0).elements("type");
           for (int i=0;i<typeList.size();i++){
               Element element = typeList.get(i);
               String phoneName = element.attributeValue("name");
               System.out.println("phonename = "+phoneName);
               //get all element
               List<Element> childList = element.elements();
               for (int j=0;j<childList.size();j++){
                   Element e = childList.get(j);
                   System.out.println(e.getName()+"="+e.getText());
               }
           }
       } catch (DocumentException e) {
           // TODO Auto-generated catch block
           e.printStackTrace();
       }
   }

   public static void parserXMLbyXPath(String strXML){
       SAXReader reader = new SAXReader();
       StringReader sr = new StringReader(strXML);
       InputSource is = new InputSource(sr);
       try {
           Document document = reader.read(is);
           List list = document.selectNodes("/root/TelePhone/type");
           for(int i=0;i<list.size();i++){
               Element e = (Element) list.get(i);
               System.out.println("phonename="+e.attributeValue("name"));
               List list1 = e.selectNodes("./*");
               for(int j=0;j<list1.size();j++){
                   Element e1 = (Element) list1.get(j);
                   System.out.println(e1.getName()+"="+e1.getText());
               }
           }
       } catch (DocumentException e) {
           // TODO Auto-generated catch block
           e.printStackTrace();
       }
   }

}
